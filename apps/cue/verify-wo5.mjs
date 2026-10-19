import { chromium } from '/home/user/CUE/node_modules/playwright-core/index.mjs';
const browser = await chromium.launch({
  executablePath: '/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell',
});

let pass = 0,
  fail = 0;
function recordCheck(isPassing, message) {
  isPassing ? pass++ : (fail++, console.log('  FAIL:', message));
}

const COMPACT_PAGES = ['/settings.html', '/my-trips.html', '/our-company.html'];
const FULL_PAGES = ['/tour.html', '/activities.html', '/charter.html'];

for (const width of [390, 1280]) {
  const browserContext = await browser.newContext({ viewport: { width: width, height: 1000 } });
  await browserContext.route('**/api/**', (route) => {
    const url = route.request().url();
    if (url.includes('/account/session')) return route.fulfill({ json: { status: 'error' } });
    return route.fulfill({ json: {} });
  });
  const page = await browserContext.newPage();
  const errs = [];
  page.on('pageerror', (error) => errs.push(String(error)));

  for (const path of COMPACT_PAGES) {
    await page.goto(`http://127.0.0.1:4000${path}`, { waitUntil: 'networkidle' });
    await page.waitForTimeout(300);
    const footer = page.locator('footer');
    recordCheck(
      (await footer.count()) === 1,
      `${width}${path}: expected exactly 1 footer, got ${await footer.count()}`,
    );
    const text = await footer.innerText();
    recordCheck(/Cahyana Ubud Experience/i.test(text), `${width}${path}: brand name missing from footer`);
    recordCheck(!/We Accept/i.test(text), `${width}${path}: full footer's "We Accept" column still showing`);
    recordCheck(!/Featured On/i.test(text), `${width}${path}: full footer's "Featured On" column still showing`);
    recordCheck(!/Explore/i.test(text), `${width}${path}: full footer's "Explore" column heading still showing`);
    const footerHeight = await footer.evaluate((element) => element.getBoundingClientRect().height);
    recordCheck(
      footerHeight < 140,
      `${width}${path}: compact footer measured ${footerHeight}px tall, expected under 140`,
    );
    if (width <= 560) {
      const navH = await page.evaluate(() => document.querySelector('header').getBoundingClientRect().height);
      recordCheck(
        footerHeight <= navH + 1,
        `${width}${path}: compact footer (${footerHeight}px) is taller than the navbar (${navH}px)`,
      );
    }
    recordCheck(errs.length === 0, `${width}${path}: page errors ${errs.join(' | ')}`);
  }

  for (const path of FULL_PAGES) {
    await page.goto(`http://127.0.0.1:4000${path}`, { waitUntil: 'networkidle' });
    await page.waitForTimeout(300);
    const text = await page.locator('footer').innerText();
    recordCheck(/We Accept/i.test(text), `${width}${path}: full footer lost its "We Accept" column`);
    recordCheck(/Featured On/i.test(text), `${width}${path}: full footer lost its "Featured On" column`);
  }

  await page.goto('http://127.0.0.1:4000/my-trips.html', { waitUntil: 'networkidle' });
  await page.waitForTimeout(300);
  const h1Count = await page.locator('h1').count();
  recordCheck(h1Count === 0, `${width}/my-trips: expected the big h1 gone, found ${h1Count}`);
  const smallLabelCount = await page.locator('p', { hasText: 'My trips' }).count();
  recordCheck(smallLabelCount >= 1, `${width}/my-trips: the small rail label is gone too - nothing names the page`);

  await browserContext.close();
}

for (const path of ['/my-trips.html', '/our-company.html']) {
  const browserContext = await browser.newContext({ viewport: { width: 1280, height: 900 } });
  await browserContext.route('**/api/**', (route) => route.fulfill({ json: {} }));
  const page = await browserContext.newPage();
  await page.goto(`http://127.0.0.1:4000${path}`, { waitUntil: 'networkidle' });
  await page.waitForTimeout(400);
  const headerH = await page.evaluate(
    () => parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--header-h')) || null,
  );
  await page.evaluate(() => window.scrollTo(0, 900));
  await page.waitForTimeout(400);
  const stickTop = await page.evaluate(() => {
    const aside = document.querySelector('aside');
    const menu = aside && aside.firstElementChild;
    return menu ? menu.getBoundingClientRect().top : null;
  });
  recordCheck(stickTop !== null, `1280${path}: sticky rail menu not found`);
  recordCheck(
    headerH !== null && stickTop !== null && Math.abs(stickTop - headerH) < 2,
    `1280${path}: rail menu top=${stickTop}, expected to pin at --header-h=${headerH}`,
  );
  await browserContext.close();
}

await browser.close();
console.log(`${pass}/${pass + fail}`);
process.exit(fail ? 1 : 0);
