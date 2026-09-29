import { chromium } from '/home/user/CUE/node_modules/playwright-core/index.mjs';

// Reviews on the three pages that are not detail pages, and the email link that
// has to land ON the review rather than near it.
const BASE = process.env.BASE || 'http://127.0.0.1:4010';
let pass = 0, fail = 0;
function ok(c, m) { c ? pass++ : (fail++, console.log('  FAIL:', m)); }

const b = await chromium.launch({
  executablePath: process.env.PW_BIN || '/opt/pw-browsers/chromium-1194/chrome-linux/chrome',
});

const REVIEWS = [
  { name: 'Anna', service: 'Charter', rating: 5, message: 'Went wherever we asked all day.', country: 'AU', created_at: '2026-09-18' },
];

// What each page must ASK FOR. Checking the request is the real proof: the DOM
// looks identical whether the page asked for the right set or for everything.
const PAGES = [
  { url: '/charter.html', expect: 'service=Charter', label: 'charter' },
  { url: '/airport-transfer.html', expect: 'service=Airport', label: 'airport' },
  { url: '/transfer.html', expect: 'group=transfers', label: 'transfer' },
];

for (const w of [390, 1280]) {
  for (const p of PAGES) {
    const ctx = await b.newContext({ viewport: { width: w, height: 900 } });
    const page = await ctx.newPage();
    const asked = [];
    const errs = [];
    page.on('pageerror', (e) => errs.push(String(e)));
    await page.route('**/api/**', async (route) => {
      const u = route.request().url();
      if (/\/reviews(\?|$)/.test(u)) {
        asked.push(u);
        return route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(REVIEWS) });
      }
      return route.fulfill({ status: 200, contentType: 'application/json', body: '{}' });
    });
    await page.goto(BASE + p.url, { waitUntil: 'networkidle' });
    await page.waitForTimeout(500);

    const tag = `${p.label}@${w}`;
    ok(asked.length > 0, `${tag}: the page never asked for reviews`);
    ok(asked.some((u) => decodeURIComponent(u).includes(p.expect)),
       `${tag}: asked ${asked.map((u) => decodeURIComponent(u).split('/reviews')[1]).join(' , ')} - expected ${p.expect}`);
    // Only ONE reviews request: two would mean a second strip mounted somewhere.
    ok(asked.length === 1, `${tag}: asked for reviews ${asked.length} times`);

    const txt = await page.locator('body').innerText();
    ok(/What guests say/i.test(txt), `${tag}: no reviews heading`);
    ok(/Went wherever we asked all day/.test(txt), `${tag}: the review itself did not render`);
    const bands = await page.locator('.review-cta').count();
    ok(bands === 1, `${tag}: ${bands} "Write review" bands (want exactly 1)`);
    ok(errs.length === 0, `${tag}: page errors ${errs.join(' | ')}`);
    // The page must not grow sideways.
    const over = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
    ok(over <= 0, `${tag}: page overflows by ${over}px`);
    await ctx.close();
  }
}

// A tour page already had its reviews through DetailTabs - it must not have
// gained a second band from this change.
{
  const ctx = await b.newContext({ viewport: { width: 1280, height: 900 } });
  const page = await ctx.newPage();
  await page.route('**/api/**', (r) => r.fulfill({ status: 200, contentType: 'application/json', body: '[]' }));
  await page.goto(`${BASE}/ubud-tour.html`, { waitUntil: 'networkidle' });
  const bands = await page.locator('.review-cta').count();
  ok(bands === 1, `tour page now has ${bands} review bands`);
  await ctx.close();
}

// ---- the email link lands ON the review -----------------------------------
const TRIPS = {
  upcoming: [],
  history: [{ ref: 'CUE-001', name: 'Ubud Tour', start_date: '2026-01-02', review_items: ['Ubud Tour'] }],
};
async function myTrips({ url, trips }) {
  const ctx = await b.newContext({ viewport: { width: 1280, height: 900 } });
  const page = await ctx.newPage();
  const errs = [];
  page.on('pageerror', (e) => errs.push(String(e)));
  await page.addInitScript(() => { try { localStorage.setItem('cue_token', 'tok-test'); } catch {} });
  await page.route('**/api/**', async (route) => {
    const u = route.request().url();
    if (/\/account\/session/.test(u)) {
      return route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ account: { name: 'Anna', email: 'a@b.c' } }) });
    }
    if (/\/bookings\/mine/.test(u)) {
      return route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(trips) });
    }
    return route.fulfill({ status: 200, contentType: 'application/json', body: '{}' });
  });
  await page.goto(BASE + url, { waitUntil: 'networkidle' });
  await page.waitForTimeout(900);
  return { page, ctx, errs };
}

{
  const { page, ctx, errs } = await myTrips({ url: '/my-trips.html?review=1', trips: TRIPS });
  const txt = await page.locator('body').innerText();
  ok(/Ubud Tour/.test(txt), 'review link: the past trip did not load');
  // The popup is the point. It is the review form, so it asks for a rating.
  const modal = page.locator('[data-step="write"]').first();
  const open = await modal.isVisible().catch(() => false);
  ok(open, 'review link: the review popup did not open');
  ok(await page.getByText("Leave a Review", { exact: true }).first().isVisible().catch(() => false),
     'review link: the popup is open but is not the review form');
  // The flag must be gone, or a reload reopens a popup the guest closed - and
  // ?token= must SURVIVE, because the account provider reads it.
  const url = await page.evaluate(() => window.location.search);
  ok(!/review=1/.test(url), `review link: the flag stayed in the URL (${url})`);
  ok(errs.length === 0, `review link: page errors ${errs.join(' | ')}`);
  await ctx.close();
}

{
  // Nothing left to review: land on Past trips, but DO NOT open an empty popup.
  const empty = { upcoming: [], history: [{ ref: 'CUE-002', name: 'Ubud Tour', start_date: '2026-01-02', review_items: [] }] };
  const { page, ctx } = await myTrips({ url: '/my-trips.html?review=1', trips: empty });
  const modal = page.locator('[data-step="write"]').first();
  const open = await modal.isVisible().catch(() => false);
  ok(!open, 'review link: an EMPTY review popup opened');
  await ctx.close();
}

{
  // No flag: nothing should pop by itself.
  const { page, ctx } = await myTrips({ url: '/my-trips.html', trips: TRIPS });
  const modal = page.locator('[data-step="write"]').first();
  const open = await modal.isVisible().catch(() => false);
  ok(!open, 'a review popup opened without being asked for');
  await ctx.close();
}

// token must survive the flag being stripped
{
  const { page, ctx } = await myTrips({ url: '/my-trips.html?token=abc&review=1', trips: TRIPS });
  const url = await page.evaluate(() => window.location.search);
  ok(!/review=1/.test(url), `the flag stayed (${url})`);
  ok(!/token=abc/.test(url), `the magic-link token was left in the URL (${url})`);
  const openedToo = await page.locator('[data-step="write"]').first().isVisible().catch(() => false);
  ok(openedToo, 'with a token in the URL too, the popup did not open - the two rewrites clobbered each other');
  await ctx.close();
}

await b.close();
console.log(`${pass}/${pass + fail}`);
