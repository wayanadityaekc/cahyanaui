import { API_BASE } from '@/lib/constants';

export function buildChatSocketUrl(thread) {
  const url = new URL(API_BASE, typeof window === 'undefined' ? 'https://localhost' : window.location.href);
  url.protocol = url.protocol === 'http:' ? 'ws:' : 'wss:';
  url.pathname = '/ws/chat';
  url.search = `?thread=${encodeURIComponent(thread)}`;
  return url.toString();
}

const PING_MS = 25000;
const PONG_GRACE_MS = 10000;
const BACKOFF_MS = [1000, 2000, 4000, 8000, 15000, 20000];

export function openChatSocket(thread, { onMessage, onTyping, onPresence, onOpen, onLive } = {}) {
  if (typeof window === 'undefined' || typeof WebSocket === 'undefined') {
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

  function setLive(isLive) {
    if (live === isLive) return;
    live = isLive;
    if (onLive) onLive(isLive);
  }

  function stopTimers() {
    clearInterval(pingTimer);
    pingTimer = null;
    clearTimeout(pongTimer);
    pongTimer = null;
  }

  function startHeartbeat() {
    stopTimers();
    pingTimer = setInterval(() => {
      if (!ws || ws.readyState !== WebSocket.OPEN) return;
      try {
        ws.send(JSON.stringify({ type: 'ping' }));
      } catch (e) {
        return;
      }
      clearTimeout(pongTimer);
      pongTimer = setTimeout(() => {
        try {
          ws.close();
        } catch (e) {}
      }, PONG_GRACE_MS);
    }, PING_MS);
  }

  function connect() {
    if (closedByUs) return;
    let sock;
    try {
      sock = new WebSocket(buildChatSocketUrl(thread));
    } catch (e) {
      return schedule();
    }
    ws = sock;

    sock.onopen = () => {
      tries = 0;
      setLive(true);
      startHeartbeat();
      if (onOpen) onOpen();
    };

    sock.onmessage = (event) => {
      let message = null;
      try {
        message = JSON.parse(event.data);
      } catch (e) {
        return;
      }
      if (!message || typeof message.type !== 'string') return;
      if (message.type === 'pong') {
        clearTimeout(pongTimer);
        pongTimer = null;
        return;
      }
      if (message.type === 'ready') {
        if (onPresence) onPresence(!!message.ownerHere);
        return;
      }
      if (message.type === 'presence') {
        if (onPresence) onPresence(!!message.ownerHere);
        return;
      }
      if (message.type === 'typing') {
        if (onTyping) onTyping(message.expiresIn || 4000);
        return;
      }
      if (message.type === 'message' && message.message && onMessage) onMessage(message.message);
    };

    sock.onerror = () => {};
    sock.onclose = () => {
      stopTimers();
      setLive(false);
      if (onPresence) onPresence(false);
      schedule();
    };
    return undefined;
  }

  function schedule() {
    if (closedByUs) return;
    const wait = BACKOFF_MS[Math.min(tries, BACKOFF_MS.length - 1)];
    tries += 1;
    clearTimeout(retryTimer);
    retryTimer = setTimeout(connect, wait + Math.floor(Math.random() * 400));
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
        try {
          ws.close();
        } catch (e) {}
      }
    },
    typing() {
      if (ws && ws.readyState === WebSocket.OPEN) {
        try {
          ws.send(JSON.stringify({ type: 'typing' }));
        } catch (e) {}
      }
    },
    live: () => live,
  };
}
