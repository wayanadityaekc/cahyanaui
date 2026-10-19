import { chromium } from 'playwright-core';

const API = 'http://127.0.0.1:4599/api';
const DAY = new Date(Date.now() + 40 * 86400000).toISOString().slice(0, 10);
let pass = 0,
  fail = 0;
function checkAssertion(isPassing, message) {
  return isPassing ? pass++ : (fail++, console.log('  FAIL:', message));
}
function extractDigits(text) {
  return Number(String(text).replace(/[^0-9]/g, ''));
}

const browser = await chromium.launch({
  executablePath: '/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell',
});
for (const [current, viewportWidth] of [
  ['AUD', 390],
  ['JPY', 1280],
]) {
  const cat = await (await fetch(`${API}/pricing/catalog?currency=${current}&guests=2&stay=`)).json();
  const data = await (
    await fetch(`${API}/pricing/quote`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ currency: current, lines: [{ service: 'Ubud Tour', guests: 2 }] }),
    })
  ).json();
  const browserContext = await browser.newContext({ viewport: { width: viewportWidth, height: 900 } });
  await browserContext.route('**/api/account/**', (route) =>
    route.request().url().includes('/account/session')
      ? route.fulfill({ json: { account: { id: 9, name: 'Test Guest', email: 'guest@example.com' } } })
      : route.fulfill({ json: {} }),
  );
  await browserContext.route('**/api/bookings/**', (route) => route.fulfill({ json: { upcoming: [], history: [] } }));
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
  await page.goto('http://127.0.0.1:4000/my-trips.html?pay=1', { waitUntil: 'networkidle' });
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
  async function readRowText(pattern) {
    const row = page
      .locator('div:visible', { hasText: pattern })
      .filter({ has: page.locator('span') })
      .last();
    return row.innerText();
  }
  const body = await page.locator('body').innerText();
  const depRow = body.split('\n').find((line) => /deposit/i.test(line) && /\d/.test(line)) || '';
  const depLine = await readRowText(/Pay a deposit/);
  const fullLine = await readRowText(/Pay in full/);
  const depAmt = extractDigits((depLine.match(/[^\s]*\d[\d,.]*\s*$/m) || [''])[0]);
  const fullAmt = extractDigits((fullLine.match(/[^\s]*\d[\d,.]*\s*$/m) || [''])[0]);
  checkAssertion(
    depAmt === cat.deposit.display,
    `${current}/${viewportWidth}: deposit shown ${depAmt} = catalog ${cat.deposit.display}`,
  );
  checkAssertion(
    fullAmt === data.total.display,
    `${current}/${viewportWidth}: pay in full shown ${fullAmt} = quote ${data.total.display}`,
  );
  checkAssertion(
    new RegExp(cat.symbol.trim().replace('$', '\\$')).test(depLine),
    `${current}/${viewportWidth}: deposit in ${cat.symbol}`,
  );
  await page.screenshot({
    path: `/tmp/claude-0/-home-user/b39e23b2-cabe-5327-8412-a80a03834acc/scratchpad/pay-${current}-${viewportWidth}.png`,
  });
  checkAssertion(errs.length === 0, `${current}/${viewportWidth}: no page errors (${errs.join(' | ')})`);
  await browserContext.close();
}
await browser.close();
console.log(`\n${pass}/${pass + fail}`);
process.exit(fail ? 1 : 0);
