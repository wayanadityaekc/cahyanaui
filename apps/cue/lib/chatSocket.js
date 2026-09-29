// The guest's live connection to a handed-over chat.
//
// WHAT IT IS FOR: Wayan's reply landing the moment he sends it instead of
// whenever the next poll happened to be due, plus the two things a poll cannot
// carry at all - that he is typing, and that he is actually at the dashboard
// right now.
//
// WHAT IT IS NOT: the way messages are sent, and not the only way they arrive.
// Sending still goes over HTTP (see chatThread.js) because that is where the
// caps, the validation and an error the guest can read all live. And a socket
// is not a delivery guarantee: a phone changing network, a lid closing, a
// corporate proxy that drops idle connections and a deploy on the API all leave
// this either dead or missing frames, usually with no event to say so.
//
// So the contract has two halves, and BOTH are load-bearing:
//   onOpen  - called on every connect, INCLUDING every reconnect. The caller
//             fetches everything since the last id it saw, which is what makes a
//             gap in the socket cost one request instead of a lost message.
//   onLive  - the socket is up, or it is not. While it is not, the caller polls
//             exactly as it did before this file existed. A guest behind a proxy
//             that blocks WebSockets gets the old behaviour, not silence.
import { API_BASE } from '@/lib/constants';

// The API base is an /api path; the socket lives at the origin's /ws/chat. Built
// from the same constant rather than a second env var, so a staging API cannot
// end up with the site talking HTTP to one host and sockets to another.
export function chatSocketUrl(thread) {
  const u = new URL(API_BASE, typeof window === 'undefined' ? 'https://localhost' : window.location.href);
  u.protocol = u.protocol === 'http:' ? 'ws:' : 'wss:';
  u.pathname = '/ws/chat';
  u.search = `?thread=${encodeURIComponent(thread)}`;
  return u.toString();
}

// The server pings every 30s. This is shorter on purpose: a proxy that closes
// idle connections counts silence in either direction, and a client ping also
// gets an answer, which is how we learn a socket is dead rather than quiet.
const PING_MS = 25000;
// A dead ping is only conclusive once the answer is overdue by more than the
// round trip could plausibly be.
const PONG_GRACE_MS = 10000;
const BACKOFF_MS = [1000, 2000, 4000, 8000, 15000, 20000];

export function openChatSocket(thread, { onMessage, onTyping, onPresence, onOpen, onLive } = {}) {
  if (typeof window === 'undefined' || typeof WebSocket === 'undefined') {
    // No socket here: the caller stays on polling, which still works.
    if (onLive) onLive(false);
    return { close() {}, typing() {}, live: () => false };
  }

  let ws = null;
  let closedByUs = false;
  let tries = 0;
  let live = false;
  let pingTimer = null;
  let pongTimer = null;
  let retryTimer = null;

  function setLive(v) {
    if (live === v) return;
    live = v;
    if (onLive) onLive(v);
  }

  function stopTimers() {
    clearInterval(pingTimer); pingTimer = null;
    clearTimeout(pongTimer); pongTimer = null;
  }

  function beat() {
    stopTimers();
    pingTimer = setInterval(() => {
      if (!ws || ws.readyState !== WebSocket.OPEN) return;
      try { ws.send(JSON.stringify({ type: 'ping' })); } catch (e) { return; }
      // No answer in time means this socket is half-open: it looks connected
      // from here and nothing is reading it. Closing it is what triggers a
      // reconnect, and the reconnect is what triggers the catch-up fetch.
      clearTimeout(pongTimer);
      pongTimer = setTimeout(() => { try { ws.close(); } catch (e) { /* already gone */ } }, PONG_GRACE_MS);
    }, PING_MS);
  }

  function connect() {
    if (closedByUs) return;
    let sock;
    try { sock = new WebSocket(chatSocketUrl(thread)); } catch (e) { return schedule(); }
    ws = sock;

    sock.onopen = () => {
      tries = 0;
      setLive(true);
      beat();
      // Every connect, not just the first. Anything said while we were away is
      // read back here, so a dropped socket is never a dropped message.
      if (onOpen) onOpen();
    };

    sock.onmessage = (ev) => {
      let msg = null;
      try { msg = JSON.parse(ev.data); } catch (e) { return; }
      if (!msg || typeof msg.type !== 'string') return;
      if (msg.type === 'pong') { clearTimeout(pongTimer); pongTimer = null; return; }
      if (msg.type === 'ready') { if (onPresence) onPresence(!!msg.ownerHere); return; }
      if (msg.type === 'presence') { if (onPresence) onPresence(!!msg.ownerHere); return; }
      if (msg.type === 'typing') { if (onTyping) onTyping(msg.expiresIn || 4000); return; }
      if (msg.type === 'message' && msg.message && onMessage) onMessage(msg.message);
    };

    // A refused handshake arrives as an error then a close, so the retry lives in
    // one place.
    sock.onerror = () => {};
    sock.onclose = () => {
      stopTimers();
      setLive(false);
      if (onPresence) onPresence(false);
      schedule();
    };
    return undefined;
  }

  // Never gives up, and never hammers. While it is retrying the caller is
  // polling, so "still trying" costs the guest nothing.
  function schedule() {
    if (closedByUs) return;
    const wait = BACKOFF_MS[Math.min(tries, BACKOFF_MS.length - 1)];
    tries += 1;
    clearTimeout(retryTimer);
    // Jitter so a deploy that drops every socket at once does not bring them all
    // back in the same millisecond.
    retryTimer = setTimeout(connect, wait + Math.floor(Math.random() * 400));
  }

  connect();

  return {
    close() {
      closedByUs = true;
      stopTimers();
      clearTimeout(retryTimer);
      setLive(false);
      if (ws) { ws.onclose = null; try { ws.close(); } catch (e) { /* already gone */ } }
    },
    // Ephemeral and best-effort by design: if the socket is down, the guest's
    // typing simply is not announced. Nothing is queued - a "typing" that
    // arrives after the message would be nonsense.
    typing() {
      if (ws && ws.readyState === WebSocket.OPEN) {
        try { ws.send(JSON.stringify({ type: 'typing' })); } catch (e) { /* dropped, and that is fine */ }
      }
    },
    live: () => live,
  };
}
