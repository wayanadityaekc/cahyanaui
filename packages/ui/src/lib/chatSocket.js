// Live chat socket (replies, typing, presence), ported from CUE; sends stay HTTP, onOpen fires on every (re)connect.

// Socket URL derived from the site's apiBase (no second setting), so HTTP and WS always hit the same host.
export function chatSocketUrl(apiBase, thread) {
  const url = new URL(apiBase, typeof window === 'undefined' ? 'https://localhost' : window.location.href);
  url.protocol = url.protocol === 'http:' ? 'ws:' : 'wss:';
  url.pathname = '/ws/chat';
  url.search = `?thread=${encodeURIComponent(thread)}`;
  return url.toString();
}

// Client ping every 25s (the server pings at 30s); an unanswered ping is how a dead socket is found.
const PING_MS = 25000;
const PONG_GRACE_MS = 10000;
const BACKOFF_MS = [1000, 2000, 4000, 8000, 15000, 20000];

export function openChatSocket({ apiBase, thread, onMessage, onTyping, onPresence, onOpen, onLive } = {}) {
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

  function setLive(value) {
    if (live === value) return;
    live = value;
    if (onLive) onLive(value);
  }

  function stopTimers() {
    clearInterval(pingTimer);
    pingTimer = null;
    clearTimeout(pongTimer);
    pongTimer = null;
  }

  function closeQuietly() {
    try { ws.close(); } catch (e) { /* already gone */ }
  }

  function beat() {
    stopTimers();
    pingTimer = setInterval(() => {
      if (!ws || ws.readyState !== WebSocket.OPEN) return;
      try { ws.send(JSON.stringify({ type: 'ping' })); } catch (e) { return; }
      // No pong in time = half-open socket; closing it triggers the reconnect and its catch-up fetch.
      clearTimeout(pongTimer);
      pongTimer = setTimeout(closeQuietly, PONG_GRACE_MS);
    }, PING_MS);
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

  function handleFrame(event) {
    let frame = null;
    try { frame = JSON.parse(event.data); } catch (e) { return; }
    if (!frame || typeof frame.type !== 'string') return;
    if (frame.type === 'pong') {
      clearTimeout(pongTimer);
      pongTimer = null;
    } else if (frame.type === 'ready' || frame.type === 'presence') {
      if (onPresence) onPresence(!!frame.ownerHere);
    } else if (frame.type === 'typing') {
      if (onTyping) onTyping(frame.expiresIn || 4000);
    } else if (frame.type === 'message' && frame.message && onMessage) {
      onMessage(frame.message);
    }
  }

  function connect() {
    if (closedByUs) return;
    let sock;
    try {
      sock = new WebSocket(chatSocketUrl(apiBase, thread));
    } catch (e) {
      schedule();
      return;
    }
    ws = sock;

    sock.onopen = () => {
      tries = 0;
      setLive(true);
      beat();
      // Runs on every connect, not just the first, so messages missed while disconnected are fetched.
      if (onOpen) onOpen();
    };
    sock.onmessage = handleFrame;
    // A refused handshake fires error then close, so retry is handled only in onclose.
    sock.onerror = () => {};
    sock.onclose = () => {
      stopTimers();
      setLive(false);
      if (onPresence) onPresence(false);
      schedule();
    };
  }

  connect();

  return {
    close() {
      closedByUs = true;
      stopTimers();
      clearTimeout(retryTimer);
      setLive(false);
      if (ws) {
        ws.onclose = null;
        closeQuietly();
      }
    },
    // Best-effort typing ping: sent only while open, never queued.
    typing() {
      if (!ws || ws.readyState !== WebSocket.OPEN) return;
      try { ws.send(JSON.stringify({ type: 'typing' })); } catch (e) { /* dropped, and that is fine */ }
    },
    live: () => live,
  };
}
