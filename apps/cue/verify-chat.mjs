import { chromium } from '/home/user/CUE/node_modules/playwright-core/index.mjs';

const BASE = process.env.BASE || 'http://localhost:4000';
let pass = 0, fail = 0;
const ok = (c, m) => { c ? pass++ : (fail++, console.log('  FAIL:', m)); };

// The catalog must be stubbed or every price is an em dash and the price
// assertions measure a state no guest ever sees. Default currency is USD since
// 24 Sep 2026, so the symbol is '$'.
const CATALOG = {
  symbol: '$', currency: 'USD',
  items: [
    { name: 'Ubud Tour', standard: { display: '$40' }, exclusive: null, hasExclusive: false },
    { name: 'Ubud Culture Day', standard: { display: '$49' }, exclusive: null, hasExclusive: false },
    { name: 'Rafting Adventure', standard: { display: '$66' }, exclusive: null, hasExclusive: false },
    { name: 'ATV Adventure', standard: { display: '$72' }, exclusive: null, hasExclusive: false },
    { name: 'East Bali Tour', standard: { display: '$52' }, exclusive: null, hasExclusive: false },
  ],
  transfers: [{ route: 'Airport – Ubud', display: '$26', usd: 26, idr: 450000 }],
  charters: [
    { duration: 'half', display: '$35' },
    { duration: 'full', display: '$57' },
    { duration: 'long', display: '$64' },
  ],
};

const b = await chromium.launch({
  executablePath: process.env.CHROME || '/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell',
});

const PAGES = ['/index.html', '/tour.html', '/ubud-tour.html'];

for (const w of [390, 768, 1280]) {
  const ctx = await b.newContext({ viewport: { width: w, height: 880 } });
  await ctx.route('**/api/pricing/catalog*', (r) =>
    r.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(CATALOG) }));

  for (const path of PAGES) {
    const page = await ctx.newPage();
    const errs = [];
    // One hydration warning on the homepage predates this work: measured on a
    // build with the chat removed entirely, /index.html raises React #418 at 390
    // and 1280 while /tour.html is clean on both. Excluded by signature so this
    // gate still fails on any NEW page error, which is the point of having it.
    const KNOWN = /Minified React error #418/;
    page.on('pageerror', (e) => { if (!KNOWN.test(String(e))) errs.push(String(e)); });
    await page.goto(BASE + path, { waitUntil: 'networkidle' });

    const btn = page.locator('button[aria-label="Chat with us"]');
    ok(await btn.count() === 1, `${w}${path}: expected exactly 1 chat button, got ${await btn.count()}`);
    ok(await btn.isVisible(), `${w}${path}: chat button not visible`);

    // The panel is lazy: nothing of it exists until the button is pressed.
    // That is what keeps the listings dataset out of every page's bundle.
    ok(await page.locator('[role=dialog][aria-label="Cahyana Support"]').count() === 0,
       `${w}${path}: chat panel is in the DOM before it was opened`);

    await btn.click();
    const panel = page.locator('[role=dialog][aria-label="Cahyana Support"]');
    await panel.waitFor({ state: 'visible', timeout: 10000 });

    const box = await panel.boundingBox();
    if (w <= 768) {
      ok(Math.abs(box.width - w) <= 1, `${w}${path}: phone sheet should span the width, got ${box.width}`);
      ok(Math.abs(box.y + box.height - 880) <= 1, `${w}${path}: phone sheet should sit on the bottom edge`);
    } else {
      // Desktop is a full-height drawer off the right edge, like the navbar menu.
      ok(box.width >= 340 && box.width <= 420, `${w}${path}: drawer width ${box.width}`);
      ok(Math.abs(box.x + box.width - w) <= 1, `${w}${path}: drawer is not flush to the right edge`);
      ok(Math.abs(box.height - 880) <= 1, `${w}${path}: drawer is not full height (${box.height})`);
      ok(Math.abs(box.y) <= 1, `${w}${path}: drawer does not start at the top`);
    }

    // The suggested questions are what make this read as support.
    const chips = panel.locator('button:below(p)').filter({ hasText: /\?$/ });
    const chipCount = await panel.getByRole('button', { name: /\?$/ }).count();
    ok(chipCount >= 5, `${w}${path}: expected the suggestion chips, found ${chipCount}`);

    // Tap one: it must read back as the guest's own words, then get answered.
    await panel.getByRole('button', { name: 'How much is a day tour?' }).click();
    await panel.getByText('Day tours are priced per car', { exact: false })
      .waitFor({ state: 'visible', timeout: 10000 });
    const body = await panel.innerText();
    ok(body.includes('How much is a day tour?'), `${w}${path}: the tapped question is not shown as the guest's message`);
    ok(/\$\d/.test(body), `${w}${path}: a price answer with no price in it`);

    // Off topic: declines politely, offers what it CAN do, and quotes nothing.
    const input = panel.getByLabel('Your question');
    await input.fill('who won the world cup');
    await input.press('Enter');
    await panel.getByText('I can only help with Cahyana', { exact: false })
      .waitFor({ state: 'visible', timeout: 10000 });

    // A situation, not a lookup: must reach a person, not a price list.
    //
    // BOTH phrasings are probed on purpose. "wheelchair" is already caught by the
    // topic threshold, so testing only that one let the whole human-question guard
    // be deleted with this gate still reporting 126/126 - measured. The elderly
    // phrasing is the one that actually depends on the guard.
    //
    // And each probe COUNTS the handoff replies rather than waiting for the text
    // to be present: after the first handoff that sentence is already on screen,
    // so a plain waitFor passes even when the second question was answered with a
    // price list. That is how the first version of this check passed against a
    // deliberately broken build.
    const handoffs = () => panel.getByText('better answered by Wayan', { exact: false }).count();
    for (const q of ['my wife is in a wheelchair, can she do the tour',
                     'my mother is elderly, how much walking is there']) {
      const before = await handoffs();
      await input.fill(q);
      await input.press('Enter');
      let after = before;
      for (let i = 0; i < 40 && after === before; i += 1) {
        await page.waitForTimeout(150);
        after = await handoffs();
      }
      ok(after > before, `${w}${path}: "${q}" did not reach a person`);
    }

    const hand = panel.getByRole('link', { name: /Connect with Wayan/ });
    ok(await hand.count() >= 1, `${w}${path}: no way to reach Wayan after a handoff`);
    const href = await hand.last().getAttribute('href');
    ok(/wa\.me\/\d/.test(href || ''), `${w}${path}: handoff link goes nowhere (${href})`);

    // Nothing the guest could read as a quote for that question.
    const after = await panel.innerText();
    const tail = after.slice(after.indexOf('elderly'));
    ok(!/\$\d/.test(tail), `${w}${path}: a price was quoted in answer to a question about walking`);

    const over = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
    ok(over <= 0, `${w}${path}: page overflows by ${over}px`);

    await page.keyboard.press('Escape');
    await page.waitForTimeout(400);
    ok(!(await panel.isVisible()), `${w}${path}: Escape did not close the panel`);

    ok(errs.length === 0, `${w}${path}: page errors ${errs.join(' | ')}`);
    if (path === '/index.html') await page.screenshot({ path: `${process.env.SP}/chat-${w}.png` });
    await page.close();
  }
  await ctx.close();
}

await b.close();
console.log(`${pass}/${pass + fail}`);
process.exit(fail ? 1 : 0);
