import { chromium } from '/home/user/CUE/node_modules/playwright-core/index.mjs';
const browser = await chromium.launch({
  executablePath: '/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell',
});

let pass = 0,
  fail = 0;
function ok(isPassing, message) {
  isPassing ? pass++ : (fail++, console.log('  FAIL:', message));
}

const ACC = { id: 1, name: 'Wayan Aditya', email: 'wayan@example.com' };

async function loggedInCtx(viewportWidth = 1280) {
  const browserContext = await browser.newContext({ viewport: { width: viewportWidth, height: 900 } });
  await browserContext.route('**/api/**', (route) => {
    const url = route.request().url();
    if (url.includes('/account/session')) return route.fulfill({ json: { status: 'ok', account: ACC } });
    return route.fulfill({ json: {} });
  });
  await browserContext.addInitScript(() => localStorage.setItem('cue_token', 'tok-x'));
  return browserContext;
}

const PAGES = [
  { path: '/settings.html', crumb: 'Settings' },
  { path: '/my-trips.html', crumb: 'My Trips' },
  { path: '/our-company.html', crumb: 'Our Company' },
];

for (const { path, crumb } of PAGES) {
  const browserContext = await loggedInCtx(1280);
  const page = await browserContext.newPage();
  const errs = [];
  page.on('pageerror', (error) => errs.push(String(error)));
  await page.goto(`http://127.0.0.1:4000${path}`, { waitUntil: 'networkidle' });
  await page.waitForTimeout(500);

  const trigger = page.locator('button[aria-label="Collapse sidebar"]');
  ok((await trigger.count()) === 1, `${path}: no collapse trigger found`);

  const crumbText = await page.locator('nav[aria-label="Breadcrumb"]:visible').innerText();
  ok(
    crumbText.includes('Home') && crumbText.includes(crumb),
    `${path}: header breadcrumb missing "Home › ${crumb}" (got "${crumbText}")`,
  );

  const before = await page.evaluate(() => document.querySelector('aside').getBoundingClientRect().width);
  await trigger.click({ force: true, timeout: 8000 });
  await page.waitForTimeout(400);
  const after = await page.evaluate(() => document.querySelector('aside').getBoundingClientRect().width);
  ok(before > 200, `${path}: expanded rail measured ${before}px, expected >200`);
  ok(after < 100, `${path}: collapsed rail measured ${after}px, expected <100`);

  const activeRow = page.locator('aside [aria-current="true"]').first();
  const rowText = await activeRow.innerText().catch(() => '');
  ok(rowText.trim() === '', `${path}: collapsed row still paints its label ("${rowText}")`);

  ok(errs.length === 0, `${path}: page errors ${errs.join(' | ')}`);
  await browserContext.close();
}

{
  const browserContext = await loggedInCtx(1280);
  const page = await browserContext.newPage();
  await page.goto('http://127.0.0.1:4000/my-trips.html', { waitUntil: 'networkidle' });
  await page.waitForTimeout(500);
  await page.locator('button[aria-label="Collapse sidebar"]').click({ force: true, timeout: 8000 });
  await page.waitForTimeout(400);
  await page.goto('http://127.0.0.1:4000/settings.html', { waitUntil: 'networkidle' });
  await page.waitForTimeout(500);
  const asideWidth = await page.evaluate(() => document.querySelector('aside').getBoundingClientRect().width);
  ok(
    asideWidth < 100,
    `settings.html after collapsing on my-trips.html: rail is ${asideWidth}px, expected <100 (collapse should be a shared preference)`,
  );
  await browserContext.close();
}

{
  const browserContext = await loggedInCtx(1280);
  const page = await browserContext.newPage();
  await page.goto('http://127.0.0.1:4000/our-company.html#terms', { waitUntil: 'networkidle' });
  await page.waitForTimeout(600);
  const headerCrumbCount = await page.locator('main > div > nav[aria-label="Breadcrumb"]:visible').count();
  ok(headerCrumbCount === 1, `terms tab: header breadcrumb should always show, found ${headerCrumbCount}`);
  const inlineCrumb = await page
    .locator('h1', { hasText: 'Terms & Conditions' })
    .locator('xpath=preceding-sibling::nav[1]')
    .count();
  ok(inlineCrumb === 0, 'terms tab: no breadcrumb should print inside the content anymore');
  const totalCrumbs = await page.locator('nav[aria-label="Breadcrumb"]:visible').count();
  ok(totalCrumbs === 1, `terms tab: exactly one breadcrumb should be visible on screen, found ${totalCrumbs}`);
  await browserContext.close();
}

for (const { path } of PAGES) {
  const browserContext = await loggedInCtx(390);
  const page = await browserContext.newPage();
  const errs = [];
  page.on('pageerror', (error) => errs.push(String(error)));
  await page.goto(`http://127.0.0.1:4000${path}`, { waitUntil: 'networkidle' });
  await page.waitForTimeout(500);
  const trigger = await page.locator('button[aria-label="Collapse sidebar"]:visible').count();
  ok(trigger === 0, `${path} @390: collapse trigger should not show on mobile`);
  const crumbVisible = await page.locator('nav[aria-label="Breadcrumb"]:visible').count();
  ok(crumbVisible === 0, `${path} @390: header breadcrumb should not show on mobile`);
  ok(errs.length === 0, `${path} @390: page errors ${errs.join(' | ')}`);
  await browserContext.close();
}

{
  const browserContext = await loggedInCtx(390);
  const page = await browserContext.newPage();
  await page.goto('http://127.0.0.1:4000/settings.html', { waitUntil: 'networkidle' });
  await page.waitForTimeout(500);
  const bodyText = await page.locator('body').innerText();
  ok(
    bodyText.includes('Account Settings'),
    '@390 settings: content not shown directly (mobileNav should skip the list+back screen)',
  );
  const backBtn = await page.locator('button:visible', { hasText: 'Account Settings' }).count();
  ok(
    backBtn === 0,
    `@390 settings: found ${backBtn} "Account Settings" back/list button - mobileNav should have skipped it`,
  );
  await browserContext.close();
}

await browser.close();
console.log(`${pass}/${pass + fail}`);
process.exit(fail ? 1 : 0);
