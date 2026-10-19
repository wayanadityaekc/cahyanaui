import { chromium } from 'playwright-core';

const API = 'http://127.0.0.1:4599/api';
const SITE = 'http://127.0.0.1:4000';
const SHOT = '/tmp/claude-0/-home-user/b39e23b2-cabe-5327-8412-a80a03834acc/scratchpad';
const DAY = new Date(Date.now() + 40 * 86400000).toISOString().slice(0, 10);
let pass = 0,
  fail = 0;
function ok(isPassing, message) {
  return isPassing ? pass++ : (fail++, console.log('  FAIL:', message));
}
function digits(text) {
  return Number(String(text).replace(/[^0-9]/g, ''));
}

const browser = await chromium.launch({
  executablePath: '/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell',
});

async function toPayStep(current, viewportWidth, rail) {
  const browserContext = await browser.newContext({ viewport: { width: viewportWidth, height: 900 } });
  await browserContext.route('**/api/account/**', (route) =>
    route.request().url().includes('/account/session')
      ? route.fulfill({ json: { account: { id: 9, name: 'Test Guest', email: 'guest@example.com' } } })
      : route.fulfill({ json: {} }),
  );
  await browserContext.route('**/api/bookings/**', (route) => route.fulfill({ json: { upcoming: [], history: [] } }));
  await browserContext.route('**/api/inquiry', (route) => route.fulfill({ json: { status: 'saved', ref: 'CUE-099' } }));
  const dokuCalls = [];
  await browserContext.route('**/api/doku/create-payment', async (route) => {
    dokuCalls.push(JSON.parse(route.request().postData() || '{}'));
    await route.fulfill({ json: { status: 'ok', url: 'about:blank#doku', checkout_js: null } });
  });
  await browserContext.route('**/api/paypal/config', (route) =>
    route.fulfill({ json: { ready: false, reason: 'harness' } }),
  );
  await browserContext.addInitScript(
    ([day, currencyCode]) => {
      localStorage.setItem('cue_currency', currencyCode);
      localStorage.setItem('cue_token', 'tok-test');
      localStorage.setItem(
        'cue_itinerary_v1',
        JSON.stringify({
          days: [{ items: ['Ubud Tour'], itemModes: ['standard'], itemTimes: ['08:00'], date: day, guests: '2' }],
        }),
      );
    },
    [DAY, current],
  );
  const page = await browserContext.newPage();
  const errs = [];
  page.on('pageerror', (error) => errs.push(String(error)));
  await page.goto(`${SITE}/my-trips.html?pay=1`, { waitUntil: 'networkidle' });
  await page.waitForTimeout(600);
  await page
    .locator('button:visible', { hasText: /Pay now|Book now|Checkout/i })
    .first()
    .click();
  await page.locator('input[type=text]:visible').first().fill('Test Guest');
  await page.locator('input[type=tel]:visible').first().fill('+61412345678');
  await page.locator('input[type=email]:visible').first().fill('guest@example.com');
  const pickup = page.locator('input[placeholder*="otel" i]:visible, input[placeholder*="ickup" i]:visible').first();
  if (await pickup.count()) await pickup.fill('Ubud');
  await page.locator('button:visible', { hasText: /^\s*Continue\s*$/ }).click();
  await page.waitForTimeout(400);
  const cont2 = page.locator('button:visible', { hasText: /^\s*Continue\s*$/ });
  if (await cont2.count()) await cont2.first().click();
  await page.waitForTimeout(700);
  return { ctx: browserContext, page, errs, dokuCalls };
}

async function railInfo(page) {
  await page.locator('[data-infodot][aria-label="How the payment methods work"]').click();
  await page.waitForTimeout(350);
  const infoText = await page
    .locator('[data-rail-info]')
    .innerText()
    .catch(() => '');
  if (process.env.SHOTINFO) await page.screenshot({ path: `${SHOT}/info-${Date.now()}.png` });
  await page.keyboard.press('Escape');
  await page.waitForTimeout(300);
  return infoText;
}

