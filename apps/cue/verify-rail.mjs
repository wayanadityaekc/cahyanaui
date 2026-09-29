// Card (DOKU) is the default payment rail; PayPal is the guest's choice
// (29 Sep 2026). Run against the built site + the local API:
//   PAYPAL_CLIENT_ID=x PAYPAL_SECRET=x DOKU_CLIENT_ID=BRN-x DOKU_SECRET=SK-x \
//     node ../cahyana-api/tools/chat-dev-server.js        # 4599, both rails "on"
//   NEXT_PUBLIC_API_BASE=http://127.0.0.1:4599/api npm run build
//   node tools/serve-out.js                               # 4000
//   node verify-rail.mjs
//
// Per currency x width, at the payment step of a real checkout:
//   - two rail choices, Card checked by default;
//   - Card + a non-rupiah currency: every amount is the EXACT rupiah figure the
//     server bills (quote lines' rupiah + the catalog's rupiah deposit), the
//     guest's own figure beside it as an estimate, and the note says so;
//   - Card + rupiah: no estimate, no note;
//   - PayPal: amounts in the guest's own currency, no rupiah (IDR -> told USD);
//   - after Book Now, the checkout shown is the CHOSEN rail's, and the DOKU
//     request carries only booking_ref + option (never an amount).
// Plus: an experience page says "for 2 guests", never "per person".
import { chromium } from 'playwright-core';

const API = 'http://127.0.0.1:4599/api';
const SITE = 'http://127.0.0.1:4000';
const SHOT = '/tmp/claude-0/-home-user/b39e23b2-cabe-5327-8412-a80a03834acc/scratchpad';
const DAY = new Date(Date.now() + 40 * 86400000).toISOString().slice(0, 10);
let pass = 0, fail = 0;
const ok = (c, m) => (c ? pass++ : (fail++, console.log('  FAIL:', m)));
const digits = (t) => Number(String(t).replace(/[^0-9]/g, ''));

const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell' });

async function toPayStep(cur, w, rail) {
  const ctx = await b.newContext({ viewport: { width: w, height: 900 } });
  await ctx.route('**/api/account/**', (r) =>
    r.request().url().includes('/account/session')
      ? r.fulfill({ json: { account: { id: 9, name: 'Test Guest', email: 'guest@example.com' } } })
      : r.fulfill({ json: {} }));
  await ctx.route('**/api/bookings/**', (r) => r.fulfill({ json: { upcoming: [], history: [] } }));
  // The dev API's stub database covers chat only, so saving a booking is stubbed
  // here: a pending booking, as the real server answers when a payment is due.
  await ctx.route('**/api/inquiry', (r) => r.fulfill({ json: { status: 'saved', ref: 'CUE-099' } }));
  const dokuCalls = [];
  await ctx.route('**/api/doku/create-payment', async (r) => {
    dokuCalls.push(JSON.parse(r.request().postData() || '{}'));
    await r.fulfill({ json: { status: 'ok', url: 'about:blank#doku', checkout_js: null } });
  });
  // No real PayPal SDK here - just enough to know which checkout mounted.
  await ctx.route('**/api/paypal/config', (r) => r.fulfill({ json: { ready: false, reason: 'harness' } }));
  await ctx.addInitScript(([day, c]) => {
    localStorage.setItem('cue_currency', c);
    localStorage.setItem('cue_token', 'tok-test');
    localStorage.setItem('cue_itinerary_v1', JSON.stringify({ days: [{ items: ['Ubud Tour'], itemModes: ['standard'], itemTimes: ['08:00'], date: day, guests: '2' }] }));
  }, [DAY, cur]);
  const page = await ctx.newPage();
  const errs = [];
  page.on('pageerror', (e) => errs.push(String(e)));
  await page.goto(`${SITE}/my-trips.html?pay=1`, { waitUntil: 'networkidle' });
  await page.waitForTimeout(600);
  await page.locator('button:visible', { hasText: /Pay now|Book now|Checkout/i }).first().click();
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
  return { ctx, page, errs, dokuCalls };
}

// The rail explanation lives behind the (i) beside the heading; open it, read
// it, close it (Escape - the same way a guest would dismiss it).
async function railInfo(page) {
  await page.locator('[data-infodot][aria-label="How the payment methods work"]').click();
  await page.waitForTimeout(350);
  const t = await page.locator('[data-rail-info]').innerText().catch(() => '');
  await page.keyboard.press('Escape');
  await page.waitForTimeout(300);
  return t;
}

