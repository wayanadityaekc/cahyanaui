// WO2: booking needs an account; browsing and the cart do not.
// Sign-in is by a 6-digit CODE now (28 Sep 2026, Wayan), not a link - the whole
// thing happens in one popup, on the same page, with no navigation at all.
// Drives the built pages (npm run build && npm run serve, port 4000):
//   A. logged out -> Pay now = sign-in popup, NOT the booking form; cart untouched
//   C. send code -> wrong code shows an error, does not sign in -> right code
//      signs in AND opens the held booking, right there, no navigation
//   B. create account on an email that already has one -> lands in the SAME
//      code stage (one door, whichever way it's reached) -> right code opens
//      the held booking
//   G. create a genuinely NEW account -> signs in immediately, no code needed
//   D. signed in already -> Pay now opens the form, no popup
//   E. dismissing the popup opens nothing; the cart is untouched
//   F. a stale resume marker (> 1h) does NOT yank a guest off the homepage -
//      dead code on the code-entry path now (nothing sets that marker's
//      redirect in motion any more), kept for regression insurance since the
//      mechanism itself is untouched.
import { chromium } from '/home/user/CUE/node_modules/playwright-core/index.mjs';

const BASE = 'http://127.0.0.1:4000';
let pass = 0, fail = 0;
function ok(c, m) { c ? pass++ : (fail++, console.log('  FAIL:', m)); }
const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell' });
const DAY = new Date(Date.now() + 40 * 86400000).toISOString().slice(0, 10);
const CART = JSON.stringify({ days: [{ items: ['Ubud Tour'], itemModes: ['standard'], itemTimes: ['08:00'], date: DAY, guests: '2' }], transfers: [], charters: [] });
const ACC = { id: 9, name: 'Wayan Aditya', email: 'wayan@example.com', phone: '+6281' };

async function setup(w, { signedIn = false, marker = null } = {}) {
  const ctx = await b.newContext({ viewport: { width: w, height: 900 } });
  let session = signedIn;
  await ctx.route('**/api/**', (route) => {
    const url = route.request().url();
    const body = route.request().postDataJSON ? (route.request().postDataJSON() || {}) : {};
    if (url.includes('/account/session')) return route.fulfill({ json: session ? { account: ACC } : { status: 'error' } });
    if (url.includes('/account/login')) return route.fulfill({ json: { status: 'ok' } });
    // A stubbed server that mimics a real one closely enough to test the UI
    // against: '000000' is always wrong, anything else 6-digit is right.
    if (url.includes('/account/verify')) {
      if (body.code === '000000') return route.fulfill({ json: { status: 'error', detail: 'That code is incorrect or has expired.' } });
      session = true;
      return route.fulfill({ json: { status: 'ok', token: 'tok-verified', account: ACC } });
    }
    if (/\/api\/account(\?|$)/.test(url)) {
      // The email in ACC already "has an account" - mirror the real server:
      // no token handed over, a code sent to that inbox instead.
      if (body.email === ACC.email) return route.fulfill({ json: { status: 'ok', signin_sent: true, email: ACC.email } });
      session = true;
      return route.fulfill({ json: { status: 'ok', token: 'tok-new', account: { ...ACC, email: body.email, name: body.name } } });
    }
    if (url.includes('/bookings/mine')) return route.fulfill({ json: { upcoming: [], history: [] } });
    if (url.includes('/pricing/catalog')) return route.fulfill({ json: { currency: 'USD', symbol: '$', catalog: {} } });
    return route.fulfill({ json: {} });
  });
  await ctx.addInitScript(([cart, tok, mk]) => {
    if (!sessionStorage.getItem('seeded')) {
      sessionStorage.setItem('seeded', '1');
      localStorage.setItem('cue_itinerary_v1', cart);
      if (tok) localStorage.setItem('cue_token', tok);
      if (mk) localStorage.setItem('cue_resume_book', JSON.stringify(mk));
    }
  }, [CART, signedIn ? 'tok-old' : '', marker]);
  const page = await ctx.newPage();
  const errs = []; page.on('pageerror', (e) => errs.push(String(e)));
  return { ctx, page, errs };
}
function payNow(p) { return p.locator('button:visible', { hasText: /^\s*Pay now\s*$/ }).first().click(); }
function gateOpen(p) { return p.locator('text=Sign in to book').isVisible(); }
function codeOpen(p) { return p.locator('text=Enter your code').isVisible(); }
function formOpen(p) { return p.locator('text=Booking Confirmation').isVisible(); }
function marker(p) { return p.evaluate(() => localStorage.getItem('cue_resume_book')); }
function cartLen(p) { return p.evaluate(() => (JSON.parse(localStorage.getItem('cue_itinerary_v1') || '{}').days || []).length); }
// The 6 boxes fill left-to-right as one field each (OtpFields), so typing into
// the first one and letting auto-advance carry it is how a guest actually
// uses it - not Playwright's .fill() on a single input.
async function typeCode(p, digits) {
  await p.locator('input[inputmode="numeric"]:visible').first().click();
  await p.keyboard.type(digits, { delay: 20 });
}

