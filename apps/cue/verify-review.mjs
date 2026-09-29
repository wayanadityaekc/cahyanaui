// The review popup, in the browser, on the built pages.
//
// What is being pinned: a submit that partly succeeds must SAY so. It used to
// throw on the first refusal, so reviews already published were reported as a
// single red error - the guest read "nothing happened", tried again, and got
// "you've already submitted a review for this tour".
// Run it against the BUILT pages, not `next dev`:
//   npm run build && npm run serve   (port 4000)
//   node verify-review.mjs
import { chromium } from '/home/user/CUE/node_modules/playwright-core/index.mjs';

const BASE = 'http://127.0.0.1:4000';
let pass = 0, fail = 0;
function ok(c, m) { c ? pass++ : (fail++, console.log('  FAIL:', m)); }

const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell' });

// Two past bookings the account may review. The SECOND is refused by the server
// (something changed between the page loading and the submit) - the case that
// used to hide the first one's success.
const MINE = {
  upcoming: [],
  history: [
    { ref: 'CUE-100', name: 'Ubud Tour', start_date: '2026-08-20', end_date: '2026-08-20',
      guests: '2', price_usd: 40, price_idr: 700000, status: 'new', upcoming: false,
      review_items: ['Ubud Tour'], lines: [{ type: 'tour', service: 'Ubud Tour', date: '2026-08-20', guests: '2' }] },
    { ref: 'CUE-103', name: 'Kecak Dance', start_date: '2026-08-18', end_date: '2026-08-18',
      guests: '2', price_usd: 12, price_idr: 200000, status: 'paid', upcoming: false,
      review_items: ['Kecak Dance'], lines: [{ type: 'tour', service: 'Kecak Dance', date: '2026-08-18', guests: '2' }] },
  ],
};

