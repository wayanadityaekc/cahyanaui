import { chromium } from '/home/user/CUE/node_modules/playwright-core/index.mjs';

const BASE = process.env.BASE || 'http://localhost:4000';
let pass = 0, fail = 0;
const ok = (c, m) => { c ? pass++ : (fail++, console.log('  FAIL:', m)); };

// Waits for text, but returns false instead of throwing. A thrown timeout ends
// the run and hides every later assertion - which is how the first version of
// this gate reported a disabled poll as a crash rather than as a failure.
// The panel opens on the intro now. Every path has to cross it, and crossing
// it the same way everywhere keeps the rest of the gate about the chat rather
// than about the form.
async function enterChat() { /* nothing to cross: the chat opens straight away */ }

async function seen(root, text, ms) {
  try {
    await root.getByText(text, { exact: false }).first().waitFor({ state: 'visible', timeout: ms });
    return true;
  } catch { return false; }
}

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
  // The chat now opens a WebSocket once a thread exists. Every context here
  // stubs the HTTP routes, so leaving the socket alone would send it to the LIVE
  // API over the internet - slow, flaky, and it would mean these assertions
  // depended on production being up. Refused instead, which is also the case
  // worth checking: with no socket the panel falls back to polling, and
  // everything below has to pass exactly as it did before any of this existed.
  // The socket's own behaviour is verify-live.mjs's job.
  const ctx = await b.newContext({ viewport: { width: w, height: 880 } });
  await ctx.routeWebSocket(/\/ws\//, (ws) => ws.close());
  await ctx.route('**/api/pricing/catalog*', (r) =>
    r.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(CATALOG) }));

  // In this pass the handover is made to FAIL on purpose. Two reasons:
  //
  // 1. A successful handover stores the thread, and the next page in the same
  //    context would then correctly be talking to Wayan instead of answering -
  //    which broke the canned-answer checks on working code, twice.
  // 2. It is worth testing. A guest whose handover cannot reach the server must
  //    be told, not left looking at a line that says "give me a moment" forever.
  //
  // The happy path gets its own context at the end of each width.
  await ctx.route('**/api/chat/**', (r) =>
    r.fulfill({ status: 503, contentType: 'application/json', body: JSON.stringify({ status: 'error', detail: 'Could not reach Wayan just now.' }) }));

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

    // ---- a guest can chat, and is offered a way in ----
    ok(await panel.getByLabel('Your question').count() === 1, `${w}${path}: a guest cannot type`);
    ok(await panel.locator('[data-signin]').count() === 1, `${w}${path}: no sign-in offered to a guest`);
    ok(await panel.getByText('Chatting as a guest', { exact: false }).count() === 1,
       `${w}${path}: nothing says they are chatting as a guest`);
    if (path === PAGES[0]) {
      await panel.locator('[data-signin]').click();
      ok(await seen(page.locator('[role=dialog][aria-label="Sign in"]').last(), 'Sign in', 6000),
         `${w}${path}: the sign-in button does not open the sign-in`);
      await page.keyboard.press('Escape');
      await page.waitForTimeout(300);
    }
    // The offer is an offer: nothing is blocked behind it.
    ok(await panel.getByRole('button', { name: 'How much is a day tour?' }).count() === 1,
       `${w}${path}: the suggestions are gated behind signing in`);

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

    // ---- the buttons, against the site's own contract ----
    // verify-btnsm.mjs CANNOT see any of these. It censuses what is on screen at
    // page load, and this panel only mounts after a tap - so six new buttons
    // shipped without ever meeting BTN_SM. Two of them were 14.8px and 16px tall
    // against a 33.6px standard: nothing overrode the height, they were squashed,
    // because a flex item in a scrolling column shrinks by default.
    const std = await page.evaluate(() => {
      const el = document.createElement('div');
      el.style.cssText = 'height:var(--btn-h);font-size:var(--text-small);border-radius:var(--radius-sm)';
      document.body.appendChild(el);
      const cs = getComputedStyle(el);
      const out = { h: parseFloat(cs.height), fs: parseFloat(cs.fontSize), r: parseFloat(cs.borderRadius) };
      el.remove();
      return out;
    });
    const ctas = await panel.evaluate((root) => [...root.querySelectorAll('[data-cta]')].map((el) => {
      const r = el.getBoundingClientRect(); const cs = getComputedStyle(el);
      const label = (el.innerText || el.getAttribute('aria-label') || '').trim();
      return { label, words: label ? label.split(/\s+/).length : 0, h: r.height,
        fs: parseFloat(cs.fontSize), rad: parseFloat(cs.borderTopLeftRadius),
        pt: parseFloat(cs.paddingTop), pb: parseFloat(cs.paddingBottom) };
    }), await panel.elementHandle());
    ok(ctas.length >= 2, `${w}${path}: expected action buttons in the panel, found ${ctas.length}`);
    for (const c of ctas) {
      ok(Math.abs(c.h - std.h) < 0.5, `${w}${path}: "${c.label}" is ${c.h}px, not ${std.h}`);
      ok(c.fs === std.fs, `${w}${path}: "${c.label}" font ${c.fs}, not ${std.fs}`);
      ok(c.rad === std.r, `${w}${path}: "${c.label}" radius ${c.rad}, not ${std.r}`);
      ok(c.pt === 0 && c.pb === 0, `${w}${path}: "${c.label}" has vertical padding`);
      // The site's 1-2 word rule. Chips are exempt - they are questions.
      ok(c.words <= 2, `${w}${path}: "${c.label}" is ${c.words} words, the rule is 2`);
    }

    // One control height in the panel: the chips keep the pill, not a fourth size.
    const chipBox = await panel.evaluate((root) => [...root.querySelectorAll('[data-chip]')].map((el) => {
      const cs = getComputedStyle(el);
      return { h: el.getBoundingClientRect().height, fs: parseFloat(cs.fontSize), rad: parseFloat(cs.borderTopLeftRadius) };
    }), await panel.elementHandle());
    for (const c of chipBox) {
      ok(Math.abs(c.h - std.h) < 0.5, `${w}${path}: a chip is ${c.h}px, not ${std.h}`);
      ok(c.fs === std.fs, `${w}${path}: a chip font is ${c.fs}, not ${std.fs}`);
      ok(c.rad > 100, `${w}${path}: a chip lost its pill shape (${c.rad})`);
    }

    // Anything new has to declare what it is, or this fails.
    const stray = await panel.evaluate((root) =>
      [...root.querySelectorAll('button')].filter((el) =>
        !el.hasAttribute('data-cta') && !el.hasAttribute('data-chip') &&
        el.getAttribute('aria-label') !== 'Close chat').length,
      await panel.elementHandle());
    ok(stray === 0, `${w}${path}: ${stray} button(s) in the panel are neither an action nor a chip`);

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
    const handoffs = () => panel.getByText('Give me a moment', { exact: false }).count();
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

    // Nothing is asked before the handover any more - it connects on the spot.
    ok(await panel.getByText('Give me a moment', { exact: false }).count() >= 1,
       `${w}${path}: the guest is not told they are being connected`);
    ok(await panel.locator('input[type=email]').count() === 0,
       `${w}${path}: an email is being asked for before the handover`);
    // The server is refusing here. That must be said out loud.
    ok(await seen(panel, 'Could not reach Wayan', 8000),
       `${w}${path}: a handover that failed left the guest waiting silently`);

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

  // ---- the whole handover loop, in a browser of its own ----
  // Its own context on purpose: a handed-over guest keeps the thread in
  // localStorage, so reusing the context above would leave every later page
  // talking to Wayan instead of answering. That is the product working; it just
  // cannot share a browser with the checks that expect canned answers.
  {
    const hctx = await b.newContext({ viewport: { width: w, height: 880 } });
    await hctx.routeWebSocket(/\/ws\//, (ws) => ws.close());
    await hctx.route('**/api/pricing/catalog*', (r) =>
      r.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(CATALOG) }));
    const chat = { started: [], sent: [], reply: null, id: 'a'.repeat(48) };
    const acct = [];
    await hctx.route('**/api/account', async (r) => {
      acct.push(JSON.parse(r.request().postData() || '{}'));
      return r.fulfill({ status: 200, contentType: 'application/json',
        body: JSON.stringify({ status: 'ok', token: 'stub-token', account: { name: 'Hannah', email: 'hannah@example.com' } }) });
    });
    await hctx.route('**/api/chat/**', async (r) => {
      const req = r.request();
      const url = new URL(req.url());
      const json = (x) => r.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(x) });
      if (req.method() === 'POST' && url.pathname.endsWith('/chat/start')) {
        chat.started.push(JSON.parse(req.postData() || '{}'));
        return json({ status: 'ok', thread: chat.id });
      }
      if (req.method() === 'POST' && url.pathname.endsWith('/message')) {
        chat.sent.push(JSON.parse(req.postData() || '{}'));
        return json({ status: 'ok', message: { id: 10 + chat.sent.length, sender: 'guest', body: '', created_at: new Date().toISOString() } });
      }
      const all = chat.reply
        ? [{ id: 99, sender: 'owner', body: chat.reply, created_at: new Date().toISOString() }]
        : [];
      const since = Number(url.searchParams.get('since') || 0);
      return json({ status: 'ok', thread: chat.id, messages: all.filter((m) => m.id > since) });
    });

    const page = await hctx.newPage();
    const errs = [];
    const KNOWN = /Minified React error #418/;
    page.on('pageerror', (e) => { if (!KNOWN.test(String(e))) errs.push(String(e)); });
    await page.goto(BASE + '/index.html', { waitUntil: 'networkidle' });
    await page.locator('button[aria-label="Chat with us"]').click();
    const panel = page.locator('[role=dialog][aria-label="Cahyana Support"]');
    await panel.waitFor({ state: 'visible', timeout: 10000 });
    const input = panel.getByLabel('Your question');

    await input.fill('my mother is elderly, how much walking is there');
    await input.press('Enter');
    ok(await seen(panel, 'Give me a moment', 10000), `${w}: the guest is not told they are being connected`);
    ok(await seen(panel, 'You are with Wayan now', 10000), `${w}: the handover never completed`);

    ok(chat.started.length === 1, `${w}: expected one handover, got ${chat.started.length}`);
    const started = chat.started[0];
    ok(/walking/.test(started.question || ''), `${w}: the guest's actual question was not passed on`);
    ok(started.page === '/index.html', `${w}: Wayan is not told which page they were on`);
    // Nothing was asked before connecting - that is the whole point of this
    // change: no name, no email, no form in front of the question.
    // A guest handover carries no identity, which is exactly why the email is
    // offered afterwards.
    ok(!started.email && !started.name, `${w}: a guest handover carried contact details from nowhere`);

    // The panel says who is reading now, and when to expect an answer.
    const afterSend = await panel.innerText();
    ok(/talking to Wayan/.test(afterSend), `${w}: nothing says the conversation moved to a person`);
    ok(/Bali time/.test(afterSend), `${w}: the guest is not told when Wayan answers`);

    // Typing now goes to Wayan, not to the matcher.
    await input.fill('thank you, that helps');
    await input.press('Enter');
    for (let i = 0; i < 40 && !chat.sent.length; i += 1) await page.waitForTimeout(150);
    ok(chat.sent.length === 1, `${w}: a message typed after the handover did not reach the thread`);
    ok(/thank you, that helps/.test((chat.sent[0] || {}).body || ''),
       `${w}: the thread received something other than what was typed`);

    // His reply lands in the panel on its own.
    chat.reply = 'We can do a shorter route for her, no problem.';
    ok(await seen(panel, chat.reply, 15000), `${w}: Wayan's reply never arrived in the panel`);

    // And the conversation is still there after a reload - that is what the
    // stored thread id is for.
    await page.reload({ waitUntil: 'networkidle' });
    await page.locator('button[aria-label="Chat with us"]').click();
    const again = page.locator('[role=dialog][aria-label="Cahyana Support"]');
    await again.waitFor({ state: 'visible', timeout: 10000 });
    ok(await seen(again, chat.reply, 15000), `${w}: the conversation did not survive a reload`);

    const over2 = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
    ok(over2 <= 0, `${w}: handover page overflows by ${over2}px`);
    ok(errs.length === 0, `${w}: handover page errors ${errs.join(' | ')}`);
    await hctx.close();
  }

  // ---- somebody who is already signed in ----
  // No offer, and greeted by name the moment the panel opens (Wayan: "sehabis
  // login langsung sambut mereka hi name user").
  {
    const sctx = await b.newContext({ viewport: { width: w, height: 880 } });
    await sctx.routeWebSocket(/\/ws\//, (ws) => ws.close());
    await sctx.addInitScript(() => { try { localStorage.setItem('cue_token', 'stub-token'); } catch {} });
    await sctx.route('**/api/account/session*', (r) => r.fulfill({ status: 200, contentType: 'application/json',
      body: JSON.stringify({ status: 'ok', account: { id: 1, name: 'Hannah Wills', email: 'hannah@example.com' } }) }));
    await sctx.route('**/api/bookings/mine*', (r) => r.fulfill({ status: 200, contentType: 'application/json',
      body: JSON.stringify({ upcoming: [], past: [] }) }));
    await sctx.route('**/api/pricing/catalog*', (r) =>
      r.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(CATALOG) }));
    const started = [];
    await sctx.route('**/api/chat/**', (r) => {
      const req = r.request();
      if (req.method() === 'POST' && req.url().includes('/chat/start')) {
        started.push(JSON.parse(req.postData() || '{}'));
        return r.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ status: 'ok', thread: 'd'.repeat(48) }) });
      }
      return r.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ status: 'ok', messages: [] }) });
    });

    const page = await sctx.newPage();
    await page.goto(BASE + '/index.html', { waitUntil: 'networkidle' });
    await page.locator('button[aria-label="Chat with us"]').click();
    const panel = page.locator('[role=dialog][aria-label="Cahyana Support"]');
    await panel.waitFor({ state: 'visible', timeout: 10000 });

    ok(await seen(panel, 'Hi Hannah!', 10000), `${w}: a signed-in guest is not greeted by name`);
    ok(await panel.locator('[data-signin]').count() === 0, `${w}: a signed-in guest is still offered a sign-in`);
    // First name only - "Hi Hannah Wills!" reads like a form letter.
    ok(!(await panel.innerText()).includes('Hi Hannah Wills'), `${w}: greeted with the full name`);
    // One greeting, not the generic one plus a personal one with a second set
    // of chips under it.
    const greetings = await panel.getByText('What can I help you with', { exact: false }).count();
    ok(greetings === 1, `${w}: ${greetings} greetings on screen for a signed-in guest`);
    ok(!(await panel.innerText()).includes("Ask me about our tours"),
       `${w}: the generic opener is still there under the personal one`);
    const chipRuns = await panel.getByRole('button', { name: 'How much is a day tour?' }).count();
    ok(chipRuns === 1, `${w}: the suggestions are shown ${chipRuns} times`);

    // And Wayan gets the name without anyone typing it.
    const i2 = panel.getByLabel('Your question');
    await i2.fill('my mother is elderly, how much walking is there');
    await i2.press('Enter');
    for (let k = 0; k < 40 && !started.length; k += 1) await page.waitForTimeout(150);
    ok(started.length === 1, `${w}: the signed-in handover never started`);
    ok((started[0] || {}).name === 'Hannah Wills', `${w}: the handover did not carry the account name`);
    ok((started[0] || {}).email === 'hannah@example.com', `${w}: the handover did not carry the account email`);

    await sctx.close();
  }

  // ---- the same handover, but at 2am in Bali ----
  // This is the branch the email exists for. Inside his hours nothing is asked,
  // because he is about to reply; outside them the wait is certain, so the
  // offer comes straight away - and it is skippable.
  {
    const nctx = await b.newContext({ viewport: { width: w, height: 880 } });
    await nctx.routeWebSocket(/\/ws\//, (ws) => ws.close());
    await nctx.clock.install({ time: new Date('2026-09-26T18:00:00Z') });  // 02:00 in Bali
    await nctx.route('**/api/pricing/catalog*', (r) =>
      r.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(CATALOG) }));
    const night = { contact: [], id: 'c'.repeat(48) };
    await nctx.route('**/api/chat/**', async (r) => {
      const req = r.request();
      const url = new URL(req.url());
      const json = (x) => r.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(x) });
      if (req.method() === 'POST' && url.pathname.endsWith('/chat/start')) return json({ status: 'ok', thread: night.id });
      if (req.method() === 'POST' && url.pathname.endsWith('/contact')) {
        night.contact.push(JSON.parse(req.postData() || '{}'));
        return json({ status: 'ok' });
      }
      if (req.method() === 'POST') return json({ status: 'ok', message: { id: 7, sender: 'guest', body: '', created_at: new Date().toISOString() } });
      return json({ status: 'ok', thread: night.id, messages: [] });
    });

    const page = await nctx.newPage();
    await page.goto(BASE + '/index.html', { waitUntil: 'networkidle' });
    await page.locator('button[aria-label="Chat with us"]').click();
    const panel = page.locator('[role=dialog][aria-label="Cahyana Support"]');
    await panel.waitFor({ state: 'visible', timeout: 10000 });
    const input = panel.getByLabel('Your question');
    await input.fill('my mother is elderly, how much walking is there');
    await input.press('Enter');
    ok(await seen(panel, 'You are with Wayan now', 10000), `${w}: the night handover never completed`);

    // Told the truth about the hour, and offered the way out.
    ok(await seen(panel, 'probably asleep', 8000), `${w}: at 2am the guest is not told he is asleep`);
    const mailBox = panel.locator('input[type=email]');
    ok(await mailBox.count() === 1, `${w}: no email offered when the reply cannot come tonight`);

    await mailBox.fill('rui@example.com');
    await panel.locator('[data-mailsend]').click();
    for (let i = 0; i < 40 && !night.contact.length; i += 1) await page.waitForTimeout(150);
    ok(night.contact.length === 1, `${w}: the email never reached the server`);
    ok((night.contact[0] || {}).email === 'rui@example.com', `${w}: a different address was sent`);
    ok(await seen(panel, 'He will reach you there', 8000), `${w}: nothing confirms the email was kept`);

    await nctx.close();
  }

}

await b.close();
console.log(`${pass}/${pass + fail}`);
process.exit(fail ? 1 : 0);
