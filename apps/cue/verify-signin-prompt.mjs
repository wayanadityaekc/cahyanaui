import { chromium } from '/home/user/CUE/node_modules/playwright-core/index.mjs';
const b = await chromium.launch({
  executablePath: '/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell',
});

let pass = 0,
  fail = 0;
function ok(c, m) {
  c ? pass++ : (fail++, console.log('  FAIL:', m));
}

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
  const errs = [];
  page.on('pageerror', (e) => errs.push(String(e)));

  for (const { path, lead, tab } of PAGES) {
    await page.goto(`http://127.0.0.1:4000${path}`, { waitUntil: 'networkidle' });
    await page.waitForTimeout(400);
    if (tab) {
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
    ok((await btn.count()) >= 1, `${w}${path}: no "Sign in" button on the page`);

    await btn.click();
    await page.waitForTimeout(400);
    const dlg = page.locator('[role="dialog"]:visible').first();
    const dlgCount = await dlg.count();
    ok(dlgCount === 1, `${w}${path}: clicking Sign in did not open a visible dialog`);
    const dlgText = dlgCount === 1 ? await dlg.innerText() : '';
    ok(/email/i.test(dlgText), `${w}${path}: opened dialog doesn't look like the sign-in form`);

    await page.keyboard.press('Escape');
    await page.waitForTimeout(300);
    ok(errs.length === 0, `${w}${path}: page errors ${errs.join(' | ')}`);
  }

  await ctx.close();
}

await b.close();
console.log(`${pass}/${pass + fail}`);
process.exit(fail ? 1 : 0);
