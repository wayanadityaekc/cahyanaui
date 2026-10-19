import { chromium } from 'playwright-core';

const SITE = 'http://127.0.0.1:4000';
const API = 'http://127.0.0.1:4599/api';
const WANT = ['USD', 'IDR', 'AUD', 'EUR', 'GBP', 'SGD', 'NZD', 'CAD', 'CHF', 'JPY', 'MYR', 'HKD'];
const SHOT = process.env.SHOT_DIR || '/tmp';

let pass = 0;
let fail = 0;
function checkAssertion(isPassing, message) {
  return isPassing ? pass++ : (fail++, console.log('  FAIL:', message));
}

const browser = await chromium.launch({
  executablePath: '/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell',
});

async function fetchApiCatalog(current) {
  return (await fetch(`${API}/pricing/catalog?currency=${current}&guests=2&stay=`)).json();
}
const usd = await fetchApiCatalog('USD');
const ubudUsd = usd.items.find((item) => item.name === 'Ubud Tour').standard.display;

const ladderMultipliers = [
  1, 1.1, 1.2, 1.3, 1.4, 1.5, 1.6, 1.7, 1.8, 1.9, 2, 2.2, 2.4, 2.5, 2.6, 2.8, 3, 3.2, 3.5, 3.8, 4, 4.2, 4.5, 4.8, 5,
  5.5, 6, 6.5, 7, 7.5, 8, 8.5, 9, 9.5, 10,
];
function checkIsOnLadder(price) {
  if (price <= 10) return Number.isInteger(price);
  const magnitude = 10 ** Math.floor(Math.log10(price));
  return ladderMultipliers.some((multiplier) => Math.round(multiplier * magnitude) === price);
}

for (const width of [390, 1280]) {
  const browserContext = await browser.newContext({ viewport: { width: width, height: 844 } });
  const page = await browserContext.newPage();
  const errs = [];
  page.on('pageerror', (error) => errs.push(error.message));

  const raw = await (await fetch(`${SITE}/tour.html`)).text();
  const priceMatch = raw.match(/data-price="Ubud Tour" data-mode="standard"><span[^>]*>\$<\/span>(\d+)/);
  checkAssertion(
    priceMatch && Number(priceMatch[1]) === ubudUsd,
    `${width}: static HTML already shows the API price ($${priceMatch && priceMatch[1]} vs $${ubudUsd})`,
  );

  await page.goto(`${SITE}/tour.html`, { waitUntil: 'networkidle' });

  const id = width <= 992 ? 'acct-cur' : 'menu-cur';
  if (width <= 992) await page.click('button[aria-label="Open menu"]');
  else await page.click('header button:has-text("Log in")');
  await page.waitForTimeout(600);
  const trig = page.locator(`#${id}`);
  await trig.scrollIntoViewIfNeeded();
  await trig.click();
  await page.waitForTimeout(400);
  const list = page.locator(`#${id} + ul[role="listbox"]`);
  const options = await list.locator('li[role="option"]').allInnerTexts();
  checkAssertion(
    options.map((opt) => opt.trim()).join(',') === WANT.join(','),
    `${width}: picker offers the 12 currencies in order (${options.join(',')})`,
  );
  const flags = await list.evaluate((listElement) =>
    [...listElement.querySelectorAll('use')].map((useElement) => {
      const id = useElement.getAttribute('href').slice(1);
      const sym = document.getElementById(id);
      return sym ? sym.children.length : 0;
    }),
  );
  checkAssertion(
    flags.length === 12 && flags.every((flag) => flag > 0),
    `${width}: every option has a drawn flag (${flags.join(',')})`,
  );
  const box = await list.boundingBox();
  const vh = page.viewportSize().height;
  checkAssertion(
    box && box.y + box.height <= vh + 1,
    `${width}: open list stays on screen (bottom ${box && Math.round(box.y + box.height)} / ${vh})`,
  );
  checkAssertion(
    await list.evaluate((listElement) => listElement.scrollHeight > listElement.clientHeight),
    `${width}: long list scrolls inside itself`,
  );
  await page.screenshot({ path: `${SHOT}/fx-picker-${width}.png` });

  await list.locator('li[role="option"]', { hasText: 'JPY' }).click();
  const jpy = await fetchApiCatalog('JPY');
  const want = jpy.items.find((item) => item.name === 'Ubud Tour').standard.display;
  await page
    .waitForFunction(
      (expectedValue) => {
        const element = document.querySelector('[data-price="Ubud Tour"]');
        return (
          element &&
          element.textContent.replace(/[^0-9]/g, '') === String(expectedValue) &&
          element.textContent.includes('¥')
        );
      },
      want,
      { timeout: 8000 },
    )
    .catch(() => {});
  const txt = await page.locator('[data-price="Ubud Tour"]').first().textContent();
  checkAssertion(
    txt.includes('¥') && txt.replace(/[^0-9]/g, '') === String(want),
    `${width}: Ubud Tour reads ¥${want} (got "${txt}")`,
  );
  const all = await page.$$eval('[data-price]', (elements) =>
    elements.map((event) => event.textContent.trim()).filter(Boolean),
  );
  const nums = all.map((text) => Number(text.replace(/.*?([\d,]+)$/, '$1').replace(/,/g, '')));
  const off = nums.filter((num) => num > 0 && !checkIsOnLadder(num));
  checkAssertion(
    all.length > 5 && off.length === 0,
    `${width}: all ${all.length} JPY prices are clean ladder numbers (${off.slice(0, 4).join(',')})`,
  );
  checkAssertion(
    all.every((text) => text.includes('¥')),
    `${width}: every price is in yen`,
  );
  await page.screenshot({ path: `${SHOT}/fx-jpy-${width}.png`, fullPage: false });

  const over = await page.evaluate(() => document.documentElement.scrollWidth - innerWidth);
  checkAssertion(over <= 0, `${width}: no horizontal overflow (${over})`);
  checkAssertion(errs.length === 0, `${width}: no page errors (${errs.join(' | ')})`);
  await browserContext.close();
}

await browser.close();
console.log(`\n${pass}/${pass + fail}`);
process.exit(fail ? 1 : 0);
