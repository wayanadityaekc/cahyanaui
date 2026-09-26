#!/usr/bin/env node
// The live chat, end to end, in a real browser against the real server.
//
// WHY THIS HARNESS HAD TO EXIST. Every earlier check on the chat mocked the
// API's HTTP responses, because Railway is not reachable from here. A mocked
// response cannot test a WebSocket at all: the upgrade, the ticket, the
// heartbeat, a reconnect and the catch-up after it only happen against a server.
// So this one starts cahyana-api itself (server.js, unmodified - only the
// database is in memory) and lets the page connect for real.
//
// It asserts the two things that are the whole point, and it is careful about the
// difference between them:
//   1. LIVE - a reply lands without a poll. Proved by counting requests, not by a
//      stopwatch: a 5s poll can coincidentally look fast.
//   2. STILL WORKS WHEN IT IS NOT LIVE - a guest whose network will not carry a
//      WebSocket, and a guest whose socket dropped while Wayan was answering.
//      Those are not edge cases; they are most phones on a bad day.
//
// Run:  node ../cahyana-api/tools/chat-dev-server.js   (port 4599)
//       NEXT_PUBLIC_API_BASE=http://127.0.0.1:4599/api npm run build
//       node tools/serve-out.js                        (port 4000)
//       node verify-live.mjs
import { chromium } from 'playwright-core';

const BASE = process.env.BASE || 'http://127.0.0.1:4000';
const API = process.env.API || 'http://127.0.0.1:4599/api';
const AUTH = 'Basic ' + Buffer.from(`${process.env.ADMIN_USER || 'owner'}:${process.env.ADMIN_PASS || 'pw'}`).toString('base64');
const EXEC = process.env.CHROME || '/opt/pw-browsers/chromium-1194/chrome-linux/chrome';

let pass = 0, fail = 0;
const ok = (c, m) => { c ? pass++ : (fail++, console.log('  FAIL:', m)); };
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const api = async (path, init = {}) => {
  const res = await fetch(API + path, {
    ...init,
    headers: { Authorization: AUTH, ...(init.body ? { 'Content-Type': 'application/json' } : {}), ...(init.headers || {}) },
  });
  return { status: res.status, json: await res.json().catch(() => null) };
};

// A question the answer engine deliberately cannot answer, so the panel hands
// over and a real thread is created. Taken from the same list the engine's own
// guard uses - a question it CAN answer would never reach Wayan.
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
  // The handover line is what says a thread exists.
  await page.locator('text=/with Wayan now|Will connect you/i').first().waitFor({ timeout: 6000 });
}

const panel = (page) => page.locator('[role="dialog"][aria-label*="Support"]');

// The newest thread on the owner's side, matched on the question rather than
// "the last row": two browser contexts in one run each make one.
async function threadFor(question) {
  const list = await api('/admin/chats');
  const t = (list.json.threads || []).find((x) => (x.last_body || '').includes(question.slice(0, 20))
    || (x.last_body || '').includes(question));
  return t ? t.id : null;
}

