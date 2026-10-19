#!/usr/bin/env node
import { chromium } from 'playwright-core';

const BASE = process.env.BASE || 'http://127.0.0.1:4000';
const API = process.env.API || 'http://127.0.0.1:4599/api';
const AUTH = `Basic ${Buffer.from(`${process.env.ADMIN_USER || 'owner'}:${process.env.ADMIN_PASS || 'pw'}`).toString('base64')}`;
const EXEC = process.env.CHROME || '/opt/pw-browsers/chromium-1194/chrome-linux/chrome';

let pass = 0,
  fail = 0;
function ok(isPassing, message) {
  isPassing ? pass++ : (fail++, console.log('  FAIL:', message));
}
function sleep(delayMs) {
  return new Promise((resolve) => setTimeout(resolve, delayMs));
}
async function seen(loc, timeoutMs = 4000) {
  try {
    await loc.first().waitFor({ timeout: timeoutMs });
    return true;
  } catch (e) {
    return false;
  }
}
async function untilTrue(page, condition, timeoutMs = 8000) {
  try {
    await page.waitForFunction(condition, null, { timeout: timeoutMs });
    return true;
  } catch (e) {
    return false;
  }
}

async function api(path, init = {}) {
  const response = await fetch(API + path, {
    ...init,
    headers: {
      Authorization: AUTH,
      ...(init.body ? { 'Content-Type': 'application/json' } : {}),
      ...(init.headers || {}),
    },
  });
  return { status: response.status, json: await response.json().catch(() => null) };
}

const HANDOVER_Q = 'my wife is in a wheelchair, can she do the tour';

async function openPanel(page) {
  await page.goto(`${BASE}/tour.html`, { waitUntil: 'domcontentloaded' });
  await page.locator('button[aria-label="Chat with us"]').first().click();
  await page.locator('[role="dialog"][aria-label*="Support"]').waitFor({ state: 'visible', timeout: 5000 });
}

async function handOver(page) {
  const input = page.locator('[role="dialog"][aria-label*="Support"] input[aria-label="Your question"]');
  await input.fill(HANDOVER_Q);
  await input.press('Enter');
  ok(await seen(page.locator('text=/with Wayan now|Will connect you/i'), 6000), 'the handover line never appeared');
}

function panel(page) {
  return page.locator('[role="dialog"][aria-label*="Support"]');
}

async function threadFor(question) {
  const list = await api('/admin/chats');
  const thread = (list.json.threads || []).find(
    (candidateThread) =>
      (candidateThread.last_body || '').includes(question.slice(0, 20)) ||
      (candidateThread.last_body || '').includes(question),
  );
  return thread ? thread.id : null;
}

