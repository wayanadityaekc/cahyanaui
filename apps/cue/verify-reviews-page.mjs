// Reviews page redesign (Sep 2026, Wayan: "use the template of listing page
// ... H1 white ... don't need extra text ... put review also in the menu").
// Pins: "Reviews" reachable from both nav surfaces, hero H1 actually renders
// white (not the shared SUBHERO_TITLE's near-invisible soft-black on this
// page's dark photo), the old marketing paragraph is gone, and the content
// section lines up with the listing pages' own left edge, not a stray 0/32px.
// Run against the built pages: npm run build && npm run serve (port 4000).
import { chromium } from '/home/user/CUE/node_modules/playwright-core/index.mjs';
const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell' });

let pass = 0, fail = 0;
const ok = (c, m) => { c ? pass++ : (fail++, console.log('  FAIL:', m)); };

for (const w of [390, 1280]) {
  const ctx = await b.newContext({ viewport: { width: w, height: 1100 } });
  await ctx.route('**/api/**', (route) => route.fulfill({ json: [] }));
  const page = await ctx.newPage();
  const errs = []; page.on('pageerror', (e) => errs.push(String(e)));

  // ---- desktop nav / drawer carries the link -----------------------------
  await page.goto('http://127.0.0.1:4000/', { waitUntil: 'networkidle' });
  if (w >= 993) {
    const link = page.locator('[data-desktop-nav] a', { hasText: 'Reviews' });
    ok(await link.count() === 1, `${w}/home: no "Reviews" link in the desktop nav`);
    ok((await link.getAttribute('href')) === '/all-reviews.html', `${w}/home: Reviews link does not point at /all-reviews.html`);
  } else {
    await page.locator('#hamburger').click();
    await page.waitForTimeout(400);
    const link = page.locator('#nav-menu a', { hasText: 'Reviews' });
    ok(await link.count() === 1, `${w}/home: no "Reviews" row in the drawer`);
    ok((await link.getAttribute('href')) === '/all-reviews.html', `${w}/home: drawer Reviews row does not point at /all-reviews.html`);
  }

  // ---- the reviews page itself --------------------------------------------
  await page.goto('http://127.0.0.1:4000/all-reviews.html', { waitUntil: 'networkidle' });
  await page.waitForTimeout(400);

  const h1 = page.locator('h1');
  ok((await h1.innerText()).trim() === 'Guest Reviews', `${w}: unexpected H1 text "${(await h1.innerText()).trim()}"`);

  // No hero photo (Wayan: "gausah isi hero image cukup h1 dan deskripsi singkat dan
  // breadcrumb") - the section holding the H1 must not carry a background image.
  const heroBg = await page.evaluate(() => {
    const h1 = document.querySelector('h1');
    const section = h1 && h1.closest('section');
    return section ? getComputedStyle(section).backgroundImage : null;
  });
  ok(heroBg === 'none', `${w}: hero section still has a background image (${heroBg})`);

  const bodyText = await page.locator('body').innerText();
  ok(!/no invitations, no incentives/i.test(bodyText), `${w}: the old marketing paragraph is still on the page`);
  ok(!/completed booking/i.test(await h1.innerText()), `${w}: H1 still carries the old long copy`);
  ok(/What guests say after booking/i.test(bodyText), `${w}: the short description line is missing`);

  // Content section lines up with a REAL listing page's own left edge - not
  // a formula re-typed into this harness (CATSEC centers within the whole
  // --container, it is not a flat --container-x gutter; re-deriving that
  // math here would just prove the harness agrees with itself).
  const h2Left = await page.evaluate(() => {
    const h2 = document.querySelector('#all-reviews h2');
    return h2 ? h2.getBoundingClientRect().left : null;
  });
  ok(h2Left !== null, `${w}: "All Reviews" heading not found`);
  const refPage = await ctx.newPage();
  await refPage.goto('http://127.0.0.1:4000/activities.html', { waitUntil: 'networkidle' });
  const refLeft = await refPage.evaluate(() => {
    const h1 = document.querySelector('h1');
    return h1 ? h1.getBoundingClientRect().left : null;
  });
  await refPage.close();
  ok(Math.abs(h2Left - refLeft) < 1, `${w}: "All Reviews" at ${h2Left}px, activities.html's own heading is at ${refLeft}px`);

  const over = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
  ok(over <= 0, `${w}: page overflows by ${over}px`);
  ok(errs.length === 0, `${w}: page errors ${errs.join(' | ')}`);
  await page.screenshot({ path: `shots/all-reviews-AFTER-${w}.png`, fullPage: true });
  await ctx.close();
}

await b.close();
console.log(`${pass}/${pass + fail}`);
process.exit(fail ? 1 : 0);
