import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { execSync } from 'node:child_process';
import { chromium } from 'playwright-core';

const ROOT = 'out';
function findShell() {
  try {
    const hit = execSync('ls -d /opt/pw-browsers/*/chrome-linux/headless_shell 2>/dev/null | head -1')
      .toString()
      .trim();
    if (hit) return hit;
  } catch (e) {}
  return '/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell';
}
const EXE = findShell();
const MIME = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'application/javascript',
  '.webp': 'image/webp',
  '.woff2': 'font/woff2',
  '.svg': 'image/svg+xml',
  '.json': 'application/json',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.ico': 'image/x-icon',
  '.txt': 'text/plain',
  '.xml': 'application/xml',
};
function serve(root, port) {
  return new Promise((result) => {
    const httpServer = http.createServer((request, response) => {
      let pathname = decodeURIComponent(request.url.split('?')[0]);
      if (pathname.endsWith('/')) pathname += 'index.html';
      let filePath = path.join(root, pathname);
      if (!fs.existsSync(filePath) && !path.extname(filePath)) filePath = path.join(root, `${pathname}.html`);
      if (!fs.existsSync(filePath)) {
        response.writeHead(404);
        response.end();
        return;
      }
      response.writeHead(200, { 'content-type': MIME[path.extname(filePath)] || 'text/html' });
      response.end(fs.readFileSync(filePath));
    });
    httpServer.listen(port, () => result(httpServer));
  });
}

const port = 8000 + Math.floor(Math.random() * 1500);
const server = await serve(ROOT, port);
const browser = await chromium.launch({ executablePath: EXE });
let pass = 0,
  fail = 0;
function check(label, cond) {
  if (cond) {
    pass++;
    console.log(`OK   ${label}`);
  } else {
    fail++;
    console.log(`FAIL ${label}`);
  }
}

{
  const pg = await browser.newPage({ viewport: { width: 1280, height: 1200 } });
  await pg.goto(`http://localhost:${port}/my-trips.html`, { waitUntil: 'networkidle' });
  await pg.waitForTimeout(300);
  check('TripBar absent on my-trips.html', (await pg.$('#tripbar')) === null);
  await pg.close();
}
{
  const pg = await browser.newPage({ viewport: { width: 1280, height: 1200 } });
  await pg.goto(`http://localhost:${port}/tour.html`, { waitUntil: 'networkidle' });
  await pg.waitForTimeout(300);
  check('TripBar still present on tour.html (control)', (await pg.$('#tripbar')) !== null);
  await pg.close();
}

{
  const pg = await browser.newPage({ viewport: { width: 1280, height: 1200 } });
  await pg.goto(`http://localhost:${port}/my-trips.html`, { waitUntil: 'networkidle' });
  await pg.waitForTimeout(300);
  const fs_ = await pg.evaluate(() => {
    const ps = document.querySelectorAll('[data-mytrips-cart] p');
    return ps[1] ? getComputedStyle(ps[1]).fontSize : null;
  });
  check(`Empty-state hint text uses body size (12.8px), got ${fs_}`, fs_ === '12.8px');
  await pg.close();
}

{
  const pg = await browser.newPage({ viewport: { width: 1280, height: 1200 } });
  await pg.addInitScript(() => {
    try {
      localStorage.setItem(
        'cue_itinerary_v1',
        JSON.stringify({
          days: [{ items: ['Ubud Tour'], itemModes: ['standard'], date: '2026-10-15', guests: '2' }],
          transfers: [{ route: 'Airport - Ubud', date: '2026-10-14', guests: '2' }],
          charters: [],
        }),
      );
    } catch (e) {}
  });
  await pg.goto(`http://localhost:${port}/my-trips.html`, { waitUntil: 'networkidle' });
  await pg.waitForTimeout(500);
  const before = await pg.evaluate(
    () => document.querySelectorAll('[data-mytrips-cart] button[aria-label^="Remove"]').length,
  );
  await pg.locator('[data-mytrips-cart] button[aria-label^="Remove"]').nth(1).click();
  await pg.waitForTimeout(300);
  const after = await pg.evaluate(
    () => document.querySelectorAll('[data-mytrips-cart] button[aria-label^="Remove"]').length,
  );
  const stored = await pg.evaluate(() => JSON.parse(localStorage.getItem('cue_itinerary_v1') || '{}'));
  check(`X button removes a row (before=${before} after=${after})`, before === 2 && after === 1);
  check(
    'Removed row was the transfer, not the tour',
    (stored.transfers || []).length === 0 && (stored.days || []).length === 1,
  );
  await pg.close();
}

{
  const pg = await browser.newPage({ viewport: { width: 1280, height: 1200 } });
  await pg.addInitScript(() => {
    try {
      localStorage.setItem(
        'cue_itinerary_v1',
        JSON.stringify({
          days: [
            { items: [], itemModes: [], date: '' },
            { items: ['Ubud Tour'], itemModes: ['exclusive'], date: '2026-09-18', guests: '2' },
          ],
          transfers: [],
          charters: [],
        }),
      );
    } catch (e) {}
  });
  await pg.goto(`http://localhost:${port}/my-trips.html`, { waitUntil: 'networkidle' });
  await pg.waitForTimeout(500);
  const rowsBefore = await pg.evaluate(
    () => document.querySelectorAll('[data-mytrips-cart] button[aria-label^="Remove"]').length,
  );
  await pg.locator('[data-mytrips-cart] button[aria-label^="Remove"]').first().click();
  await pg.waitForTimeout(300);
  const rowsAfter = await pg.evaluate(
    () => document.querySelectorAll('[data-mytrips-cart] button[aria-label^="Remove"]').length,
  );
  const emptyState = await pg.$('text=Your trip is empty.');
  check(
    `Empty-leading-day scenario: X removes the tour (before=${rowsBefore} after=${rowsAfter})`,
    rowsBefore === 1 && rowsAfter === 0 && emptyState !== null,
  );
  await pg.close();
}

