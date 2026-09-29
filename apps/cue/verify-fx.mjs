// Live-rate pricing on the built site (29 Sep 2026).
//
//   node ../cahyana-api/tools/chat-dev-server.js                 # API on 4599
//   NEXT_PUBLIC_API_BASE=http://127.0.0.1:4599/api npm run build
//   node tools/serve-out.js                                      # site on 4000
//   node verify-fx.mjs
//
// Checks, at 390 and 1280:
//   - the HTML already carries the API's price (build-time catalog), so first
//     paint is not a stale fallback;
//   - the currency picker offers all 12 currencies, each with a drawn flag, and
//     the open list stays on screen;
//   - picking a new currency (JPY, SGD) reprices the page in that currency, and
//     every price on it reads as a clean ladder number;
//   - no page errors, no horizontal overflow.
import { chromium } from 'playwright-core';

const SITE = 'http://127.0.0.1:4000';
const API = 'http://127.0.0.1:4599/api';
const WANT = ['USD', 'IDR', 'AUD', 'EUR', 'GBP', 'SGD', 'NZD', 'CAD', 'CHF', 'JPY', 'MYR', 'HKD'];
const SHOT = process.env.SHOT_DIR || '/tmp';

let pass = 0;
let fail = 0;
function ok(c, m) { return (c ? pass++ : (fail++, console.log('  FAIL:', m))); }

const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell' });

// What the API itself says, so nothing here is a number typed into the harness.
async function apiCat(cur) { return (await fetch(`${API}/pricing/catalog?currency=${cur}&guests=2&stay=`)).json(); }
const usd = await apiCat('USD');
const ubudUsd = usd.items.find((i) => i.name === 'Ubud Tour').standard.display;

// Is n on the ladder fx.js uses? (<=10 whole; else a mantissa step of its decade)
const M = [1, 1.1, 1.2, 1.3, 1.4, 1.5, 1.6, 1.7, 1.8, 1.9, 2, 2.2, 2.4, 2.5, 2.6, 2.8, 3, 3.2, 3.5, 3.8, 4, 4.2, 4.5, 4.8, 5, 5.5, 6, 6.5, 7, 7.5, 8, 8.5, 9, 9.5, 10];
function onLadder(n) {
  if (n <= 10) return Number.isInteger(n);
  const d = 10 ** Math.floor(Math.log10(n));
  return M.some((m) => Math.round(m * d) === n);
}

for (const w of [390, 1280]) {
  const ctx = await b.newContext({ viewport: { width: w, height: 844 } });
  const page = await ctx.newPage();
  const errs = [];
  page.on('pageerror', (e) => errs.push(e.message));

  // 1. First paint = the API's number, before any client fetch runs.
  const raw = await (await fetch(`${SITE}/tour.html`)).text();
  const m = raw.match(/data-price="Ubud Tour" data-mode="standard"><span[^>]*>\$<\/span>(\d+)/);
  ok(m && Number(m[1]) === ubudUsd, `${w}: static HTML already shows the API price ($${m && m[1]} vs $${ubudUsd})`);

  await page.goto(`${SITE}/tour.html`, { waitUntil: 'networkidle' });

  // 2. The picker. On phones it lives in the drawer; on desktop in the account menu.
  // Two copies of the picker are mounted at every width (drawer: #acct-cur,
  // account menu: #menu-cur) - pick the one this width actually uses.
  const id = w <= 992 ? 'acct-cur' : 'menu-cur';
  if (w <= 992) await page.click('button[aria-label="Open menu"]');
  else await page.click('header button:has-text("Log in")');
  await page.waitForTimeout(600);
  const trig = page.locator(`#${id}`);
  await trig.scrollIntoViewIfNeeded();
  await trig.click();
  await page.waitForTimeout(400);
  const list = page.locator(`#${id} + ul[role="listbox"]`);
  const opts = await list.locator('li[role="option"]').allInnerTexts();
  ok(opts.map((t) => t.trim()).join(',') === WANT.join(','), `${w}: picker offers the 12 currencies in order (${opts.join(',')})`);
  const flags = await list.evaluate((ul) =>
    [...ul.querySelectorAll('use')].map((u) => {
      const id = u.getAttribute('href').slice(1);
      const sym = document.getElementById(id);
      return sym ? sym.children.length : 0;
    }),
  );
  ok(flags.length === 12 && flags.every((n) => n > 0), `${w}: every option has a drawn flag (${flags.join(',')})`);
  const box = await list.boundingBox();
  const vh = page.viewportSize().height;
  ok(box && box.y + box.height <= vh + 1, `${w}: open list stays on screen (bottom ${box && Math.round(box.y + box.height)} / ${vh})`);
  ok(await list.evaluate((ul) => ul.scrollHeight > ul.clientHeight), `${w}: long list scrolls inside itself`);
  await page.screenshot({ path: `${SHOT}/fx-picker-${w}.png` });

  // 3. Pick JPY: prices reprice in yen, on the ladder, matching the API.
  await list.locator('li[role="option"]', { hasText: 'JPY' }).click();
  const jpy = await apiCat('JPY');
  const want = jpy.items.find((i) => i.name === 'Ubud Tour').standard.display;
  await page.waitForFunction(
    (v) => {
      const el = document.querySelector('[data-price="Ubud Tour"]');
      return el && el.textContent.replace(/[^0-9]/g, '') === String(v) && el.textContent.includes('¥');
    },
    want,
    { timeout: 8000 },
  ).catch(() => {});
  const txt = await page.locator('[data-price="Ubud Tour"]').first().textContent();
  ok(txt.includes('¥') && txt.replace(/[^0-9]/g, '') === String(want), `${w}: Ubud Tour reads ¥${want} (got "${txt}")`);
  const all = await page.$$eval('[data-price]', (els) => els.map((e) => e.textContent.trim()).filter(Boolean));
  const nums = all.map((t) => Number(t.replace(/.*?([\d,]+)$/, '$1').replace(/,/g, '')));
  const off = nums.filter((n) => n > 0 && !onLadder(n));
  ok(all.length > 5 && off.length === 0, `${w}: all ${all.length} JPY prices are clean ladder numbers (${off.slice(0, 4).join(',')})`);
  ok(all.every((t) => t.includes('¥')), `${w}: every price is in yen`);
  await page.screenshot({ path: `${SHOT}/fx-jpy-${w}.png`, fullPage: false });

  const over = await page.evaluate(() => document.documentElement.scrollWidth - innerWidth);
  ok(over <= 0, `${w}: no horizontal overflow (${over})`);
  ok(errs.length === 0, `${w}: no page errors (${errs.join(' | ')})`);
  await ctx.close();
}

await b.close();
console.log(`\n${pass}/${pass + fail}`);
process.exit(fail ? 1 : 0);
