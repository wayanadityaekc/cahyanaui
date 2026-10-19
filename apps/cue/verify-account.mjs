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

async function createContextFor(viewportWidth, api) {
  const browserContext = await browser.newContext({ viewport: { width: viewportWidth, height: 900 } });
  await browserContext.route('**/api/**', (route) => {
    const url = route.request().url();
    const hit = Object.keys(api).find((routeKey) => url.includes(routeKey));
    if (hit) return route.fulfill({ json: typeof api[hit] === 'function' ? api[hit](route.request()) : api[hit] });
    if (url.includes('/pricing/catalog')) return route.fulfill({ json: { currency: 'USD', symbol: '$', catalog: {} } });
    return route.fulfill({ json: {} });
  });
  return browserContext;
}

for (const width of [390, 1280]) {
  for (const kind of ['existing', 'new']) {
    const browserContext = await createContextFor(width, {
      '/account/session': { status: 'error' },
      '/api/account':
        kind === 'existing'
          ? { status: 'ok', signin_sent: true, email: 'andras@example.com' }
          : { status: 'ok', token: 'tok-new', account: { id: 9, name: 'New', email: 'fresh@example.com' } },
    });
    const page = await browserContext.newPage();
    const errs = [];
    page.on('pageerror', (error) => errs.push(String(error)));
    await page.goto(`${BASE}/index.html`, { waitUntil: 'networkidle' });
    await page.locator('[data-account-slot="out"] > button').click();
    if (width > 992) await page.locator('[data-account-slot="out"] div[id] button', { hasText: 'Log in' }).click();
    await page.locator('button:visible', { hasText: 'Create an account' }).click();
    await page.fill('#auth-name:visible', 'Someone');
    await page.fill('#auth-cemail:visible', kind === 'existing' ? 'andras@example.com' : 'fresh@example.com');
    await page.fill('#auth-phone:visible', '+36306563875');
    await page.locator('button:visible', { hasText: 'Create Account' }).click();
    await page.waitForTimeout(700);
    const token = await page.evaluate(() => localStorage.getItem('cue_token'));
    if (kind === 'existing') {
      const note = await page
        .locator('[data-signin-note]:visible')
        .first()
        .innerText()
        .catch(() => '');
      checkAssertion(
        /already have an account as/i.test(note) && note.includes('andras@example.com'),
        `${width}/create-existing: the guest is not told which account this is (got "${note}")`,
      );
      checkAssertion(!token, `${width}/create-existing: THE BROWSER ENDED UP HOLDING A LOGIN`);
      checkAssertion(
        !(await page.locator('#auth-cemail:visible').count()),
        `${width}/create-existing: sign-up form still showing instead of the code stage`,
      );
      checkAssertion(
        (await page.locator('input[inputmode="numeric"]:visible').count()) === 6,
        `${width}/create-existing: did not land on the 6-box code entry`,
      );
    } else {
      checkAssertion(token === 'tok-new', `${width}/create-new: a new guest is no longer signed in (${token})`);
      checkAssertion(
        !(await page.locator('#auth-cemail:visible').count()),
        `${width}/create-new: the modal stayed open after a real sign-up`,
      );
    }
    checkAssertion(errs.length === 0, `${width}/create-${kind}: page errors ${errs.join(' | ')}`);
    await browserContext.close();
  }

  for (const kind of ['existing', 'new']) {
    const browserContext = await createContextFor(width, {
      '/account/session': { account: { id: 9, name: 'Signed In', email: 'fresh@example.com' } },
      '/inquiry': {
        status: 'saved',
        ref: kind === 'existing' ? 'CUE-777' : 'CUE-778',
        token: null,
        account: null,
        signin_sent: false,
      },
    });
    const page = await browserContext.newPage();
    const errs = [];
    page.on('pageerror', (error) => errs.push(String(error)));
    await page.addInitScript((day) => {
      localStorage.setItem('cue_token', 'tok-signed-in');
      localStorage.setItem(
        'cue_itinerary_v1',
        JSON.stringify({
          days: [{ items: ['Ubud Tour'], itemModes: ['standard'], itemTimes: ['08:00'], date: day, guests: '2' }],
        }),
      );
    }, DAY);
    await page.goto(`${BASE}/my-trips.html?pay=0`, { waitUntil: 'networkidle' });
    await page
      .locator('button:visible', { hasText: /Pay now|Book now|Checkout/i })
      .first()
      .click();
    await page.fill('input[type=text]:visible >> nth=0', 'Someone');
    await page.locator('input[type=tel]:visible').first().fill('+36306563875');
    await page
      .locator('input[type=email]:visible')
      .first()
      .fill(kind === 'existing' ? 'andras@example.com' : 'fresh@example.com');
    const pickup = page.locator('input[placeholder*="otel" i]:visible, input[placeholder*="ickup" i]:visible').first();
    if (await pickup.count()) await pickup.fill('Ubud');
    await page.locator('button:visible', { hasText: /^\s*Continue\s*$/ }).click();
    await page
      .locator('button:visible', { hasText: /Book now/i })
      .last()
      .click();
    await page.waitForTimeout(900);
    const token = await page.evaluate(() => localStorage.getItem('cue_token'));
    const note = await page
      .locator('[data-signin-note]:visible')
      .first()
      .innerText()
      .catch(() => '');
    checkAssertion(!note, `${width}/book-${kind}: a signed-in guest was told to check an inbox`);
    checkAssertion(token === 'tok-signed-in', `${width}/book-${kind}: the session was dropped or swapped (${token})`);
    checkAssertion(
      await page.locator('text=Booking Received').isVisible(),
      `${width}/book-${kind}: never reached the success screen`,
    );
    const over = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
    checkAssertion(over <= 0, `${width}/book-${kind}: page overflows by ${over}px`);
    checkAssertion(errs.length === 0, `${width}/book-${kind}: page errors ${errs.join(' | ')}`);
    await browserContext.close();
  }
}
await browser.close();
console.log(`${pass}/${pass + fail}`);
process.exit(fail ? 1 : 0);