for (const w of [390, 1280]) {
  for (const mode of ['all-ok', 'partial']) {
    const ctx = await b.newContext({ viewport: { width: w, height: 900 } });
    const page = await ctx.newPage();
    const errs = [];
    page.on('pageerror', (e) => errs.push(String(e)));

    const posted = [];
    // What the server has accepted, so /bookings/mine answers the way the real
    // one does: a reviewed trip stops being offered.
    const reviewed = new Set();
    let mineHits = 0;
    // ONE branching handler. A catch-all registered later wins in Playwright, so
    // separate route() calls for /api/** would swallow the specific ones.
    await ctx.route('**/api/**', async (route) => {
      const url = route.request().url();
      if (url.includes('/account/me') || url.includes('/account/session')) {
        return route.fulfill({ json: { status: 'ok', account: { id: 7, name: 'Anna', email: 'a@e.com' } } });
      }
      if (url.includes('/bookings/mine')) {
        mineHits += 1;
        const history = MINE.history.map((t) => ({ ...t,
          review_items: t.review_items.filter((svc) => !reviewed.has(t.ref + '::' + svc)) }));
        return route.fulfill({ json: { ...MINE, history } });
      }
      if (url.includes('/reviews') && route.request().method() === 'POST') {
        const body = JSON.parse(route.request().postData() || '{}');
        posted.push(body.service);
        const refuse = mode === 'partial' && body.booking_ref === 'CUE-103';
        if (!refuse) reviewed.add(body.booking_ref + '::' + body.service);
        return route.fulfill({ json: refuse
          ? { ok: false, reason: "This booking isn't confirmed yet, so there's nothing to review." }
          : { ok: true } });
      }
      if (url.includes('/reviews')) return route.fulfill({ json: [] });
      if (url.includes('/pricing/catalog')) return route.fulfill({ json: { currency: 'USD', symbol: '$', catalog: {} } });
      return route.fulfill({ json: {} });
    });

    await page.addInitScript(() => {
      localStorage.setItem('cue_token', 'tok-anna');
    });

    await page.goto(BASE + '/my-trips.html', { waitUntil: 'networkidle' });

    // Open the popup from Past trips.
    if (w < 1024) {
      const back = page.locator('button:visible', { hasText: /^(Back|My trips)$/i }).first();
      if (await back.count()) await back.click().catch(() => {});
    }
    const pastTab = page.locator('button:visible', { hasText: 'Past' }).first();
    if (await pastTab.count()) await pastTab.click();
    const trigger = page.locator('button:visible', { hasText: /Write review|Leave a Review/i }).first();
    ok(await trigger.count() > 0, `${w}/${mode}: no review trigger on Past trips`);
    if (!(await trigger.count())) { await ctx.close(); continue; }
    await trigger.click();

    const modal = page.locator('#modal-form, [data-step="write"]').first();
    await page.locator('[data-step="write"]').waitFor({ timeout: 10000 });

    // Both trips offered and pre-ticked.
    const boxes = page.locator('[data-step="write"] input[type=checkbox]');
    ok(await boxes.count() === 2, `${w}/${mode}: expected 2 trips ticked, got ${await boxes.count()}`);

    await page.locator('[data-step="write"] button[aria-label="5 stars"]').click();
    await page.fill('#rvm-message', 'Driver was early and the day ran exactly as described.');
    await page.locator('[data-step="write"] button', { hasText: /Submit review/ }).click();

    await page.waitForFunction(() => !document.querySelector('[data-step="write"]') ||
      !!document.querySelector('[data-step="write"] p.text-err'), { timeout: 10000 });

    const shell = page.locator('div.fixed.inset-0').filter({ hasText: 'Leave a Review' }).last();
    const txt = await shell.innerText();
    ok(/Leave a Review/.test(txt), `${w}/${mode}: HARNESS READ THE WRONG BOX`);
    // EVERY ticked trip is attempted, not just up to the first refusal.
    ok(posted.length === 2, `${w}/${mode}: ${posted.length} of 2 reviews were attempted`);

    if (mode === 'all-ok') {
      ok(/Thank you/.test(txt), `${w}/${mode}: no thank-you after a clean submit`);
      ok(/live on the site/.test(txt), `${w}/${mode}: success text does not say the review is live`);
      ok(!/once approved/.test(txt), `${w}/${mode}: STALE COPY - still promises approval that never comes`);
      ok(!/could not be included/.test(txt), `${w}/${mode}: a clean submit reported a failure`);
    } else {
      ok(/Thank you/.test(txt), `${w}/${mode}: the review that WAS published is hidden behind an error`);
      ok(/could not be included/.test(txt), `${w}/${mode}: the refused trip is not mentioned at all`);
      ok(/Kecak Dance/.test(txt), `${w}/${mode}: the refused trip is not named`);
      ok(/isn't confirmed yet/.test(txt), `${w}/${mode}: the server's reason is not passed on`);
      ok(!/Ubud Tour/.test(txt.split('could not be included')[1] || ''),
         `${w}/${mode}: the trip that SUCCEEDED is listed as a failure`);
    }

    // Close, then look again. Before refreshTrips the list was read once per page
    // load, so a trip reviewed a moment ago was still offered - tick it again and
    // the gate answered "you've already submitted a review for this tour".
    const hitsBefore = mineHits;
    await shell.locator('button', { hasText: 'Done' }).click();
    await page.waitForFunction(() => !document.querySelector('[data-step="write"]'), { timeout: 5000 }).catch(() => {});
    await page.waitForTimeout(600);
    ok(mineHits > hitsBefore, `${w}/${mode}: closing the popup did not re-read My Trips`);
    const again = page.locator('button:visible', { hasText: /Write review|Leave a Review/i }).first();
    if (mode === 'all-ok') {
      ok(await again.count() === 0, `${w}/${mode}: every trip is reviewed but the review button is still there`);
    } else {
      ok(await again.count() > 0, `${w}/${mode}: the trip that was NOT reviewed lost its button`);
      if (await again.count()) {
        await again.click();
        await page.locator('[data-step="write"]').waitFor({ timeout: 10000 });
        // With one trip left the popup shows no checklist at all, so reading its
        // text proves nothing. What it SENDS is the truth.
        const n = posted.length;
        await page.locator('[data-step="write"] button[aria-label="5 stars"]').click();
        await page.fill('#rvm-message', 'Second try for the one that was left.');
        await page.locator('[data-step="write"] button', { hasText: /Submit review/ }).click();
        await page.waitForTimeout(800);
        const sentNow = posted.slice(n);
        ok(!sentNow.includes('Ubud Tour'), `${w}/${mode}: THE TRIP JUST REVIEWED WAS SENT AGAIN`);
        ok(sentNow.length === 1 && sentNow[0] === 'Kecak Dance', `${w}/${mode}: second submit sent ${JSON.stringify(sentNow)}`);
      }
    }

    // The page must not grow sideways with the modal open.
    const over = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
    ok(over <= 0, `${w}/${mode}: page overflows by ${over}px`);
    ok(errs.length === 0, `${w}/${mode}: page errors ${errs.join(' | ')}`);

    await page.screenshot({ path: `shots/rv-${mode}-${w}.png` });
    await ctx.close();
  }
}

await b.close();
console.log(`${pass}/${pass + fail}`);
process.exit(fail ? 1 : 0);