async function main() {
  const browser = await chromium.launch({ executablePath: EXEC, args: ['--no-sandbox'] });
  const errors = [];

  // ================= 1. a guest on a real socket =========================
  {
    const ctx = await browser.newContext({ viewport: { width: 390, height: 844 } });
    const page = await ctx.newPage();
    page.on('pageerror', (e) => errors.push(`live: ${e.message}`));

    // Every HTTP read of the thread, so "no poll happened" is a count and not a
    // feeling.
    const polls = [];
    page.on('request', (r) => { if (/\/api\/chat\/[a-f0-9]{48}\?/.test(r.url())) polls.push(Date.now()); });

    await openPanel(page);
    await handOver(page);

    ok(await panel(page).getAttribute('data-live') !== null, 'the panel does not report whether it is live');
    // The socket is opened as soon as there is a thread. Given a beat, because a
    // handshake is a round trip.
    await page.waitForFunction(
      () => document.querySelector('[role="dialog"][aria-label*="Support"]')?.dataset.live === '1',
      null, { timeout: 8000 },
    ).catch(() => {});
    ok(await panel(page).getAttribute('data-live') === '1', 'the guest never got a live socket against the real server');

    const id = await threadFor(HANDOVER_Q);
    ok(!!id, 'the handover did not create a thread on the server');

    // --- the claim: a reply arrives without a poll ---
    const pollsBefore = polls.length;
    const t0 = Date.now();
    const sent = await api(`/admin/chats/${id}/reply`, { method: 'POST', body: JSON.stringify({ body: 'Yes - the easy route works with a wheelchair.' }) });
    ok(sent.status === 200, `the owner reply failed (${sent.status})`);
    await page.locator('text=the easy route works with a wheelchair').first().waitFor({ timeout: 4000 });
    const took = Date.now() - t0;
    ok(took < 1500, `the reply took ${took}ms - that is poll speed, not socket speed`);
    // The airtight half. A 5s poll can land in 200ms by luck; a poll that never
    // happened cannot.
    ok(polls.length === pollsBefore, `${polls.length - pollsBefore} thread read(s) happened - the reply came from a poll, not the socket`);

    // --- typing, and it expires ---
    const tk = await api('/admin/ws-ticket', { method: 'POST', body: '{}' });
    ok(!!(tk.json && tk.json.ticket), 'could not mint a ws ticket');
    const WS = (await import('../cahyana-api/node_modules/ws/index.js')).default;
    const owner = new WS(API.replace(/^http/, 'ws').replace(/\/api$/, '') + `/ws/admin?ticket=${tk.json.ticket}`);
    await new Promise((r, j) => { owner.once('open', r); owner.once('error', j); });
    owner.send(JSON.stringify({ type: 'typing', threadId: id }));
    await panel(page).locator('[data-typing]').waitFor({ timeout: 3000 });
    ok(true, 'typing reached the guest');
    ok(/typing/i.test(await panel(page).locator('[data-typing]').innerText()), 'the typing row does not say who is typing');
    await sleep(5000);
    ok(await panel(page).locator('[data-typing]').count() === 0, 'typing never expired - it would sit on screen after he stopped');

    // --- presence is a fact, not a timetable ---
    const strip = await panel(page).innerText();
    ok(/online right now/i.test(strip), 'the guest is not told the owner is actually here while a dashboard is connected');
    owner.close();
    await page.waitForFunction(
      () => !/online right now/i.test(document.querySelector('[role="dialog"][aria-label*="Support"]')?.innerText || ''),
      null, { timeout: 4000 },
    ).catch(() => {});
    ok(!/online right now/i.test(await panel(page).innerText()), 'the guest still thinks he is here after the dashboard closed');

    // --- a gap in the socket must not lose a message ---
    // Offline kills the socket and the fetches. The reply is stored while the
    // guest cannot hear it, so the only way it can appear is the catch-up read
    // the reconnect triggers. This is the assertion that makes the whole design
    // safe to ship.
    await ctx.setOffline(true);
    await sleep(600);
    await api(`/admin/chats/${id}/reply`, { method: 'POST', body: JSON.stringify({ body: 'One more thing - bring a hat.' }) });
    await sleep(1200);
    ok(await panel(page).locator('text=bring a hat').count() === 0, 'the page somehow saw a message while it was offline');
    await ctx.setOffline(false);
    await page.locator('text=bring a hat').first().waitFor({ timeout: 25000 });
    ok(true, 'the message sent during the gap arrived after the socket came back');
    await page.waitForFunction(
      () => document.querySelector('[role="dialog"][aria-label*="Support"]')?.dataset.live === '1',
      null, { timeout: 25000 },
    ).catch(() => {});
    ok(await panel(page).getAttribute('data-live') === '1', 'the socket never reconnected after the network came back');

    // Nothing may be duplicated by the two paths both carrying it.
    const body = await panel(page).innerText();
    ok((body.match(/bring a hat/g) || []).length === 1, 'the message was shown twice - the socket and the catch-up both added it');
    ok((body.match(/easy route works with a wheelchair/g) || []).length === 1, 'the first reply was duplicated');

    await ctx.close();
  }

  // ============ 2. a guest whose network will not carry a WebSocket =======
  // Not a curiosity: corporate wifi, some mobile proxies, older captive
  // portals. This guest must get exactly the behaviour that shipped before any
  // of this existed, not a panel that quietly stops updating.
  {
    const ctx = await browser.newContext({ viewport: { width: 390, height: 844 } });
    // Removing the constructor is the bluntest honest version of "blocked":
    // whatever the reason, the page cannot make one.
    await ctx.addInitScript(() => { delete window.WebSocket; });
    const page = await ctx.newPage();
    page.on('pageerror', (e) => errors.push(`fallback: ${e.message}`));
    const polls = [];
    page.on('request', (r) => { if (/\/api\/chat\/[a-f0-9]{48}\?/.test(r.url())) polls.push(Date.now()); });

    const Q = 'can you take my grandmother who cannot walk far';
    await openPanel(page);
    const input = panel(page).locator('input[aria-label="Your question"]');
    await input.fill(Q);
    await input.press('Enter');
    await page.locator('text=/with Wayan now|Will connect you/i').first().waitFor({ timeout: 6000 });

    ok(await panel(page).getAttribute('data-live') === '0', 'a page with no WebSocket reported itself as live');
    const id2 = await threadFor(Q);
    ok(!!id2, 'the fallback guest did not create a thread');

    await api(`/admin/chats/${id2}/reply`, { method: 'POST', body: JSON.stringify({ body: 'We can keep the walking short.' }) });
    await page.locator('text=keep the walking short').first().waitFor({ timeout: 12000 });
    ok(true, 'the reply still reached a guest with no WebSocket');
    ok(polls.length > 0, 'the fallback guest made no thread reads at all - nothing was watching for a reply');

    // And it is not hammering: roughly one read every 5s, so a minute of waiting
    // is around a dozen requests, not hundreds.
    const n0 = polls.length;
    await sleep(6000);
    const added = polls.length - n0;
    ok(added >= 1 && added <= 3, `the fallback polled ${added} times in 6s - expected about one`);

    await ctx.close();
  }

  ok(errors.length === 0, `page errors: ${errors.join(' | ')}`);
  await browser.close();
  console.log(`\n${pass}/${pass + fail}`);
  process.exit(fail ? 1 : 0);
}

main().catch((e) => { console.error(e); process.exit(1); });
