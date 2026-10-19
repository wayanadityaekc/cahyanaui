import { chromium } from 'playwright-core';

const SITE = process.env.BASE || 'http://127.0.0.1:4000';
const MSG = 'Three days with the same driver, every pickup on time.';
const ANDRAS = { name: 'Andras', country: 'Hungary', rating: 5, message: MSG, source: 'cahyana' };
const ROWS = [
  { ...ANDRAS, service: 'Airport – Ubud', created_at: '2026-09-20T10:00:03Z' },
  { ...ANDRAS, service: 'Ubud Culture Day', created_at: '2026-09-20T10:00:02Z' },
  { ...ANDRAS, service: 'Ubud Tour', created_at: '2026-09-20T10:00:01Z' },
  {
    name: 'Santos',
    country: 'Spain',
    rating: 4,
    message: 'Good day out.',
    service: 'Ubud Tour',
    source: 'cahyana',
    created_at: '2026-09-18T08:00:00Z',
  },
];

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

async function open(path, viewportWidth) {
  const browserContext = await browser.newContext({ viewport: { width: viewportWidth, height: 900 } });
  await browserContext.route('**/api/**', (route) => {
    const requestUrl = new URL(route.request().url());
    if (requestUrl.pathname.endsWith('/reviews/summary')) return route.fulfill({ json: [] });
    if (requestUrl.pathname.endsWith('/reviews')) {
      const svc = requestUrl.searchParams.get('service'),
        grp = requestUrl.searchParams.get('group');
      const routes = ['Airport – Ubud', 'Canggu Area'];
      return route.fulfill({
        json: ROWS.filter((review) => (svc ? review.service === svc : grp ? routes.includes(review.service) : true)),
      });
    }
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

function collectReviewCards(page) {
  return page.evaluate(() =>
    [...document.querySelectorAll('button')]
      .filter((button) => button.querySelector('p') && /Read more/.test(button.textContent))
      .map((button) => ({
        name: button.querySelector('span').textContent.trim(),
        trip: (button.children[1] || {}).textContent || '',
        text: button.querySelector('p').textContent,
      })),
  );
}

for (const width of [390, 1280]) {
  for (const path of ['/', '/all-reviews.html']) {
    const { ctx: browserContext, page, errors } = await open(path, width);
    const list = await collectReviewCards(page);
    const andras = list.filter((card) => card.name === 'Andras');
    recordCheck(andras.length === 1, `${width} ${path}: ${andras.length} Andras cards`);
    recordCheck(
      andras[0] && andras[0].trip === 'Ubud Tour + 2 more',
      `${width} ${path}: trip line "${andras[0] && andras[0].trip}"`,
    );
    recordCheck(
      list.some((card) => card.name === 'Santos' && card.trip === 'Ubud Tour'),
      `${width} ${path}: single-trip review changed`,
    );
    await page.locator('button', { hasText: MSG }).first().click();
    await page.waitForTimeout(400);
    const modal = await page.evaluate(() => {
      const dialog = [...document.querySelectorAll('[role=dialog]')].find((candidateDialog) =>
        /Guest review/.test(candidateDialog.textContent),
      );
      return dialog ? dialog.innerText : '';
    });
    recordCheck(
      modal.includes('Ubud Tour · Ubud Culture Day · Airport – Ubud'),
      `${width} ${path}: popup trip list "${modal.split('\n').slice(0, 4).join(' | ')}"`,
    );
    recordCheck(errors.length === 0, `${width} ${path}: page errors ${errors}`);
    await browserContext.close();
  }
  for (const [path, trip] of [
    ['/ubud-tour.html', 'Ubud Tour'],
    ['/ubud-culture-day.html', 'Ubud Culture Day'],
    ['/airport-transfer.html', 'Airport – Ubud'],
  ]) {
    const { ctx: browserContext, page } = await open(path, width);
    const andras = (await collectReviewCards(page)).filter((card) => card.name === 'Andras');
    recordCheck(
      andras.length === 1 && andras[0].trip === trip,
      `${width} ${path}: Andras cards ${JSON.stringify(andras.map((andra) => andra.trip))}`,
    );
    await browserContext.close();
  }
}

await browser.close();
process.stdout.write(`${pass}/${pass + fail}\n`);
process.exit(fail ? 1 : 0);
