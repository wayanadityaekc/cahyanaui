import { chromium } from '/home/user/CUE/node_modules/playwright-core/index.mjs';

const BASE = process.env.BASE || 'http://localhost:4000';
let pass = 0,
  fail = 0;
function recordCheck(isPassing, message) {
  isPassing ? pass++ : (fail++, console.log('  FAIL:', message));
}

const ON_SALE = 'Ubud Tour';
const SALE = 40,
  LIST = 45;

function buildCatalog(symbol) {
  const current = symbol === 'Rp' ? 'IDR' : 'USD';
  function convertPrice(usd) {
    return symbol === 'Rp' ? usd * 17600 : usd;
  }
  function buildCatalogItem(name, price, list) {
    return {
      name,
      standard: { display: convertPrice(price) },
      listStandard: { display: convertPrice(list == null ? price : list) },
      exclusive: null,
      listExclusive: null,
      hasExclusive: false,
    };
  }
  return {
    symbol,
    currency: current,
    promo: { pct: 10, endsOn: '2099-01-01', label: 'Low season' },
    items: [
      buildCatalogItem(ON_SALE, SALE, LIST),
      buildCatalogItem('Ubud Culture Day', 49),
      buildCatalogItem('East Bali Tour', 52),
      buildCatalogItem('Rafting Adventure', 66),
      buildCatalogItem('ATV Adventure', 72),
    ],
    transfers: [{ route: 'Airport – Ubud', display: convertPrice(26) }],
    charters: [
      { duration: 'half', display: convertPrice(35) },
      { duration: 'full', display: convertPrice(57) },
      { duration: 'long', display: convertPrice(64) },
    ],
  };
}

const browser = await chromium.launch({
  executablePath: process.env.CHROME || '/opt/pw-browsers/chromium-1194/chrome-linux/chrome',
});

for (const symbol of ['$', 'Rp']) {
  for (const width of [390, 1280]) {
    const browserContext = await browser.newContext({ viewport: { width: width, height: 900 } });
    await browserContext.routeWebSocket(/\/ws\//, (ws) => ws.close());
    await browserContext.route('**/api/pricing/catalog*', (route) =>
      route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(buildCatalog(symbol)) }),
    );
    if (symbol === 'Rp') {
      await browserContext.addInitScript(() => {
        try {
          localStorage.setItem('cue_currency', 'IDR');
        } catch (e) {}
      });
    }

    for (const path of ['/tour.html', '/ubud-tour.html']) {
      const page = await browserContext.newPage();
      const errs = [];
      page.on('pageerror', (error) => errs.push(error.message));
      await page.goto(BASE + path, { waitUntil: 'load' });
      await page
        .waitForFunction(
          (name) => {
            const element = document.querySelector(`[data-price="${name}"]`);
            return element && element.querySelector('[data-price-was]');
          },
          ON_SALE,
          { timeout: 15000 },
        )
        .catch(() => {});

      const read = await page.evaluate((name) => {
        const out = { sale: null, others: 0, othersWithStrike: 0 };
        document.querySelectorAll('[data-price]').forEach((element) => {
          const was = element.querySelector('[data-price-was]');
          if (element.getAttribute('data-price') === name) {
            if (!out.sale && was) {
              const cs = getComputedStyle(was);
              const parent = getComputedStyle(element);
              out.sale = {
                text: element.textContent.trim(),
                wasText: was.textContent.trim(),
                line: cs.textDecorationLine,
                colour: cs.color,
                muted: getComputedStyle(document.documentElement).getPropertyValue('--color-muted').trim(),
                size: parseFloat(cs.fontSize),
                parentSize: parseFloat(parent.fontSize),
                weight: cs.fontWeight,
                first: element.firstElementChild === was,
              };
            }
          } else {
            out.others += 1;
            if (was) out.othersWithStrike += 1;
          }
        });
        return out;
      }, ON_SALE);

      const tag = `${symbol}/${width}${path}`;
      recordCheck(!!read.sale, `${tag}: the item on sale shows no struck-through price`);
      if (read.sale) {
        const saleReading = read.sale;
        recordCheck(
          saleReading.line.includes('line-through'),
          `${tag}: the old price is not struck through (${saleReading.line})`,
        );
        recordCheck(saleReading.first, `${tag}: the old price is rendered after the new one`);
        recordCheck(
          saleReading.size < saleReading.parentSize,
          `${tag}: the old price is not smaller (${saleReading.size} vs ${saleReading.parentSize})`,
        );
        recordCheck(
          saleReading.weight === '400',
          `${tag}: the old price is bold (${saleReading.weight}) and competes with the real one`,
        );
        function extractDigits(text) {
          return text.replace(/[^\d]/g, '');
        }
        recordCheck(extractDigits(saleReading.wasText).length > 0, `${tag}: the struck element has no number in it`);
        recordCheck(
          extractDigits(saleReading.text).length > extractDigits(saleReading.wasText).length,
          `${tag}: the sale price is missing next to the struck one`,
        );
      }
      recordCheck(read.others > 0, `${tag}: no other prices on the page - this case proves nothing`);
      recordCheck(
        read.othersWithStrike === 0,
        `${tag}: ${read.othersWithStrike} price(s) NOT on sale were struck through anyway`,
      );

      const over = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
      recordCheck(over <= 0, `${tag}: page overflows by ${over}px`);
      recordCheck(errs.length === 0, `${tag}: page errors ${errs.join(' | ')}`);
      await page.close();
    }
    await browserContext.close();
  }
}

{
  const plain = buildCatalog('$');
  plain.promo = null;
  plain.items.forEach((item) => {
    item.listStandard = { display: item.standard.display };
  });
  const browserContext = await browser.newContext({ viewport: { width: 390, height: 900 } });
  await browserContext.routeWebSocket(/\/ws\//, (ws) => ws.close());
  await browserContext.route('**/api/pricing/catalog*', (route) =>
    route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(plain) }),
  );
  for (const path of ['/tour.html', '/ubud-tour.html', '/index.html']) {
    const page = await browserContext.newPage();
    await page.goto(BASE + path, { waitUntil: 'load' });
    await page.waitForTimeout(1200);
    const struckPriceCount = await page.$$eval('[data-price-was]', (event) => event.length);
    recordCheck(
      struckPriceCount === 0,
      `no sale ${path}: ${struckPriceCount} struck-through price(s) with nothing on sale`,
    );
    await page.close();
  }
  await browserContext.close();
}

await browser.close();
console.log(`${pass}/${pass + fail}`);
