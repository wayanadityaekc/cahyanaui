import { chromium } from '/home/user/CUE/node_modules/playwright-core/index.mjs';
const b = await chromium.launch({
  executablePath: '/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell',
});

let pass = 0,
  fail = 0;
function ok(c, m) {
  c ? pass++ : (fail++, console.log('  FAIL:', m));
}

const PAGES = ['/settings.html', '/my-trips.html', '/our-company.html'];

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

  for (const path of PAGES) {
    await page.goto(`http://127.0.0.1:4000${path}`, { waitUntil: 'networkidle' });
    await page.waitForTimeout(300);

    const before = await page.evaluate(() => {
      const f = document.querySelector('footer');
      const r = f.getBoundingClientRect();
      return { top: r.top, bottom: r.bottom, vh: window.innerHeight, position: getComputedStyle(f).position };
    });
    ok(before.position === 'fixed', `${w}${path}: footer is not position:fixed (${before.position})`);
    ok(
      Math.abs(before.bottom - before.vh) < 1,
      `${w}${path}: footer bottom=${before.bottom}, viewport=${before.vh} - not flush with the bottom edge`,
    );

    await page.evaluate(() => window.scrollTo(0, 999999));
    await page.waitForTimeout(500);
    const after = await page.evaluate(() => {
      const f = document.querySelector('footer');
      const r = f.getBoundingClientRect();
      return { top: r.top, bottom: r.bottom, vh: window.innerHeight, scrollY: window.scrollY };
    });
    if (after.scrollY > 0) {
      ok(
        Math.abs(after.top - before.top) < 1,
        `${w}${path}: footer moved on scroll (top ${before.top} -> ${after.top})`,
      );
      ok(
        Math.abs(after.bottom - after.vh) < 1,
        `${w}${path}: after scrolling, footer bottom=${after.bottom} != viewport ${after.vh}`,
      );
    }

    const overlap = await page.evaluate(() => {
      const f = document.querySelector('footer');
      const fTop = f.getBoundingClientRect().top;
      const kids = Array.from(document.body.children).filter(
        (element) =>
          element.tagName !== 'FOOTER' &&
          getComputedStyle(element).display !== 'none' &&
          getComputedStyle(element).position !== 'fixed',
      );
      let worst = 0;
      kids.forEach((element) => {
        const b = element.getBoundingClientRect().bottom;
        if (b > fTop) worst = Math.max(worst, b - fTop);
      });
      return worst;
    });
    ok(overlap <= 1, `${w}${path}: page content overlaps the fixed footer by ${overlap}px`);

    ok(errs.length === 0, `${w}${path}: page errors ${errs.join(' | ')}`);
  }

  await ctx.close();
}

{
  const ctx = await b.newContext({ viewport: { width: 390, height: 900 } });
  await ctx.addInitScript(() => {
    function mark() {
      document.documentElement.dataset.standalone = '1';
    }
    if (document.documentElement) mark();
    else document.addEventListener('readystatechange', mark, { once: true });
  });
  await ctx.route('**/api/**', (route) => route.fulfill({ json: {} }));
  const page = await ctx.newPage();
  for (const path of PAGES) {
    await page.goto(`http://127.0.0.1:4000${path}`, { waitUntil: 'networkidle' });
    await page.waitForTimeout(300);
    const navDisplay = await page.evaluate(() => {
      const element = document.querySelector('[data-appnav]');
      return element ? getComputedStyle(element).display : null;
    });
    ok(
      navDisplay === 'none',
      `standalone/390${path}: app bottom bar did not yield to the fixed footer (display=${navDisplay})`,
    );
    const footerFixed = await page.evaluate(() => {
      const f = document.querySelector('footer');
      return f ? getComputedStyle(f).position : null;
    });
    ok(footerFixed === 'fixed', `standalone/390${path}: footer lost its fixed position in app mode`);
  }
  await ctx.close();
}

await b.close();
console.log(`${pass}/${pass + fail}`);
process.exit(fail ? 1 : 0);
