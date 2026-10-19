import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { chromium } from '/home/user/CUE/node_modules/playwright-core/index.mjs';

const BASE = process.env.BASE || 'http://localhost:4000';
let pass = 0,
  fail = 0;
function checkAssertion(isPassing, message) {
  isPassing ? pass++ : (fail++, console.log('  FAIL:', message));
}

const FREE = ['/', '/bali-guide.html', '/charter.html'];
const DETAIL = '/ubud-tour.html';
const LISTING = '/tour.html';
const FOOTERBAR = ['/my-trips.html', '/our-company.html'];

function enableAppMode(page) {
  return page.addInitScript(() => {
    function mark() {
      document.documentElement.dataset.standalone = '1';
    }
    if (document.documentElement) mark();
    else document.addEventListener('readystatechange', mark, { once: true });
  });
}

function measureBox(page, selector) {
  return page.evaluate((selectorItem) => {
    const element = document.querySelector(selectorItem);
    if (!element) return null;
    const cs = getComputedStyle(element);
    const boxItem = element.getBoundingClientRect();
    return { display: cs.display, h: Math.round(boxItem.height), bottom: Math.round(boxItem.bottom) };
  }, selector);
}

function findBottomBars(page) {
  return page.evaluate(
    () =>
      [...document.querySelectorAll('[data-appnav], .stickybar, .footerbar')].filter((element) => {
        const cs = getComputedStyle(element);
        const boundingBox = element.getBoundingClientRect();
        return (
          cs.display !== 'none' &&
          cs.visibility !== 'hidden' &&
          boundingBox.height > 0 &&
          Math.abs(boundingBox.bottom - window.innerHeight) < 2
        );
      }).length,
  );
}

