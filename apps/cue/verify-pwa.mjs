import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { chromium } from '/home/user/CUE/node_modules/playwright-core/index.mjs';

const BASE = process.env.BASE || 'http://localhost:4000';
let pass = 0, fail = 0;
function ok(c, m) { c ? pass++ : (fail++, console.log('  FAIL:', m)); }

const FREE = ['/', '/bali-guide.html', '/charter.html'];
const DETAIL = '/ubud-tour.html';
const LISTING = '/tour.html';
const FOOTERBAR = ['/my-trips.html', '/our-company.html'];

function appMode(page) {
  return page.addInitScript(() => {
    function mark() { document.documentElement.dataset.standalone = '1'; }
    if (document.documentElement) mark();
    else document.addEventListener('readystatechange', mark, { once: true });
  });
}

function box(page, sel) {
  return page.evaluate((s) => {
    const element = document.querySelector(s);
    if (!element) return null;
    const cs = getComputedStyle(element);
    const r = element.getBoundingClientRect();
    return { display: cs.display, h: Math.round(r.height), bottom: Math.round(r.bottom) };
  }, sel);
}

function bottomBars(page) {
  return page.evaluate(() => [...document.querySelectorAll('[data-appnav], .stickybar, .footerbar')]
    .filter((element) => {
      const cs = getComputedStyle(element);
      const r = element.getBoundingClientRect();
      return cs.display !== 'none' && cs.visibility !== 'hidden' && r.height > 0
        && Math.abs(r.bottom - window.innerHeight) < 2;
    }).length);
}

{
  const root = 'out/_next/static';
  function walk(d) {
    return readdirSync(d).flatMap((f) => {
      const p = join(d, f);
      return statSync(p).isDirectory() ? walk(p) : [p];
    });
  }
  const css = walk(root).filter((p) => p.endsWith('.css')).map((p) => readFileSync(p, 'utf8')).join('\n');
  function esc(s) { return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); }
  const classes = [...new Set(css.match(/\.standalone\\:[^{\s,]+/g) || [])];

  ok(classes.length >= 3, `css: only ${classes.length} standalone utilities compiled - interpolated class names never reach Tailwind`);

  classes.forEach((classe) => {
    const re = new RegExp(`${esc(classe)}(?:[^{,]*)\\{([^}]*)\\}`, 'g');
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
    ok(!!mediaHit, `css ${classe}: no (display-mode: standalone) rule - installed Android/iOS 16.4+ would get nothing`);
    ok(!!attrHit, `css ${classe}: no html[data-standalone] rule - older iPhones would get nothing`);
    if (mediaHit && attrHit) {
      ok(mediaHit.decl === attrHit.decl, `css ${classe}: branches declare different things ("${mediaHit.decl}" vs "${attrHit.decl}")`);
      ok(mediaHit.scoped && attrHit.scoped, `css ${classe}: one branch is not width-scoped (media ${mediaHit.scoped}, attr ${attrHit.scoped})`);
    }
  });
}

