// The two places a returning guest used to be handed someone's login.
//
// The server (cahyana-api, tools/account-door-test.js) no longer gives a
// browser the session of an account that already existed - it emails that
// account a sign-in link. This harness pins the other half: the SITE tells the
// guest which inbox to check, and never ends up holding a login it was not
// given. Run against the built pages:
//   npm run build && npm run serve   (port 4000)
//   node verify-account.mjs
import { chromium } from '/home/user/CUE/node_modules/playwright-core/index.mjs';

const BASE = 'http://127.0.0.1:4000';
let pass = 0, fail = 0;
const ok = (c, m) => { c ? pass++ : (fail++, console.log('  FAIL:', m)); };
const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell' });
const DAY = new Date(Date.now() + 40 * 86400000).toISOString().slice(0, 10);

async function ctxFor(w, api) {
  const ctx = await b.newContext({ viewport: { width: w, height: 900 } });
  await ctx.route('**/api/**', (route) => {
    const url = route.request().url();
    const hit = Object.keys(api).find((k) => url.includes(k));
    if (hit) return route.fulfill({ json: typeof api[hit] === 'function' ? api[hit](route.request()) : api[hit] });
    if (url.includes('/pricing/catalog')) return route.fulfill({ json: { currency: 'USD', symbol: '$', catalog: {} } });
    return route.fulfill({ json: {} });
  });
  return ctx;
}

for (const w of [390, 1280]) {
  // ---- 1. create account with an email that already has an account ------
  for (const kind of ['existing', 'new']) {
    const ctx = await ctxFor(w, {
      '/account/session': { status: 'error' },
      '/api/account': kind === 'existing'
        ? { status: 'ok', signin_sent: true, email: 'andras@example.com' }
        : { status: 'ok', token: 'tok-new', account: { id: 9, name: 'New', email: 'fresh@example.com' } },
    });
    const page = await ctx.newPage();
    const errs = []; page.on('pageerror', (e) => errs.push(String(e)));
    await page.goto(BASE + '/index.html', { waitUntil: 'networkidle' });
    // Open the sign-in modal the way a guest does: menu -> Sign in.
    await page.locator('#hamburger').click();
    await page.locator('button:visible, a:visible', { hasText: /^\s*Sign in\s*$/ }).first().click();
    await page.locator('button:visible', { hasText: 'Create an account' }).click();
    await page.fill('#auth-name', 'Someone');
    await page.fill('#auth-cemail', kind === 'existing' ? 'andras@example.com' : 'fresh@example.com');
    await page.fill('#auth-phone', '+36306563875');
    await page.locator('button:visible', { hasText: 'Create Account' }).click();
    await page.waitForTimeout(700);
    const token = await page.evaluate(() => localStorage.getItem('cue_token'));
    if (kind === 'existing') {
      const note = await page.locator('[data-signin-note]:visible').first().innerText().catch(() => '');
      ok(/already have an account/i.test(note) && note.includes('andras@example.com'),
        `${w}/create-existing: the guest is not told to check that inbox (got "${note}")`);
      ok(!token, `${w}/create-existing: THE BROWSER ENDED UP HOLDING A LOGIN`);
      ok(await page.locator('#auth-cemail').isVisible(), `${w}/create-existing: the modal closed as if it had signed in`);
    } else {
      ok(token === 'tok-new', `${w}/create-new: a new guest is no longer signed in (${token})`);
      ok(!(await page.locator('#auth-cemail').isVisible()), `${w}/create-new: the modal stayed open after a real sign-up`);
    }
    ok(errs.length === 0, `${w}/create-${kind}: page errors ${errs.join(' | ')}`);
    await ctx.close();
  }

  // ---- 2. booking with an email that already has an account ---------------
  for (const kind of ['existing', 'new']) {
    const ctx = await ctxFor(w, {
      '/account/session': { status: 'error' },
      '/inquiry': kind === 'existing'
        ? { status: 'saved', ref: 'CUE-777', token: null, account: null, signin_sent: true, signin_email: 'andras@example.com' }
        : { status: 'saved', ref: 'CUE-778', token: 'tok-new', account: { id: 9, name: 'New', email: 'fresh@example.com' }, signin_sent: false },
    });
    const page = await ctx.newPage();
    const errs = []; page.on('pageerror', (e) => errs.push(String(e)));
    await page.addInitScript((day) => {
      localStorage.setItem('cue_itinerary_v1', JSON.stringify({ days: [{ items: ['Ubud Tour'], itemModes: ['standard'], itemTimes: ['08:00'], date: day, guests: '2' }] }));
    }, DAY);
    // ?pay=0: the booking is taken with nothing charged online, so the modal
    // lands on its own success screen rather than PayPal's iframe.
    await page.goto(BASE + '/my-trips.html?pay=0', { waitUntil: 'networkidle' });
    await page.locator('button:visible', { hasText: /Pay now|Book now|Checkout/i }).first().click();
    await page.fill('input[type=text]:visible >> nth=0', 'Someone');
    await page.locator('input[type=tel]:visible').first().fill('+36306563875');
    await page.locator('input[type=email]:visible').first().fill(kind === 'existing' ? 'andras@example.com' : 'fresh@example.com');
    const pickup = page.locator('input[placeholder*="otel" i]:visible, input[placeholder*="ickup" i]:visible').first();
    if (await pickup.count()) await pickup.fill('Ubud');
    await page.locator('button:visible', { hasText: /^\s*Continue\s*$/ }).click();
    await page.locator('button:visible', { hasText: /Book now/i }).last().click();
    await page.waitForTimeout(900);
    const token = await page.evaluate(() => localStorage.getItem('cue_token'));
    const note = await page.locator('[data-signin-note]:visible').first().innerText().catch(() => '');
    if (kind === 'existing') {
      ok(/already have an account/i.test(note) && note.includes('andras@example.com'),
        `${w}/book-existing: the guest is not told where the sign-in link went (got "${note}")`);
      ok(!token, `${w}/book-existing: THE BROWSER ENDED UP HOLDING A LOGIN`);
    } else {
      ok(!note, `${w}/book-new: a brand-new guest was told to check an inbox`);
      ok(token === 'tok-new', `${w}/book-new: a new guest is no longer signed in after booking (${token})`);
    }
    ok(await page.locator('text=Booking Received').isVisible(), `${w}/book-${kind}: never reached the success screen`);
    const over = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
    ok(over <= 0, `${w}/book-${kind}: page overflows by ${over}px`);
    ok(errs.length === 0, `${w}/book-${kind}: page errors ${errs.join(' | ')}`);
    if (kind === 'existing') await page.screenshot({ path: `shots/acct-book-existing-${w}.png` });
    await ctx.close();
  }
}
await b.close();
console.log(`${pass}/${pass + fail}`);
process.exit(fail ? 1 : 0);
