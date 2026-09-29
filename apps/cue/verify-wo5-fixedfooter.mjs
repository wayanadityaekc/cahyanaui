// Follow-up on WO5 (Sep 2026, Wayan: "whichever page has compact footer, the
// footer needs to be sticky at the bottom, only the content scrolled"). The
// compact footer goes from "last thing on the page" to fixed at the viewport
// bottom on Settings/My Trips/Our Company. Run against the built pages:
// npm run build && npm run serve (port 4000).
import { chromium } from '/home/user/CUE/node_modules/playwright-core/index.mjs';
const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell' });

let pass = 0, fail = 0;
function ok(c, m) { c ? pass++ : (fail++, console.log('  FAIL:', m)); }

const PAGES = ['/settings.html', '/my-trips.html', '/our-company.html'];

for (const w of [390, 1280]) {
  const ctx = await b.newContext({ viewport: { width: w, height: 900 } });
  await ctx.route('**/api/**', (route) => {
    const url = route.request().url();
    if (url.includes('/account/session')) return route.fulfill({ json: { status: 'error' } });
    return route.fulfill({ json: {} });
  });
  const page = await ctx.newPage();
  const errs = []; page.on('pageerror', (e) => errs.push(String(e)));

  for (const path of PAGES) {
    await page.goto(`http://127.0.0.1:4000${path}`, { waitUntil: 'networkidle' });
    await page.waitForTimeout(300);

    // Footer sits at the true bottom of the viewport BEFORE any scroll.
    const before = await page.evaluate(() => {
      const f = document.querySelector('footer');
      const r = f.getBoundingClientRect();
      return { top: r.top, bottom: r.bottom, vh: window.innerHeight, position: getComputedStyle(f).position };
    });
    ok(before.position === 'fixed', `${w}${path}: footer is not position:fixed (${before.position})`);
    ok(Math.abs(before.bottom - before.vh) < 1, `${w}${path}: footer bottom=${before.bottom}, viewport=${before.vh} - not flush with the bottom edge`);

    // Scroll the page as far as it goes - footer must not move at all. Some
    // of these pages are short enough not to scroll at all (logged out
    // Settings, say) - that is not a failure, there is just nothing to prove
    // the "stays put" half with; the overlap check below still runs either way.
    // A huge number, not document.documentElement.scrollHeight read up front -
    // the browser clamps it to the real max itself. Reading scrollHeight first
    // measured short here (fell ~30px shy of the true max, reproducibly), on
    // a page whose height depends on --header-h-max/dvh math that keeps
    // settling for a moment after networkidle.
    await page.evaluate(() => window.scrollTo(0, 999999));
    await page.waitForTimeout(500);
    const after = await page.evaluate(() => {
      const f = document.querySelector('footer');
      const r = f.getBoundingClientRect();
      return { top: r.top, bottom: r.bottom, vh: window.innerHeight, scrollY: window.scrollY };
    });
    if (after.scrollY > 0) {
      ok(Math.abs(after.top - before.top) < 1, `${w}${path}: footer moved on scroll (top ${before.top} -> ${after.top})`);
      ok(Math.abs(after.bottom - after.vh) < 1, `${w}${path}: after scrolling, footer bottom=${after.bottom} != viewport ${after.vh}`);
    }

    // Content must not be hidden BEHIND the fixed footer. Checked at the
    // FULLY SCROLLED position (or the only position, if the page never
    // scrolls) - at scroll 0 on a page taller than the viewport, almost all
    // of its content legitimately sits below the fold, which would make a
    // naive "any child bottom > footer top" check fail on every long page
    // for no real reason.
    //
    // Only NORMAL-FLOW children count. This site always mounts several
    // full-viewport `fixed inset-0` shells (LoadingScreen, AuthModal x2, the
    // booking modals) whose real state is opacity/visibility, not
    // display:none - each one's own bottom is trivially the viewport height,
    // which is not "content hidden behind the footer", it is an invisible
    // overlay that happens to reach the same pixel. The one element that is
    // actual scrolling content is the in-flow one.
    const overlap = await page.evaluate(() => {
      const f = document.querySelector('footer');
      const fTop = f.getBoundingClientRect().top;
      const kids = Array.from(document.body.children).filter((el) =>
        el.tagName !== 'FOOTER' && getComputedStyle(el).display !== 'none' && getComputedStyle(el).position !== 'fixed');
      let worst = 0;
      kids.forEach((el) => {
        const b = el.getBoundingClientRect().bottom;
        if (b > fTop) worst = Math.max(worst, b - fTop);
      });
      return worst;
    });
    ok(overlap <= 1, `${w}${path}: page content overlaps the fixed footer by ${overlap}px`);

    ok(errs.length === 0, `${w}${path}: page errors ${errs.join(' | ')}`);
  }

  await ctx.close();
}

// ---- PWA app mode: the fixed footer wins over the app bottom bar ----------
// Only one thing may stick to the bottom (CLAUDE.md) - on these three pages
// there is no bookbar/stickybar, so before this fix the app bottom bar was
// the only thing claiming the bottom edge in standalone mode. Now the footer
// does too, so it has to be the one that yields.
{
  const ctx = await b.newContext({ viewport: { width: 390, height: 900 } });
  // The plain assignment is not enough in this environment - measured:
  // document.documentElement can be unavailable at init-script time, and the
  // failure is SILENT (the attribute is just never set, no exception surfaces
  // to Node). Same fallback verify-pwa.mjs's own appMode() uses.
  await ctx.addInitScript(() => {
    function mark() { document.documentElement.dataset.standalone = '1'; }
    if (document.documentElement) mark();
    else document.addEventListener('readystatechange', mark, { once: true });
  });
  await ctx.route('**/api/**', (route) => route.fulfill({ json: {} }));
  const page = await ctx.newPage();
  for (const path of PAGES) {
    await page.goto(`http://127.0.0.1:4000${path}`, { waitUntil: 'networkidle' });
    await page.waitForTimeout(300);
    const navDisplay = await page.evaluate(() => {
      const el = document.querySelector('[data-appnav]');
      return el ? getComputedStyle(el).display : null;
    });
    ok(navDisplay === 'none', `standalone/390${path}: app bottom bar did not yield to the fixed footer (display=${navDisplay})`);
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
