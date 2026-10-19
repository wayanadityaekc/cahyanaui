import { chromium } from 'playwright-core';
const BASE = process.argv[2];
let pass = 0,
  fail = 0;
function ok(isPassing, message) {
  if (isPassing) pass++;
  else {
    fail++;
    console.log('  FAIL', message);
  }
}

const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });

for (const width of [390, 1280]) {
  const browserContext = await browser.newContext({ viewport: { width: width, height: 900 } });
  const page = await browserContext.newPage();
  const errs = [];
  page.on('pageerror', (error) => errs.push(String(error)));
  console.log(`\n@${width}`);

  await page.goto(`${BASE}/our-company/`, { waitUntil: 'load' });
  await page.waitForTimeout(400);
  const tabs = await page.$$eval('button, a', (elements) => elements.map((event) => event.textContent.trim()));
  ok(tabs.includes('Booking Terms'), `${width} Our Company has a Booking Terms tab`);
  ok(tabs.includes('Cancellation'), `${width} Our Company has a Cancellation tab`);

  let text = '';
  for (const sectionId of ['terms', 'cancellation']) {
    await page.goto(`${BASE}/our-company/#${sectionId}`, { waitUntil: 'load' });
    await page.waitForTimeout(350);
    text += `\n${await page.evaluate(() => document.body.innerText)}`;
  }
  ok(/full when you book|in full when you book/i.test(text), `${width} it says payment is in full`);
  ok(/no deposit-only option/i.test(text), `${width} and that there is no deposit-only option`);
  ok(/30 days or more/i.test(text) && /full refund/i.test(text), `${width} 30+ days is a full refund`);
  ok(/7 to 30 days/i.test(text) && /50% refund/i.test(text), `${width} 7-30 days is 50%`);
  ok(/less than 7 days/i.test(text) && /no refund/i.test(text), `${width} inside 7 days is no refund`);
  ok(/2:00 PM/.test(text) && /11:00 AM/.test(text), `${width} check-in 2:00 PM and check-out 11:00 AM`);

  const NUMBERS = /(\d+)(?=\s*(?:to\s*\d+\s*)?\s*days?\b)/gi;
  const seen = new Set();
  for (const pagePath of ['/our-company/#terms', '/our-company/#cancellation', '/villas/cahyana-house/', '/']) {
    await page.goto(BASE + pagePath, { waitUntil: 'load' });
    await page.waitForTimeout(250);
    const pageText = await page.evaluate(() => document.body.innerText);
    for (const numberMatch of pageText.matchAll(NUMBERS)) seen.add(numberMatch[1]);
  }
  const extra = [...seen].filter((number) => !['7', '30'].includes(number));
  ok(extra.length === 0, `${width} only 7 and 30 day windows appear anywhere (${JSON.stringify([...seen])})`);

  await page.goto(`${BASE}/villas/cahyana-house/`, { waitUntil: 'load' });
  await page.waitForTimeout(400);
  const aside = await page.locator('aside').first().innerText();
  ok(/Paid in full at booking/i.test(aside), `${width} the booking panel states payment in full`);
  ok(/Check-in from 2:00 PM/i.test(aside), `${width} and the check-in time`);
  ok(/Cancellation policy/i.test(aside), `${width} and links to the policy`);

  const asideTours = ['Ubud Tour', 'Ubud Culture Day', 'Private Car Charter', 'Airport Transfer'];
  for (const tourName of asideTours) ok(aside.includes(tourName), `${width} the booking flow offers ${tourName}`);
  ok(/Explore more tours in Bali/i.test(aside), `${width} and links out for the rest`);
  const cueLinks = await page.locator('aside a[href*="cahyanaubudexperience.com"]').count();
  ok(cueLinks >= 5, `${width} the tour links point at the sister site (${cueLinks})`);
  ok(!/Kecak|Rafting|Mount Batur|Bali Zoo/i.test(aside), `${width} and not the whole catalog`);

  await page.goto(`${BASE}/`, { waitUntil: 'load' });
  await page.waitForTimeout(400);
  const home = await page.evaluate(() => document.body.innerText);
  ok(/Add to your reservation/i.test(home), `${width} the homepage frames add-ons as part of the reservation`);
  for (const addOnName of ['Airport pickup', 'Spa & Massage', 'A day with a driver']) {
    ok(home.includes(addOnName), `${width} homepage add-on: ${addOnName}`);
  }
  ok(/More to do in Bali/i.test(home), `${width} homepage has the explore-more band`);

  await page.goto(`${BASE}/villas/cahyana-house/`, { waitUntil: 'load' });
  await page.waitForTimeout(400);
  const grid = page.locator('[data-photogrid]');
  ok((await grid.count()) === 1, `${width} the photo grid is mounted once`);
  ok((await grid.getAttribute('data-photogrid')) === 'closed', `${width} and starts closed`);
  await page.locator('[data-mosaic-tile]:visible').first().click();
  await page.waitForTimeout(500);
  const state = await page.evaluate(() => {
    const element = document.querySelector('[data-photogrid]');
    const box = element.getBoundingClientRect();
    const images = element.querySelectorAll('img');
    const chrome = element.querySelectorAll('button');
    return {
      open: element.dataset.photogrid,
      full: Math.round(box.width) === innerWidth && Math.round(box.height) === innerHeight,
      photos: images.length,
      controls: chrome.length,
      scrollable: element.querySelector('.overflow-y-auto') !== null,
      bodyLocked: getComputedStyle(document.body).overflow === 'hidden',
    };
  });
  ok(state.open === 'open', `${width} tapping the photo opens it`);
  ok(state.full, `${width} it covers the whole screen`);
  ok(state.photos >= 4, `${width} every photo is in the grid (${state.photos})`);
  ok(state.controls === 1, `${width} the ONLY control drawn over the photos is close (${state.controls})`);
  ok(state.scrollable, `${width} the grid scrolls`);
  ok(state.bodyLocked, `${width} the page behind it does not`);
  await page.keyboard.press('Escape');
  await page.waitForTimeout(400);
  ok((await grid.getAttribute('data-photogrid')) === 'closed', `${width} Escape closes it`);

  ok(errs.length === 0, `${width} no page errors: ${errs.join(' | ')}`);
  await browserContext.close();
}
await browser.close();
console.log(`\n${pass}/${pass + fail}`);
process.exit(fail ? 1 : 0);
