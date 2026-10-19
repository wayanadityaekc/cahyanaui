import { chromium } from '/home/user/CUE/node_modules/playwright-core/index.mjs';

const BASE = 'http://127.0.0.1:4000';
let pass = 0,
  fail = 0;
function recordCheck(isPassing, message) {
  isPassing ? pass++ : (fail++, console.log('  FAIL:', message));
}

const browser = await chromium.launch({
  executablePath: '/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell',
});

const MINE = {
  upcoming: [],
  history: [
    {
      ref: 'CUE-100',
      name: 'Ubud Tour',
      start_date: '2026-08-20',
      end_date: '2026-08-20',
      guests: '2',
      price_usd: 40,
      price_idr: 700000,
      status: 'new',
      upcoming: false,
      review_items: ['Ubud Tour'],
      lines: [{ type: 'tour', service: 'Ubud Tour', date: '2026-08-20', guests: '2' }],
    },
    {
      ref: 'CUE-103',
      name: 'Kecak Dance',
      start_date: '2026-08-18',
      end_date: '2026-08-18',
      guests: '2',
      price_usd: 12,
      price_idr: 200000,
      status: 'paid',
      upcoming: false,
      review_items: ['Kecak Dance'],
      lines: [{ type: 'tour', service: 'Kecak Dance', date: '2026-08-18', guests: '2' }],
    },
  ],
};

