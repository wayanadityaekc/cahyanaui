// Live chat socket (replies, typing, presence); sends stay HTTP, onOpen fires on each reconnect, poll while not live.
import { API_BASE } from '@/lib/constants';

// Socket URL derived from API_BASE (no second env var), so HTTP and WS always hit the same host.
export function chatSocketUrl(thread) {
  const u = new URL(API_BASE, typeof window === 'undefined' ? 'https://localhost' : window.location.href);
  u.protocol = u.protocol === 'http:' ? 'ws:' : 'wss:';
  u.pathname = '/ws/chat';
  u.search = `?thread=${encodeURIComponent(thread)}`;
  return u.toString();
}

// Client ping every 25s (server pings at 30s); an unanswered ping is how a dead socket is detected.
const PING_MS = 25000;
// How long past a ping before the socket counts as dead.
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
      // No pong in time = half-open socket; closing it triggers the reconnect and its catch-up fetch.
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
      // Runs on every connect, not just the first, so messages missed while disconnected are fetched.
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

    // A refused handshake fires error then close, so retry is handled only in onclose.
    sock.onerror = () => {};
    sock.onclose = () => {
      stopTimers();
      setLive(false);
      if (onPresence) onPresence(false);
      schedule();
    };
    return undefined;
  }

  // Reconnect forever with backoff; the caller polls meanwhile.
  function schedule() {
    if (closedByUs) return;
    const wait = BACKOFF_MS[Math.min(tries, BACKOFF_MS.length - 1)];
    tries += 1;
    clearTimeout(retryTimer);
    // Jitter so sockets dropped by a deploy don't all reconnect at once.
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
    // Best-effort typing ping: sent only while open, never queued.
    typing() {
      if (ws && ws.readyState === WebSocket.OPEN) {
        try { ws.send(JSON.stringify({ type: 'typing' })); } catch (e) { /* dropped, and that is fine */ }
      }
    },
    live: () => live,
  };
}
