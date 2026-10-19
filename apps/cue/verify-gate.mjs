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
const CART = JSON.stringify({
  days: [{ items: ['Ubud Tour'], itemModes: ['standard'], itemTimes: ['08:00'], date: DAY, guests: '2' }],
  transfers: [],
  charters: [],
});
const ACC = { id: 9, name: 'Wayan Aditya', email: 'wayan@example.com', phone: '+6281' };

async function setupContext(viewportWidth, { signedIn = false, marker = null } = {}) {
  const browserContext = await browser.newContext({ viewport: { width: viewportWidth, height: 900 } });
  let session = signedIn;
  await browserContext.route('**/api/**', (route) => {
    const url = route.request().url();
    const body = route.request().postDataJSON ? route.request().postDataJSON() || {} : {};
    if (url.includes('/account/session'))
      return route.fulfill({ json: session ? { account: ACC } : { status: 'error' } });
    if (url.includes('/account/login')) return route.fulfill({ json: { status: 'ok' } });
    if (url.includes('/account/verify')) {
      if (body.code === '000000')
        return route.fulfill({ json: { status: 'error', detail: 'That code is incorrect or has expired.' } });
      session = true;
      return route.fulfill({ json: { status: 'ok', token: 'tok-verified', account: ACC } });
    }
    if (/\/api\/account(\?|$)/.test(url)) {
      if (body.email === ACC.email)
        return route.fulfill({ json: { status: 'ok', signin_sent: true, email: ACC.email } });
      session = true;
      return route.fulfill({
        json: { status: 'ok', token: 'tok-new', account: { ...ACC, email: body.email, name: body.name } },
      });
    }
    if (url.includes('/bookings/mine')) return route.fulfill({ json: { upcoming: [], history: [] } });
    if (url.includes('/pricing/catalog')) return route.fulfill({ json: { currency: 'USD', symbol: '$', catalog: {} } });
    return route.fulfill({ json: {} });
  });
  await browserContext.addInitScript(
    ([cart, tok, mk]) => {
      if (!sessionStorage.getItem('seeded')) {
        sessionStorage.setItem('seeded', '1');
        localStorage.setItem('cue_itinerary_v1', cart);
        if (tok) localStorage.setItem('cue_token', tok);
        if (mk) localStorage.setItem('cue_resume_book', JSON.stringify(mk));
      }
    },
    [CART, signedIn ? 'tok-old' : '', marker],
  );
  const page = await browserContext.newPage();
  const errs = [];
  page.on('pageerror', (error) => errs.push(String(error)));
  return { ctx: browserContext, page, errs };
}
function payNow(targetPage) {
  return targetPage
    .locator('button:visible', { hasText: /^\s*Pay now\s*$/ })
    .first()
    .click();
}
function checkIsGateOpen(targetPage) {
  return targetPage.locator('text=Sign in to book').isVisible();
}
function checkIsCodeOpen(targetPage) {
  return targetPage.locator('text=Enter your code').isVisible();
}
function checkIsFormOpen(targetPage) {
  return targetPage.locator('text=Booking Confirmation').isVisible();
}
function readMarker(targetPage) {
  return targetPage.evaluate(() => localStorage.getItem('cue_resume_book'));
}
function countCartLength(targetPage) {
  return targetPage.evaluate(() => (JSON.parse(localStorage.getItem('cue_itinerary_v1') || '{}').days || []).length);
}
async function typeCode(targetPage, digits) {
  await targetPage.locator('input[inputmode="numeric"]:visible').first().click();
  await targetPage.keyboard.type(digits, { delay: 20 });
}

