import { chromium } from '/home/user/CUE/node_modules/playwright-core/index.mjs';

const BASE = process.env.BASE || 'http://127.0.0.1:4010';
let pass = 0,
  fail = 0;
function recordCheck(isPassing, message) {
  isPassing ? pass++ : (fail++, console.log('  FAIL:', message));
}

const browser = await chromium.launch({
  executablePath: process.env.PW_BIN || '/opt/pw-browsers/chromium-1194/chrome-linux/chrome',
});

const REVIEWS = [
  {
    name: 'Anna',
    service: 'Charter',
    rating: 5,
    message: 'Went wherever we asked all day.',
    country: 'AU',
    created_at: '2026-09-18',
  },
];

const PAGES = [
  { url: '/charter.html', expect: 'service=Charter', label: 'charter' },
  { url: '/airport-transfer.html', expect: 'service=Airport', label: 'airport' },
  { url: '/transfer.html', expect: 'group=transfers', label: 'transfer' },
];

for (const width of [390, 1280]) {
  for (const pageEntry of PAGES) {
    const browserContext = await browser.newContext({ viewport: { width: width, height: 900 } });
    const page = await browserContext.newPage();
    const asked = [];
    const errs = [];
    page.on('pageerror', (error) => errs.push(String(error)));
    await page.route('**/api/**', async (route) => {
      const requestUrl = route.request().url();
      if (/\/reviews(\?|$)/.test(requestUrl)) {
        asked.push(requestUrl);
        return route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(REVIEWS) });
      }
      return route.fulfill({ status: 200, contentType: 'application/json', body: '{}' });
    });
    await page.goto(BASE + pageEntry.url, { waitUntil: 'networkidle' });
    await page.waitForTimeout(500);

    const tag = `${pageEntry.label}@${width}`;
    recordCheck(asked.length > 0, `${tag}: the page never asked for reviews`);
    recordCheck(
      asked.some((requestUrl) => decodeURIComponent(requestUrl).includes(pageEntry.expect)),
      `${tag}: asked ${asked.map((requestUrl) => decodeURIComponent(requestUrl).split('/reviews')[1]).join(' , ')} - expected ${pageEntry.expect}`,
    );
    recordCheck(asked.length === 1, `${tag}: asked for reviews ${asked.length} times`);

    const txt = await page.locator('body').innerText();
    recordCheck(/What guests say/i.test(txt), `${tag}: no reviews heading`);
    recordCheck(/Went wherever we asked all day/.test(txt), `${tag}: the review itself did not render`);
    const bands = await page.locator('.review-cta').count();
    recordCheck(bands === 1, `${tag}: ${bands} "Write review" bands (want exactly 1)`);
    recordCheck(errs.length === 0, `${tag}: page errors ${errs.join(' | ')}`);
    const over = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
    recordCheck(over <= 0, `${tag}: page overflows by ${over}px`);
    await browserContext.close();
  }
}

{
  const browserContext = await browser.newContext({ viewport: { width: 1280, height: 900 } });
  const page = await browserContext.newPage();
  await page.route('**/api/**', (route) => route.fulfill({ status: 200, contentType: 'application/json', body: '[]' }));
  await page.goto(`${BASE}/ubud-tour.html`, { waitUntil: 'networkidle' });
  const bands = await page.locator('.review-cta').count();
  recordCheck(bands === 1, `tour page now has ${bands} review bands`);
  await browserContext.close();
}

const TRIPS = {
  upcoming: [],
  history: [{ ref: 'CUE-001', name: 'Ubud Tour', start_date: '2026-01-02', review_items: ['Ubud Tour'] }],
};
async function openMyTripsPage({ url, trips }) {
  const browserContext = await browser.newContext({ viewport: { width: 1280, height: 900 } });
  const page = await browserContext.newPage();
  const errs = [];
  page.on('pageerror', (error) => errs.push(String(error)));
  await page.addInitScript(() => {
    try {
      localStorage.setItem('cue_token', 'tok-test');
    } catch (e) {}
  });
  await page.route('**/api/**', async (route) => {
    const requestUrl = route.request().url();
    if (/\/account\/session/.test(requestUrl)) {
      return route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ account: { name: 'Anna', email: 'a@b.c' } }),
      });
    }
    if (/\/bookings\/mine/.test(requestUrl)) {
      return route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(trips) });
    }
    return route.fulfill({ status: 200, contentType: 'application/json', body: '{}' });
  });
  await page.goto(BASE + url, { waitUntil: 'networkidle' });
  await page.waitForTimeout(900);
  return { page, ctx: browserContext, errs };
}

{
  const { page, ctx: browserContext, errs } = await openMyTripsPage({ url: '/my-trips.html?review=1', trips: TRIPS });
  const txt = await page.locator('body').innerText();
  recordCheck(/Ubud Tour/.test(txt), 'review link: the past trip did not load');
  const modal = page.locator('[data-step="write"]').first();
  const open = await modal.isVisible().catch(() => false);
  recordCheck(open, 'review link: the review popup did not open');
  recordCheck(
    await page
      .getByText('Leave a Review', { exact: true })
      .first()
      .isVisible()
      .catch(() => false),
    'review link: the popup is open but is not the review form',
  );
  const url = await page.evaluate(() => window.location.search);
  recordCheck(!/review=1/.test(url), `review link: the flag stayed in the URL (${url})`);
  recordCheck(errs.length === 0, `review link: page errors ${errs.join(' | ')}`);
  await browserContext.close();
}

{
  const empty = {
    upcoming: [],
    history: [{ ref: 'CUE-002', name: 'Ubud Tour', start_date: '2026-01-02', review_items: [] }],
  };
  const { page, ctx: browserContext } = await openMyTripsPage({ url: '/my-trips.html?review=1', trips: empty });
  const modal = page.locator('[data-step="write"]').first();
  const open = await modal.isVisible().catch(() => false);
  recordCheck(!open, 'review link: an EMPTY review popup opened');
  await browserContext.close();
}

{
  const { page, ctx: browserContext } = await openMyTripsPage({ url: '/my-trips.html', trips: TRIPS });
  const modal = page.locator('[data-step="write"]').first();
  const open = await modal.isVisible().catch(() => false);
  recordCheck(!open, 'a review popup opened without being asked for');
  await browserContext.close();
}

{
  const { page, ctx: browserContext } = await openMyTripsPage({
    url: '/my-trips.html?token=abc&review=1',
    trips: TRIPS,
  });
  const url = await page.evaluate(() => window.location.search);
  recordCheck(!/review=1/.test(url), `the flag stayed (${url})`);
  recordCheck(!/token=abc/.test(url), `the magic-link token was left in the URL (${url})`);
  const openedToo = await page
    .locator('[data-step="write"]')
    .first()
    .isVisible()
    .catch(() => false);
  recordCheck(openedToo, 'with a token in the URL too, the popup did not open - the two rewrites clobbered each other');
  await browserContext.close();
}

await browser.close();
console.log(`${pass}/${pass + fail}`);
