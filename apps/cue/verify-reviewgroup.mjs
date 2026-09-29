// One review posted for 3 trips: one card on mixed lists ("Ubud Tour + 2 more"), its own copy on each trip's page.
// Run: npm run build && npm run serve, then node verify-reviewgroup.mjs
import { chromium } from 'playwright-core';

const SITE = process.env.BASE || 'http://127.0.0.1:4000';
const MSG = 'Three days with the same driver, every pickup on time.';
const ANDRAS = { name: 'Andras', country: 'Hungary', rating: 5, message: MSG, source: 'cahyana' };
// What the server stores after one submit with 3 trips ticked: 3 rows, newest first.
const ROWS = [
  { ...ANDRAS, service: 'Airport – Ubud', created_at: '2026-09-20T10:00:03Z' },
  { ...ANDRAS, service: 'Ubud Culture Day', created_at: '2026-09-20T10:00:02Z' },
  { ...ANDRAS, service: 'Ubud Tour', created_at: '2026-09-20T10:00:01Z' },
  { name: 'Santos', country: 'Spain', rating: 4, message: 'Good day out.', service: 'Ubud Tour', source: 'cahyana', created_at: '2026-09-18T08:00:00Z' },
];

let pass = 0, fail = 0;
function ok(cond, msg) { if (cond) pass++; else { fail++; process.stdout.write(`FAIL ${msg}\n`); } }

const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });

async function open(path, w) {
  const ctx = await browser.newContext({ viewport: { width: w, height: 900 } });
  await ctx.route('**/api/**', (r) => {
    const u = new URL(r.request().url());
    if (u.pathname.endsWith('/reviews/summary')) return r.fulfill({ json: [] });
    if (u.pathname.endsWith('/reviews')) {
      const svc = u.searchParams.get('service'), grp = u.searchParams.get('group');
      const routes = ['Airport – Ubud', 'Canggu Area'];
      return r.fulfill({ json: ROWS.filter((x) => (svc ? x.service === svc : grp ? routes.includes(x.service) : true)) });
    }
    return r.fulfill({ status: 503, body: '{}' });
  });
  await ctx.routeWebSocket(/.*/, (ws) => ws.close());
  const page = await ctx.newPage();
  const errors = [];
  page.on('pageerror', (e) => errors.push(String(e)));
  await page.goto(SITE + path, { waitUntil: 'networkidle' });
  await page.waitForTimeout(600);
  return { ctx, page, errors };
}

// Review cards on the page: [name, trip line] per card.
function cards(page) {
  return page.evaluate(() => [...document.querySelectorAll('button')]
    .filter((b) => b.querySelector('p') && /Read more/.test(b.textContent))
    .map((b) => ({ name: b.querySelector('span').textContent.trim(), trip: (b.children[1] || {}).textContent || '', text: b.querySelector('p').textContent })));
}

for (const w of [390, 1280]) {
  // Mixed lists: one Andras card with the combined trip line.
  for (const path of ['/', '/all-reviews.html']) {
    const { ctx, page, errors } = await open(path, w);
    const list = await cards(page);
    const andras = list.filter((c) => c.name === 'Andras');
    ok(andras.length === 1, `${w} ${path}: ${andras.length} Andras cards`);
    ok(andras[0] && andras[0].trip === 'Ubud Tour + 2 more', `${w} ${path}: trip line "${andras[0] && andras[0].trip}"`);
    ok(list.some((c) => c.name === 'Santos' && c.trip === 'Ubud Tour'), `${w} ${path}: single-trip review changed`);
    // The popup names every trip.
    await page.locator('button', { hasText: MSG }).first().click();
    await page.waitForTimeout(400);
    const modal = await page.evaluate(() => { const d = [...document.querySelectorAll('[role=dialog]')].find((x) => /Guest review/.test(x.textContent)); return d ? d.innerText : ''; });
    ok(modal.includes('Ubud Tour · Ubud Culture Day · Airport – Ubud'), `${w} ${path}: popup trip list "${modal.split('\n').slice(0, 4).join(' | ')}"`);
    ok(errors.length === 0, `${w} ${path}: page errors ${errors}`);
    await ctx.close();
  }
  // Each booked item's own page keeps its own copy.
  for (const [path, trip] of [['/ubud-tour.html', 'Ubud Tour'], ['/ubud-culture-day.html', 'Ubud Culture Day'], ['/airport-transfer.html', 'Airport – Ubud']]) {
    const { ctx, page } = await open(path, w);
    const andras = (await cards(page)).filter((c) => c.name === 'Andras');
    ok(andras.length === 1 && andras[0].trip === trip, `${w} ${path}: Andras cards ${JSON.stringify(andras.map((c) => c.trip))}`);
    await ctx.close();
  }
}

await browser.close();
process.stdout.write(`${pass}/${pass + fail}\n`);
process.exit(fail ? 1 : 0);
