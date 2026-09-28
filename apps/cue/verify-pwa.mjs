import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { chromium } from '/home/user/CUE/node_modules/playwright-core/index.mjs';

const BASE = process.env.BASE || 'http://localhost:4000';
let pass = 0, fail = 0;
const ok = (c, m) => { c ? pass++ : (fail++, console.log('  FAIL:', m)); };

// Pages with no sticky bar of their own - the app bar belongs to them.
const FREE = ['/', '/bali-guide.html', '/charter.html'];
const DETAIL = '/ubud-tour.html';   // BookBar, shows below 993
const LISTING = '/tour.html';       // SectionSwitcher, shows below 768
// My Trips + Our Company (WO5+, Sep 2026, Wayan: "the footer needs to be
// sticky at the bottom") moved OUT of FREE and in here: the compact footer on
// those two pages is `.footerbar`, fixed at the bottom at every width, so the
// app bar now yields to it there exactly like it yields to BookBar/
// SectionSwitcher elsewhere. They used to be the two pages the app bar owned
// outright - now neither is.
const FOOTERBAR = ['/my-trips.html', '/our-company.html'];

// WHAT THIS HARNESS CANNOT DO, said plainly.
// App mode reaches the CSS down two paths: `@media (display-mode: standalone)`
// and `html[data-standalone]`. Only the SECOND can be exercised here - measured,
// not assumed: this Chromium accepts `Emulation.setEmulatedMedia` for
// prefers-color-scheme (returns true) and ignores it for display-mode (returns
// false at every width), and a headless `--app` window exposes no page to drive.
// Pretending otherwise is how a suite reports green over a branch it never ran,
// which is the trap verify-zoom hit with maxTouchPoints.
//   So the behaviour below runs through the attribute, and the media branch is
// covered by proving in the BUILT CSS that it declares the same thing for the
// same classes at the same widths. If someone drops a slot from the custom
// variant, that check fires.
const appMode = (page) => page.addInitScript(() => {
  const mark = () => { document.documentElement.dataset.standalone = '1'; };
  if (document.documentElement) mark();
  else document.addEventListener('readystatechange', mark, { once: true });
});

const box = (page, sel) => page.evaluate((s) => {
  const el = document.querySelector(s);
  if (!el) return null;
  const cs = getComputedStyle(el);
  const r = el.getBoundingClientRect();
  return { display: cs.display, h: Math.round(r.height), bottom: Math.round(r.bottom) };
}, sel);

// Exactly one thing stuck to the bottom of the screen. Two is the collision
// Wayan decided against; zero is what the first cut of this shipped at 768-992
// on a listing page, where the app bar yielded to a bar that was not displayed.
const bottomBars = (page) => page.evaluate(() => [...document.querySelectorAll('[data-appnav], .stickybar, .footerbar')]
  .filter((el) => {
    const cs = getComputedStyle(el);
    const r = el.getBoundingClientRect();
    return cs.display !== 'none' && cs.visibility !== 'hidden' && r.height > 0
      && Math.abs(r.bottom - window.innerHeight) < 2;
  }).length);

