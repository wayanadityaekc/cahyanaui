import { chromium } from 'playwright-core';
import fs from 'node:fs';

const SITE = process.env.BASE || 'http://127.0.0.1:4000';
const TOURS = JSON.parse(fs.readFileSync('content/tours/tours.json', 'utf8'));
const MSG = 'Our driver knew every quiet corner of Ubud.';
const REVIEW = { name: 'Andras', country: 'Hungary', rating: 5, message: MSG, service: 'Ubud Tour', source: 'cahyana' };

let pass = 0,
  fail = 0;
function ok(cond, message) {
  if (cond) pass++;
  else {
    fail++;
    process.stdout.write(`FAIL ${message}\n`);
  }
}

const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });

async function open(path, viewportWidth) {
  const browserContext = await browser.newContext({ viewport: { width: viewportWidth, height: 900 } });
  const asked = [];
  await browserContext.route('**/api/**', (route) => {
    const requestUrl = new URL(route.request().url());
    if (requestUrl.pathname.endsWith('/reviews/summary'))
      return route.fulfill({ json: [{ service: 'Ubud Tour', avg_rating: 5, count: 1 }] });
    if (requestUrl.pathname.endsWith('/reviews')) {
      const svc = requestUrl.searchParams.get('service'),
        grp = requestUrl.searchParams.get('group');
      asked.push(svc ?? (grp ? `group:${grp}` : '(all)'));
      return route.fulfill({ json: !svc && !grp ? [REVIEW] : svc === 'Ubud Tour' ? [REVIEW] : [] });
    }
    return route.fulfill({ status: 503, body: '{}' });
  });
  await browserContext.routeWebSocket(/.*/, (ws) => ws.close());
  const page = await browserContext.newPage();
  const errors = [];
  page.on('pageerror', (error) => errors.push(String(error)));
  const result = await page.goto(SITE + path, { waitUntil: 'networkidle' });
  await page.waitForTimeout(600);
  return { ctx: browserContext, page, asked, errors, status: result.status() };
}

function writeButtons(page) {
  return page.evaluate(
    () =>
      [...document.querySelectorAll('button, a')].filter((button) => {
        if (button.textContent.trim() !== 'Write review') return false;
        const box = button.getBoundingClientRect();
        const cs = getComputedStyle(button);
        return box.width > 0 && box.height > 0 && cs.visibility !== 'hidden';
      }).length,
  );
}

for (const [slug, tour] of Object.entries(TOURS)) {
  if (!fs.existsSync(`out/${slug}.html`)) continue;
  const { ctx: browserContext, asked, status, errors } = await open(`/${slug}.html`, 1280);
  ok(status === 200, `${slug}: HTTP ${status}`);
  ok(asked.includes(tour.bookItem), `${slug}: review list asked for ${JSON.stringify(asked)}, not "${tour.bookItem}"`);
  ok(!asked.includes(tour.title) || tour.title === tour.bookItem, `${slug}: still asks by long title`);
  ok(errors.length === 0, `${slug}: page errors ${errors}`);
  await browserContext.close();
}

for (const width of [390, 1280]) {
  {
    const { ctx: browserContext, page } = await open('/ubud-tour.html', width);
    const body = await page.evaluate(() => document.body.innerText);
    ok(body.includes(MSG), `${width} ubud-tour: review text not on its own page`);
    ok(!/No reviews yet for this program/.test(body), `${width} ubud-tour: empty state shown despite a review`);
    const hero = await page.evaluate(
      () => (document.querySelector('[data-rating="Ubud Tour"]') || {}).textContent || '',
    );
    ok(/5\.0/.test(hero), `${width} ubud-tour: hero stars read "${hero}"`);
    ok((await writeButtons(page)) === 1, `${width} ubud-tour: ${await writeButtons(page)} Write review buttons`);
    ok(
      (await page.evaluate(() => document.documentElement.scrollWidth - innerWidth)) <= 0,
      `${width} ubud-tour: page overflows`,
    );
    await browserContext.close();
  }
  {
    const { ctx: browserContext, page, asked } = await open('/', width);
    ok(asked.includes('(all)'), `${width} home: reviews request was filtered ${JSON.stringify(asked)}`);
    ok((await page.evaluate(() => document.body.innerText)).includes(MSG), `${width} home: review not shown`);
    await browserContext.close();
  }
  {
    const { ctx: browserContext, page } = await open('/tour.html', width);
    const card = await page.evaluate(
      () => (document.querySelector('[data-rating="Ubud Tour"]') || {}).textContent || '',
    );
    ok(/5\.0/.test(card), `${width} tour listing: card stars read "${card}"`);
    await browserContext.close();
  }
  for (const path of [
    '/east-bali-tour-lempuyang.html',
    '/transfer.html',
    '/charter.html',
    '/airport-transfer.html',
    '/attractions/atv-ride.html',
    '/lempuyang-tirta-gangga.html',
  ]) {
    if (!fs.existsSync(`out${path}`)) continue;
    const { ctx: browserContext, page, status } = await open(path, width);
    ok(status === 200, `${width} ${path}: HTTP ${status}`);
    const writeButtonCount = await writeButtons(page);
    ok(writeButtonCount === 1, `${width} ${path}: ${writeButtonCount} Write review buttons`);
    await browserContext.close();
  }
}

await browser.close();
process.stdout.write(`${pass}/${pass + fail}\n`);
process.exit(fail ? 1 : 0);