{
  const pg = await browser.newPage({ viewport: { width: 1280, height: 1200 } });
  await pg.goto(`http://localhost:${port}/my-trips.html`, { waitUntil: 'networkidle' });
  await pg.waitForTimeout(300);
  await pg.click('button:has-text("Add a program")');
  await pg.waitForTimeout(300);
  const hrefs = await pg.$$eval('[role="dialog"] a[href]', (as) => as.map((link) => link.getAttribute('href')));
  check(
    `Add-program popup links to the 4 category pages, got ${JSON.stringify(hrefs)}`,
    ['/tour.html', '/activities.html', '/transfer.html', '/charter.html'].every((href) => hrefs.includes(href)),
  );
  const hasCategoryButtons = await pg.$('[role="dialog"] button:has-text("Tour Programs")');
  check('No in-modal category-button step (now direct links)', hasCategoryButtons === null);
  await pg.close();
}

{
  const pg = await browser.newPage({ viewport: { width: 1280, height: 1200 } });
  const postedBookings = [];
  await pg.route('**/bookings/mine', (route) =>
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        upcoming: [
          {
            ref: 'CUE-100',
            name: 'Ubud Tour',
            status: 'confirmed',
            guests: 2,
            start_date: '2026-12-01',
            end_date: '2026-12-01',
            price_usd: 60,
            price_idr: 1050000,
            lines: [],
          },
        ],
        history: [
          {
            ref: 'CUE-050',
            name: 'Tegalalang Rice Terrace',
            status: 'completed',
            guests: 2,
            start_date: '2026-08-01',
            end_date: '2026-08-01',
            price_usd: 55,
            price_idr: 960000,
            lines: [],
            review_items: ['Tegalalang Rice Terrace'],
          },
          {
            ref: 'CUE-040',
            name: 'Uluwatu Sunset Tour',
            status: 'completed',
            guests: 2,
            start_date: '2026-07-15',
            end_date: '2026-07-15',
            price_usd: 65,
            price_idr: 1140000,
            lines: [],
            review_items: ['Uluwatu Sunset Tour'],
          },
        ],
      }),
    }),
  );
  await pg.route('**/reviews', (route) => {
    if (route.request().method() === 'POST') {
      postedBookings.push(JSON.parse(route.request().postData()));
      return route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ ok: true }) });
    }
    return route.continue();
  });
  await pg.addInitScript(() => {
    try {
      localStorage.setItem('cue_token', 'fake-token-for-test');
    } catch (e) {}
  });
  await pg.goto(`http://localhost:${port}/my-trips.html`, { waitUntil: 'networkidle' });
  await pg.click('aside nav button:has-text("Booked Trip")');
  await pg.waitForTimeout(500);
  const cancelLink = await pg.$('a:has-text("Contact us to cancel")');
  check('Booked trip card has a cancellation-contact button', cancelLink !== null);
  const href = cancelLink ? await cancelLink.getAttribute('href') : '';
  check(
    `Cancellation link opens WhatsApp with the booking ref, got ${href}`,
    href.includes('wa.me') && href.includes('CUE-100'),
  );

  await pg.click('aside nav button:has-text("Past Trip")');
  await pg.waitForTimeout(500);
  const reviewBtns = await pg.$$('button:has-text("Leave a Review")');
  check(`Exactly one global "Leave a Review" button on Past tab, got ${reviewBtns.length}`, reviewBtns.length === 1);
  await reviewBtns[0].click();
  await pg.waitForTimeout(400);
  const modalTitle = await pg.$('h3:has-text("Leave a Review")');
  check('Review modal opens', modalTitle !== null);
  const nameField = await pg.$('#rvm-name');
  const countryField = await pg.$('#rvm-country');
  check('Review form has a name field', nameField !== null);
  check('Review form has a country field (Select)', countryField !== null);
  const starRow = await pg.$$('button[aria-label*="star"]');
  check(`Review form has a single 5-star row, got ${starRow.length}`, starRow.length === 5);

  const checkboxes = await pg.$$('input[type="checkbox"]');
  check(`Checklist shows both past-trip items, got ${checkboxes.length}`, checkboxes.length === 2);
  const allChecked = await pg.evaluate(() =>
    [...document.querySelectorAll('input[type="checkbox"]')].every((checkbox) => checkbox.checked),
  );
  check('Both items pre-checked by default', allChecked);

  await pg.fill('#rvm-name', 'Test Guest');
  await pg.click('button[aria-label="5 stars"]');
  await pg.fill('#rvm-message', 'Loved every stop, driver was great.');
  await pg.click('button:has-text("Submit review")');
  await pg.waitForTimeout(600);
  check(`Submitting fanned out to 2 POSTs, got ${postedBookings.length}`, postedBookings.length === 2);
  const refs = postedBookings.map((postedReview) => postedReview.booking_ref).sort();
  check(
    `Both booking refs used, got ${JSON.stringify(refs)}`,
    JSON.stringify(refs) === JSON.stringify(['CUE-040', 'CUE-050']),
  );
  check(
    'Same rating/message reused on both',
    postedBookings.every(
      (postedReview) =>
        postedReview.rating === 5 &&
        postedReview.message === 'Loved every stop, driver was great.' &&
        postedReview.name === 'Test Guest',
    ),
  );
  const thankYou = await pg.$('h3:has-text("Thank you")');
  check('Success screen shown after submit', thankYou !== null);

  await pg.close();
}

await browser.close();
server.close();
console.log(`\n${pass} passed, ${fail} failed`);
process.exit(fail ? 1 : 0);
