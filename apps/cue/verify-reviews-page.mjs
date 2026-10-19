import { chromium } from '/home/user/CUE/node_modules/playwright-core/index.mjs';
const browser = await chromium.launch({
  executablePath: '/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell',
});

let pass = 0,
  fail = 0;
function ok(isPassing, message) {
  isPassing ? pass++ : (fail++, console.log('  FAIL:', message));
}

for (const width of [390, 1280]) {
  const browserContext = await browser.newContext({ viewport: { width: width, height: 1100 } });
  await browserContext.route('**/api/**', (route) => route.fulfill({ json: [] }));
  const page = await browserContext.newPage();
  const errs = [];
  page.on('pageerror', (error) => errs.push(String(error)));

  await page.goto('http://127.0.0.1:4000/', { waitUntil: 'networkidle' });
  if (width >= 993) {
    const link = page.locator('[data-desktop-nav] a', { hasText: 'Reviews' });
    ok((await link.count()) === 1, `${width}/home: no "Reviews" link in the desktop nav`);
    ok(
      (await link.getAttribute('href')) === '/all-reviews.html',
      `${width}/home: Reviews link does not point at /all-reviews.html`,
    );
  } else {
    await page.locator('#hamburger').click();
    await page.waitForTimeout(400);
    const link = page.locator('#nav-menu a', { hasText: 'Reviews' });
    ok((await link.count()) === 1, `${width}/home: no "Reviews" row in the drawer`);
    ok(
      (await link.getAttribute('href')) === '/all-reviews.html',
      `${width}/home: drawer Reviews row does not point at /all-reviews.html`,
    );
  }

  await page.goto('http://127.0.0.1:4000/all-reviews.html', { waitUntil: 'networkidle' });
  await page.waitForTimeout(400);

  const h1 = page.locator('h1');
  ok(
    (await h1.innerText()).trim() === 'Guest Reviews',
    `${width}: unexpected H1 text "${(await h1.innerText()).trim()}"`,
  );

  const heroBg = await page.evaluate(() => {
    const h1 = document.querySelector('h1');
    const section = h1 && h1.closest('section');
    return section ? getComputedStyle(section).backgroundImage : null;
  });
  ok(heroBg === 'none', `${width}: hero section still has a background image (${heroBg})`);

  const bodyText = await page.locator('body').innerText();
  ok(!/no invitations, no incentives/i.test(bodyText), `${width}: the old marketing paragraph is still on the page`);
  ok(!/completed booking/i.test(await h1.innerText()), `${width}: H1 still carries the old long copy`);
  ok(/What guests say after booking/i.test(bodyText), `${width}: the short description line is missing`);

  const h2Left = await page.evaluate(() => {
    const h2 = document.querySelector('#all-reviews h2');
    return h2 ? h2.getBoundingClientRect().left : null;
  });
  ok(h2Left !== null, `${width}: "All Reviews" heading not found`);
  const refPage = await browserContext.newPage();
  await refPage.goto('http://127.0.0.1:4000/activities.html', { waitUntil: 'networkidle' });
  const refLeft = await refPage.evaluate(() => {
    const h1 = document.querySelector('h1');
    return h1 ? h1.getBoundingClientRect().left : null;
  });
  await refPage.close();
  ok(
    Math.abs(h2Left - refLeft) < 1,
    `${width}: "All Reviews" at ${h2Left}px, activities.html's own heading is at ${refLeft}px`,
  );

  const over = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
  ok(over <= 0, `${width}: page overflows by ${over}px`);
  ok(errs.length === 0, `${width}: page errors ${errs.join(' | ')}`);
  await page.screenshot({ path: `shots/all-reviews-AFTER-${width}.png`, fullPage: true });
  await browserContext.close();
}

await browser.close();
console.log(`${pass}/${pass + fail}`);
process.exit(fail ? 1 : 0);
