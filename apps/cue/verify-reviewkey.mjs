// Reviews show on the page they belong to, and each page has one Write review button.
// Run: npm run build && npm run serve, then node verify-reviewkey.mjs
// Reviews are stored under the booking name (bookItem); every lookup (list, hero stars, card stars) must use it.
import { chromium } from 'playwright-core';
import fs from 'node:fs';

const SITE = process.env.BASE || 'http://127.0.0.1:4000';
const TOURS = JSON.parse(fs.readFileSync('content/tours/tours.json', 'utf8'));
const MSG = 'Our driver knew every quiet corner of Ubud.';
const REVIEW = { name: 'Andras', country: 'Hungary', rating: 5, message: MSG, service: 'Ubud Tour', source: 'cahyana' };

let pass = 0, fail = 0;
function ok(cond, msg) { if (cond) pass++; else { fail++; process.stdout.write(`FAIL ${msg}\n`); } }

const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });

async function open(path, w) {
  const ctx = await browser.newContext({ viewport: { width: w, height: 900 } });
  const asked = [];
  await ctx.route('**/api/**', (r) => {
    const u = new URL(r.request().url());
    if (u.pathname.endsWith('/reviews/summary')) return r.fulfill({ json: [{ service: 'Ubud Tour', avg_rating: 5, count: 1 }] });
    if (u.pathname.endsWith('/reviews')) {
      const svc = u.searchParams.get('service'), grp = u.searchParams.get('group');
      asked.push(svc ?? (grp ? `group:${grp}` : '(all)'));
      // Server behaviour: a service filter returns only that service; no filter returns everything.
      return r.fulfill({ json: !svc && !grp ? [REVIEW] : svc === 'Ubud Tour' ? [REVIEW] : [] });
    }
    return r.fulfill({ status: 503, body: '{}' });
  });
  await ctx.routeWebSocket(/.*/, (ws) => ws.close());
  const page = await ctx.newPage();
  const errors = [];
  page.on('pageerror', (e) => errors.push(String(e)));
  const res = await page.goto(SITE + path, { waitUntil: 'networkidle' });
  await page.waitForTimeout(600);
  return { ctx, page, asked, errors, status: res.status() };
}

// Visible buttons that open the review popup.
function writeButtons(page) {
  return page.evaluate(() => [...document.querySelectorAll('button, a')].filter((b) => {
    if (b.textContent.trim() !== 'Write review') return false;
    const r = b.getBoundingClientRect(); const cs = getComputedStyle(b);
    return r.width > 0 && r.height > 0 && cs.visibility !== 'hidden';
  }).length);
}

// 1. Every tour page asks for its reviews by its booking name.
for (const [slug, t] of Object.entries(TOURS)) {
  if (!fs.existsSync(`out/${slug}.html`)) continue;
  const { ctx, asked, status, errors } = await open(`/${slug}.html`, 1280);
  ok(status === 200, `${slug}: HTTP ${status}`);
  ok(asked.includes(t.bookItem), `${slug}: review list asked for ${JSON.stringify(asked)}, not "${t.bookItem}"`);
  ok(!asked.includes(t.title) || t.title === t.bookItem, `${slug}: still asks by long title`);
  ok(errors.length === 0, `${slug}: page errors ${errors}`);
  await ctx.close();
}

for (const w of [390, 1280]) {
  // 2. Ubud Tour's own page shows its review, stars and one button.
  {
    const { ctx, page } = await open('/ubud-tour.html', w);
    const body = await page.evaluate(() => document.body.innerText);
    ok(body.includes(MSG), `${w} ubud-tour: review text not on its own page`);
    ok(!/No reviews yet for this program/.test(body), `${w} ubud-tour: empty state shown despite a review`);
    const hero = await page.evaluate(() => (document.querySelector('[data-rating="Ubud Tour"]') || {}).textContent || '');
    ok(/5\.0/.test(hero), `${w} ubud-tour: hero stars read "${hero}"`);
    ok(await writeButtons(page) === 1, `${w} ubud-tour: ${await writeButtons(page)} Write review buttons`);
    ok(await page.evaluate(() => document.documentElement.scrollWidth - innerWidth) <= 0, `${w} ubud-tour: page overflows`);
    await ctx.close();
  }
  // 3. Homepage shows reviews from every program (unfiltered request).
  {
    const { ctx, page, asked } = await open('/', w);
    ok(asked.includes('(all)'), `${w} home: reviews request was filtered ${JSON.stringify(asked)}`);
    ok((await page.evaluate(() => document.body.innerText)).includes(MSG), `${w} home: review not shown`);
    await ctx.close();
  }
  // 4. Listing card shows the stars.
  {
    const { ctx, page } = await open('/tour.html', w);
    const card = await page.evaluate(() => (document.querySelector('[data-rating="Ubud Tour"]') || {}).textContent || '');
    ok(/5\.0/.test(card), `${w} tour listing: card stars read "${card}"`);
    await ctx.close();
  }
  // 5. Exactly one Write review button on every page that has reviews (empty state included).
  for (const path of ['/east-bali-tour-lempuyang.html', '/transfer.html', '/charter.html', '/airport-transfer.html', '/attractions/atv-ride.html', '/lempuyang-tirta-gangga.html']) {
    if (!fs.existsSync(`out${path}`)) continue;
    const { ctx, page, status } = await open(path, w);
    ok(status === 200, `${w} ${path}: HTTP ${status}`);
    const n = await writeButtons(page);
    ok(n === 1, `${w} ${path}: ${n} Write review buttons`);
    await ctx.close();
  }
}

await browser.close();
process.stdout.write(`${pass}/${pass + fail}\n`);
process.exit(fail ? 1 : 0);
