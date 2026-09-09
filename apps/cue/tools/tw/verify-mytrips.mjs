// Functional verification for the My Trips revamp (not a diff=0 migration -
// this is new/changed behavior, so verify by interaction, not computed-style diff).
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { execSync } from 'node:child_process';
import { chromium } from 'playwright-core';

const ROOT = 'out';
function findShell() {
  try { const hit = execSync('ls -d /opt/pw-browsers/*/chrome-linux/headless_shell 2>/dev/null | head -1').toString().trim(); if (hit) return hit; } catch {}
  return '/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell';
}
const EXE = findShell();
const MIME = { '.html': 'text/html', '.css': 'text/css', '.js': 'application/javascript', '.webp': 'image/webp', '.woff2': 'font/woff2', '.svg': 'image/svg+xml', '.json': 'application/json', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.png': 'image/png', '.ico': 'image/x-icon', '.txt': 'text/plain', '.xml': 'application/xml' };
function serve(root, port) {
  return new Promise((res) => {
    const s = http.createServer((q, r) => {
      let p = decodeURIComponent(q.url.split('?')[0]);
      if (p.endsWith('/')) p += 'index.html';
      let f = path.join(root, p);
      if (!fs.existsSync(f) && !path.extname(f)) f = path.join(root, p + '.html');
      if (!fs.existsSync(f)) { r.writeHead(404); r.end(); return; }
      r.writeHead(200, { 'content-type': MIME[path.extname(f)] || 'text/html' });
      r.end(fs.readFileSync(f));
    });
    s.listen(port, () => res(s));
  });
}

const port = 8000 + Math.floor(Math.random() * 1500);
const s = await serve(ROOT, port);
const b = await chromium.launch({ executablePath: EXE });
let pass = 0, fail = 0;
const check = (label, cond) => { if (cond) { pass++; console.log(`OK   ${label}`); } else { fail++; console.log(`FAIL ${label}`); } };

// ---- 1) TripBar gone on my-trips, present on another page ----
{
  const pg = await b.newPage({ viewport: { width: 1280, height: 1200 } });
  await pg.goto(`http://localhost:${port}/my-trips.html`, { waitUntil: 'networkidle' });
  await pg.waitForTimeout(300);
  check('TripBar absent on my-trips.html', (await pg.$('#tripbar')) === null);
  await pg.close();
}
{
  const pg = await b.newPage({ viewport: { width: 1280, height: 1200 } });
  await pg.goto(`http://localhost:${port}/tour.html`, { waitUntil: 'networkidle' });
  await pg.waitForTimeout(300);
  check('TripBar still present on tour.html (control)', (await pg.$('#tripbar')) !== null);
  await pg.close();
}

// ---- 2) Text style: hint/explanation paragraph uses body-text size (not 16px default) ----
{
  const pg = await b.newPage({ viewport: { width: 1280, height: 1200 } });
  await pg.goto(`http://localhost:${port}/my-trips.html`, { waitUntil: 'networkidle' });
  await pg.waitForTimeout(300);
  const fs_ = await pg.evaluate(() => {
    // The empty-state has 2 <p>: the bold lead ("Your trip is empty.", intentionally
    // larger) and the hint/explanation sub-line right after it - the one this fix targets.
    const ps = document.querySelectorAll('[data-mytrips-cart] p');
    return ps[1] ? getComputedStyle(ps[1]).fontSize : null;
  });
  check(`Empty-state hint text uses body size (12.8px), got ${fs_}`, fs_ === '12.8px');
  await pg.close();
}

// ---- 3) Delete (X) button actually removes a transfer/charter row (the reported bug) ----
{
  const pg = await b.newPage({ viewport: { width: 1280, height: 1200 } });
  await pg.addInitScript(() => {
    try {
      localStorage.setItem('cue_itinerary_v1', JSON.stringify({
        days: [{ items: ['Ubud Tour'], itemModes: ['standard'], date: '2026-10-15', guests: '2' }],
        transfers: [{ route: 'Airport - Ubud', date: '2026-10-14', guests: '2' }],
        charters: [],
      }));
    } catch {}
  });
  await pg.goto(`http://localhost:${port}/my-trips.html`, { waitUntil: 'networkidle' });
  await pg.waitForTimeout(500);
  const before = await pg.evaluate(() => document.querySelectorAll('[data-mytrips-cart] button[aria-label^="Remove"]').length);
  // Remove the SECOND row (the transfer) - this is exactly the case that was broken
  // (global rows-index spliced into the wrong local array). Locator .nth() = position
  // among ALL matches (unlike CSS :nth-of-type, which counts per-parent siblings and
  // never matches here since each button is alone within its own item wrapper).
  await pg.locator('[data-mytrips-cart] button[aria-label^="Remove"]').nth(1).click();
  await pg.waitForTimeout(300);
  const after = await pg.evaluate(() => document.querySelectorAll('[data-mytrips-cart] button[aria-label^="Remove"]').length);
  const stored = await pg.evaluate(() => JSON.parse(localStorage.getItem('cue_itinerary_v1') || '{}'));
  check(`X button removes a row (before=${before} after=${after})`, before === 2 && after === 1);
  check('Removed row was the transfer, not the tour', (stored.transfers || []).length === 0 && (stored.days || []).length === 1);
  await pg.close();
}

// ---- 4) Add Program picker: single-step, links straight to the category pages ----
{
  const pg = await b.newPage({ viewport: { width: 1280, height: 1200 } });
  await pg.goto(`http://localhost:${port}/my-trips.html`, { waitUntil: 'networkidle' });
  await pg.waitForTimeout(300);
  await pg.click('button:has-text("Add a program")');
  await pg.waitForTimeout(300);
  const hrefs = await pg.$$eval('[role="dialog"] a[href]', (as) => as.map((a) => a.getAttribute('href')));
  check(`Add-program popup links to the 4 category pages, got ${JSON.stringify(hrefs)}`,
    ['/tour.html', '/activities.html', '/transfer.html', '/charter.html'].every((h) => hrefs.includes(h)));
  // No in-modal item list left (old flow rendered plain <button> items after a category click).
  const hasCategoryButtons = await pg.$('[role="dialog"] button:has-text("Tour Programs")');
  check('No in-modal category-button step (now direct links)', hasCategoryButtons === null);
  await pg.close();
}

// ---- 5) Booked trip card shows a cancellation-contact button (mocked booking data) ----
{
  const pg = await b.newPage({ viewport: { width: 1280, height: 1200 } });
  const posted = [];
  await pg.route('**/bookings/mine', (route) => route.fulfill({
    status: 200,
    contentType: 'application/json',
    body: JSON.stringify({
      upcoming: [{ ref: 'CUE-100', name: 'Ubud Tour', status: 'confirmed', guests: 2, start_date: '2026-12-01', end_date: '2026-12-01', price_usd: 60, price_idr: 1050000, lines: [] }],
      // TWO separate past bookings, each with a reviewable item - the exact case
      // Wayan asked for: pick across MULTIPLE past trips in one review flow.
      history: [
        { ref: 'CUE-050', name: 'Tegalalang Rice Terrace', status: 'completed', guests: 2, start_date: '2026-08-01', end_date: '2026-08-01', price_usd: 55, price_idr: 960000, lines: [], review_items: ['Tegalalang Rice Terrace'] },
        { ref: 'CUE-040', name: 'Uluwatu Sunset Tour', status: 'completed', guests: 2, start_date: '2026-07-15', end_date: '2026-07-15', price_usd: 65, price_idr: 1140000, lines: [], review_items: ['Uluwatu Sunset Tour'] },
      ],
    }),
  }));
  await pg.route('**/reviews', (route) => {
    if (route.request().method() === 'POST') {
      posted.push(JSON.parse(route.request().postData()));
      return route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ ok: true }) });
    }
    return route.continue();
  });
  await pg.addInitScript(() => { try { localStorage.setItem('cue_token', 'fake-token-for-test'); } catch {} });
  await pg.goto(`http://localhost:${port}/my-trips.html`, { waitUntil: 'networkidle' });
  await pg.click('button[role="tab"]:has-text("Booked Trip")');
  await pg.waitForTimeout(500);
  const cancelLink = await pg.$('a:has-text("Contact us to cancel")');
  check('Booked trip card has a cancellation-contact button', cancelLink !== null);
  const href = cancelLink ? await cancelLink.getAttribute('href') : '';
  check(`Cancellation link opens WhatsApp with the booking ref, got ${href}`, href.includes('wa.me') && href.includes('CUE-100'));

  // ---- 6) Past tab: single global "Leave a Review" (no per-card button) ----
  await pg.click('button[role="tab"]:has-text("Past Trip")');
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

  // Multi-select checklist across the 2 different past bookings, both pre-checked.
  const checkboxes = await pg.$$('input[type="checkbox"]');
  check(`Checklist shows both past-trip items, got ${checkboxes.length}`, checkboxes.length === 2);
  const allChecked = await pg.evaluate(() => [...document.querySelectorAll('input[type="checkbox"]')].every((c) => c.checked));
  check('Both items pre-checked by default', allChecked);

  // Fill + submit: ONE rating/message should fan out as 2 separate POSTs, one per
  // (booking_ref, service) pair - exactly what "dibagi ke semua review yang dicentang" asks.
  await pg.fill('#rvm-name', 'Test Guest');
  await pg.click('button[aria-label="5 stars"]');
  await pg.fill('#rvm-message', 'Loved every stop, driver was great.');
  await pg.click('button:has-text("Submit review")');
  await pg.waitForTimeout(600);
  check(`Submitting fanned out to 2 POSTs, got ${posted.length}`, posted.length === 2);
  const refs = posted.map((p) => p.booking_ref).sort();
  check(`Both booking refs used, got ${JSON.stringify(refs)}`, JSON.stringify(refs) === JSON.stringify(['CUE-040', 'CUE-050']));
  check('Same rating/message reused on both', posted.every((p) => p.rating === 5 && p.message === 'Loved every stop, driver was great.' && p.name === 'Test Guest'));
  const thankYou = await pg.$('h3:has-text("Thank you")');
  check('Success screen shown after submit', thankYou !== null);

  await pg.close();
}

await b.close();
s.close();
console.log(`\n${pass} passed, ${fail} failed`);
process.exit(fail ? 1 : 0);
