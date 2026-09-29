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
const AUTH = `Basic ${Buffer.from(`${process.env.ADMIN_USER || 'owner'}:${process.env.ADMIN_PASS || 'pw'}`).toString('base64')}`;
const EXEC = process.env.CHROME || '/opt/pw-browsers/chromium-1194/chrome-linux/chrome';

let pass = 0, fail = 0;
function ok(c, m) { c ? pass++ : (fail++, console.log('  FAIL:', m)); }
function sleep(ms) { return new Promise((r) => setTimeout(r, ms)); }
// Waits that REPORT instead of throwing. A throwing wait turns one failing
// assertion into a crashed run and every assertion after it into no information
// at all - which is how the first version of this harness "caught" a sabotage
// while hiding eight other results.
async function seen(loc, ms = 4000) { try { await loc.first().waitFor({ timeout: ms }); return true; } catch (e) { return false; } }
async function untilTrue(page, fn, ms = 8000) { try { await page.waitForFunction(fn, null, { timeout: ms }); return true; } catch (e) { return false; } }

async function api(path, init = {}) {
  const res = await fetch(API + path, {
    ...init,
    headers: { Authorization: AUTH, ...(init.body ? { 'Content-Type': 'application/json' } : {}), ...(init.headers || {}) },
  });
  return { status: res.status, json: await res.json().catch(() => null) };
}

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
  ok(await seen(page.locator('text=/with Wayan now|Will connect you/i'), 6000), 'the handover line never appeared');
}

