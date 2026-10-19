import { chromium } from '/home/user/CUE/node_modules/playwright-core/index.mjs';

const BASE = 'http://127.0.0.1:4000';
let pass = 0,
  fail = 0;
function checkAssertion(isPassing, message) {
  isPassing ? pass++ : (fail++, console.log('  FAIL:', message));
}
const browser = await chromium.launch({
  executablePath: '/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell',
});
const DAY = new Date(Date.now() + 40 * 86400000).toISOString().slice(0, 10);

async function run(viewportWidth) {
  const browserContext = await browser.newContext({ viewport: { width: viewportWidth, height: 900 } });
  await browserContext.route('**/api/**', (route) => {
    const url = route.request().url();
    const body = route.request().postDataJSON ? route.request().postDataJSON() || {} : {};
    if (url.includes('/account/session'))
      return route.fulfill({ json: { account: { id: 9, name: 'Signed In', email: 'me@example.com' } } });
    if (url.includes('/account/login')) return route.fulfill({ json: { status: 'ok' } });
    if (url.includes('/account/verify')) {
      if (body.code === '000000')
        return route.fulfill({ json: { status: 'error', detail: 'That code is incorrect or has expired.' } });
      return route.fulfill({
        json: {
          status: 'ok',
          token: 'tok-verified',
          account: { id: 3, name: 'Someone Else', email: 'andras@example.com' },
        },
      });
    }
    if (url.includes('/inquiry'))
      return route.fulfill({
        json: {
          status: 'saved',
          ref: 'CUE-900',
          token: null,
          account: null,
          signin_sent: true,
          signin_email: 'andras@example.com',
        },
      });
    if (url.includes('/bookings/mine')) return route.fulfill({ json: { upcoming: [], history: [] } });
    if (url.includes('/pricing/catalog')) return route.fulfill({ json: { currency: 'USD', symbol: '$', catalog: {} } });
    return route.fulfill({ json: {} });
  });
  await browserContext.addInitScript((day) => {
    localStorage.setItem('cue_token', 'tok-signed-in');
    localStorage.setItem(
      'cue_itinerary_v1',
      JSON.stringify({
        days: [{ items: ['Ubud Tour'], itemModes: ['standard'], itemTimes: ['08:00'], date: day, guests: '2' }],
      }),
    );
  }, DAY);
  const page = await browserContext.newPage();
  const errs = [];
  page.on('pageerror', (error) => errs.push(String(error)));
  await page.goto(`${BASE}/my-trips.html?pay=0`, { waitUntil: 'networkidle' });
  await page
    .locator('button:visible', { hasText: /Pay now|Book now|Checkout/i })
    .first()
    .click();
  await page.fill('input[type=text]:visible >> nth=0', 'Someone');
  await page.locator('input[type=tel]:visible').first().fill('+61412345678');
  await page.locator('input[type=email]:visible').first().fill('andras@example.com');
  const pickup = page.locator('input[placeholder*="otel" i]:visible, input[placeholder*="ickup" i]:visible').first();
  if (await pickup.count()) await pickup.fill('Ubud');
  await page.locator('button:visible', { hasText: /^\s*Continue\s*$/ }).click();
  await page
    .locator('button:visible', { hasText: /Book now/i })
    .last()
    .click();
  await page.waitForTimeout(900);
  checkAssertion(
    await page.locator('text=Booking Received').isVisible(),
    `${viewportWidth}: never reached the success screen`,
  );
  checkAssertion(
    await page.locator('[data-signin-note]:visible').isVisible(),
    `${viewportWidth}: no signin note shown`,
  );
  const noteText = await page.locator('[data-signin-note]:visible').innerText();
  checkAssertion(
    !/check your email/i.test(noteText),
    `${viewportWidth}: still says "check your email" instead of showing the code entry`,
  );
  checkAssertion(
    (await page.locator('input[inputmode="numeric"]:visible').count()) === 6,
    `${viewportWidth}: no 6-box code entry inside the note`,
  );
  await page.screenshot({ path: `shots/bcm-otp-${viewportWidth}.png` });

  await page.locator('input[inputmode="numeric"]:visible').first().click();
  await page.keyboard.type('000000', { delay: 20 });
  await page.waitForTimeout(500);
  checkAssertion(
    /incorrect|expired/i.test(await page.locator('[data-signin-note]:visible').innerText()),
    `${viewportWidth}: no error for a wrong code`,
  );
  const tokAfterWrong = await page.evaluate(() => localStorage.getItem('cue_token'));
  checkAssertion(
    tokAfterWrong === 'tok-signed-in',
    `${viewportWidth}: a WRONG code changed the session (${tokAfterWrong})`,
  );

  await page.locator('input[inputmode="numeric"]:visible').first().click();
  await page.keyboard.type('246810', { delay: 20 });
  await page.waitForTimeout(700);
  checkAssertion(
    /Signed in as/i.test(await page.locator('[data-signin-note]:visible').innerText()),
    `${viewportWidth}: no confirmation after a correct code`,
  );
  const tok = await page.evaluate(() => localStorage.getItem('cue_token'));
  checkAssertion(tok === 'tok-verified', `${viewportWidth}: session not swapped to the verified account (${tok})`);
  await page.screenshot({ path: `shots/bcm-otp-verified-${viewportWidth}.png` });
  checkAssertion(errs.length === 0, `${viewportWidth}: page errors ${errs.join(' | ')}`);
  await browserContext.close();
}
for (const width of [390, 1280]) await run(width);
await browser.close();
console.log(`${pass}/${pass + fail}`);
process.exit(fail ? 1 : 0);