for (const width of [390, 1280]) {
  for (const mode of ['all-ok', 'partial']) {
    const browserContext = await browser.newContext({ viewport: { width: width, height: 900 } });
    const page = await browserContext.newPage();
    const errs = [];
    page.on('pageerror', (error) => errs.push(String(error)));

    const posted = [];
    const reviewed = new Set();
    let mineHits = 0;
    await browserContext.route('**/api/**', async (route) => {
      const url = route.request().url();
      if (url.includes('/account/me') || url.includes('/account/session')) {
        return route.fulfill({ json: { status: 'ok', account: { id: 7, name: 'Anna', email: 'a@e.com' } } });
      }
      if (url.includes('/bookings/mine')) {
        mineHits += 1;
        const history = MINE.history.map((trip) => ({
          ...trip,
          review_items: trip.review_items.filter((svc) => !reviewed.has(`${trip.ref}::${svc}`)),
        }));
        return route.fulfill({ json: { ...MINE, history } });
      }
      if (url.includes('/reviews') && route.request().method() === 'POST') {
        const body = JSON.parse(route.request().postData() || '{}');
        posted.push(body.service);
        const shouldRefuse = mode === 'partial' && body.booking_ref === 'CUE-103';
        if (!shouldRefuse) reviewed.add(`${body.booking_ref}::${body.service}`);
        return route.fulfill({
          json: shouldRefuse
            ? { ok: false, reason: "This booking isn't confirmed yet, so there's nothing to review." }
            : { ok: true },
        });
      }
      if (url.includes('/reviews')) return route.fulfill({ json: [] });
      if (url.includes('/pricing/catalog'))
        return route.fulfill({ json: { currency: 'USD', symbol: '$', catalog: {} } });
      return route.fulfill({ json: {} });
    });

    await page.addInitScript(() => {
      localStorage.setItem('cue_token', 'tok-anna');
    });

    await page.goto(`${BASE}/my-trips.html`, { waitUntil: 'networkidle' });

    if (width < 1024) {
      const back = page.locator('button:visible', { hasText: /^(Back|My trips)$/i }).first();
      if (await back.count()) await back.click().catch(() => {});
    }
    const pastTab = page.locator('button:visible', { hasText: 'Past' }).first();
    if (await pastTab.count()) await pastTab.click();
    const trigger = page.locator('button:visible', { hasText: /Write review|Leave a Review/i }).first();
    recordCheck((await trigger.count()) > 0, `${width}/${mode}: no review trigger on Past trips`);
    if (!(await trigger.count())) {
      await browserContext.close();
      continue;
    }
    await trigger.click();

    const modal = page.locator('#modal-form, [data-step="write"]').first();
    await page.locator('[data-step="write"]').waitFor({ timeout: 10000 });

    const boxes = page.locator('[data-step="write"] input[type=checkbox]');
    recordCheck((await boxes.count()) === 2, `${width}/${mode}: expected 2 trips ticked, got ${await boxes.count()}`);

    await page.locator('[data-step="write"] button[aria-label="5 stars"]').click();
    await page.fill('#rvm-message', 'Driver was early and the day ran exactly as described.');
    await page.locator('[data-step="write"] button', { hasText: /Submit review/ }).click();

    await page.waitForFunction(
      () =>
        !document.querySelector('[data-step="write"]') || !!document.querySelector('[data-step="write"] p.text-err'),
      { timeout: 10000 },
    );

    const shell = page.locator('div.fixed.inset-0').filter({ hasText: 'Leave a Review' }).last();
    const txt = await shell.innerText();
    recordCheck(/Leave a Review/.test(txt), `${width}/${mode}: HARNESS READ THE WRONG BOX`);
    recordCheck(posted.length === 2, `${width}/${mode}: ${posted.length} of 2 reviews were attempted`);

    if (mode === 'all-ok') {
      recordCheck(/Thank you/.test(txt), `${width}/${mode}: no thank-you after a clean submit`);
      recordCheck(/live on the site/.test(txt), `${width}/${mode}: success text does not say the review is live`);
      recordCheck(
        !/once approved/.test(txt),
        `${width}/${mode}: STALE COPY - still promises approval that never comes`,
      );
      recordCheck(!/could not be included/.test(txt), `${width}/${mode}: a clean submit reported a failure`);
    } else {
      recordCheck(/Thank you/.test(txt), `${width}/${mode}: the review that WAS published is hidden behind an error`);
      recordCheck(/could not be included/.test(txt), `${width}/${mode}: the refused trip is not mentioned at all`);
      recordCheck(/Kecak Dance/.test(txt), `${width}/${mode}: the refused trip is not named`);
      recordCheck(/isn't confirmed yet/.test(txt), `${width}/${mode}: the server's reason is not passed on`);
      recordCheck(
        !/Ubud Tour/.test(txt.split('could not be included')[1] || ''),
        `${width}/${mode}: the trip that SUCCEEDED is listed as a failure`,
      );
    }

    const hitsBefore = mineHits;
    await shell.locator('button', { hasText: 'Done' }).click();
    await page.waitForFunction(() => !document.querySelector('[data-step="write"]'), { timeout: 5000 }).catch(() => {});
    await page.waitForTimeout(600);
    recordCheck(mineHits > hitsBefore, `${width}/${mode}: closing the popup did not re-read My Trips`);
    const again = page.locator('button:visible', { hasText: /Write review|Leave a Review/i }).first();
    if (mode === 'all-ok') {
      recordCheck(
        (await again.count()) === 0,
        `${width}/${mode}: every trip is reviewed but the review button is still there`,
      );
    } else {
      recordCheck((await again.count()) > 0, `${width}/${mode}: the trip that was NOT reviewed lost its button`);
      if (await again.count()) {
        await again.click();
        await page.locator('[data-step="write"]').waitFor({ timeout: 10000 });
        const postedCount = posted.length;
        await page.locator('[data-step="write"] button[aria-label="5 stars"]').click();
        await page.fill('#rvm-message', 'Second try for the one that was left.');
        await page.locator('[data-step="write"] button', { hasText: /Submit review/ }).click();
        await page.waitForTimeout(800);
        const sentNow = posted.slice(postedCount);
        recordCheck(!sentNow.includes('Ubud Tour'), `${width}/${mode}: THE TRIP JUST REVIEWED WAS SENT AGAIN`);
        recordCheck(
          sentNow.length === 1 && sentNow[0] === 'Kecak Dance',
          `${width}/${mode}: second submit sent ${JSON.stringify(sentNow)}`,
        );
      }
    }

    const over = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
    recordCheck(over <= 0, `${width}/${mode}: page overflows by ${over}px`);
    recordCheck(errs.length === 0, `${width}/${mode}: page errors ${errs.join(' | ')}`);

    await page.screenshot({ path: `shots/rv-${mode}-${width}.png` });
    await browserContext.close();
  }
}

await browser.close();
console.log(`${pass}/${pass + fail}`);
process.exit(fail ? 1 : 0);
