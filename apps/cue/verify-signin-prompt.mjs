import { chromium } from '/home/user/CUE/node_modules/playwright-core/index.mjs';
const browser = await chromium.launch({
  executablePath: '/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell',
});

let pass = 0,
  fail = 0;
function recordCheck(isPassing, message) {
  isPassing ? pass++ : (fail++, console.log('  FAIL:', message));
}

const PAGES = [
  { path: '/settings.html', lead: 'Sign in to manage your details.', tab: null },
  { path: '/my-trips.html', lead: 'Sign in to see your trips.', tab: 'Booked Trip' },
];

for (const width of [390, 1280]) {
  const browserContext = await browser.newContext({ viewport: { width: width, height: 900 } });
  await browserContext.route('**/api/**', (route) => {
    const url = route.request().url();
    if (url.includes('/account/session')) return route.fulfill({ json: { status: 'error' } });
    return route.fulfill({ json: {} });
  });
  const page = await browserContext.newPage();
  const errs = [];
  page.on('pageerror', (error) => errs.push(String(error)));

  for (const { path, lead, tab } of PAGES) {
    await page.goto(`http://127.0.0.1:4000${path}`, { waitUntil: 'networkidle' });
    await page.waitForTimeout(400);
    if (tab) {
      if (width < 993) {
        const back = page.locator('button:visible', { hasText: 'My trips' }).first();
        if (await back.count()) await back.click();
        await page.waitForTimeout(300);
      }
      const tabBtn = page.locator('button:visible', { hasText: tab }).first();
      await tabBtn.click();
      await page.waitForTimeout(400);
    }

    recordCheck((await page.locator('body').innerText()).includes(lead), `${width}${path}: expected lead text missing`);

    const button = page.locator('button', { hasText: 'Sign in' }).first();
    recordCheck((await button.count()) >= 1, `${width}${path}: no "Sign in" button on the page`);

    await button.click();
    await page.waitForTimeout(400);
    const dlg = page.locator('[role="dialog"]:visible').first();
    const dlgCount = await dlg.count();
    recordCheck(dlgCount === 1, `${width}${path}: clicking Sign in did not open a visible dialog`);
    const dlgText = dlgCount === 1 ? await dlg.innerText() : '';
    recordCheck(/email/i.test(dlgText), `${width}${path}: opened dialog doesn't look like the sign-in form`);

    await page.keyboard.press('Escape');
    await page.waitForTimeout(300);
    recordCheck(errs.length === 0, `${width}${path}: page errors ${errs.join(' | ')}`);
  }

  await browserContext.close();
}

await browser.close();
console.log(`${pass}/${pass + fail}`);
process.exit(fail ? 1 : 0);