// ---- 1. the two CSS branches must agree ----
{
  const root = 'out/_next/static';
  const walk = (d) => readdirSync(d).flatMap((f) => {
    const p = join(d, f);
    return statSync(p).isDirectory() ? walk(p) : [p];
  });
  const css = walk(root).filter((p) => p.endsWith('.css')).map((p) => readFileSync(p, 'utf8')).join('\n');
  const esc = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const classes = [...new Set(css.match(/\.standalone\\:[^{\s,]+/g) || [])];

  ok(classes.length >= 3, `css: only ${classes.length} standalone utilities compiled - interpolated class names never reach Tailwind`);

  for (const c of classes) {
    const re = new RegExp(`${esc(c)}(?:[^{,]*)\\{([^}]*)\\}`, 'g');
    let m;
    const branches = { media: [], attr: [] };
    while ((m = re.exec(css)) !== null) {
      const before = css.slice(Math.max(0, m.index - 260), m.index);
      const isAttr = /html\[data-standalone\]\s$/.test(before);
      const scoped = before.includes('min-width:993px');
      (isAttr ? branches.attr : branches.media).push({ decl: m[1], scoped, before });
    }
    const mediaHit = branches.media.find((b) => b.before.includes('display-mode:standalone'));
    const attrHit = branches.attr[0];
    ok(!!mediaHit, `css ${c}: no (display-mode: standalone) rule - installed Android/iOS 16.4+ would get nothing`);
    ok(!!attrHit, `css ${c}: no html[data-standalone] rule - older iPhones would get nothing`);
    if (mediaHit && attrHit) {
      ok(mediaHit.decl === attrHit.decl, `css ${c}: branches declare different things ("${mediaHit.decl}" vs "${attrHit.decl}")`);
      ok(mediaHit.scoped && attrHit.scoped, `css ${c}: one branch is not width-scoped (media ${mediaHit.scoped}, attr ${attrHit.scoped})`);
    }
  }
}

const browser = await chromium.launch({ executablePath: process.env.PW_BIN || '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });

// ---- 2. a browser tab: nothing may change ----
{
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 } });
  for (const path of [...FREE, DETAIL, LISTING, ...FOOTERBAR]) {
    const page = await ctx.newPage();
    const errs = [];
    page.on('pageerror', (e) => errs.push(e.message));
    await page.goto(BASE + path, { waitUntil: 'load' });
    const nav = await box(page, '[data-appnav]');
    ok(nav && nav.display === 'none', `tab ${path}: app bar is showing in a browser tab`);
    const navChat = await page.evaluate(() => {
      const b = [...document.querySelectorAll('button[aria-label="Chat with us"]')].find((el) => !el.closest('[data-appnav]'));
      return b ? getComputedStyle(b).display : null;
    });
    ok(navChat && navChat !== 'none', `tab ${path}: navbar chat icon vanished in a browser tab`);
    const cart = await box(page, 'a[aria-label="My Trips"]');
    ok(cart && cart.display !== 'none', `tab ${path}: navbar cart icon vanished in a browser tab`);
    ok(errs.length === 0, `tab ${path}: page errors ${errs.join(' | ')}`);
    await page.close();
  }

  const page = await ctx.newPage();
  await page.goto(BASE + '/', { waitUntil: 'load' });
  const head = await page.evaluate(() => ({
    manifest: document.querySelector('link[rel=manifest]')?.getAttribute('href') || '',
    theme: document.querySelector('meta[name=theme-color]')?.content || '',
    apple: document.querySelector('meta[name=apple-mobile-web-app-capable]')?.content || '',
    std: document.querySelector('meta[name=mobile-web-app-capable]')?.content || '',
    title: document.querySelector('meta[name=apple-mobile-web-app-title]')?.content || '',
  }));
  ok(head.manifest === '/manifest.webmanifest', `head: manifest link is "${head.manifest}"`);
  ok(head.theme !== '', 'head: no theme-color');
  ok(head.apple === 'yes' && head.std === 'yes', 'head: web-app-capable meta missing');
  ok(head.title === 'Cahyana', `head: apple app title is "${head.title}"`);

  const mf = await page.evaluate(async () => {
    const r = await fetch('/manifest.webmanifest');
    if (!r.ok) return { status: r.status };
    const j = await r.json();
    const by = (p) => (j.icons || []).filter((i) => i.purpose === p).map((i) => i.sizes).sort().join(',');
    return { status: r.status, display: j.display, start: j.start_url, any: by('any'), maskable: by('maskable') };
  });
  ok(mf.status === 200, `manifest: HTTP ${mf.status}`);
  ok(mf.display === 'standalone', `manifest: display is "${mf.display}"`);
  ok(mf.start === '/', `manifest: start_url is "${mf.start}"`);
  // Chrome will not offer the install prompt without both sizes.
  ok(mf.any === '192x192,512x512', `manifest: "any" icons are ${mf.any}`);
  ok(mf.maskable === '192x192,512x512', `manifest: "maskable" icons are ${mf.maskable}`);

  // localhost is a secure context, so this is the real worker, not a mock.
  const sw = await page.evaluate(async () => {
    for (let i = 0; i < 40; i += 1) {
      const r = await navigator.serviceWorker.getRegistration();
      if (r) return { ok: true, scope: r.scope };
      await new Promise((f) => setTimeout(f, 150));
    }
    return { ok: false };
  });
  ok(sw.ok, 'service worker never registered');
  ok(!sw.ok || sw.scope.endsWith('/'), `service worker scope is ${sw.scope}`);

  // The one rule the worker exists to honour: a page is never answered from cache.
  const swSrc = readFileSync('out/sw.js', 'utf8');
  ok(/mode\s*!==?\s*['"]navigate['"]|mode === 'navigate'/.test(swSrc), 'sw: no navigation branch at all');
  const navBranch = swSrc.slice(swSrc.indexOf("'navigate'"), swSrc.indexOf("'navigate'") + 220);
  ok(navBranch.includes('fetch(req)') && navBranch.indexOf('fetch(req)') < navBranch.indexOf('caches.match'),
     'sw: HTML is read from cache before the network - a push would never reach installed guests');
  await page.close();
  await ctx.close();
}

// ---- 3. app mode ----
for (const w of [390, 768]) {
  const ctx = await browser.newContext({ viewport: { width: w, height: 844 } });

  for (const path of FREE) {
    const page = await ctx.newPage();
    const errs = [];
    page.on('pageerror', (e) => errs.push(e.message));
    await appMode(page);
    await page.goto(BASE + path, { waitUntil: 'load' });
    await page.waitForTimeout(200);

    const nav = await box(page, '[data-appnav]');
    ok(nav && nav.display !== 'none', `${w}${path}: app bar is not showing in app mode`);
    if (nav && nav.display !== 'none') {
      ok(nav.bottom === 844, `${w}${path}: app bar bottom ${nav.bottom}, expected flush at 844`);
      const pad = await page.evaluate(() => parseFloat(getComputedStyle(document.body).paddingBottom));
      ok(pad >= nav.h, `${w}${path}: body reserves ${pad}px for a ${nav.h}px bar`);
      ok(pad - nav.h <= 14, `${w}${path}: ${Math.round(pad - nav.h)}px of reserved space is wasted under a ${nav.h}px bar`);
      const cells = await page.$$eval('[data-appnav] > *', (els) => els.length);
      ok(cells === 4, `${w}${path}: app bar has ${cells} items, expected 4`);
    }

    // The hand-over: what moved down has to be gone from the top.
    const navChat = await page.evaluate(() => {
      const b = [...document.querySelectorAll('button[aria-label="Chat with us"]')].find((el) => !el.closest('[data-appnav]'));
      return b ? getComputedStyle(b).display : null;
    });
    ok(navChat === 'none', `${w}${path}: navbar chat icon still visible in app mode (${navChat})`);
    const cart = await box(page, 'a[aria-label="My Trips"]');
    ok(cart && cart.display === 'none', `${w}${path}: navbar cart icon still visible in app mode`);

    const over = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
    ok(over <= 0, `${w}${path}: page overflows by ${over}px`);
    ok(errs.length === 0, `${w}${path}: page errors ${errs.join(' | ')}`);
    await page.close();
  }

  // A detail page sells, so BookBar wins there - but BookBar starts TRANSLATED
  // OUT and slides in once the guest is past the booking card, and SectionSwitcher
  // is not even mounted until the listing hero leaves the screen. Measured, not
  // assumed: at the top of /ubud-tour.html the bar reads translate "0px 150%",
  // and /tour.html has no .stickybar in the DOM at all.
  //   So the invariant is NEVER TWO, checked at the top AND after scrolling, plus
  // the specific hand-over each page owes.
  for (const path of [...FREE, DETAIL, LISTING, ...FOOTERBAR]) {
    const page = await ctx.newPage();
    await appMode(page);
    await page.goto(BASE + path, { waitUntil: 'load' });
    await page.waitForTimeout(200);
    ok(await bottomBars(page) <= 1, `${w}${path}: two bars stuck to the bottom at the top of the page`);
    await page.evaluate(() => window.scrollTo({ top: 1600, behavior: 'instant' }));
    await page.waitForTimeout(600);
    const after = await bottomBars(page);
    ok(after <= 1, `${w}${path}: ${after} bars stuck to the bottom after scrolling`);

    if (FREE.includes(path)) {
      ok(after === 1, `${w}${path}: the app bar disappeared on a page that has no bar of its own`);
    }
    if (path === DETAIL) {
      // The page the money is on: its own bar, and only its own bar.
      const bar = await box(page, '.stickybar');
      const nav = await box(page, '[data-appnav]');
      ok(bar && bar.bottom === 844, `${w}${DETAIL}: BookBar did not come in on scroll (bottom ${bar && bar.bottom})`);
      ok(nav && nav.display === 'none', `${w}${DETAIL}: app bar did not yield to BookBar`);
    }
    if (path === LISTING && w < 768) {
      // The switcher only exists once the hero is gone - that is when the app
      // bar has to step aside, and not a moment before.
      const nav = await box(page, '[data-appnav]');
      const sw = await box(page, '.stickybar');
      ok(sw && sw.display !== 'none', `${w}${LISTING}: SectionSwitcher never appeared after scrolling`);
      ok(nav && nav.display === 'none', `${w}${LISTING}: app bar did not yield to SectionSwitcher`);
    }
    if (FOOTERBAR.includes(path)) {
      // Unlike BookBar/SectionSwitcher, the compact footer runs at EVERY
      // width and is on screen from the first paint, not just after
      // scrolling - so this checks it before AND after scroll, both times.
      const footer = await box(page, '.footerbar');
      const nav = await box(page, '[data-appnav]');
      ok(footer && footer.display !== 'none' && footer.bottom === 844, `${w}${path}: compact footer is not pinned to the bottom (bottom ${footer && footer.bottom})`);
      ok(nav && nav.display === 'none', `${w}${path}: app bar did not yield to the compact footer`);
    }
    await page.close();
  }
  await ctx.close();
}

// ---- 4. desktop app mode is deliberately untouched ----
{
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 } });
  const page = await ctx.newPage();
  await appMode(page);
  await page.goto(BASE + '/', { waitUntil: 'load' });
  await page.waitForTimeout(200);
  const nav = await box(page, '[data-appnav]');
  ok(nav && nav.display === 'none', '1280: app bar showing on desktop');
  const cart = await box(page, 'a[aria-label="My Trips"]');
  ok(cart && cart.display !== 'none', '1280: navbar cart hidden in desktop app mode');
  await page.close();
  await ctx.close();
}

// ---- 5. the bar's chat button opens the real panel ----
{
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 } });
  const page = await ctx.newPage();
  await appMode(page);
  await page.route('**/api/chat/**', (r) => r.fulfill({ status: 500, contentType: 'application/json', body: '{}' }));
  await page.goto(BASE + '/', { waitUntil: 'load' });
  await page.waitForTimeout(250);
  // Never throw: a thrown click ends the run and hides every later assertion.
  const clicked = await page.click('[data-appnav] button[aria-label="Chat with us"]', { timeout: 8000 })
    .then(() => true).catch(() => false);
  ok(clicked, 'app bar: the chat button was not clickable');
  const opened = clicked
    && await page.waitForSelector('text=Ask me about our tours', { timeout: 8000 }).then(() => true).catch(() => false);
  ok(opened, 'app bar: the chat button did not open the panel');
  await page.close();
  await ctx.close();
}

await browser.close();
console.log(`${pass}/${pass + fail}`);
