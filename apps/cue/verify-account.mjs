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
function ok(c, m) { c ? pass++ : (fail++, console.log('  FAIL:', m)); }
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
    await page.goto(`${BASE}/index.html`, { waitUntil: 'networkidle' });
    // Open the sign-in modal the way a guest does since WO1: the account slot at the
    // right of the navbar. Phones open the modal straight away; desktop opens a small
    // menu first, whose green "Log in" opens it.
    await page.locator('[data-account-slot="out"] > button').click();
    if (w > 992) await page.locator('[data-account-slot="out"] div[id] button', { hasText: 'Log in' }).click();
    await page.locator('button:visible', { hasText: 'Create an account' }).click();
    await page.fill('#auth-name:visible', 'Someone');
    await page.fill('#auth-cemail:visible', kind === 'existing' ? 'andras@example.com' : 'fresh@example.com');
    await page.fill('#auth-phone:visible', '+36306563875');
    await page.locator('button:visible', { hasText: 'Create Account' }).click();
    await page.waitForTimeout(700);
    const token = await page.evaluate(() => localStorage.getItem('cue_token'));
    if (kind === 'existing') {
      // 28 Sep 2026: the account door is a 6-digit code now, not a passive
      // "check your email" - the server already emailed one, and the modal
      // moves straight to the same code-entry stage a plain sign-in uses.
      const note = await page.locator('[data-signin-note]:visible').first().innerText().catch(() => '');
      ok(/already have an account as/i.test(note) && note.includes('andras@example.com'),
        `${w}/create-existing: the guest is not told which account this is (got "${note}")`);
      ok(!token, `${w}/create-existing: THE BROWSER ENDED UP HOLDING A LOGIN`);
      ok(!(await page.locator('#auth-cemail:visible').count()), `${w}/create-existing: sign-up form still showing instead of the code stage`);
      ok(await page.locator('input[inputmode="numeric"]:visible').count() === 6, `${w}/create-existing: did not land on the 6-box code entry`);
    } else {
      ok(token === 'tok-new', `${w}/create-new: a new guest is no longer signed in (${token})`);
      ok(!(await page.locator('#auth-cemail:visible').count()), `${w}/create-new: the modal stayed open after a real sign-up`);
    }
    ok(errs.length === 0, `${w}/create-${kind}: page errors ${errs.join(' | ')}`);
    await ctx.close();
  }

  // ---- 2. booking ---------------------------------------------------------
  // WO2 (28 Sep 2026): booking needs an account, so a logged-out guest never
  // reaches this form any more - verify-gate.mjs pins that. What stays worth
  // pinning here: a SIGNED-IN guest books, reaches the success screen, keeps the
  // session it came with, and is never told to go check an inbox. The two runs
  // differ only in booking ref; both stub the server the way it really answers a
  // signed-in booking (no token, no signin_sent).
  for (const kind of ['existing', 'new']) {
    const ctx = await ctxFor(w, {
      '/account/session': { account: { id: 9, name: 'Signed In', email: 'fresh@example.com' } },
      '/inquiry': { status: 'saved', ref: kind === 'existing' ? 'CUE-777' : 'CUE-778', token: null, account: null, signin_sent: false },
    });
    const page = await ctx.newPage();
    const errs = []; page.on('pageerror', (e) => errs.push(String(e)));
    await page.addInitScript((day) => {
      localStorage.setItem('cue_token', 'tok-signed-in');
      localStorage.setItem('cue_itinerary_v1', JSON.stringify({ days: [{ items: ['Ubud Tour'], itemModes: ['standard'], itemTimes: ['08:00'], date: day, guests: '2' }] }));
    }, DAY);
    // ?pay=0: the booking is taken with nothing charged online, so the modal
    // lands on its own success screen rather than PayPal's iframe.
    await page.goto(`${BASE}/my-trips.html?pay=0`, { waitUntil: 'networkidle' });
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
    ok(!note, `${w}/book-${kind}: a signed-in guest was told to check an inbox`);
    ok(token === 'tok-signed-in', `${w}/book-${kind}: the session was dropped or swapped (${token})`);
    ok(await page.locator('text=Booking Received').isVisible(), `${w}/book-${kind}: never reached the success screen`);
    const over = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
    ok(over <= 0, `${w}/book-${kind}: page overflows by ${over}px`);
    ok(errs.length === 0, `${w}/book-${kind}: page errors ${errs.join(' | ')}`);
    await ctx.close();
  }
}
await b.close();
console.log(`${pass}/${pass + fail}`);
process.exit(fail ? 1 : 0);
