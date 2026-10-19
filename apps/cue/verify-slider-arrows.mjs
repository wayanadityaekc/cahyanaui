import { chromium } from 'playwright-core';

const SITE = process.env.BASE || 'http://127.0.0.1:4000';
function buildReview(reviewNumber) {
  return {
    name: `Guest ${reviewNumber}`,
    country: 'Spain',
    rating: 5,
    message: `Review ${reviewNumber}, on time and friendly.`,
    service: 'Ubud Tour',
    source: 'cahyana',
    created_at: `2026-09-${10 + reviewNumber}`,
  };
}

let pass = 0,
  fail = 0;
function recordCheck(cond, message) {
  if (cond) pass++;
  else {
    fail++;
    process.stdout.write(`FAIL ${message}\n`);
  }
}

const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });

async function open(path, viewportWidth, count) {
  const browserContext = await browser.newContext({ viewport: { width: viewportWidth, height: 900 } });
  await browserContext.route('**/api/**', (route) => {
    const requestUrl = new URL(route.request().url());
    if (requestUrl.pathname.endsWith('/reviews/summary')) return route.fulfill({ json: [] });
    if (requestUrl.pathname.endsWith('/reviews'))
      return route.fulfill({ json: Array.from({ length: count }, (unusedValue, index) => buildReview(index + 1)) });
    return route.fulfill({ status: 503, body: '{}' });
  });
  await browserContext.routeWebSocket(/.*/, (ws) => ws.close());
  const page = await browserContext.newPage();
  const errors = [];
  page.on('pageerror', (error) => errors.push(String(error)));
  await page.goto(SITE + path, { waitUntil: 'networkidle' });
  await page.waitForTimeout(600);
  return { ctx: browserContext, page, errors };
}

async function readArrowVisibility(page, selector) {
  const track = page.locator(selector).first();
  await track.scrollIntoViewIfNeeded();
  await track.hover();
  await page.waitForTimeout(400);
  return page.evaluate((selectorItem) => {
    const trackItem = document.querySelector(selectorItem);
    const holder = trackItem.parentElement;
    function checkIsArrowShown(label) {
      return [...holder.querySelectorAll(`:scope > button[aria-label="${label}"]`)].some((arrowButton) => {
        const cs = getComputedStyle(arrowButton);
        const box = arrowButton.getBoundingClientRect();
        return cs.display !== 'none' && cs.visibility !== 'hidden' && +cs.opacity > 0.5 && box.width > 0;
      });
    }
    return {
      canPrev: trackItem.scrollLeft > 4,
      canNext: trackItem.scrollLeft + trackItem.clientWidth < trackItem.scrollWidth - 4,
      prev: checkIsArrowShown('Previous'),
      next: checkIsArrowShown('Next'),
    };
  }, selector);
}

for (const [path, selector] of [
  ['/', '#reviews [class*="overflow-x-auto"]'],
  ['/ubud-tour.html', '#dsec-reviews [class*="overflow-x-auto"]'],
]) {
  for (const count of [2, 8]) {
    const { ctx: browserContext, page, errors } = await open(path, 1280, count);
    const arrowsBefore = await readArrowVisibility(page, selector);
    recordCheck(
      arrowsBefore.prev === arrowsBefore.canPrev,
      `${path} ${count} reviews: Previous shown=${arrowsBefore.prev} but can scroll back=${arrowsBefore.canPrev}`,
    );
    recordCheck(
      arrowsBefore.next === arrowsBefore.canNext,
      `${path} ${count} reviews: Next shown=${arrowsBefore.next} but can scroll on=${arrowsBefore.canNext}`,
    );
    if (count === 8) {
      await page.evaluate((selectorItem) => {
        const track = document.querySelector(selectorItem);
        track.scrollLeft = track.scrollWidth;
      }, selector);
      await page.waitForTimeout(500);
      const end = await readArrowVisibility(page, selector);
      recordCheck(!end.next && end.prev, `${path} at the end: next=${end.next} prev=${end.prev}`);
    }
    recordCheck(errors.length === 0, `${path}: page errors ${errors}`);
    await browserContext.close();
  }
}

for (const path of ['/', '/ubud-tour.html', '/attractions/atv-ride.html']) {
  const { ctx: browserContext, page, errors } = await open(path, 1280, 8);
  const groupCount = await page.evaluate(() => {
    let markedCount = 0;
    document.querySelectorAll('.group.relative').forEach((holder) => {
      const track = [...holder.children].find(
        (child) => child.tagName === 'DIV' && /overflow-x-auto/.test(child.className),
      );
      if (track) track.setAttribute('data-sweep', String(markedCount++));
    });
    return document.querySelectorAll('[data-sweep]').length;
  });
  recordCheck(groupCount > 0, `${path}: no sliders found`);
  process.stdout.write(`${path}: ${groupCount} sliders\n`);
  for (let reviewNumber = 0; reviewNumber < groupCount; reviewNumber++) {
    const selector = `[data-sweep="${reviewNumber}"]`;
    const visible = await page.evaluate(
      (selectorItem) => document.querySelector(selectorItem).getBoundingClientRect().width > 0,
      selector,
    );
    if (!visible) continue;
    const arrowsBefore = await readArrowVisibility(page, selector);
    recordCheck(
      arrowsBefore.prev === arrowsBefore.canPrev && arrowsBefore.next === arrowsBefore.canNext,
      `${path} slider ${reviewNumber}: arrows ${JSON.stringify(arrowsBefore)}`,
    );
    if (arrowsBefore.next) {
      const before = await page.evaluate((selectorItem) => document.querySelector(selectorItem).scrollLeft, selector);
      await page.locator(selector).locator('xpath=..').locator(':scope > button[aria-label="Next"]').click();
      await page.waitForTimeout(700);
      const after = await page.evaluate((selectorItem) => document.querySelector(selectorItem).scrollLeft, selector);
      recordCheck(after > before, `${path} slider ${reviewNumber}: Next did not scroll (${before} -> ${after})`);
      const arrowsAfter = await readArrowVisibility(page, selector);
      recordCheck(
        arrowsAfter.prev === arrowsAfter.canPrev && arrowsAfter.next === arrowsAfter.canNext,
        `${path} slider ${reviewNumber} after Next: arrows ${JSON.stringify(arrowsAfter)}`,
      );
    }
  }
  recordCheck(errors.length === 0, `${path}: page errors ${errors}`);
  await browserContext.close();
}

{
  const { ctx: browserContext, page } = await open('/', 390, 8);
  const shown = await page.evaluate(() =>
    [...document.querySelectorAll('button[aria-label="Next"], button[aria-label="Previous"]')].some(
      (arrowButton) =>
        getComputedStyle(arrowButton).display !== 'none' && arrowButton.getBoundingClientRect().width > 0,
    ),
  );
  recordCheck(!shown, '390: an arrow is displayed on a phone');
  await browserContext.close();
}

await browser.close();
process.stdout.write(`${pass}/${pass + fail}\n`);
process.exit(fail ? 1 : 0);