{
  const root = 'out/_next/static';
  function walk(directory) {
    return readdirSync(directory).flatMap((entryName) => {
      const entryPath = join(directory, entryName);
      return statSync(entryPath).isDirectory() ? walk(entryPath) : [entryPath];
    });
  }
  const css = walk(root)
    .filter((filePath) => filePath.endsWith('.css'))
    .map((filePath) => readFileSync(filePath, 'utf8'))
    .join('\n');
  function escapeRegex(text) {
    return text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }
  const classes = [...new Set(css.match(/\.standalone\\:[^{\s,]+/g) || [])];

  checkAssertion(
    classes.length >= 3,
    `css: only ${classes.length} standalone utilities compiled - interpolated class names never reach Tailwind`,
  );

  classes.forEach((classe) => {
    const pattern = new RegExp(`${escapeRegex(classe)}(?:[^{,]*)\\{([^}]*)\\}`, 'g');
    let match;
    const branches = { media: [], attr: [] };
    while ((match = pattern.exec(css)) !== null) {
      const before = css.slice(Math.max(0, match.index - 260), match.index);
      const isAttr = /html\[data-standalone\]\s$/.test(before);
      const isScoped = before.includes('min-width:993px');
      (isAttr ? branches.attr : branches.media).push({ decl: match[1], scoped: isScoped, before });
    }
    const mediaHit = branches.media.find((branch) => branch.before.includes('display-mode:standalone'));
    const attrHit = branches.attr[0];
    checkAssertion(
      !!mediaHit,
      `css ${classe}: no (display-mode: standalone) rule - installed Android/iOS 16.4+ would get nothing`,
    );
    checkAssertion(!!attrHit, `css ${classe}: no html[data-standalone] rule - older iPhones would get nothing`);
    if (!(mediaHit && attrHit)) return;
    checkAssertion(
      mediaHit.decl === attrHit.decl,
      `css ${classe}: branches declare different things ("${mediaHit.decl}" vs "${attrHit.decl}")`,
    );
    checkAssertion(
      mediaHit.scoped && attrHit.scoped,
      `css ${classe}: one branch is not width-scoped (media ${mediaHit.scoped}, attr ${attrHit.scoped})`,
    );
  });
}

const browser = await chromium.launch({
  executablePath: process.env.PW_BIN || '/opt/pw-browsers/chromium-1194/chrome-linux/chrome',
});

{
  const browserContext = await browser.newContext({ viewport: { width: 390, height: 844 } });
  for (const path of [...FREE, DETAIL, LISTING, ...FOOTERBAR]) {
    const page = await browserContext.newPage();
    const errs = [];
    page.on('pageerror', (error) => errs.push(error.message));
    await page.goto(BASE + path, { waitUntil: 'load' });
    const nav = await measureBox(page, '[data-appnav]');
    checkAssertion(nav && nav.display === 'none', `tab ${path}: app bar is showing in a browser tab`);
    const navChat = await page.evaluate(() => {
      const chatButton = [...document.querySelectorAll('button[aria-label="Chat with us"]')].find(
        (element) => !element.closest('[data-appnav]'),
      );
      return chatButton ? getComputedStyle(chatButton).display : null;
    });
    checkAssertion(navChat && navChat !== 'none', `tab ${path}: navbar chat icon vanished in a browser tab`);
    const cart = await measureBox(page, 'a[aria-label="My Trips"]');
    checkAssertion(cart && cart.display !== 'none', `tab ${path}: navbar cart icon vanished in a browser tab`);
    checkAssertion(errs.length === 0, `tab ${path}: page errors ${errs.join(' | ')}`);
    await page.close();
  }

  const page = await browserContext.newPage();
  await page.goto(`${BASE}/`, { waitUntil: 'load' });
  const head = await page.evaluate(() => ({
    manifest: document.querySelector('link[rel=manifest]')?.getAttribute('href') || '',
    theme: document.querySelector('meta[name=theme-color]')?.content || '',
    apple: document.querySelector('meta[name=apple-mobile-web-app-capable]')?.content || '',
    std: document.querySelector('meta[name=mobile-web-app-capable]')?.content || '',
    title: document.querySelector('meta[name=apple-mobile-web-app-title]')?.content || '',
  }));
  checkAssertion(head.manifest === '/manifest.webmanifest', `head: manifest link is "${head.manifest}"`);
  checkAssertion(head.theme !== '', 'head: no theme-color');
  checkAssertion(head.apple === 'yes' && head.std === 'yes', 'head: web-app-capable meta missing');
  checkAssertion(head.title === 'Cahyana', `head: apple app title is "${head.title}"`);

  const mf = await page.evaluate(async () => {
    const response = await fetch('/manifest.webmanifest');
    if (!response.ok) return { status: response.status };
    const manifest = await response.json();
    function listIconSizesByPurpose(purpose) {
      return (manifest.icons || [])
        .filter((icon) => icon.purpose === purpose)
        .map((icon) => icon.sizes)
        .sort()
        .join(',');
    }
    return {
      status: response.status,
      display: manifest.display,
      start: manifest.start_url,
      any: listIconSizesByPurpose('any'),
      maskable: listIconSizesByPurpose('maskable'),
    };
  });
  checkAssertion(mf.status === 200, `manifest: HTTP ${mf.status}`);
  checkAssertion(mf.display === 'standalone', `manifest: display is "${mf.display}"`);
  checkAssertion(mf.start === '/', `manifest: start_url is "${mf.start}"`);
  checkAssertion(mf.any === '192x192,512x512', `manifest: "any" icons are ${mf.any}`);
  checkAssertion(mf.maskable === '192x192,512x512', `manifest: "maskable" icons are ${mf.maskable}`);

  const sw = await page.evaluate(async () => {
    for (let attempt = 0; attempt < 40; attempt += 1) {
      const registration = await navigator.serviceWorker.getRegistration();
      if (registration) return { ok: true, scope: registration.scope };
      await new Promise((resolve) => setTimeout(resolve, 150));
    }
    return { ok: false };
  });
  checkAssertion(sw.ok, 'service worker never registered');
  checkAssertion(!sw.ok || sw.scope.endsWith('/'), `service worker scope is ${sw.scope}`);

  const swSrc = readFileSync('out/sw.js', 'utf8');
  checkAssertion(/mode\s*!==?\s*['"]navigate['"]|mode === 'navigate'/.test(swSrc), 'sw: no navigation branch at all');
  const navBranch = swSrc.slice(swSrc.indexOf("'navigate'"), swSrc.indexOf("'navigate'") + 220);
  checkAssertion(
    navBranch.includes('fetch(req)') && navBranch.indexOf('fetch(req)') < navBranch.indexOf('caches.match'),
    'sw: HTML is read from cache before the network - a push would never reach installed guests',
  );
  await page.close();
  await browserContext.close();
}

for (const width of [390, 768]) {
  const browserContext = await browser.newContext({ viewport: { width: width, height: 844 } });

  for (const path of FREE) {
    const page = await browserContext.newPage();
    const errs = [];
    page.on('pageerror', (error) => errs.push(error.message));
    await enableAppMode(page);
    await page.goto(BASE + path, { waitUntil: 'load' });
    await page.waitForTimeout(200);

    const nav = await measureBox(page, '[data-appnav]');
    checkAssertion(nav && nav.display !== 'none', `${width}${path}: app bar is not showing in app mode`);
    if (nav && nav.display !== 'none') {
      checkAssertion(nav.bottom === 844, `${width}${path}: app bar bottom ${nav.bottom}, expected flush at 844`);
      const pad = await page.evaluate(() => parseFloat(getComputedStyle(document.body).paddingBottom));
      checkAssertion(pad >= nav.h, `${width}${path}: body reserves ${pad}px for a ${nav.h}px bar`);
      checkAssertion(
        pad - nav.h <= 14,
        `${width}${path}: ${Math.round(pad - nav.h)}px of reserved space is wasted under a ${nav.h}px bar`,
      );
      const cells = await page.$$eval('[data-appnav] > *', (elements) => elements.length);
      checkAssertion(cells === 4, `${width}${path}: app bar has ${cells} items, expected 4`);
    }

    const navChat = await page.evaluate(() => {
      const chatButton = [...document.querySelectorAll('button[aria-label="Chat with us"]')].find(
        (element) => !element.closest('[data-appnav]'),
      );
      return chatButton ? getComputedStyle(chatButton).display : null;
    });
    checkAssertion(navChat === 'none', `${width}${path}: navbar chat icon still visible in app mode (${navChat})`);
    const cart = await measureBox(page, 'a[aria-label="My Trips"]');
    checkAssertion(cart && cart.display === 'none', `${width}${path}: navbar cart icon still visible in app mode`);

    const over = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
    checkAssertion(over <= 0, `${width}${path}: page overflows by ${over}px`);
    checkAssertion(errs.length === 0, `${width}${path}: page errors ${errs.join(' | ')}`);
    await page.close();
  }

  for (const path of [...FREE, DETAIL, LISTING, ...FOOTERBAR]) {
    const page = await browserContext.newPage();
    await enableAppMode(page);
    await page.goto(BASE + path, { waitUntil: 'load' });
    await page.waitForTimeout(200);
    checkAssertion(
      (await findBottomBars(page)) <= 1,
      `${width}${path}: two bars stuck to the bottom at the top of the page`,
    );
    await page.evaluate(() => window.scrollTo({ top: 1600, behavior: 'instant' }));
    await page.waitForTimeout(600);
    const after = await findBottomBars(page);
    checkAssertion(after <= 1, `${width}${path}: ${after} bars stuck to the bottom after scrolling`);

    if (FREE.includes(path)) {
      checkAssertion(after === 1, `${width}${path}: the app bar disappeared on a page that has no bar of its own`);
    }
    if (path === DETAIL) {
      const bar = await measureBox(page, '.stickybar');
      const nav = await measureBox(page, '[data-appnav]');
      checkAssertion(
        bar && bar.bottom === 844,
        `${width}${DETAIL}: BookBar did not come in on scroll (bottom ${bar && bar.bottom})`,
      );
      checkAssertion(nav && nav.display === 'none', `${width}${DETAIL}: app bar did not yield to BookBar`);
    }
    if (path === LISTING && width < 768) {
      const nav = await measureBox(page, '[data-appnav]');
      const sw = await measureBox(page, '.stickybar');
      checkAssertion(sw && sw.display !== 'none', `${width}${LISTING}: SectionSwitcher never appeared after scrolling`);
      checkAssertion(nav && nav.display === 'none', `${width}${LISTING}: app bar did not yield to SectionSwitcher`);
    }
    if (FOOTERBAR.includes(path)) {
      const footer = await measureBox(page, '.footerbar');
      const nav = await measureBox(page, '[data-appnav]');
      checkAssertion(
        footer && footer.display !== 'none' && footer.bottom === 844,
        `${width}${path}: compact footer is not pinned to the bottom (bottom ${footer && footer.bottom})`,
      );
      checkAssertion(nav && nav.display === 'none', `${width}${path}: app bar did not yield to the compact footer`);
    }
    await page.close();
  }
  await browserContext.close();
}

{
  const browserContext = await browser.newContext({ viewport: { width: 1280, height: 900 } });
  const page = await browserContext.newPage();
  await enableAppMode(page);
  await page.goto(`${BASE}/`, { waitUntil: 'load' });
  await page.waitForTimeout(200);
  const nav = await measureBox(page, '[data-appnav]');
  checkAssertion(nav && nav.display === 'none', '1280: app bar showing on desktop');
  const cart = await measureBox(page, 'a[aria-label="My Trips"]');
  checkAssertion(cart && cart.display !== 'none', '1280: navbar cart hidden in desktop app mode');
  await page.close();
  await browserContext.close();
}

{
  const browserContext = await browser.newContext({ viewport: { width: 390, height: 844 } });
  const page = await browserContext.newPage();
  await enableAppMode(page);
  await page.route('**/api/chat/**', (route) =>
    route.fulfill({ status: 500, contentType: 'application/json', body: '{}' }),
  );
  await page.goto(`${BASE}/`, { waitUntil: 'load' });
  await page.waitForTimeout(250);
  let clicked = true;
  try {
    await page.click('[data-appnav] button[aria-label="Chat with us"]', { timeout: 8000 });
  } catch (e) {
    clicked = false;
  }
  checkAssertion(clicked, 'app bar: the chat button was not clickable');
  let opened = false;
  if (clicked) {
    try {
      await page.waitForSelector('text=Ask me about our tours', { timeout: 8000 });
      opened = true;
    } catch (e) {}
  }
  checkAssertion(opened, 'app bar: the chat button did not open the panel');
  await page.close();
  await browserContext.close();
}

await browser.close();
console.log(`${pass}/${pass + fail}`);
