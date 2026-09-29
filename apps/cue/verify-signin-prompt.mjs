// Logged-out empty state on Settings + My Trips (Sep 2026, Wayan: "match it to
// My Trips's shape, then upgrade both together"). Before this Settings was a
// bare unstyled <p> with no button anywhere on the page, and My Trips had a
// lead+sub shape but no button either. Both now share components/account/
// SignInPrompt.jsx: same copy shape, and a real "Sign in" button that opens
// AuthModal in place. Run against the built pages: npm run build && npm run serve.
import { chromium } from '/home/user/CUE/node_modules/playwright-core/index.mjs';
const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell' });

let pass = 0, fail = 0;
function ok(c, m) { c ? pass++ : (fail++, console.log('  FAIL:', m)); }

// My Trips lands on the cart tab by default (a local cart, no sign-in
// needed there) - the sign-in gate only lives under Booked/Past Trip.
const PAGES = [
  { path: '/settings.html', lead: 'Sign in to manage your details.', tab: null },
  { path: '/my-trips.html', lead: 'Sign in to see your trips.', tab: 'Booked Trip' },
];

for (const w of [390, 1280]) {
  const ctx = await b.newContext({ viewport: { width: w, height: 900 } });
  await ctx.route('**/api/**', (route) => {
    const url = route.request().url();
    if (url.includes('/account/session')) return route.fulfill({ json: { status: 'error' } });
    return route.fulfill({ json: {} });
  });
  const page = await ctx.newPage();
  const errs = []; page.on('pageerror', (e) => errs.push(String(e)));

  for (const { path, lead, tab } of PAGES) {
    await page.goto(`http://127.0.0.1:4000${path}`, { waitUntil: 'networkidle' });
    await page.waitForTimeout(400);
    if (tab) {
      // My Trips opens straight into its content (reading=true), not the
      // section list - mobile needs the back row tapped first to reach the
      // list the tab lives in.
      if (w < 993) {
        const back = page.locator('button:visible', { hasText: 'My trips' }).first();
        if (await back.count()) await back.click();
        await page.waitForTimeout(300);
      }
      const tabBtn = page.locator('button:visible', { hasText: tab }).first();
      await tabBtn.click();
      await page.waitForTimeout(400);
    }

    ok((await page.locator('body').innerText()).includes(lead), `${w}${path}: expected lead text missing`);

    const btn = page.locator('button', { hasText: 'Sign in' }).first();
    ok(await btn.count() >= 1, `${w}${path}: no "Sign in" button on the page`);

    // Not just present - opens the real AuthModal in place.
    await btn.click();
    await page.waitForTimeout(400);
    const dlg = page.locator('[role="dialog"]:visible').first();
    const dlgCount = await dlg.count();
    ok(dlgCount === 1, `${w}${path}: clicking Sign in did not open a visible dialog`);
    // Guarded: .innerText() on a locator matching nothing auto-waits for it
    // to appear and hangs the whole run for 30s instead of failing cleanly.
    const dlgText = dlgCount === 1 ? await dlg.innerText() : '';
    ok(/email/i.test(dlgText), `${w}${path}: opened dialog doesn't look like the sign-in form`);

    // Escape closes it cleanly, no stray page errors from the round trip.
    await page.keyboard.press('Escape');
    await page.waitForTimeout(300);
    ok(errs.length === 0, `${w}${path}: page errors ${errs.join(' | ')}`);
  }

  await ctx.close();
}

await b.close();
console.log(`${pass}/${pass + fail}`);
process.exit(fail ? 1 : 0);
