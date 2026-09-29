// Slider arrows show only when they can move (hover on desktop). Run: npm run build && npm run serve, then node verify-slider-arrows.mjs
// The bug this guards: the arrows were hidden with the `hidden` attribute, which loses to their own `min-[993px]:flex` class.
import { chromium } from 'playwright-core';

const SITE = process.env.BASE || 'http://127.0.0.1:4000';
const review = (i) => ({ name: `Guest ${i}`, country: 'Spain', rating: 5, message: `Review ${i}, on time and friendly.`, service: 'Ubud Tour', source: 'cahyana', created_at: `2026-09-${10 + i}` });

let pass = 0, fail = 0;
function ok(cond, msg) { if (cond) pass++; else { fail++; process.stdout.write(`FAIL ${msg}\n`); } }

const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });

async function open(path, w, count) {
  const ctx = await browser.newContext({ viewport: { width: w, height: 900 } });
  await ctx.route('**/api/**', (r) => {
    const u = new URL(r.request().url());
    if (u.pathname.endsWith('/reviews/summary')) return r.fulfill({ json: [] });
    if (u.pathname.endsWith('/reviews')) return r.fulfill({ json: Array.from({ length: count }, (_, i) => review(i + 1)) });
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

// For the slider holding `sel`: can it scroll each way, and is each arrow actually visible while hovered?
async function arrows(page, sel) {
  const track = page.locator(sel).first();
  await track.scrollIntoViewIfNeeded();
  await track.hover();
  await page.waitForTimeout(400);
  return page.evaluate((s) => {
    const t = document.querySelector(s);
    const holder = t.parentElement;
    const shown = (label) => [...holder.querySelectorAll(`:scope > button[aria-label="${label}"]`)].some((b) => {
      const cs = getComputedStyle(b); const r = b.getBoundingClientRect();
      return cs.display !== 'none' && cs.visibility !== 'hidden' && +cs.opacity > 0.5 && r.width > 0;
    });
    return {
      canPrev: t.scrollLeft > 4,
      canNext: t.scrollLeft + t.clientWidth < t.scrollWidth - 4,
      prev: shown('Previous'),
      next: shown('Next'),
    };
  }, sel);
}

// Review rows: 2 cards fit (no arrows), 8 cards overflow (Next only at the start).
for (const [path, sel] of [['/', '#reviews [class*="overflow-x-auto"]'], ['/ubud-tour.html', '#dsec-reviews [class*="overflow-x-auto"]']]) {
  for (const count of [2, 8]) {
    const { ctx, page, errors } = await open(path, 1280, count);
    const a = await arrows(page, sel);
    ok(a.prev === a.canPrev, `${path} ${count} reviews: Previous shown=${a.prev} but can scroll back=${a.canPrev}`);
    ok(a.next === a.canNext, `${path} ${count} reviews: Next shown=${a.next} but can scroll on=${a.canNext}`);
    if (count === 8) {
      // Scroll to the end: Next must go, Previous must appear.
      await page.evaluate((s) => { const t = document.querySelector(s); t.scrollLeft = t.scrollWidth; }, sel);
      await page.waitForTimeout(500);
      const end = await arrows(page, sel);
      ok(!end.next && end.prev, `${path} at the end: next=${end.next} prev=${end.prev}`);
    }
    ok(errors.length === 0, `${path}: page errors ${errors}`);
    await ctx.close();
  }
}

// Every other slider on the site: arrows match what can scroll, and Next actually moves the row.
for (const path of ['/', '/ubud-tour.html', '/attractions/atv-ride.html']) {
  const { ctx, page, errors } = await open(path, 1280, 8);
  const n = await page.evaluate(() => {
    let k = 0;
    // A slider = a .group.relative holding a sideways track (the arrows' parent).
    document.querySelectorAll('.group.relative').forEach((h) => { const t = [...h.children].find((c) => c.tagName === 'DIV' && /overflow-x-auto/.test(c.className)); if (t) t.setAttribute('data-sweep', String(k++)); });
    return document.querySelectorAll('[data-sweep]').length;
  });
  ok(n > 0, `${path}: no sliders found`);
  process.stdout.write(`${path}: ${n} sliders\n`);
  for (let i = 0; i < n; i++) {
    const sel = `[data-sweep="${i}"]`;
    const visible = await page.evaluate((s) => document.querySelector(s).getBoundingClientRect().width > 0, sel);
    if (!visible) continue;
    const a = await arrows(page, sel);
    ok(a.prev === a.canPrev && a.next === a.canNext, `${path} slider ${i}: arrows ${JSON.stringify(a)}`);
    if (a.next) {
      const before = await page.evaluate((s) => document.querySelector(s).scrollLeft, sel);
      await page.locator(sel).locator('xpath=..').locator(':scope > button[aria-label="Next"]').click();
      await page.waitForTimeout(700);
      const after = await page.evaluate((s) => document.querySelector(s).scrollLeft, sel);
      ok(after > before, `${path} slider ${i}: Next did not scroll (${before} -> ${after})`);
      const b = await arrows(page, sel);
      ok(b.prev === b.canPrev && b.next === b.canNext, `${path} slider ${i} after Next: arrows ${JSON.stringify(b)}`);
    }
  }
  ok(errors.length === 0, `${path}: page errors ${errors}`);
  await ctx.close();
}

// Phones never show arrows (they swipe).
{
  const { ctx, page } = await open('/', 390, 8);
  const shown = await page.evaluate(() => [...document.querySelectorAll('button[aria-label="Next"], button[aria-label="Previous"]')]
    .some((b) => getComputedStyle(b).display !== 'none' && b.getBoundingClientRect().width > 0));
  ok(!shown, '390: an arrow is displayed on a phone');
  await ctx.close();
}

await browser.close();
process.stdout.write(`${pass}/${pass + fail}\n`);
process.exit(fail ? 1 : 0);
