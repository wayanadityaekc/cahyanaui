import { chromium } from '/home/user/CUE/node_modules/playwright-core/index.mjs';
const browser = await chromium.launch({
  executablePath: '/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell',
});

const REVIEWS = Array.from({ length: 8 }, (unusedValue, index) => ({
  name: `Guest ${index + 1}`,
  service: 'Ubud Tour',
  rating: 5 - (index % 2),
  message:
    index % 2 === 0
      ? 'Great trip, our driver was on time and friendly.'
      : 'This trip was absolutely fantastic from start to finish. Our driver was on time, friendly, and knew all the best spots to stop for photos. The itinerary was well paced and never felt rushed. We saw waterfalls, rice terraces, and a beautiful temple. Highly recommend booking with Cahyana - communication was clear and pricing was upfront the whole way through, no surprises at the end of the day.',
  country: 'Australia',
  created_at: `2026-09-${10 + index}`,
}));

let pass = 0,
  fail = 0;
function recordCheck(isPassing, message) {
  isPassing ? pass++ : (fail++, console.log('  FAIL:', message));
}

for (const width of [390, 1280]) {
  const browserContext = await browser.newContext({ viewport: { width: width, height: 1000 } });
  await browserContext.route('**/api/**', (route) => {
    const url = route.request().url();
    if (url.includes('/reviews/summary')) return route.fulfill({ json: [] });
    if (url.includes('/reviews')) return route.fulfill({ json: REVIEWS });
    if (url.includes('/pricing/catalog')) return route.fulfill({ json: { currency: 'USD', symbol: '$', catalog: {} } });
    return route.fulfill({ json: {} });
  });
  const page = await browserContext.newPage();
  const errs = [];
  page.on('pageerror', (error) => errs.push(String(error)));
  await page.goto('http://127.0.0.1:4000/', { waitUntil: 'networkidle' });
  await page.locator('#reviews').scrollIntoViewIfNeeded();
  await page.waitForTimeout(500);
  const cards = page.locator('#reviews button:not([aria-label="Previous"]):not([aria-label="Next"])');
  const cardCount = await cards.count();
  console.log(`${width}: cards rendered = ${cardCount}`);
  recordCheck(cardCount === 8, `${width}: expected 8 review cards, got ${cardCount}`);
  const heights = await cards.evaluateAll((elements) =>
    elements.map((event) => Math.round(event.getBoundingClientRect().height)),
  );
  recordCheck(new Set(heights).size === 1, `${width}: card heights not uniform: ${heights.join(',')}`);
  await page.screenshot({ path: `shots/reviews-slider-${width}.png` });

  const track = page.locator('#reviews .flex.overflow-x-auto').first();
  const overflowing = await track.evaluate((element) => element.scrollWidth > element.clientWidth);
  recordCheck(overflowing, `${width}: track does not overflow (not a slider)`);

  await cards.nth(2).click();
  await page.waitForTimeout(500);
  const reviewDialog = page.locator('[role="dialog"][aria-label="Guest review"]');
  const modalText = await reviewDialog.innerText();
  recordCheck(modalText.includes(REVIEWS[2].name), `${width}: modal missing clicked review's name`);
  recordCheck(modalText.length > REVIEWS[2].message.length / 2, `${width}: modal text looks truncated`);
  await page.screenshot({ path: `shots/reviews-modal-${width}.png` });

  const href = await page.locator('#reviews a', { hasText: 'See all reviews' }).getAttribute('href');
  recordCheck(href === '/all-reviews.html', `${width}: See all reviews href is "${href}", not /all-reviews.html`);

  await page.keyboard.press('Escape');
  await page.waitForTimeout(400);
  recordCheck(!(await reviewDialog.isVisible()), `${width}: modal did not close on Escape`);

  recordCheck(errs.length === 0, `${width}: page errors ${errs.join(' | ')}`);
  await browserContext.close();
}

{
  const browserContext = await browser.newContext({ viewport: { width: 1280, height: 1000 } });
  await browserContext.route('**/api/**', (route) => {
    const url = route.request().url();
    if (url.includes('/reviews')) return route.fulfill({ json: REVIEWS });
    return route.fulfill({ json: {} });
  });
  const page = await browserContext.newPage();
  const errs = [];
  page.on('pageerror', (error) => errs.push(String(error)));
  const response = await page.goto('http://127.0.0.1:4000/all-reviews.html', { waitUntil: 'networkidle' });
  recordCheck(response.status() === 200, `all-reviews.html: status ${response.status()}`);
  const cards = page.locator('[data-reviews-track] button');
  recordCheck((await cards.count()) === 8, `all-reviews.html: expected 8 cards, got ${await cards.count()}`);
  await cards.nth(0).click();
  await page.waitForTimeout(400);
  recordCheck(
    await page.locator('[role="dialog"][aria-label="Guest review"]').isVisible(),
    `all-reviews.html: click did not open modal`,
  );
  await page.screenshot({ path: 'shots/all-reviews-page-1280.png', fullPage: true });
  recordCheck(errs.length === 0, `all-reviews.html: page errors ${errs.join(' | ')}`);
  await browserContext.close();
}

await browser.close();
console.log(`${pass}/${pass + fail}`);
process.exit(fail ? 1 : 0);
