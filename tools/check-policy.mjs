// The policy numbers, the gallery and the cross-sell. Policy is checked as a
// RULE - the figures a guest reads must be the ones in content/policies.js, and
// must be the same wherever they appear. A site that states two refund windows
// is worse than one that states none.
import { chromium } from 'playwright-core';
const BASE = process.argv[2];
let pass = 0, fail = 0;
const ok = (c, m) => { if (c) pass++; else { fail++; console.log('  FAIL', m); } };

const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });

for (const w of [390, 1280]) {
  const ctx = await browser.newContext({ viewport: { width: w, height: 900 } });
  const page = await ctx.newPage();
  const errs = [];
  page.on('pageerror', (e) => errs.push(String(e)));
  console.log(`\n@${w}`);

  // ---- policy: stated, and stated once ------------------------------------
  await page.goto(BASE + '/our-company/', { waitUntil: 'load' });
  await page.waitForTimeout(400);
  const tabs = await page.$$eval('button, a', (els) => els.map((e) => e.textContent.trim()));
  ok(tabs.includes('Booking Terms'), `${w} Our Company has a Booking Terms tab`);
  ok(tabs.includes('Cancellation'), `${w} Our Company has a Cancellation tab`);

  // Our Company keeps all six sections in the DOM and hides five with the
  // `hidden` attribute, so innerText reads only the open one. Open each tab by
  // its hash. CUE documents this exact trap: "halaman yang sectionnya di-hidden
  // WAJIB dibuka lewat hash".
  let text = '';
  for (const h of ['terms', 'cancellation']) {
    await page.goto(`${BASE}/our-company/#${h}`, { waitUntil: 'load' });
    await page.waitForTimeout(350);
    text += '\n' + await page.evaluate(() => document.body.innerText);
  }
  ok(/full when you book|in full when you book/i.test(text), `${w} it says payment is in full`);
  ok(/no deposit-only option/i.test(text), `${w} and that there is no deposit-only option`);
  ok(/30 days or more/i.test(text) && /full refund/i.test(text), `${w} 30+ days is a full refund`);
  ok(/7 to 30 days/i.test(text) && /50% refund/i.test(text), `${w} 7-30 days is 50%`);
  ok(/less than 7 days/i.test(text) && /no refund/i.test(text), `${w} inside 7 days is no refund`);
  ok(/2:00 PM/.test(text) && /11:00 AM/.test(text), `${w} check-in 2:00 PM and check-out 11:00 AM`);

  // no OTHER refund window anywhere on the site
  // EVERY number attached to "day"/"days", not just the one next to "before":
  // "14 to 30 days before" only has one number touching the word, so the
  // narrower pattern read 30 and missed the 14. Tested by drifting a band.
  const NUMBERS = /(\d+)(?=\s*(?:to\s*\d+\s*)?\s*days?\b)/gi;
  const seen = new Set();
  for (const p of ['/our-company/#terms', '/our-company/#cancellation', '/villas/cahyana-house/', '/']) {
    await page.goto(BASE + p, { waitUntil: 'load' });
    await page.waitForTimeout(250);
    const t = await page.evaluate(() => document.body.innerText);
    for (const m of t.matchAll(NUMBERS)) seen.add(m[1]);
  }
  const extra = [...seen].filter((n) => !['7', '30'].includes(n));
  ok(extra.length === 0, `${w} only 7 and 30 day windows appear anywhere (${JSON.stringify([...seen])})`);

  // ---- the terms travel with the booking ----------------------------------
  await page.goto(BASE + '/villas/cahyana-house/', { waitUntil: 'load' });
  await page.waitForTimeout(400);
  const aside = await page.locator('aside').first().innerText();
  ok(/Paid in full at booking/i.test(aside), `${w} the booking panel states payment in full`);
  ok(/Check-in from 2:00 PM/i.test(aside), `${w} and the check-in time`);
  ok(/Cancellation policy/i.test(aside), `${w} and links to the policy`);

  // ---- cross-sell ---------------------------------------------------------
  const asideTours = ['Ubud Tour', 'Ubud Culture Day', 'Private Car Charter', 'Airport Transfer'];
  for (const t of asideTours) ok(aside.includes(t), `${w} the booking flow offers ${t}`);
  ok(/Explore more tours in Bali/i.test(aside), `${w} and links out for the rest`);
  const cueLinks = await page.locator('aside a[href*="cahyanaubudexperience.com"]').count();
  ok(cueLinks >= 5, `${w} the tour links point at the sister site (${cueLinks})`);
  // NOT the whole catalog
  ok(!/Kecak|Rafting|Mount Batur|Bali Zoo/i.test(aside), `${w} and not the whole catalog`);

  await page.goto(BASE + '/', { waitUntil: 'load' });
  await page.waitForTimeout(400);
  const home = await page.evaluate(() => document.body.innerText);
  ok(/Add to your reservation/i.test(home), `${w} the homepage frames add-ons as part of the reservation`);
  for (const a of ['Airport pickup', 'Spa & Massage', 'A day with a driver']) {
    ok(home.includes(a), `${w} homepage add-on: ${a}`);
  }
  ok(/More to do in Bali/i.test(home), `${w} homepage has the explore-more band`);

  // ---- gallery: full screen, no chrome ------------------------------------
  await page.goto(BASE + '/villas/cahyana-house/', { waitUntil: 'load' });
  await page.waitForTimeout(400);
  const grid = page.locator('[data-photogrid]');
  ok(await grid.count() === 1, `${w} the photo grid is mounted once`);
  ok(await grid.getAttribute('data-photogrid') === 'closed', `${w} and starts closed`);
  await page.locator('button[aria-label*="View all"]').first().click();
  await page.waitForTimeout(500);
  const state = await page.evaluate(() => {
    const el = document.querySelector('[data-photogrid]');
    const r = el.getBoundingClientRect();
    const imgs = el.querySelectorAll('img');
    const chrome = el.querySelectorAll('button');
    return {
      open: el.dataset.photogrid,
      full: Math.round(r.width) === innerWidth && Math.round(r.height) === innerHeight,
      photos: imgs.length,
      controls: chrome.length,
      scrollable: el.querySelector('.overflow-y-auto') !== null,
      bodyLocked: getComputedStyle(document.body).overflow === 'hidden',
    };
  });
  ok(state.open === 'open', `${w} tapping the photo opens it`);
  ok(state.full, `${w} it covers the whole screen`);
  ok(state.photos >= 4, `${w} every photo is in the grid (${state.photos})`);
  ok(state.controls === 1, `${w} the ONLY control drawn over the photos is close (${state.controls})`);
  ok(state.scrollable, `${w} the grid scrolls`);
  ok(state.bodyLocked, `${w} the page behind it does not`);
  await page.keyboard.press('Escape');
  await page.waitForTimeout(400);
  ok(await grid.getAttribute('data-photogrid') === 'closed', `${w} Escape closes it`);

  ok(errs.length === 0, `${w} no page errors: ${errs.join(' | ')}`);
  await ctx.close();
}
await browser.close();
console.log(`\n${pass}/${pass + fail}`);
process.exit(fail ? 1 : 0);
