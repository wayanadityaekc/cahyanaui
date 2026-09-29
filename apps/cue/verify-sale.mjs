import { chromium } from '/home/user/CUE/node_modules/playwright-core/index.mjs';

// The seasonal sale, as a guest sees it. The server side is pinned by
// promo-test.js in cahyana-api; this is only about what reaches the screen.
//
// THE RULE BEING TESTED is "strike it through only when the two numbers really
// differ" - not "a sale is running". A card that crosses a number out because a
// flag was set somewhere is exactly the invented discount BookBar deliberately
// refused to copy from GetYourGuide.
const BASE = process.env.BASE || 'http://localhost:4000';
let pass = 0, fail = 0;
function ok(c, m) { c ? pass++ : (fail++, console.log('  FAIL:', m)); }

// One item on sale, the rest not - so both branches are exercised on the same
// page, in the same render, with the same code.
const ON_SALE = 'Ubud Tour';
const SALE = 40, LIST = 45;

function catalogFor(symbol) {
  const cur = symbol === 'Rp' ? 'IDR' : 'USD';
  function n(usd) { return (symbol === 'Rp' ? usd * 17600 : usd); }
  function item(name, price, list) {
    return ({
      name,
      standard: { display: n(price) },
      listStandard: { display: n(list == null ? price : list) },
      exclusive: null, listExclusive: null, hasExclusive: false,
    });
  }
  return {
    symbol, currency: cur,
    promo: { pct: 10, endsOn: '2099-01-01', label: 'Low season' },
    items: [
      item(ON_SALE, SALE, LIST),
      item('Ubud Culture Day', 49),
      item('East Bali Tour', 52),
      item('Rafting Adventure', 66),
      item('ATV Adventure', 72),
    ],
    transfers: [{ route: 'Airport – Ubud', display: n(26) }],
    charters: [{ duration: 'half', display: n(35) }, { duration: 'full', display: n(57) }, { duration: 'long', display: n(64) }],
  };
}

const b = await chromium.launch({
  executablePath: process.env.CHROME || '/opt/pw-browsers/chromium-1194/chrome-linux/chrome',
});

for (const symbol of ['$', 'Rp']) {
  for (const w of [390, 1280]) {
    const ctx = await b.newContext({ viewport: { width: w, height: 900 } });
    await ctx.routeWebSocket(/\/ws\//, (ws) => ws.close());
    await ctx.route('**/api/pricing/catalog*', (r) =>
      r.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(catalogFor(symbol)) }));
    if (symbol === 'Rp') {
      await ctx.addInitScript(() => { try { localStorage.setItem('cue_currency', 'IDR'); } catch {} });
    }

    for (const path of ['/tour.html', '/ubud-tour.html']) {
      const page = await ctx.newPage();
      const errs = [];
      page.on('pageerror', (e) => errs.push(e.message));
      await page.goto(BASE + path, { waitUntil: 'load' });
      // Wait for the catalog to land - before it does every price is its build-time
      // fallback and there is nothing to strike through.
      await page.waitForFunction((name) => {
        const el = document.querySelector(`[data-price="${name}"]`);
        return el && el.querySelector('[data-price-was]');
      }, ON_SALE, { timeout: 15000 }).catch(() => {});

      const read = await page.evaluate((name) => {
        const out = { sale: null, others: 0, othersWithStrike: 0 };
        document.querySelectorAll('[data-price]').forEach((el) => {
          const was = el.querySelector('[data-price-was]');
          if (el.getAttribute('data-price') === name) {
            if (!out.sale && was) {
              const cs = getComputedStyle(was);
              const parent = getComputedStyle(el);
              out.sale = {
                text: el.textContent.trim(),
                wasText: was.textContent.trim(),
                line: cs.textDecorationLine,
                colour: cs.color,
                muted: getComputedStyle(document.documentElement).getPropertyValue('--color-muted').trim(),
                size: parseFloat(cs.fontSize),
                parentSize: parseFloat(parent.fontSize),
                weight: cs.fontWeight,
                // The struck number must come FIRST: it is what the price used
                // to be, and reading it after the new one inverts the sentence.
                first: el.firstElementChild === was,
              };
            }
          } else {
            out.others += 1;
            if (was) out.othersWithStrike += 1;
          }
        });
        return out;
      }, ON_SALE);

      const tag = `${symbol}/${w}${path}`;
      ok(!!read.sale, `${tag}: the item on sale shows no struck-through price`);
      if (read.sale) {
        const s = read.sale;
        ok(s.line.includes('line-through'), `${tag}: the old price is not struck through (${s.line})`);
        ok(s.first, `${tag}: the old price is rendered after the new one`);
        ok(s.size < s.parentSize, `${tag}: the old price is not smaller (${s.size} vs ${s.parentSize})`);
        ok(s.weight === '400', `${tag}: the old price is bold (${s.weight}) and competes with the real one`);
        // Both numbers on screen, and the cheaper one is the one NOT struck.
        function digits(t) { return t.replace(/[^\d]/g, ''); }
        ok(digits(s.wasText).length > 0, `${tag}: the struck element has no number in it`);
        ok(digits(s.text).length > digits(s.wasText).length, `${tag}: the sale price is missing next to the struck one`);
      }
      ok(read.others > 0, `${tag}: no other prices on the page - this case proves nothing`);
      ok(read.othersWithStrike === 0,
         `${tag}: ${read.othersWithStrike} price(s) NOT on sale were struck through anyway`);

      const over = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
      ok(over <= 0, `${tag}: page overflows by ${over}px`);
      ok(errs.length === 0, `${tag}: page errors ${errs.join(' | ')}`);
      await page.close();
    }
    await ctx.close();
  }
}

// ---- no sale running: not one struck number anywhere ----------------------
{
  const plain = catalogFor('$');
  plain.promo = null;
  plain.items.forEach((i) => { i.listStandard = { display: i.standard.display }; });
  const ctx = await b.newContext({ viewport: { width: 390, height: 900 } });
  await ctx.routeWebSocket(/\/ws\//, (ws) => ws.close());
  await ctx.route('**/api/pricing/catalog*', (r) =>
    r.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(plain) }));
  for (const path of ['/tour.html', '/ubud-tour.html', '/index.html']) {
    const page = await ctx.newPage();
    await page.goto(BASE + path, { waitUntil: 'load' });
    await page.waitForTimeout(1200);
    const n = await page.$$eval('[data-price-was]', (e) => e.length);
    ok(n === 0, `no sale ${path}: ${n} struck-through price(s) with nothing on sale`);
    await page.close();
  }
  await ctx.close();
}

await b.close();
console.log(`${pass}/${pass + fail}`);