async function main() {
  const browser = await chromium.launch({ executablePath: EXEC, args: ['--no-sandbox'] });
  const errors = [];

  {
    const browserContext = await browser.newContext({ viewport: { width: 390, height: 844 } });
    let sever = null;
    let replay = null;
    await browserContext.routeWebSocket(/\/ws\/chat/, (client) => {
      const server = client.connectToServer();
      let lastMsg = null;
      server.onMessage((frame) => {
        const text = typeof frame === 'string' ? frame : String(frame);
        if (/"type":"message"/.test(text)) lastMsg = text;
        client.send(frame);
      });
      replay = () => {
        if (!lastMsg) return false;
        client.send(lastMsg);
        return true;
      };
      sever = () => {
        try {
          server.close();
        } catch (e) {}
        try {
          client.close();
        } catch (e) {}
      };
    });
    const page = await browserContext.newPage();
    page.on('pageerror', (error) => errors.push(`live: ${error.message}`));

    const polls = [];
    page.on('request', (request) => {
      if (/\/api\/chat\/[a-f0-9]{48}\?/.test(request.url())) polls.push(Date.now());
    });

    await openPanel(page);
    await handOver(page);

    ok((await panel(page).getAttribute('data-live')) !== null, 'the panel does not report whether it is live');
    await untilTrue(page, () => document.querySelector('[role="dialog"][aria-label*="Support"]')?.dataset.live === '1');
    ok(
      (await panel(page).getAttribute('data-live')) === '1',
      'the guest never got a live socket against the real server',
    );

    const id = await threadFor(HANDOVER_Q);
    ok(!!id, 'the handover did not create a thread on the server');

    const pollsBefore = polls.length;
    const t0 = Date.now();
    const sent = await api(`/admin/chats/${id}/reply`, {
      method: 'POST',
      body: JSON.stringify({ body: 'Yes - the easy route works with a wheelchair.' }),
    });
    ok(sent.status === 200, `the owner reply failed (${sent.status})`);
    const arrived = await seen(page.locator('text=the easy route works with a wheelchair'));
    ok(arrived, 'the reply never reached the guest at all');
    const took = Date.now() - t0;
    ok(took < 1500, `the reply took ${took}ms - that is poll speed, not socket speed`);
    ok(
      polls.length === pollsBefore,
      `${polls.length - pollsBefore} thread read(s) happened - the reply came from a poll, not the socket`,
    );

    ok(replay() === true, 'no frame was captured, so the dedupe is not being tested at all');
    await sleep(600);
    const once = await panel(page).innerText();
    ok(
      (once.match(/easy route works with a wheelchair/g) || []).length === 1,
      'the same message was shown twice - it is not deduped by its id',
    );

    const tk = await api('/admin/ws-ticket', { method: 'POST', body: '{}' });
    ok(!!(tk.json && tk.json.ticket), 'could not mint a ws ticket');
    const WS = (await import('../cahyana-api/node_modules/ws/index.js')).default;
    const owner = new WS(`${API.replace(/^http/, 'ws').replace(/\/api$/, '')}/ws/admin?ticket=${tk.json.ticket}`);
    await new Promise((resolve, reject) => {
      owner.once('open', resolve);
      owner.once('error', reject);
    });
    owner.send(JSON.stringify({ type: 'typing', threadId: id }));
    const typed = await seen(panel(page).locator('[data-typing]'), 3000);
    ok(typed, 'typing never reached the guest');
    ok(
      typed && /typing/i.test(await panel(page).locator('[data-typing]').innerText()),
      'the typing row does not say who is typing',
    );
    await sleep(5000);
    ok(
      (await panel(page).locator('[data-typing]').count()) === 0,
      'typing never expired - it would sit on screen after he stopped',
    );

    const strip = await panel(page).innerText();
    ok(
      /online right now/i.test(strip),
      'the guest is not told the owner is actually here while a dashboard is connected',
    );
    owner.close();
    await untilTrue(
      page,
      () =>
        !/online right now/i.test(document.querySelector('[role="dialog"][aria-label*="Support"]')?.innerText || ''),
      4000,
    );
    ok(
      !/online right now/i.test(await panel(page).innerText()),
      'the guest still thinks he is here after the dashboard closed',
    );

    ok(
      typeof sever === 'function',
      'the socket was never proxied, so it cannot be severed - this case would test nothing',
    );
    sever();
    await untilTrue(page, () => document.querySelector('[role="dialog"][aria-label*="Support"]')?.dataset.live === '0');
    ok((await panel(page).getAttribute('data-live')) === '0', 'severing the socket did not register as a drop');
    await api(`/admin/chats/${id}/reply`, {
      method: 'POST',
      body: JSON.stringify({ body: 'One more thing - bring a hat.' }),
    });
    const dropped = Date.now();
    await sleep(350);
    ok(
      (await panel(page).locator('text=bring a hat').count()) === 0,
      'the page saw a message over a socket that was closed',
    );

    const gapArrived = await seen(page.locator('text=bring a hat'), 20000);
    const gap = Date.now() - dropped;
    ok(
      gapArrived,
      'a message sent while the socket was down NEVER arrived - the reconnect does not read back what it missed',
    );
    ok(
      !gapArrived || gap < 4000,
      `the gap message took ${gap}ms - slow enough that it came from the fallback tick, not the reconnect`,
    );
    ok((await panel(page).getAttribute('data-live')) === '1', 'the socket never reconnected after being severed');

    const body = await panel(page).innerText();
    ok(
      !gapArrived || (body.match(/bring a hat/g) || []).length === 1,
      'the message was shown twice - the socket and the catch-up both added it',
    );

    await browserContext.close();
  }

  {
    const browserContext = await browser.newContext({ viewport: { width: 390, height: 844 } });
    await browserContext.addInitScript(() => {
      delete window.WebSocket;
    });
    const page = await browserContext.newPage();
    page.on('pageerror', (error) => errors.push(`fallback: ${error.message}`));
    const polls = [];
    page.on('request', (request) => {
      if (/\/api\/chat\/[a-f0-9]{48}\?/.test(request.url())) polls.push(Date.now());
    });

    const grandmotherQuestion = 'can you take my grandmother who cannot walk far';
    await openPanel(page);
    const input = panel(page).locator('input[aria-label="Your question"]');
    await input.fill(grandmotherQuestion);
    await input.press('Enter');
    await page.locator('text=/with Wayan now|Will connect you/i').first().waitFor({ timeout: 6000 });

    ok((await panel(page).getAttribute('data-live')) === '0', 'a page with no WebSocket reported itself as live');
    const id2 = await threadFor(grandmotherQuestion);
    ok(!!id2, 'the fallback guest did not create a thread');

    await api(`/admin/chats/${id2}/reply`, {
      method: 'POST',
      body: JSON.stringify({ body: 'We can keep the walking short.' }),
    });
    ok(
      await seen(page.locator('text=keep the walking short'), 12000),
      'the reply never reached a guest with no WebSocket',
    );
    ok(polls.length > 0, 'the fallback guest made no thread reads at all - nothing was watching for a reply');

    const n0 = polls.length;
    await sleep(6000);
    const added = polls.length - n0;
    ok(added >= 1 && added <= 3, `the fallback polled ${added} times in 6s - expected about one`);

    await browserContext.close();
  }

  ok(errors.length === 0, `page errors: ${errors.join(' | ')}`);
  await browser.close();
  console.log(`\n${pass}/${pass + fail}`);
  process.exit(fail ? 1 : 0);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
