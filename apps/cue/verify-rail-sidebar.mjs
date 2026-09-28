// Collapsible rail + breadcrumb-in-header on My Trips/Our Company/Settings
// (Sep 2026, Wayan: "make it like shadcn's sidebar-08" - picked the
// collapsible toggle and the header breadcrumb, applied to all three account
// pages). Run against the built pages: npm run build && npm run serve.
import { chromium } from '/home/user/CUE/node_modules/playwright-core/index.mjs';
const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell' });

let pass = 0, fail = 0;
const ok = (c, m) => { c ? pass++ : (fail++, console.log('  FAIL:', m)); };

const ACC = { id: 1, name: 'Wayan Aditya', email: 'wayan@example.com' };

async function loggedInCtx(w = 1280) {
  const ctx = await b.newContext({ viewport: { width: w, height: 900 } });
  await ctx.route('**/api/**', (route) => {
    const url = route.request().url();
    if (url.includes('/account/session')) return route.fulfill({ json: { status: 'ok', account: ACC } });
    return route.fulfill({ json: {} });
  });
  await ctx.addInitScript(() => localStorage.setItem('cue_token', 'tok-x'));
  return ctx;
}

const PAGES = [
  { path: '/settings.html', crumb: 'Settings' },
  { path: '/my-trips.html', crumb: 'My Trips' },
  { path: '/our-company.html', crumb: 'Our Company' },
];

// ---- desktop: trigger + breadcrumb present, collapse actually shrinks the rail
for (const { path, crumb } of PAGES) {
  const ctx = await loggedInCtx(1280);
  const page = await ctx.newPage();
  const errs = []; page.on('pageerror', (e) => errs.push(String(e)));
  await page.goto(`http://127.0.0.1:4000${path}`, { waitUntil: 'networkidle' });
  await page.waitForTimeout(500);

  const trigger = page.locator('button[aria-label="Collapse sidebar"]');
  ok(await trigger.count() === 1, `${path}: no collapse trigger found`);

  const crumbText = await page.locator('nav[aria-label="Breadcrumb"]:visible').innerText();
  ok(crumbText.includes('Home') && crumbText.includes(crumb), `${path}: header breadcrumb missing "Home › ${crumb}" (got "${crumbText}")`);

  const before = await page.evaluate(() => document.querySelector('aside').getBoundingClientRect().width);
  await trigger.click({ force: true, timeout: 8000 });
  await page.waitForTimeout(400);
  const after = await page.evaluate(() => document.querySelector('aside').getBoundingClientRect().width);
  ok(before > 200, `${path}: expanded rail measured ${before}px, expected >200`);
  ok(after < 100, `${path}: collapsed rail measured ${after}px, expected <100`);

  // The item's label text is gone from the painted row, but the page is
  // still navigable - title/aria-label still carry it.
  const activeRow = page.locator('aside [role="tab"][aria-selected="true"], aside a[aria-current="true"]').first();
  const rowText = await activeRow.innerText().catch(() => '');
  ok(rowText.trim() === '', `${path}: collapsed row still paints its label ("${rowText}")`);

  ok(errs.length === 0, `${path}: page errors ${errs.join(' | ')}`);
  await ctx.close();
}

// ---- collapse state persists across a fresh page load (one shared preference)
{
  const ctx = await loggedInCtx(1280);
  const page = await ctx.newPage();
  await page.goto('http://127.0.0.1:4000/my-trips.html', { waitUntil: 'networkidle' });
  await page.waitForTimeout(500);
  await page.locator('button[aria-label="Collapse sidebar"]').click({ force: true, timeout: 8000 });
  await page.waitForTimeout(400);
  await page.goto('http://127.0.0.1:4000/settings.html', { waitUntil: 'networkidle' });
  await page.waitForTimeout(500);
  const w = await page.evaluate(() => document.querySelector('aside').getBoundingClientRect().width);
  ok(w < 100, `settings.html after collapsing on my-trips.html: rail is ${w}px, expected <100 (collapse should be a shared preference)`);
  await ctx.close();
}

// ---- Terms/Privacy/Cancellation get the SAME header breadcrumb as every
// other tab now (Sep 2026, Wayan: "follow the breadcrumb in the account
// setting, no breadcrumb inside the content") - the legal-only inline
// "Pattern A" trail that used to print above the H1 is gone, and the header
// one is never suppressed. Exactly one breadcrumb on screen, always the
// header's.
{
  const ctx = await loggedInCtx(1280);
  const page = await ctx.newPage();
  await page.goto('http://127.0.0.1:4000/our-company.html#terms', { waitUntil: 'networkidle' });
  await page.waitForTimeout(600);
  const headerCrumbCount = await page.locator('main > div > nav[aria-label="Breadcrumb"]:visible').count();
  ok(headerCrumbCount === 1, `terms tab: header breadcrumb should always show, found ${headerCrumbCount}`);
  const inlineCrumb = await page.locator('h1', { hasText: 'Terms & Conditions' }).locator('xpath=preceding-sibling::nav[1]').count();
  ok(inlineCrumb === 0, 'terms tab: no breadcrumb should print inside the content anymore');
  const totalCrumbs = await page.locator('nav[aria-label="Breadcrumb"]:visible').count();
  ok(totalCrumbs === 1, `terms tab: exactly one breadcrumb should be visible on screen, found ${totalCrumbs}`);
  await ctx.close();
}

// ---- mobile: no trigger, no header breadcrumb - the phone UX is untouched
for (const { path } of PAGES) {
  const ctx = await loggedInCtx(390);
  const page = await ctx.newPage();
  const errs = []; page.on('pageerror', (e) => errs.push(String(e)));
  await page.goto(`http://127.0.0.1:4000${path}`, { waitUntil: 'networkidle' });
  await page.waitForTimeout(500);
  const trigger = await page.locator('button[aria-label="Collapse sidebar"]:visible').count();
  ok(trigger === 0, `${path} @390: collapse trigger should not show on mobile`);
  const crumbVisible = await page.locator('nav[aria-label="Breadcrumb"]:visible').count();
  ok(crumbVisible === 0, `${path} @390: header breadcrumb should not show on mobile`);
  ok(errs.length === 0, `${path} @390: page errors ${errs.join(' | ')}`);
  await ctx.close();
}

// ---- settings: single rail item, always active, no phone list/back screen
{
  const ctx = await loggedInCtx(390);
  const page = await ctx.newPage();
  await page.goto('http://127.0.0.1:4000/settings.html', { waitUntil: 'networkidle' });
  await page.waitForTimeout(500);
  const bodyText = await page.locator('body').innerText();
  ok(bodyText.includes('Account Settings'), '@390 settings: content not shown directly (mobileNav should skip the list+back screen)');
  // The phone list+back screen RailLayout shows for multi-item pages must
  // not appear here - there's only one item, so a list of it would be noise.
  const backBtn = await page.locator('button:visible', { hasText: 'Account Settings' }).count();
  ok(backBtn === 0, `@390 settings: found ${backBtn} "Account Settings" back/list button - mobileNav should have skipped it`);
  await ctx.close();
}

await b.close();
console.log(`${pass}/${pass + fail}`);
process.exit(fail ? 1 : 0);