for (const [cur, w] of [['USD', 390], ['AUD', 1280], ['IDR', 390], ['USD', 1280]]) {
  const cat = await (await fetch(`${API}/pricing/catalog?currency=${cur}&guests=2&stay=`)).json();
  const q = await (await fetch(`${API}/pricing/quote`, {
    method: 'POST', headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ currency: cur, lines: [{ service: 'Ubud Tour', guests: 2 }] }),
  })).json();
  const totalIdr = q.lines.reduce((s, l) => s + l.was.idr, 0);
  const tag = `${cur}/${w}`;

  // --- Card (default) ----------------------------------------------------
  const { ctx, page, errs, dokuCalls } = await toPayStep(cur, w);
  const choice = page.locator('[data-rail-choice] [role="radio"]');
  ok((await choice.count()) === 2, `${tag}: two rail choices (${await choice.count()})`);
  ok((await page.locator('[data-rail="doku"]').getAttribute('aria-checked')) === 'true', `${tag}: Card is checked by default`);
  // Icon only (Wayan: "icon, no text"), still named for screen readers.
  const railBtns = await page.locator('[data-rail-choice] [role="radio"]').evaluateAll((els) =>
    els.map((e) => ({ text: e.innerText.trim(), svg: !!e.querySelector('svg'), name: e.getAttribute('aria-label') })));
  ok(railBtns.every((b) => b.text === '' && b.svg && b.name), `${tag}: rail buttons are icon-only & named (${JSON.stringify(railBtns)})`);
  ok((await page.locator('[data-rail-info]').count()) === 0, `${tag}: no explanation printed until the (i) is tapped`);
  // The popup floats: opening it must not move Book Now.
  const bookBox = async () => (await page.locator('button:visible', { hasText: /^\s*Book Now\s*$/ }).boundingBox());
  const before = await bookBox();
  await page.locator('[data-infodot][aria-label="How the payment methods work"]').click();
  await page.waitForTimeout(350);
  const after = await bookBox();
  const infoTxt = await page.locator('[data-rail-info]').innerText().catch(() => '');
  ok(/Card/.test(infoTxt) && /QRIS/.test(infoTxt) && /PayPal/.test(infoTxt), `${tag}: (i) explains both methods`);
  ok(before && after && Math.abs(before.y - after.y) < 1, `${tag}: opening the (i) does not move Book Now (${before && before.y} -> ${after && after.y})`);
  const pb = await page.locator('[data-rail-info]').boundingBox();
  ok(pb && pb.x >= 0 && pb.x + pb.width <= w + 1, `${tag}: popup stays on screen`);
  await page.screenshot({ path: `${SHOT}/rail-info-${cur}-${w}.png` });
  await page.keyboard.press('Escape');
  await page.waitForTimeout(300);
  ok((await page.locator('[data-rail-info]').count()) === 0 || !(await page.locator('[data-rail-info]').isVisible()), `${tag}: Escape closes it`);
  const rowAmt = async (label) => {
    const card = page.locator('[role="radiogroup"][aria-label] > div', { hasText: label }).first();
    return card.locator('button').first().innerText();
  };
  const dep = await rowAmt('Pay a deposit');
  const full = await rowAmt('Pay in full');
  if (cur !== 'IDR') {
    ok(/Rp/.test(dep) && dep.includes('≈'), `${tag}: card deposit shows rupiah + estimate ("${dep.replace(/\n/g, ' | ')}")`);
    const [depIdr] = dep.match(/Rp[\d.]+/) || [''];
    const [fullIdr] = full.match(/Rp[\d.]+/) || [''];
    ok(digits(depIdr) === cat.deposit.idr, `${tag}: deposit rupiah ${digits(depIdr)} = server ${cat.deposit.idr}`);
    ok(digits(fullIdr) === totalIdr, `${tag}: full rupiah ${digits(fullIdr)} = server ${totalIdr}`);
    const est = (full.split('≈')[1] || '');
    ok(digits(est) === q.total.display, `${tag}: estimate ${digits(est)} = ${cur} total ${q.total.display}`);
    ok(/rupiah amount is exact/i.test(await railInfo(page)), `${tag}: (i) says the rupiah amount is exact`);
  } else {
    ok(!dep.includes('≈'), `${tag}: rupiah guest gets no estimate`);
    ok(!/estimate/i.test(await railInfo(page)), `${tag}: rupiah guest gets no estimate note`);
  }
  await page.screenshot({ path: `${SHOT}/rail-card-${cur}-${w}.png` });

  // --- PayPal ------------------------------------------------------------
  await page.locator('[data-rail="paypal"]').click();
  await page.waitForTimeout(250);
  ok((await page.locator('[data-rail="paypal"]').getAttribute('aria-checked')) === 'true', `${tag}: PayPal can be chosen`);
  const depP = await rowAmt('Pay a deposit');
  if (cur === 'IDR') ok(/\$10\b/.test(depP) && depP.includes('≈'), `${tag}: rupiah on PayPal shows the exact USD it is billed ("${depP.replace(/\n/g, ' | ')}")`);
  else ok(!depP.includes('≈') && !/Rp/.test(depP), `${tag}: PayPal shows the guest's own currency ("${depP.replace(/\n/g, ' | ')}")`);
  const ppInfo = await railInfo(page);
  if (cur === 'IDR') ok(/PayPal cannot charge IDR/.test(ppInfo), `${tag}: rupiah on PayPal is told USD`);
  else ok(!/cannot charge|estimate/.test(ppInfo), `${tag}: no extra note on PayPal in own currency`);
  await page.screenshot({ path: `${SHOT}/rail-paypal-${cur}-${w}.png` });

  // Back to Card and book: the DOKU checkout must be what mounts.
  await page.locator('[data-rail="doku"]').click();
  await page.locator('button:visible', { hasText: /^\s*Book Now\s*$/ }).click();
  await page.waitForTimeout(1500);
  const final = await page.locator('body').innerText();
  ok(/DOKU's secure payment/.test(final), `${tag}: Card booking shows the DOKU checkout`);
  await page.locator('button:visible', { hasText: /^Pay / }).last().click().catch(() => {});
  await page.waitForTimeout(600);
  ok(dokuCalls.length === 1 && Object.keys(dokuCalls[0]).sort().join() === 'booking_ref,option',
    `${tag}: DOKU gets ref + option only (${JSON.stringify(dokuCalls)})`);
  const over = await page.evaluate(() => document.documentElement.scrollWidth - innerWidth);
  ok(over <= 0, `${tag}: no horizontal overflow (${over})`);
  ok(errs.length === 0, `${tag}: no page errors (${errs.join(' | ')})`);
  await ctx.close();

  // PayPal chosen -> PayPal checkout mounts, not DOKU.
  const r2 = await toPayStep(cur, w);
  await r2.page.locator('[data-rail="paypal"]').click();
  await r2.page.locator('button:visible', { hasText: /^\s*Book Now\s*$/ }).click();
  await r2.page.waitForTimeout(1500);
  const final2 = await r2.page.locator('body').innerText();
  ok(!/DOKU's secure payment/.test(final2) && /Almost there/.test(final2), `${tag}: PayPal booking does NOT show DOKU`);
  ok(r2.dokuCalls.length === 0, `${tag}: and never calls DOKU`);
  await r2.ctx.close();
}

// Experience unit label.
for (const w of [390, 1280]) {
  const ctx = await b.newContext({ viewport: { width: w, height: 900 } });
  const page = await ctx.newPage();
  await page.goto(`${SITE}/attractions/atv-ride.html`, { waitUntil: 'networkidle' });
  const txt = await page.locator('body').innerText();
  ok(/for 2 guests/.test(txt), `${w}: ATV page says "for 2 guests"`);
  ok(!/per person/i.test(txt.replace(/Entrance ticket per person/gi, '')), `${w}: ATV page never says "per person" over a price`);
  const raw = await (await fetch(`${SITE}/attractions/atv-ride.html`)).text();
  ok(/for 2 guests/.test(raw), `${w}: the static HTML already says "for 2 guests"`);
  await page.screenshot({ path: `${SHOT}/atv-${w}.png` });
  await ctx.close();
}

await b.close();
console.log(`\n${pass}/${pass + fail}`);
process.exit(fail ? 1 : 0);