function panel(page) { return page.locator('[role="dialog"][aria-label*="Support"]'); }

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
    // A proxy in front of the guest's socket. It forwards to the real server -
    // this is still a real connection, the handshake, the ticket-free guest door,
    // the frames and the heartbeat all genuinely happen - and it gives the test a
    // way to cut the wire, which is the only honest way to test a reconnect.
    let sever = null;
    let replay = null;
    await ctx.routeWebSocket(/\/ws\/chat/, (client) => {
      const server = client.connectToServer();
      let lastMsg = null;
      // Frames are forwarded by hand only because we want to keep one: replaying
      // it is the only deterministic way to make the same message arrive twice,
      // and the dedupe is untested otherwise. Not a hypothetical either - a
      // reconnect whose catch-up overlaps an in-flight socket frame produces
      // exactly this, and it is a race a harness cannot schedule.
      server.onMessage((frame) => {
        const text = typeof frame === 'string' ? frame : String(frame);
        if (/"type":"message"/.test(text)) lastMsg = text;
        client.send(frame);
      });
      // Reports whether it actually sent. Without that the assertion below is
      // vacuous, and it WAS: replay is reassigned by the reconnect's handler,
      // whose captured frame is null, so calling it after a sever did nothing and
      // "no duplicate appeared" passed on a build with the dedupe removed.
      replay = () => { if (!lastMsg) return false; client.send(lastMsg); return true; };
      sever = () => {
        try { server.close(); } catch (e) { /* already gone */ }
        try { client.close(); } catch (e) { /* already gone */ }
      };
    });
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
    await untilTrue(page, () => document.querySelector('[role="dialog"][aria-label*="Support"]')?.dataset.live === '1');
    ok(await panel(page).getAttribute('data-live') === '1', 'the guest never got a live socket against the real server');

    const id = await threadFor(HANDOVER_Q);
    ok(!!id, 'the handover did not create a thread on the server');

    // --- the claim: a reply arrives without a poll ---
    const pollsBefore = polls.length;
    const t0 = Date.now();
    const sent = await api(`/admin/chats/${id}/reply`, { method: 'POST', body: JSON.stringify({ body: 'Yes - the easy route works with a wheelchair.' }) });
    ok(sent.status === 200, `the owner reply failed (${sent.status})`);
    const arrived = await seen(page.locator('text=the easy route works with a wheelchair'));
    ok(arrived, 'the reply never reached the guest at all');
    const took = Date.now() - t0;
    ok(took < 1500, `the reply took ${took}ms - that is poll speed, not socket speed`);
    // The airtight half. A 5s poll can land in 200ms by luck; a poll that never
    // happened cannot.
    ok(polls.length === pollsBefore, `${polls.length - pollsBefore} thread read(s) happened - the reply came from a poll, not the socket`);

    // --- the same message arriving twice must be shown once ---------------
    // Before the sever, because that is where a frame has been captured. The
    // proxy re-sends the exact frame the server already sent, which is what a
    // catch-up overlapping an in-flight socket frame produces - a race no harness
    // can schedule, so it is forced instead.
    ok(replay() === true, 'no frame was captured, so the dedupe is not being tested at all');
    await sleep(600);
    const once = await panel(page).innerText();
    ok((once.match(/easy route works with a wheelchair/g) || []).length === 1,
      'the same message was shown twice - it is not deduped by its id');

    // --- typing, and it expires ---
    const tk = await api('/admin/ws-ticket', { method: 'POST', body: '{}' });
    ok(!!(tk.json && tk.json.ticket), 'could not mint a ws ticket');
    const WS = (await import('../cahyana-api/node_modules/ws/index.js')).default;
    const owner = new WS(`${API.replace(/^http/, 'ws').replace(/\/api$/, '')}/ws/admin?ticket=${tk.json.ticket}`);
    await new Promise((r, j) => { owner.once('open', r); owner.once('error', j); });
    owner.send(JSON.stringify({ type: 'typing', threadId: id }));
    const typed = await seen(panel(page).locator('[data-typing]'), 3000);
    ok(typed, 'typing never reached the guest');
    ok(typed && /typing/i.test(await panel(page).locator('[data-typing]').innerText()), 'the typing row does not say who is typing');
    await sleep(5000);
    ok(await panel(page).locator('[data-typing]').count() === 0, 'typing never expired - it would sit on screen after he stopped');

    // --- presence is a fact, not a timetable ---
    const strip = await panel(page).innerText();
    ok(/online right now/i.test(strip), 'the guest is not told the owner is actually here while a dashboard is connected');
    owner.close();
    await untilTrue(page, () => !/online right now/i.test(document.querySelector('[role="dialog"][aria-label*="Support"]')?.innerText || ''), 4000);
    ok(!/online right now/i.test(await panel(page).innerText()), 'the guest still thinks he is here after the dashboard closed');

    // --- a gap in the socket must not lose a message ---
    // Offline kills the socket and the fetches. The reply is stored while the
    // guest cannot hear it, so the only way it can appear is the catch-up read
    // the reconnect triggers. This is the assertion that makes the whole design
    // safe to ship.
    // --- a gap in the socket must not lose a message --------------------
    //
    // HOW NOT TO DO THIS: ctx.setOffline(true) does NOT close an open WebSocket
    // in Chromium. Measured - data-live stayed 1 through the whole "outage" and
    // the reply arrived over the socket 13ms after coming back. The first version
    // of this assertion passed with the catch-up deliberately removed, because
    // there was never a gap to catch up from. An assertion that cannot fail is
    // not an assertion.
    //
    // So the socket is severed for real, through a proxy: routeWebSocket hands us
    // both ends of a REAL connection to the REAL server, and closing them is
    // exactly what a dropped connection looks like to the page. The reconnect then
    // opens a fresh one through the same proxy.
    //
    // TWO NETS OVERLAP over a gap - the reconnect's catch-up, and the polling
    // fallback that mounts the moment the socket drops - and both are wanted (a
    // drop and a reconnect close enough together can batch into no fallback mount
    // at all). The clock separates them: the fallback's next tick is 5s after it
    // mounted, the socket's first retry is ~1s after the drop.
    ok(typeof sever === 'function', 'the socket was never proxied, so it cannot be severed - this case would test nothing');
    sever();
    await untilTrue(page, () => document.querySelector('[role="dialog"][aria-label*="Support"]')?.dataset.live === '0');
    ok(await panel(page).getAttribute('data-live') === '0', 'severing the socket did not register as a drop');
    await api(`/admin/chats/${id}/reply`, { method: 'POST', body: JSON.stringify({ body: 'One more thing - bring a hat.' }) });
    const dropped = Date.now();
    await sleep(350);
    ok(await panel(page).locator('text=bring a hat').count() === 0, 'the page saw a message over a socket that was closed');

    const gapArrived = await seen(page.locator('text=bring a hat'), 20000);
    const gap = Date.now() - dropped;
    // THE assertion this whole case exists for. With the reconnect's catch-up
    // removed, this never arrives at ALL - measured, 20s and nothing - because the
    // polling fallback unmounts again the moment the socket is back, before its
    // first 5s tick. So the catch-up is not a belt over a brace; for a short drop
    // it is the only thing carrying the message.
    ok(gapArrived, 'a message sent while the socket was down NEVER arrived - the reconnect does not read back what it missed');
    ok(!gapArrived || gap < 4000, `the gap message took ${gap}ms - slow enough that it came from the fallback tick, not the reconnect`);
    ok(await panel(page).getAttribute('data-live') === '1', 'the socket never reconnected after being severed');

    // Nothing may be duplicated by the gap's two possible carriers.
    const body = await panel(page).innerText();
    ok(!gapArrived || (body.match(/bring a hat/g) || []).length === 1,
      'the message was shown twice - the socket and the catch-up both added it');

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
    ok(await seen(page.locator('text=keep the walking short'), 12000), 'the reply never reached a guest with no WebSocket');
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