for (const width of [390, 1280]) {
  {
    const { ctx: browserContext, page, errs } = await setupContext(width);
    await page.goto(`${BASE}/my-trips.html`, { waitUntil: 'networkidle' });
    await payNow(page);
    await page.waitForTimeout(500);
    checkAssertion(await checkIsGateOpen(page), `${width}/A: Pay now logged out did not show "Sign in to book"`);
    checkAssertion(!(await checkIsFormOpen(page)), `${width}/A: THE BOOKING FORM OPENED WITHOUT AN ACCOUNT`);
    checkAssertion(
      JSON.parse((await readMarker(page)) || '{}').path === '/my-trips.html',
      `${width}/A: no resume marker for /my-trips.html (${await readMarker(page)})`,
    );
    checkAssertion((await countCartLength(page)) === 1, `${width}/A: cart changed`);
    await page.screenshot({ path: `shots/gate-${width}.png` });
    await page.fill('#auth-email:visible', 'wayan@example.com');
    await page.locator('button:visible', { hasText: 'Send code' }).click();
    await page.waitForTimeout(500);
    checkAssertion(await checkIsCodeOpen(page), `${width}/C: no code-entry stage after "Send code"`);
    checkAssertion(
      /wayan@example\.com/.test(await page.locator('body').innerText()),
      `${width}/C: the code-sent message does not say which address`,
    );
    await page.screenshot({ path: `shots/gate-code-${width}.png` });

    await typeCode(page, '000000');
    await page.waitForTimeout(500);
    checkAssertion(!(await checkIsFormOpen(page)), `${width}/C: A WRONG CODE OPENED THE BOOKING FORM`);
    checkAssertion(
      await checkIsCodeOpen(page),
      `${width}/C: a wrong code left the code stage instead of showing an error there`,
    );
    checkAssertion(
      /incorrect|expired/i.test(await page.locator('body').innerText()),
      `${width}/C: no error shown for a wrong code`,
    );

    await typeCode(page, '135791');
    await page.waitForTimeout(700);
    checkAssertion(
      await checkIsFormOpen(page),
      `${width}/C: booking form did not open after a correct code, in the same tab`,
    );
    checkAssertion(
      !(await checkIsGateOpen(page)) && !(await checkIsCodeOpen(page)),
      `${width}/C: sign-in popup still showing after a correct code`,
    );
    checkAssertion(!(await readMarker(page)), `${width}/C: marker not cleared`);
    checkAssertion((await countCartLength(page)) === 1, `${width}/C: cart lost across sign-in`);
    checkAssertion(
      (await page.evaluate(() => localStorage.getItem('cue_token'))) === 'tok-verified',
      `${width}/C: token not stored`,
    );
    checkAssertion(
      new URL(page.url()).pathname === '/my-trips.html',
      `${width}/C: the guest was navigated away (${page.url()})`,
    );
    await page.screenshot({ path: `shots/gate-resumed-${width}.png` });
    checkAssertion(errs.length === 0, `${width}/A+C: page errors ${errs.join(' | ')}`);
    await browserContext.close();
  }
  {
    const { ctx: browserContext, page, errs } = await setupContext(width);
    await page.goto(`${BASE}/my-trips.html`, { waitUntil: 'networkidle' });
    await payNow(page);
    await page.waitForTimeout(400);
    await page.locator('button:visible', { hasText: 'Create an account' }).click();
    await page.fill('#auth-name:visible', 'Wayan Aditya');
    await page.fill('#auth-cemail:visible', 'wayan@example.com');
    await page.fill('#auth-phone:visible', '+6281234');
    await page.locator('button:visible', { hasText: 'Create Account' }).click();
    await page.waitForTimeout(700);
    checkAssertion(await checkIsCodeOpen(page), `${width}/B: duplicate-email create did not land on the code stage`);
    checkAssertion(
      !((await page.locator('#auth-cemail:visible').count()) > 0),
      `${width}/B: sign-up form still showing under the code stage`,
    );
    await typeCode(page, '246810');
    await page.waitForTimeout(700);
    checkAssertion(await checkIsFormOpen(page), `${width}/B: booking form did not open after verifying`);
    checkAssertion(!(await readMarker(page)), `${width}/B: marker not cleared`);
    checkAssertion(errs.length === 0, `${width}/B: page errors ${errs.join(' | ')}`);
    await browserContext.close();
  }
  {
    const { ctx: browserContext, page, errs } = await setupContext(width);
    await page.goto(`${BASE}/my-trips.html`, { waitUntil: 'networkidle' });
    await payNow(page);
    await page.waitForTimeout(400);
    await page.locator('button:visible', { hasText: 'Create an account' }).click();
    await page.fill('#auth-name:visible', 'Fresh Guest');
    await page.fill('#auth-cemail:visible', 'fresh@example.com');
    await page.fill('#auth-phone:visible', '+6281234');
    await page.locator('button:visible', { hasText: 'Create Account' }).click();
    await page.waitForTimeout(700);
    checkAssertion(
      await checkIsFormOpen(page),
      `${width}/G: booking form did not open right after a new account was created`,
    );
    checkAssertion(
      !(await checkIsCodeOpen(page)),
      `${width}/G: a brand-new account was asked for a code it was never sent`,
    );
    checkAssertion(errs.length === 0, `${width}/G: page errors ${errs.join(' | ')}`);
    await browserContext.close();
  }
  {
    const { ctx: browserContext, page, errs } = await setupContext(width, { signedIn: true });
    await page.goto(`${BASE}/my-trips.html`, { waitUntil: 'networkidle' });
    await payNow(page);
    await page.waitForTimeout(500);
    checkAssertion(await checkIsFormOpen(page), `${width}/D: signed-in Pay now did not open the form`);
    checkAssertion(!(await checkIsGateOpen(page)), `${width}/D: signed-in guest was asked to sign in`);
    checkAssertion(errs.length === 0, `${width}/D: page errors ${errs.join(' | ')}`);
    await browserContext.close();
  }
  {
    const { ctx: browserContext, page, errs } = await setupContext(width);
    await page.goto(`${BASE}/my-trips.html`, { waitUntil: 'networkidle' });
    await payNow(page);
    await page.waitForTimeout(400);
    await page.keyboard.press('Escape');
    await page.waitForTimeout(500);
    checkAssertion(!(await checkIsGateOpen(page)), `${width}/E: Escape did not close the popup`);
    checkAssertion(!(await checkIsFormOpen(page)), `${width}/E: form opened after dismissing`);
    checkAssertion((await countCartLength(page)) === 1, `${width}/E: cart changed`);
    checkAssertion(errs.length === 0, `${width}/E: page errors ${errs.join(' | ')}`);
    await browserContext.close();
  }
  {
    const {
      ctx: browserContext,
      page,
      errs,
    } = await setupContext(width, { marker: { path: '/my-trips.html', at: Date.now() - 2 * 3600000 } });
    await page.goto(`${BASE}/?token=tok-link`, { waitUntil: 'networkidle' });
    await page.waitForTimeout(1200);
    checkAssertion(new URL(page.url()).pathname === '/', `${width}/F: stale marker still redirected (${page.url()})`);
    checkAssertion(errs.length === 0, `${width}/F: page errors ${errs.join(' | ')}`);
    await browserContext.close();
  }
}
await browser.close();
console.log(`${pass}/${pass + fail}`);
process.exit(fail ? 1 : 0);