for (const w of [390, 1280]) {
  // A + C: logged out, code round trip (wrong then right), same tab throughout
  {
    const { ctx, page, errs } = await setup(w);
    await page.goto(BASE + '/my-trips.html', { waitUntil: 'networkidle' });
    await payNow(page); await page.waitForTimeout(500);
    ok(await gateOpen(page), `${w}/A: Pay now logged out did not show "Sign in to book"`);
    ok(!(await formOpen(page)), `${w}/A: THE BOOKING FORM OPENED WITHOUT AN ACCOUNT`);
    ok(JSON.parse(await marker(page) || '{}').path === '/my-trips.html', `${w}/A: no resume marker for /my-trips.html (${await marker(page)})`);
    ok(await cartLen(page) === 1, `${w}/A: cart changed`);
    await page.screenshot({ path: `shots/gate-${w}.png` });
    await page.fill('#auth-email:visible', 'wayan@example.com');
    await page.locator('button:visible', { hasText: 'Send code' }).click();
    await page.waitForTimeout(500);
    ok(await codeOpen(page), `${w}/C: no code-entry stage after "Send code"`);
    ok(/wayan@example\.com/.test(await page.locator('body').innerText()), `${w}/C: the code-sent message does not say which address`);
    await page.screenshot({ path: `shots/gate-code-${w}.png` });

    // wrong code first
    await typeCode(page, '000000');
    await page.waitForTimeout(500);
    ok(!(await formOpen(page)), `${w}/C: A WRONG CODE OPENED THE BOOKING FORM`);
    ok(await codeOpen(page), `${w}/C: a wrong code left the code stage instead of showing an error there`);
    ok(/incorrect|expired/i.test(await page.locator('body').innerText()), `${w}/C: no error shown for a wrong code`);

    // right code - typed after the wrong one, same tab, no navigation
    await typeCode(page, '135791');
    await page.waitForTimeout(700);
    ok(await formOpen(page), `${w}/C: booking form did not open after a correct code, in the same tab`);
    ok(!(await gateOpen(page)) && !(await codeOpen(page)), `${w}/C: sign-in popup still showing after a correct code`);
    ok(!(await marker(page)), `${w}/C: marker not cleared`);
    ok(await cartLen(page) === 1, `${w}/C: cart lost across sign-in`);
    ok(await page.evaluate(() => localStorage.getItem('cue_token')) === 'tok-verified', `${w}/C: token not stored`);
    ok(new URL(page.url()).pathname === '/my-trips.html', `${w}/C: the guest was navigated away (${page.url()})`);
    await page.screenshot({ path: `shots/gate-resumed-${w}.png` });
    ok(errs.length === 0, `${w}/A+C: page errors ${errs.join(' | ')}`);
    await ctx.close();
  }
  // B: create account on an email that already has one -> same code stage
  {
    const { ctx, page, errs } = await setup(w);
    await page.goto(BASE + '/my-trips.html', { waitUntil: 'networkidle' });
    await payNow(page); await page.waitForTimeout(400);
    await page.locator('button:visible', { hasText: 'Create an account' }).click();
    await page.fill('#auth-name:visible', 'Wayan Aditya');
    await page.fill('#auth-cemail:visible', 'wayan@example.com');
    await page.fill('#auth-phone:visible', '+6281234');
    await page.locator('button:visible', { hasText: 'Create Account' }).click();
    await page.waitForTimeout(700);
    ok(await codeOpen(page), `${w}/B: duplicate-email create did not land on the code stage`);
    ok(!(await page.locator('#auth-cemail:visible').count().then((n) => n > 0)), `${w}/B: sign-up form still showing under the code stage`);
    await typeCode(page, '246810');
    await page.waitForTimeout(700);
    ok(await formOpen(page), `${w}/B: booking form did not open after verifying`);
    ok(!(await marker(page)), `${w}/B: marker not cleared`);
    ok(errs.length === 0, `${w}/B: page errors ${errs.join(' | ')}`);
    await ctx.close();
  }
  // G: a genuinely new account still signs in immediately, no code
  {
    const { ctx, page, errs } = await setup(w);
    await page.goto(BASE + '/my-trips.html', { waitUntil: 'networkidle' });
    await payNow(page); await page.waitForTimeout(400);
    await page.locator('button:visible', { hasText: 'Create an account' }).click();
    await page.fill('#auth-name:visible', 'Fresh Guest');
    await page.fill('#auth-cemail:visible', 'fresh@example.com');
    await page.fill('#auth-phone:visible', '+6281234');
    await page.locator('button:visible', { hasText: 'Create Account' }).click();
    await page.waitForTimeout(700);
    ok(await formOpen(page), `${w}/G: booking form did not open right after a new account was created`);
    ok(!(await codeOpen(page)), `${w}/G: a brand-new account was asked for a code it was never sent`);
    ok(errs.length === 0, `${w}/G: page errors ${errs.join(' | ')}`);
    await ctx.close();
  }
  // D: already signed in
  {
    const { ctx, page, errs } = await setup(w, { signedIn: true });
    await page.goto(BASE + '/my-trips.html', { waitUntil: 'networkidle' });
    await payNow(page); await page.waitForTimeout(500);
    ok(await formOpen(page), `${w}/D: signed-in Pay now did not open the form`);
    ok(!(await gateOpen(page)), `${w}/D: signed-in guest was asked to sign in`);
    ok(errs.length === 0, `${w}/D: page errors ${errs.join(' | ')}`);
    await ctx.close();
  }
  // E: dismiss
  {
    const { ctx, page, errs } = await setup(w);
    await page.goto(BASE + '/my-trips.html', { waitUntil: 'networkidle' });
    await payNow(page); await page.waitForTimeout(400);
    await page.keyboard.press('Escape'); await page.waitForTimeout(500);
    ok(!(await gateOpen(page)), `${w}/E: Escape did not close the popup`);
    ok(!(await formOpen(page)), `${w}/E: form opened after dismissing`);
    ok(await cartLen(page) === 1, `${w}/E: cart changed`);
    ok(errs.length === 0, `${w}/E: page errors ${errs.join(' | ')}`);
    await ctx.close();
  }
  // F: stale marker (see file header - this is regression insurance on dead code)
  {
    const { ctx, page, errs } = await setup(w, { marker: { path: '/my-trips.html', at: Date.now() - 2 * 3600000 } });
    await page.goto(BASE + '/?token=tok-link', { waitUntil: 'networkidle' });
    await page.waitForTimeout(1200);
    ok(new URL(page.url()).pathname === '/', `${w}/F: stale marker still redirected (${page.url()})`);
    ok(errs.length === 0, `${w}/F: page errors ${errs.join(' | ')}`);
    await ctx.close();
  }
}
await b.close();
console.log(`${pass}/${pass + fail}`);
process.exit(fail ? 1 : 0);
