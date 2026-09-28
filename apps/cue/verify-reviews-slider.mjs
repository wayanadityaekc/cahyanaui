// Homepage reviews section, Sep 2026 (Wayan: "reviews section need to be as a
// slider side, not scrolling to bottom because it's too long ... create a fix
// box per review and it can see details when got clicked, button see all
// reviews go to the page review"). Pins: uniform card height, the section is
// a horizontal slider (not a grid that grows with review count), clicking a
// card opens the full text in a popup, "See all reviews" actually links to
// /all-reviews.html (was missing `.html`, a straight 404 on this static
// export), and that page's own cards are click-to-detail too.
// Run against the built pages: npm run build && npm run serve (port 4000).
import { chromium } from '/home/user/CUE/node_modules/playwright-core/index.mjs';
const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell' });

const REVIEWS = Array.from({ length: 8 }, (_, i) => ({
  name: `Guest ${i + 1}`,
  service: 'Ubud Tour',
  rating: 5 - (i % 2),
  message: (i % 2 === 0 ? 'Great trip, our driver was on time and friendly.' : 'This trip was absolutely fantastic from start to finish. Our driver was on time, friendly, and knew all the best spots to stop for photos. The itinerary was well paced and never felt rushed. We saw waterfalls, rice terraces, and a beautiful temple. Highly recommend booking with Cahyana - communication was clear and pricing was upfront the whole way through, no surprises at the end of the day.'),
  country: 'Australia',
  created_at: '2026-09-' + (10 + i),
}));

let pass = 0, fail = 0;
const ok = (c, m) => { c ? pass++ : (fail++, console.log('  FAIL:', m)); };

for (const w of [390, 1280]) {
  const ctx = await b.newContext({ viewport: { width: w, height: 1000 } });
  await ctx.route('**/api/**', (route) => {
    const url = route.request().url();
    if (url.includes('/reviews/summary')) return route.fulfill({ json: [] });
    if (url.includes('/reviews')) return route.fulfill({ json: REVIEWS });
    if (url.includes('/pricing/catalog')) return route.fulfill({ json: { currency: 'USD', symbol: '$', catalog: {} } });
    return route.fulfill({ json: {} });
  });
  const page = await ctx.newPage();
  const errs = []; page.on('pageerror', (e) => errs.push(String(e)));
  await page.goto('http://127.0.0.1:4000/', { waitUntil: 'networkidle' });
  await page.locator('#reviews').scrollIntoViewIfNeeded();
  await page.waitForTimeout(500);
  const cards = page.locator('#reviews button:not([aria-label="Previous"]):not([aria-label="Next"])');
  const n = await cards.count();
  console.log(`${w}: cards rendered = ${n}`);
  ok(n === 8, `${w}: expected 8 review cards, got ${n}`);
  // uniform height
  const heights = await cards.evaluateAll((els) => els.map((e) => Math.round(e.getBoundingClientRect().height)));
  ok(new Set(heights).size === 1, `${w}: card heights not uniform: ${heights.join(',')}`);
  await page.screenshot({ path: `shots/reviews-slider-${w}.png` });

  // scrollable on desktop / overflow works
  const track = page.locator('#reviews .flex.overflow-x-auto').first();
  const overflowing = await track.evaluate((el) => el.scrollWidth > el.clientWidth);
  ok(overflowing, `${w}: track does not overflow (not a slider)`);

  // click a card -> modal opens with full text
  await cards.nth(2).click();
  await page.waitForTimeout(500);
  // Several [role="dialog"] instances are always mounted (AuthModal x2, this
  // one) - toggled via opacity/visibility, not unmounted. Scope to the one
  // this popup actually is.
  const reviewDialog = page.locator('[role="dialog"][aria-label="Guest review"]');
  const modalText = await reviewDialog.innerText();
  ok(modalText.includes(REVIEWS[2].name), `${w}: modal missing clicked review's name`);
  ok(modalText.length > REVIEWS[2].message.length / 2, `${w}: modal text looks truncated`);
  await page.screenshot({ path: `shots/reviews-modal-${w}.png` });

  // check-all-reviews link fixed
  const href = await page.locator('#reviews a', { hasText: 'See all reviews' }).getAttribute('href');
  ok(href === '/all-reviews.html', `${w}: See all reviews href is "${href}", not /all-reviews.html`);

  // close via escape
  await page.keyboard.press('Escape');
  await page.waitForTimeout(400);
  ok(!(await reviewDialog.isVisible()), `${w}: modal did not close on Escape`);

  ok(errs.length === 0, `${w}: page errors ${errs.join(' | ')}`);
  await ctx.close();
}

// visit /all-reviews.html itself
{
  const ctx = await b.newContext({ viewport: { width: 1280, height: 1000 } });
  await ctx.route('**/api/**', (route) => {
    const url = route.request().url();
    if (url.includes('/reviews')) return route.fulfill({ json: REVIEWS });
    return route.fulfill({ json: {} });
  });
  const page = await ctx.newPage();
  const errs = []; page.on('pageerror', (e) => errs.push(String(e)));
  const resp = await page.goto('http://127.0.0.1:4000/all-reviews.html', { waitUntil: 'networkidle' });
  ok(resp.status() === 200, `all-reviews.html: status ${resp.status()}`);
  const cards = page.locator('[data-reviews-track] button');
  ok(await cards.count() === 8, `all-reviews.html: expected 8 cards, got ${await cards.count()}`);
  await cards.nth(0).click();
  await page.waitForTimeout(400);
  ok(await page.locator('[role="dialog"][aria-label="Guest review"]').isVisible(), `all-reviews.html: click did not open modal`);
  await page.screenshot({ path: 'shots/all-reviews-page-1280.png', fullPage: true });
  ok(errs.length === 0, `all-reviews.html: page errors ${errs.join(' | ')}`);
  await ctx.close();
}

await b.close();
console.log(`${pass}/${pass + fail}`);
process.exit(fail ? 1 : 0);
