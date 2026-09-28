// WO2: booking needs an account; browsing and the cart do not.
// Drives the built pages (npm run build && npm run serve, port 4000):
//   A. logged out -> Pay now = sign-in popup, NOT the booking form; cart untouched
//   B. create account inside that popup -> booking form opens by itself
//   C. sign-in link: Send link -> marker; land on /?token= -> sent back to
//      /my-trips.html -> booking form opens; marker cleared; cart still there
//   D. signed in already -> Pay now opens the form, no popup
//   E. dismissing the popup opens nothing
//   F. a stale marker (> 1h) does NOT yank a guest off the homepage
import { chromium } from '/home/user/CUE/node_modules/playwright-core/index.mjs';

const BASE = 'http://127.0.0.1:4000';
let pass = 0, fail = 0;
const ok = (c, m) => { c ? pass++ : (fail++, console.log('  FAIL:', m)); };
const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell' });
const DAY = new Date(Date.now() + 40 * 86400000).toISOString().slice(0, 10);
const CART = JSON.stringify({ days: [{ items: ['Ubud Tour'], itemModes: ['standard'], itemTimes: ['08:00'], date: DAY, guests: '2' }], transfers: [], charters: [] });
const ACC = { id: 9, name: 'Wayan Aditya', email: 'wayan@example.com', phone: '+6281' };

async function setup(w, { signedIn = false, marker = null } = {}) {
  const ctx = await b.newContext({ viewport: { width: w, height: 900 } });
  let session = signedIn;
  await ctx.route('**/api/**', (route) => {
    const url = route.request().url();
    if (url.includes('/account/session')) return route.fulfill({ json: session ? { account: ACC } : { status: 'error' } });
    if (url.includes('/account/login')) return route.fulfill({ json: { status: 'ok' } });
    if (/\/api\/account(\?|$)/.test(url)) { session = true; return route.fulfill({ json: { status: 'ok', token: 'tok-new', account: ACC } }); }
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
  return { ctx, page, errs, signIn: () => { session = true; } };
}
const payNow = (p) => p.locator('button:visible', { hasText: /^\s*Pay now\s*$/ }).first().click();
const gateOpen = (p) => p.locator('text=Sign in to book').isVisible();
const formOpen = (p) => p.locator('text=Booking Confirmation').isVisible();
const marker = (p) => p.evaluate(() => localStorage.getItem('cue_resume_book'));
const cartLen = (p) => p.evaluate(() => (JSON.parse(localStorage.getItem('cue_itinerary_v1') || '{}').days || []).length);

for (const w of [390, 1280]) {
  // A + C: logged out, sign-in link round trip
  {
    const { ctx, page, errs, signIn } = await setup(w);
    await page.goto(BASE + '/my-trips.html', { waitUntil: 'networkidle' });
    await payNow(page); await page.waitForTimeout(500);
    ok(await gateOpen(page), `${w}/A: Pay now logged out did not show "Sign in to book"`);
    ok(!(await formOpen(page)), `${w}/A: THE BOOKING FORM OPENED WITHOUT AN ACCOUNT`);
    ok(JSON.parse(await marker(page) || '{}').path === '/my-trips.html', `${w}/A: no resume marker for /my-trips.html (${await marker(page)})`);
    ok(await cartLen(page) === 1, `${w}/A: cart changed`);
    if (w === 390) await page.screenshot({ path: `shots/gate-${w}.png` });
    else await page.screenshot({ path: `shots/gate-${w}.png` });
    await page.fill('#auth-email:visible', 'wayan@example.com');
    await page.locator('button:visible', { hasText: 'Send link' }).click();
    await page.waitForTimeout(400);
    ok(/check your email/i.test(await page.locator('body').innerText()), `${w}/C: no "check your email" after Send link`);
    // guest clicks the link in the email -> homepage with ?token=
    signIn();
    await page.goto(BASE + '/?token=tok-link', { waitUntil: 'networkidle' });
    await page.waitForURL(/my-trips\.html/, { timeout: 5000 }).catch(() => {});
    ok(page.url().includes('/my-trips.html'), `${w}/C: sign-in link did not bring the guest back to My Trips (${page.url()})`);
    await page.waitForTimeout(900);
    ok(await formOpen(page), `${w}/C: booking form did not reopen after sign-in`);
    ok(!(await gateOpen(page)), `${w}/C: sign-in popup still showing after sign-in`);
    ok(!(await marker(page)), `${w}/C: marker not cleared`);
    ok(await cartLen(page) === 1, `${w}/C: cart lost across sign-in`);
    ok(await page.evaluate(() => localStorage.getItem('cue_token')) === 'tok-link', `${w}/C: token not stored`);
    ok(!page.url().includes('token='), `${w}/C: token left in the URL`);
    await page.screenshot({ path: `shots/gate-resumed-${w}.png` });
    ok(errs.length === 0, `${w}/A+C: page errors ${errs.join(' | ')}`);
    await ctx.close();
  }
  // B: create account inside the popup
  {
    const { ctx, page, errs } = await setup(w);
    await page.goto(BASE + '/my-trips.html', { waitUntil: 'networkidle' });
    await payNow(page); await page.waitForTimeout(400);
    await page.locator('button:visible', { hasText: 'Create an account' }).click();
    await page.fill('#auth-name:visible', 'Wayan Aditya');
    await page.fill('#auth-cemail:visible', 'wayan@example.com');
    await page.fill('#auth-phone:visible', '+6281234');
    await page.locator('button:visible', { hasText: 'Create Account' }).click();
    await page.waitForTimeout(900);
    ok(await formOpen(page), `${w}/B: booking form did not open after creating an account`);
    ok(!(await page.locator('#auth-cemail:visible').count().then(n => n > 0)), `${w}/B: sign-up popup still open`);
    ok(!(await marker(page)), `${w}/B: marker not cleared`);
    ok(errs.length === 0, `${w}/B: page errors ${errs.join(' | ')}`);
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
  // F: stale marker
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