const browser = await chromium.launch({ executablePath: process.env.PW_BIN || '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });

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
      const b = [...document.querySelectorAll('button[aria-label="Chat with us"]')].find((element) => !element.closest('[data-appnav]'));
      return b ? getComputedStyle(b).display : null;
    });
    ok(navChat && navChat !== 'none', `tab ${path}: navbar chat icon vanished in a browser tab`);
    const cart = await box(page, 'a[aria-label="My Trips"]');
    ok(cart && cart.display !== 'none', `tab ${path}: navbar cart icon vanished in a browser tab`);
    ok(errs.length === 0, `tab ${path}: page errors ${errs.join(' | ')}`);
    await page.close();
  }

  const page = await ctx.newPage();
  await page.goto(`${BASE}/`, { waitUntil: 'load' });
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
    const response = await fetch('/manifest.webmanifest');
    if (!response.ok) return { status: response.status };
    const j = await response.json();
    function by(p) { return (j.icons || []).filter((i) => i.purpose === p).map((i) => i.sizes).sort().join(','); }
    return { status: response.status, display: j.display, start: j.start_url, any: by('any'), maskable: by('maskable') };
  });
  ok(mf.status === 200, `manifest: HTTP ${mf.status}`);
  ok(mf.display === 'standalone', `manifest: display is "${mf.display}"`);
  ok(mf.start === '/', `manifest: start_url is "${mf.start}"`);
  ok(mf.any === '192x192,512x512', `manifest: "any" icons are ${mf.any}`);
  ok(mf.maskable === '192x192,512x512', `manifest: "maskable" icons are ${mf.maskable}`);

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

  const swSrc = readFileSync('out/sw.js', 'utf8');
  ok(/mode\s*!==?\s*['"]navigate['"]|mode === 'navigate'/.test(swSrc), 'sw: no navigation branch at all');
  const navBranch = swSrc.slice(swSrc.indexOf("'navigate'"), swSrc.indexOf("'navigate'") + 220);
  ok(navBranch.includes('fetch(req)') && navBranch.indexOf('fetch(req)') < navBranch.indexOf('caches.match'),
     'sw: HTML is read from cache before the network - a push would never reach installed guests');
  await page.close();
  await ctx.close();
}

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

    const navChat = await page.evaluate(() => {
      const b = [...document.querySelectorAll('button[aria-label="Chat with us"]')].find((element) => !element.closest('[data-appnav]'));
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
      const bar = await box(page, '.stickybar');
      const nav = await box(page, '[data-appnav]');
      ok(bar && bar.bottom === 844, `${w}${DETAIL}: BookBar did not come in on scroll (bottom ${bar && bar.bottom})`);
      ok(nav && nav.display === 'none', `${w}${DETAIL}: app bar did not yield to BookBar`);
    }
    if (path === LISTING && w < 768) {
      const nav = await box(page, '[data-appnav]');
      const sw = await box(page, '.stickybar');
      ok(sw && sw.display !== 'none', `${w}${LISTING}: SectionSwitcher never appeared after scrolling`);
      ok(nav && nav.display === 'none', `${w}${LISTING}: app bar did not yield to SectionSwitcher`);
    }
    if (FOOTERBAR.includes(path)) {
      const footer = await box(page, '.footerbar');
      const nav = await box(page, '[data-appnav]');
      ok(footer && footer.display !== 'none' && footer.bottom === 844, `${w}${path}: compact footer is not pinned to the bottom (bottom ${footer && footer.bottom})`);
      ok(nav && nav.display === 'none', `${w}${path}: app bar did not yield to the compact footer`);
    }
    await page.close();
  }
  await ctx.close();
}

{
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 } });
  const page = await ctx.newPage();
  await appMode(page);
  await page.goto(`${BASE}/`, { waitUntil: 'load' });
  await page.waitForTimeout(200);
  const nav = await box(page, '[data-appnav]');
  ok(nav && nav.display === 'none', '1280: app bar showing on desktop');
  const cart = await box(page, 'a[aria-label="My Trips"]');
  ok(cart && cart.display !== 'none', '1280: navbar cart hidden in desktop app mode');
  await page.close();
  await ctx.close();
}

{
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 } });
  const page = await ctx.newPage();
  await appMode(page);
  await page.route('**/api/chat/**', (r) => r.fulfill({ status: 500, contentType: 'application/json', body: '{}' }));
  await page.goto(`${BASE}/`, { waitUntil: 'load' });
  await page.waitForTimeout(250);
  let clicked = true;
  try {
    await page.click('[data-appnav] button[aria-label="Chat with us"]', { timeout: 8000 });
  } catch (e) {
    clicked = false;
  }
  ok(clicked, 'app bar: the chat button was not clickable');
  let opened = false;
  if (clicked) {
    try {
      await page.waitForSelector('text=Ask me about our tours', { timeout: 8000 });
      opened = true;
    } catch (e) {}
  }
  ok(opened, 'app bar: the chat button did not open the panel');
  await page.close();
  await ctx.close();
}

await browser.close();
console.log(`${pass}/${pass + fail}`);
