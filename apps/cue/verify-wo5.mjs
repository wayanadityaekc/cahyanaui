// WO5 (Sep 2026): compact footer on Settings/My Trips/Our Company, sticky
// sidebar reusing RailLayout on My Trips + Our Company (legal pages live
// inside Our Company), and My Trips' duplicate title trimmed to one.
// Run against the built pages: npm run build && npm run serve (port 4000).
import { chromium } from '/home/user/CUE/node_modules/playwright-core/index.mjs';
const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell' });

let pass = 0, fail = 0;
const ok = (c, m) => { c ? pass++ : (fail++, console.log('  FAIL:', m)); };

const COMPACT_PAGES = ['/settings.html', '/my-trips.html', '/our-company.html'];
const FULL_PAGES = ['/tour.html', '/activities.html', '/charter.html'];

for (const w of [390, 1280]) {
  const ctx = await b.newContext({ viewport: { width: w, height: 1000 } });
  await ctx.route('**/api/**', (route) => {
    const url = route.request().url();
    if (url.includes('/account/session')) return route.fulfill({ json: { status: 'error' } });
    return route.fulfill({ json: {} });
  });
  const page = await ctx.newPage();
  const errs = []; page.on('pageerror', (e) => errs.push(String(e)));

  // ---- compact footer on the three account/utility pages ------------------
  for (const path of COMPACT_PAGES) {
    await page.goto(`http://127.0.0.1:4000${path}`, { waitUntil: 'networkidle' });
    await page.waitForTimeout(300);
    const footer = page.locator('footer');
    ok(await footer.count() === 1, `${w}${path}: expected exactly 1 footer, got ${await footer.count()}`);
    const text = await footer.innerText();
    ok(/Cahyana Ubud Experience/i.test(text), `${w}${path}: brand name missing from footer`);
    ok(!/We Accept/i.test(text), `${w}${path}: full footer's "We Accept" column still showing`);
    ok(!/Featured On/i.test(text), `${w}${path}: full footer's "Featured On" column still showing`);
    ok(!/Explore/i.test(text), `${w}${path}: full footer's "Explore" column heading still showing`);
    const h = await footer.evaluate((el) => el.getBoundingClientRect().height);
    ok(h < 140, `${w}${path}: compact footer measured ${h}px tall, expected under 140`);
    // Mobile: no taller than the navbar itself (Wayan: "shorter, at least
    // same height with navbar") - compared against the navbar's OWN measured
    // height on this page, not a number typed into the harness.
    if (w <= 560) {
      const navH = await page.evaluate(() => document.querySelector('header').getBoundingClientRect().height);
      ok(h <= navH + 1, `${w}${path}: compact footer (${h}px) is taller than the navbar (${navH}px)`);
    }
    ok(errs.length === 0, `${w}${path}: page errors ${errs.join(' | ')}`);
  }

  // ---- full footer everywhere else, unchanged ------------------------------
  for (const path of FULL_PAGES) {
    await page.goto(`http://127.0.0.1:4000${path}`, { waitUntil: 'networkidle' });
    await page.waitForTimeout(300);
    const text = await page.locator('footer').innerText();
    ok(/We Accept/i.test(text), `${w}${path}: full footer lost its "We Accept" column`);
    ok(/Featured On/i.test(text), `${w}${path}: full footer lost its "Featured On" column`);
  }

  // ---- My Trips: one title, not two --------------------------------------
  await page.goto('http://127.0.0.1:4000/my-trips.html', { waitUntil: 'networkidle' });
  await page.waitForTimeout(300);
  const h1Count = await page.locator('h1').count();
  ok(h1Count === 0, `${w}/my-trips: expected the big h1 gone, found ${h1Count}`);
  const smallLabelCount = await page.locator('p', { hasText: 'My trips' }).count();
  ok(smallLabelCount >= 1, `${w}/my-trips: the small rail label is gone too - nothing names the page`);

  await ctx.close();
}

// ---- sticky sidebar (desktop only) on My Trips + Our Company --------------
for (const path of ['/my-trips.html', '/our-company.html']) {
  const ctx = await b.newContext({ viewport: { width: 1280, height: 900 } });
  await ctx.route('**/api/**', (route) => route.fulfill({ json: {} }));
  const page = await ctx.newPage();
  await page.goto(`http://127.0.0.1:4000${path}`, { waitUntil: 'networkidle' });
  await page.waitForTimeout(400);
  const headerH = await page.evaluate(() => parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--header-h')) || null);
  await page.evaluate(() => window.scrollTo(0, 900));
  await page.waitForTimeout(400);
  const stickTop = await page.evaluate(() => {
    const aside = document.querySelector('aside');
    const menu = aside && aside.firstElementChild;
    return menu ? menu.getBoundingClientRect().top : null;
  });
  ok(stickTop !== null, `1280${path}: sticky rail menu not found`);
  ok(headerH !== null && stickTop !== null && Math.abs(stickTop - headerH) < 2,
    `1280${path}: rail menu top=${stickTop}, expected to pin at --header-h=${headerH}`);
  await ctx.close();
}

await b.close();
console.log(`${pass}/${pass + fail}`);
process.exit(fail ? 1 : 0);