for (const [current, viewportWidth] of [
  ['USD', 390],
  ['AUD', 1280],
  ['IDR', 390],
  ['USD', 1280],
]) {
  const cat = await (await fetch(`${API}/pricing/catalog?currency=${current}&guests=2&stay=`)).json();
  const quote = await (
    await fetch(`${API}/pricing/quote`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ currency: current, lines: [{ service: 'Ubud Tour', guests: 2 }] }),
    })
  ).json();
  const totalIdr = quote.lines.reduce((runningTotal, line) => runningTotal + line.was.idr, 0);
  const tag = `${current}/${viewportWidth}`;

  const { ctx: browserContext, page, errs, dokuCalls } = await toPayStep(current, viewportWidth);
  const choice = page.locator('[data-rail-choice] [role="radio"]');
  ok((await choice.count()) === 2, `${tag}: two rail choices (${await choice.count()})`);
  ok(
    (await page.locator('[data-rail="doku"]').getAttribute('aria-checked')) === 'true',
    `${tag}: Card is checked by default`,
  );
  const railBtns = await page.locator('[data-rail-choice] [role="radio"]').evaluateAll((elements) =>
    elements.map((event) => ({
      text: event.innerText.trim(),
      svg: !!event.querySelector('svg'),
      name: event.getAttribute('aria-label'),
    })),
  );
  ok(
    railBtns.every((railBtn) => railBtn.text === '' && railBtn.svg && railBtn.name),
    `${tag}: rail buttons are icon-only & named (${JSON.stringify(railBtns)})`,
  );
  ok((await page.locator('[data-rail-info]').count()) === 0, `${tag}: no explanation printed until the (i) is tapped`);
  async function bookBox() {
    return await page.locator('button:visible', { hasText: /^\s*Book Now\s*$/ }).boundingBox();
  }
  const before = await bookBox();
  await page.locator('[data-infodot][aria-label="How the payment methods work"]').click();
  await page.waitForTimeout(350);
  const after = await bookBox();
  const infoTxt = await page
    .locator('[data-rail-info]')
    .innerText()
    .catch(() => '');
  ok(/Card/.test(infoTxt) && /QRIS/.test(infoTxt) && /PayPal/.test(infoTxt), `${tag}: (i) explains both methods`);
  ok(
    before && after && Math.abs(before.y - after.y) < 1,
    `${tag}: opening the (i) does not move Book Now (${before && before.y} -> ${after && after.y})`,
  );
  const pb = await page.locator('[data-rail-info]').boundingBox();
  ok(pb && pb.x >= 0 && pb.x + pb.width <= viewportWidth + 1, `${tag}: popup stays on screen`);
  await page.screenshot({ path: `${SHOT}/rail-info-${current}-${viewportWidth}.png` });
  await page.keyboard.press('Escape');
  await page.waitForTimeout(300);
  ok(
    (await page.locator('[data-rail-info]').count()) === 0 || !(await page.locator('[data-rail-info]').isVisible()),
    `${tag}: Escape closes it`,
  );
  async function rowAmt(label) {
    const card = page.locator('[role="radiogroup"][aria-label] > div', { hasText: label }).first();
    return card.locator('button').first().innerText();
  }
  const dep = await rowAmt('Pay a deposit');
  const full = await rowAmt('Pay in full');
  if (current !== 'IDR') {
    ok(
      /Rp/.test(dep) && dep.includes('≈'),
      `${tag}: card deposit shows rupiah + estimate ("${dep.replace(/\n/g, ' | ')}")`,
    );
    const [depIdr] = dep.match(/Rp[\d.]+/) || [''];
    const [fullIdr] = full.match(/Rp[\d.]+/) || [''];
    ok(digits(depIdr) === cat.deposit.idr, `${tag}: deposit rupiah ${digits(depIdr)} = server ${cat.deposit.idr}`);
    ok(digits(fullIdr) === totalIdr, `${tag}: full rupiah ${digits(fullIdr)} = server ${totalIdr}`);
    const est = full.split('≈')[1] || '';
    ok(
      digits(est) === quote.total.display,
      `${tag}: estimate ${digits(est)} = ${current} total ${quote.total.display}`,
    );
    ok(/rupiah amount is exact/i.test(await railInfo(page)), `${tag}: (i) says the rupiah amount is exact`);
  } else {
    ok(!dep.includes('≈'), `${tag}: rupiah guest gets no estimate`);
    ok(!/estimate/i.test(await railInfo(page)), `${tag}: rupiah guest gets no estimate note`);
  }
  const cardInfo = await railInfo(page);
  await page.mouse.move(0, 0);
  await page.evaluate(() => document.activeElement?.blur());
  await page.waitForTimeout(300);
  ok(!/\bUSD\b|dollar/i.test(cardInfo), `${tag}: (i) never names USD ("${cardInfo.replace(/\n/g, ' | ')}")`);
  const dot = await page.evaluate(() => {
    const infoButton =
      document.querySelector('[data-rail-info]')?.closest('span.relative')?.querySelector('[data-infodot]') ||
      [...document.querySelectorAll('[data-infodot]')].find(
        (infoDot) => infoDot.getAttribute('aria-label') === 'How the payment methods work',
      );
    const iconBox = infoButton.querySelector('svg').getBoundingClientRect();
    return { w: iconBox.width, op: +getComputedStyle(infoButton).opacity };
  });
  ok(
    dot.w > 8 && dot.w < 16 && dot.op < 0.8 && dot.op > 0.3,
    `${tag}: (i) smaller + faint (${dot.w}px, opacity ${dot.op})`,
  );
  await page.screenshot({ path: `${SHOT}/rail-card-${current}-${viewportWidth}.png` });

  await page.locator('[data-rail="paypal"]').click();
  await page.waitForTimeout(250);
  ok(
    (await page.locator('[data-rail="paypal"]').getAttribute('aria-checked')) === 'true',
    `${tag}: PayPal can be chosen`,
  );
  const depP = await rowAmt('Pay a deposit');
  if (current === 'IDR')
    ok(
      /\$10\b/.test(depP) && depP.includes('≈'),
      `${tag}: rupiah on PayPal shows the exact USD it is billed ("${depP.replace(/\n/g, ' | ')}")`,
    );
  else
    ok(
      !depP.includes('≈') && !/Rp/.test(depP),
      `${tag}: PayPal shows the guest's own currency ("${depP.replace(/\n/g, ' | ')}")`,
    );
  const ppInfo = await railInfo(page);
  ok(!/\bUSD\b/.test(ppInfo), `${tag}: PayPal (i) never names USD`);
  if (current === 'IDR') ok(/PayPal cannot charge rupiah/.test(ppInfo), `${tag}: rupiah on PayPal is told it converts`);
  else ok(!/cannot charge|estimate/.test(ppInfo), `${tag}: no extra note on PayPal in own currency`);
  await page.screenshot({ path: `${SHOT}/rail-paypal-${current}-${viewportWidth}.png` });

  await page.locator('[data-rail="doku"]').click();
  await page.locator('button:visible', { hasText: /^\s*Book Now\s*$/ }).click();
  await page.waitForTimeout(1500);
  const final = await page.locator('body').innerText();
  ok(/DOKU's secure payment/.test(final), `${tag}: Card booking shows the DOKU checkout`);
  await page
    .locator('button:visible', { hasText: /^Pay / })
    .last()
    .click()
    .catch(() => {});
  await page.waitForTimeout(600);
  ok(
    dokuCalls.length === 1 && Object.keys(dokuCalls[0]).sort().join() === 'booking_ref,option',
    `${tag}: DOKU gets ref + option only (${JSON.stringify(dokuCalls)})`,
  );
  const over = await page.evaluate(() => document.documentElement.scrollWidth - innerWidth);
  ok(over <= 0, `${tag}: no horizontal overflow (${over})`);
  ok(errs.length === 0, `${tag}: no page errors (${errs.join(' | ')})`);
  await browserContext.close();

  const r2 = await toPayStep(current, viewportWidth);
  await r2.page.locator('[data-rail="paypal"]').click();
  await r2.page.locator('button:visible', { hasText: /^\s*Book Now\s*$/ }).click();
  await r2.page.waitForTimeout(1500);
  const final2 = await r2.page.locator('body').innerText();
  ok(!/DOKU's secure payment/.test(final2) && /Almost there/.test(final2), `${tag}: PayPal booking does NOT show DOKU`);
  ok(r2.dokuCalls.length === 0, `${tag}: and never calls DOKU`);
  await r2.ctx.close();
}

for (const width of [390, 1280]) {
  const browserContext = await browser.newContext({ viewport: { width: width, height: 900 } });
  const page = await browserContext.newPage();
  await page.goto(`${SITE}/attractions/atv-ride.html`, { waitUntil: 'networkidle' });
  const txt = await page.locator('body').innerText();
  ok(/for 2 guests/.test(txt), `${width}: ATV page says "for 2 guests"`);
  ok(
    !/per person/i.test(txt.replace(/Entrance ticket per person/gi, '')),
    `${width}: ATV page never says "per person" over a price`,
  );
  const raw = await (await fetch(`${SITE}/attractions/atv-ride.html`)).text();
  ok(/for 2 guests/.test(raw), `${width}: the static HTML already says "for 2 guests"`);
  await page.screenshot({ path: `${SHOT}/atv-${width}.png` });
  await browserContext.close();
}

await browser.close();
console.log(`\n${pass}/${pass + fail}`);
process.exit(fail ? 1 : 0);
