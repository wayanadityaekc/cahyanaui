import { chromium } from '/home/user/CUE/node_modules/playwright-core/index.mjs';

const BASE = process.env.BASE || 'http://localhost:4000';
let pass = 0,
  fail = 0;
function ok(isPassing, message) {
  isPassing ? pass++ : (fail++, console.log('  FAIL:', message));
}

async function enterChat() {}

async function seen(root, text, timeoutMs) {
  try {
    await root.getByText(text, { exact: false }).first().waitFor({ state: 'visible', timeout: timeoutMs });
    return true;
  } catch (e) {
    return false;
  }
}

const CATALOG = {
  symbol: '$',
  currency: 'USD',
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

const browser = await chromium.launch({
  executablePath: process.env.CHROME || '/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell',
});

const PAGES = ['/index.html', '/tour.html', '/ubud-tour.html'];

for (const width of [390, 768, 1280]) {
  const browserContext = await browser.newContext({ viewport: { width: width, height: 880 } });
  await browserContext.routeWebSocket(/\/ws\//, (ws) => ws.close());
  await browserContext.route('**/api/pricing/catalog*', (route) =>
    route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(CATALOG) }),
  );

  await browserContext.route('**/api/chat/**', (route) =>
    route.fulfill({
      status: 503,
      contentType: 'application/json',
      body: JSON.stringify({ status: 'error', detail: 'Could not reach Wayan just now.' }),
    }),
  );

  for (const path of PAGES) {
    const page = await browserContext.newPage();
    const errs = [];
    const KNOWN = /Minified React error #418/;
    page.on('pageerror', (error) => {
      if (!KNOWN.test(String(error))) errs.push(String(error));
    });
    await page.goto(BASE + path, { waitUntil: 'networkidle' });

    const button = page.locator('header button[aria-label="Chat with us"]');
    const shown = await page.locator('button[aria-label="Chat with us"]:visible').count();
    ok(shown === 1, `${width}${path}: expected exactly 1 visible chat button, got ${shown}`);
    ok(await button.isVisible(), `${width}${path}: chat button not visible`);

    ok(
      (await page.locator('[role=dialog][aria-label="Cahyana Support"]').count()) === 0,
      `${width}${path}: chat panel is in the DOM before it was opened`,
    );

    await button.click();
    const panel = page.locator('[role=dialog][aria-label="Cahyana Support"]');
    await panel.waitFor({ state: 'visible', timeout: 10000 });

    ok((await panel.getByLabel('Your question').count()) === 1, `${width}${path}: a guest cannot type`);
    ok((await panel.locator('[data-signin]').count()) === 1, `${width}${path}: no sign-in offered to a guest`);
    ok(
      (await panel.getByText('Chatting as a guest', { exact: false }).count()) === 1,
      `${width}${path}: nothing says they are chatting as a guest`,
    );
    if (path === PAGES[0]) {
      await panel.locator('[data-signin]').click();
      ok(
        await seen(page.locator('[role=dialog][aria-label="Sign in"]').last(), 'Sign in', 6000),
        `${width}${path}: the sign-in button does not open the sign-in`,
      );
      await page.keyboard.press('Escape');
      await page.waitForTimeout(300);
    }
    ok(
      (await panel.getByRole('button', { name: 'How much is a day tour?' }).count()) === 1,
      `${width}${path}: the suggestions are gated behind signing in`,
    );

    const box = await panel.boundingBox();
    if (width <= 768) {
      ok(Math.abs(box.width - width) <= 1, `${width}${path}: phone sheet should span the width, got ${box.width}`);
      ok(Math.abs(box.y + box.height - 880) <= 1, `${width}${path}: phone sheet should sit on the bottom edge`);
    } else {
      ok(box.width >= 340 && box.width <= 420, `${width}${path}: drawer width ${box.width}`);
      ok(Math.abs(box.x + box.width - width) <= 1, `${width}${path}: drawer is not flush to the right edge`);
      ok(Math.abs(box.height - 880) <= 1, `${width}${path}: drawer is not full height (${box.height})`);
      ok(Math.abs(box.y) <= 1, `${width}${path}: drawer does not start at the top`);
    }

    const chips = panel.locator('button:below(p)').filter({ hasText: /\?$/ });
    const chipCount = await panel.getByRole('button', { name: /\?$/ }).count();
    ok(chipCount >= 5, `${width}${path}: expected the suggestion chips, found ${chipCount}`);

    await panel.getByRole('button', { name: 'How much is a day tour?' }).click();
    await panel
      .getByText('Day tours are priced per car', { exact: false })
      .waitFor({ state: 'visible', timeout: 10000 });
    const body = await panel.innerText();
    ok(
      body.includes('How much is a day tour?'),
      `${width}${path}: the tapped question is not shown as the guest's message`,
    );
    ok(/\$\d/.test(body), `${width}${path}: a price answer with no price in it`);

    const std = await page.evaluate(() => {
      const element = document.createElement('div');
      element.style.cssText = 'height:var(--btn-h);font-size:var(--text-small);border-radius:var(--radius-sm)';
      document.body.appendChild(element);
      const cs = getComputedStyle(element);
      const out = { h: parseFloat(cs.height), fs: parseFloat(cs.fontSize), r: parseFloat(cs.borderRadius) };
      element.remove();
      return out;
    });
    const ctas = await panel.evaluate(
      (root) =>
        [...root.querySelectorAll('[data-cta]')].map((element) => {
          const boxItem = element.getBoundingClientRect();
          const cs = getComputedStyle(element);
          const label = (element.innerText || element.getAttribute('aria-label') || '').trim();
          return {
            label,
            words: label ? label.split(/\s+/).length : 0,
            h: boxItem.height,
            fs: parseFloat(cs.fontSize),
            rad: parseFloat(cs.borderTopLeftRadius),
            pt: parseFloat(cs.paddingTop),
            pb: parseFloat(cs.paddingBottom),
          };
        }),
      await panel.elementHandle(),
    );
    ok(ctas.length >= 2, `${width}${path}: expected action buttons in the panel, found ${ctas.length}`);
    ctas.forEach((cta) => {
      ok(Math.abs(cta.h - std.h) < 0.5, `${width}${path}: "${cta.label}" is ${cta.h}px, not ${std.h}`);
      ok(cta.fs === std.fs, `${width}${path}: "${cta.label}" font ${cta.fs}, not ${std.fs}`);
      ok(cta.rad === std.r, `${width}${path}: "${cta.label}" radius ${cta.rad}, not ${std.r}`);
      ok(cta.pt === 0 && cta.pb === 0, `${width}${path}: "${cta.label}" has vertical padding`);
      ok(cta.words <= 2, `${width}${path}: "${cta.label}" is ${cta.words} words, the rule is 2`);
    });

    const chipBox = await panel.evaluate(
      (root) =>
        [...root.querySelectorAll('[data-chip]')].map((element) => {
          const cs = getComputedStyle(element);
          return {
            h: element.getBoundingClientRect().height,
            fs: parseFloat(cs.fontSize),
            rad: parseFloat(cs.borderTopLeftRadius),
          };
        }),
      await panel.elementHandle(),
    );
    chipBox.forEach((chip) => {
      ok(Math.abs(chip.h - std.h) < 0.5, `${width}${path}: a chip is ${chip.h}px, not ${std.h}`);
      ok(chip.fs === std.fs, `${width}${path}: a chip font is ${chip.fs}, not ${std.fs}`);
      ok(chip.rad > 100, `${width}${path}: a chip lost its pill shape (${chip.rad})`);
    });

    const stray = await panel.evaluate(
      (root) =>
        [...root.querySelectorAll('button')].filter(
          (element) =>
            !element.hasAttribute('data-cta') &&
            !element.hasAttribute('data-chip') &&
            element.getAttribute('aria-label') !== 'Close chat',
        ).length,
      await panel.elementHandle(),
    );
    ok(stray === 0, `${width}${path}: ${stray} button(s) in the panel are neither an action nor a chip`);

    const input = panel.getByLabel('Your question');
    function handoffs() {
      return panel.getByText('Give me a moment', { exact: false }).count();
    }
    async function reaches(question) {
      const before = await handoffs();
      await input.fill(question);
      await input.press('Enter');
      let after = before;
      for (let attempt = 0; attempt < 40 && after === before; attempt += 1) {
        await page.waitForTimeout(150);
        after = await handoffs();
      }
      return after > before;
    }

    ok(await reaches('who won the world cup'), `${width}${path}: an off-topic question did not reach a person`);
    ok(
      (await panel.getByText('I can only help with Cahyana', { exact: false }).count()) === 0,
      `${width}${path}: the polite decline is back - odd questions are a dead end again`,
    );

    for (const question of [
      'my wife is in a wheelchair, can she do the tour',
      'my mother is elderly, how much walking is there',
    ]) {
      ok(await reaches(question), `${width}${path}: "${question}" did not reach a person`);
    }

    ok(
      (await panel.getByText('Give me a moment', { exact: false }).count()) >= 1,
      `${width}${path}: the guest is not told they are being connected`,
    );
    ok(
      (await panel.locator('input[type=email]').count()) === 0,
      `${width}${path}: an email is being asked for before the handover`,
    );
    ok(
      await seen(panel, 'Could not reach Wayan', 8000),
      `${width}${path}: a handover that failed left the guest waiting silently`,
    );

    const after = await panel.innerText();
    const tail = after.slice(after.indexOf('elderly'));
    ok(!/\$\d/.test(tail), `${width}${path}: a price was quoted in answer to a question about walking`);

    const over = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
    ok(over <= 0, `${width}${path}: page overflows by ${over}px`);

    await page.keyboard.press('Escape');
    await page.waitForTimeout(400);
    ok(!(await panel.isVisible()), `${width}${path}: Escape did not close the panel`);

    ok(errs.length === 0, `${width}${path}: page errors ${errs.join(' | ')}`);
    if (path === '/index.html') await page.screenshot({ path: `${process.env.SP}/chat-${width}.png` });
    await page.close();
  }
  await browserContext.close();

  {
    const hctx = await browser.newContext({ viewport: { width: width, height: 880 } });
    await hctx.routeWebSocket(/\/ws\//, (ws) => ws.close());
    await hctx.route('**/api/pricing/catalog*', (route) =>
      route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(CATALOG) }),
    );
    const chat = { started: [], sent: [], reply: null, id: 'a'.repeat(48) };
    const acct = [];
    await hctx.route('**/api/account', async (route) => {
      acct.push(JSON.parse(route.request().postData() || '{}'));
      return route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          status: 'ok',
          token: 'stub-token',
          account: { name: 'Hannah', email: 'hannah@example.com' },
        }),
      });
    });
    await hctx.route('**/api/chat/**', async (route) => {
      const request = route.request();
      const url = new URL(request.url());
      function json(payload) {
        return route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(payload) });
      }
      if (request.method() === 'POST' && url.pathname.endsWith('/chat/start')) {
        chat.started.push(JSON.parse(request.postData() || '{}'));
        return json({ status: 'ok', thread: chat.id });
      }
      if (request.method() === 'POST' && url.pathname.endsWith('/message')) {
        chat.sent.push(JSON.parse(request.postData() || '{}'));
        return json({
          status: 'ok',
          message: { id: 10 + chat.sent.length, sender: 'guest', body: '', created_at: new Date().toISOString() },
        });
      }
      const all = chat.reply
        ? [{ id: 99, sender: 'owner', body: chat.reply, created_at: new Date().toISOString() }]
        : [];
      const since = Number(url.searchParams.get('since') || 0);
      return json({ status: 'ok', thread: chat.id, messages: all.filter((message) => message.id > since) });
    });

    const page = await hctx.newPage();
    const errs = [];
    const KNOWN = /Minified React error #418/;
    page.on('pageerror', (error) => {
      if (!KNOWN.test(String(error))) errs.push(String(error));
    });
    await page.goto(`${BASE}/index.html`, { waitUntil: 'networkidle' });
    await page.locator('header button[aria-label="Chat with us"]').click();
    const panel = page.locator('[role=dialog][aria-label="Cahyana Support"]');
    await panel.waitFor({ state: 'visible', timeout: 10000 });
    const input = panel.getByLabel('Your question');

    await input.fill('my mother is elderly, how much walking is there');
    await input.press('Enter');
    ok(await seen(panel, 'Give me a moment', 10000), `${width}: the guest is not told they are being connected`);
    ok(await seen(panel, 'You are with Wayan now', 10000), `${width}: the handover never completed`);

    ok(chat.started.length === 1, `${width}: expected one handover, got ${chat.started.length}`);
    const started = chat.started[0];
    ok(/walking/.test(started.question || ''), `${width}: the guest's actual question was not passed on`);
    ok(started.page === '/index.html', `${width}: Wayan is not told which page they were on`);
    ok(!started.email && !started.name, `${width}: a guest handover carried contact details from nowhere`);

    const afterSend = await panel.innerText();
    ok(/talking to Wayan/.test(afterSend), `${width}: nothing says the conversation moved to a person`);
    ok(/Bali time/.test(afterSend), `${width}: the guest is not told when Wayan answers`);

    await input.fill('thank you, that helps');
    await input.press('Enter');
    for (let attempt = 0; attempt < 40 && !chat.sent.length; attempt += 1) await page.waitForTimeout(150);
    ok(chat.sent.length === 1, `${width}: a message typed after the handover did not reach the thread`);
    ok(
      /thank you, that helps/.test((chat.sent[0] || {}).body || ''),
      `${width}: the thread received something other than what was typed`,
    );

    chat.reply = 'We can do a shorter route for her, no problem.';
    ok(await seen(panel, chat.reply, 15000), `${width}: Wayan's reply never arrived in the panel`);

    await page.reload({ waitUntil: 'networkidle' });
    await page.locator('header button[aria-label="Chat with us"]').click();
    const again = page.locator('[role=dialog][aria-label="Cahyana Support"]');
    await again.waitFor({ state: 'visible', timeout: 10000 });
    ok(await seen(again, chat.reply, 15000), `${width}: the conversation did not survive a reload`);

    const over2 = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
    ok(over2 <= 0, `${width}: handover page overflows by ${over2}px`);
    ok(errs.length === 0, `${width}: handover page errors ${errs.join(' | ')}`);
    await hctx.close();
  }

  {
    const sctx = await browser.newContext({ viewport: { width: width, height: 880 } });
    await sctx.routeWebSocket(/\/ws\//, (ws) => ws.close());
    await sctx.addInitScript(() => {
      try {
        localStorage.setItem('cue_token', 'stub-token');
      } catch (e) {}
    });
    await sctx.route('**/api/account/session*', (route) =>
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ status: 'ok', account: { id: 1, name: 'Hannah Wills', email: 'hannah@example.com' } }),
      }),
    );
    await sctx.route('**/api/bookings/mine*', (route) =>
      route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ upcoming: [], past: [] }) }),
    );
    await sctx.route('**/api/pricing/catalog*', (route) =>
      route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(CATALOG) }),
    );
    const started = [];
    await sctx.route('**/api/chat/**', (route) => {
      const request = route.request();
      if (request.method() === 'POST' && request.url().includes('/chat/start')) {
        started.push(JSON.parse(request.postData() || '{}'));
        return route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({ status: 'ok', thread: 'd'.repeat(48) }),
        });
      }
      return route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ status: 'ok', messages: [] }),
      });
    });

    const page = await sctx.newPage();
    await page.goto(`${BASE}/index.html`, { waitUntil: 'networkidle' });
    await page.locator('header button[aria-label="Chat with us"]').click();
    const panel = page.locator('[role=dialog][aria-label="Cahyana Support"]');
    await panel.waitFor({ state: 'visible', timeout: 10000 });

    ok(await seen(panel, 'Hi Hannah!', 10000), `${width}: a signed-in guest is not greeted by name`);
    ok((await panel.locator('[data-signin]').count()) === 0, `${width}: a signed-in guest is still offered a sign-in`);
    ok(!(await panel.innerText()).includes('Hi Hannah Wills'), `${width}: greeted with the full name`);
    const greetings = await panel.getByText('What can I help you with', { exact: false }).count();
    ok(greetings === 1, `${width}: ${greetings} greetings on screen for a signed-in guest`);
    ok(
      !(await panel.innerText()).includes('Ask me about our tours'),
      `${width}: the generic opener is still there under the personal one`,
    );
    const chipRuns = await panel.getByRole('button', { name: 'How much is a day tour?' }).count();
    ok(chipRuns === 1, `${width}: the suggestions are shown ${chipRuns} times`);

    const i2 = panel.getByLabel('Your question');
    await i2.fill('my mother is elderly, how much walking is there');
    await i2.press('Enter');
    for (let attempt = 0; attempt < 40 && !started.length; attempt += 1) await page.waitForTimeout(150);
    ok(started.length === 1, `${width}: the signed-in handover never started`);
    ok((started[0] || {}).name === 'Hannah Wills', `${width}: the handover did not carry the account name`);
    ok((started[0] || {}).email === 'hannah@example.com', `${width}: the handover did not carry the account email`);

    await sctx.close();
  }

  {
    const nctx = await browser.newContext({ viewport: { width: width, height: 880 } });
    await nctx.routeWebSocket(/\/ws\//, (ws) => ws.close());
    await nctx.clock.install({ time: new Date('2026-09-26T18:00:00Z') });
    await nctx.route('**/api/pricing/catalog*', (route) =>
      route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(CATALOG) }),
    );
    const night = { contact: [], id: 'c'.repeat(48) };
    await nctx.route('**/api/chat/**', async (route) => {
      const request = route.request();
      const url = new URL(request.url());
      function json(payload) {
        return route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(payload) });
      }
      if (request.method() === 'POST' && url.pathname.endsWith('/chat/start'))
        return json({ status: 'ok', thread: night.id });
      if (request.method() === 'POST' && url.pathname.endsWith('/contact')) {
        night.contact.push(JSON.parse(request.postData() || '{}'));
        return json({ status: 'ok' });
      }
      if (request.method() === 'POST')
        return json({
          status: 'ok',
          message: { id: 7, sender: 'guest', body: '', created_at: new Date().toISOString() },
        });
      return json({ status: 'ok', thread: night.id, messages: [] });
    });

    const page = await nctx.newPage();
    await page.goto(`${BASE}/index.html`, { waitUntil: 'networkidle' });
    await page.locator('header button[aria-label="Chat with us"]').click();
    const panel = page.locator('[role=dialog][aria-label="Cahyana Support"]');
    await panel.waitFor({ state: 'visible', timeout: 10000 });
    const input = panel.getByLabel('Your question');
    await input.fill('my mother is elderly, how much walking is there');
    await input.press('Enter');
    ok(await seen(panel, 'You are with Wayan now', 10000), `${width}: the night handover never completed`);

    ok(await seen(panel, 'probably asleep', 8000), `${width}: at 2am the guest is not told he is asleep`);
    const mailBox = panel.locator('input[type=email]');
    ok((await mailBox.count()) === 1, `${width}: no email offered when the reply cannot come tonight`);

    await mailBox.fill('rui@example.com');
    await panel.locator('[data-mailsend]').click();
    for (let attempt = 0; attempt < 40 && !night.contact.length; attempt += 1) await page.waitForTimeout(150);
    ok(night.contact.length === 1, `${width}: the email never reached the server`);
    ok((night.contact[0] || {}).email === 'rui@example.com', `${width}: a different address was sent`);
    ok(await seen(panel, 'He will reach you there', 8000), `${width}: nothing confirms the email was kept`);

    await nctx.close();
  }
}

await browser.close();
console.log(`${pass}/${pass + fail}`);
process.exit(fail ? 1 : 0);
