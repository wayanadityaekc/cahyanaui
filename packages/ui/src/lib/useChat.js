'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { createChatThread } from './chatThread.js';
import { openChatSocket } from './chatSocket.js';

const THINK_MS = 400;
const POLL_MS = 5000;
const TYPING_FRAME_MS = 2000;

let seq = 0;
function uid() {
  seq += 1;
  return `m${seq}`;
}

function firstName(account) {
  return account
    ? String(account.name || '')
        .trim()
        .split(/\s+/)[0]
    : '';
}

export default function useChat({
  open = false,
  apiBase = '',
  storageKey = 'chat_thread_v1',
  answerFor = () => ({ kind: 'handoff', text: '' }),
  copy = {},
  suggestions = [],
  page = () => '',
  account = null,
  isAround = () => true,
} = {}) {
  const client = useMemo(() => createChatThread({ apiBase, storageKey }), [apiBase, storageKey]);
  const [log, setLog] = useState(() => [{ id: uid(), from: 'bot', text: copy.greeting, chips: suggestions }]);
  const [draft, setDraft] = useState('');
  const [thinking, setThinking] = useState(false);
  const [thread, setThread] = useState(null);
  const [sending, setSending] = useState(false);
  const [mail, setMail] = useState('idle');
  const [mailDraft, setMailDraft] = useState('');
  const [mailErr, setMailErr] = useState('');
  const [quiet, setQuiet] = useState(false);
  const [live, setLive] = useState(false);
  const [ownerHere, setOwnerHere] = useState(false);
  const [typingUntil, setTypingUntil] = useState(0);
  const lastSeen = useRef(0);
  const heard = useRef(false);
  const greeted = useRef(false);
  const sock = useRef(null);
  const seenIds = useRef(new Set());
  const ownerHereRef = useRef(false);
  const lastTyped = useRef(0);
  const copyRef = useRef(copy);
  copyRef.current = copy;

  function say(text, extra = {}) {
    setLog((prev) => [...prev, { id: uid(), from: 'bot', text, ...extra }]);
  }

  async function deliver(id, text) {
    try {
      await client.send(id, text);
    } catch (e) {
      say(copyRef.current.sendFailed);
    }
  }

  useEffect(() => {
    const name = firstName(account);
    if (!name || greeted.current) return;
    greeted.current = true;
    const line = { id: uid(), from: 'bot', text: String(copy.hello || '').replace('{name}', name), chips: suggestions };
    setLog((prev) => (prev.length === 1 && prev[0].from === 'bot' ? [line] : [...prev, line]));
  }, [account, copy.hello, suggestions]);

  useEffect(() => {
    const id = client.read();
    if (id) setThread(id);
  }, [client]);

  const takeOwner = useCallback((list) => {
    const fresh = [];
    list.forEach((message) => {
      if (message.id > lastSeen.current) lastSeen.current = message.id;
      if (message.sender !== 'owner' || seenIds.current.has(message.id)) return;
      seenIds.current.add(message.id);
      fresh.push(message);
    });
    if (!fresh.length) return;
    heard.current = true;
    setLog((prev) => [...prev, ...fresh.map((message) => ({ id: uid(), from: 'owner', text: message.body }))]);
  }, []);

  const catchUp = useCallback(async () => {
    if (!thread) return;
    try {
      const { gone, messages } = await client.poll(thread, lastSeen.current);
      if (gone) {
        setThread(null);
        setLog((prev) => [...prev, { id: uid(), from: 'bot', text: copyRef.current.threadGone, chips: suggestions }]);
        return;
      }
      takeOwner(messages);
    } catch (e) {}
  }, [client, thread, takeOwner, suggestions]);

  useEffect(() => {
    if (!open || !thread) return undefined;
    const socket = openChatSocket({
      apiBase,
      thread,
      onOpen: catchUp,
      onLive: setLive,
      onPresence: (here) => {
        ownerHereRef.current = here;
        setOwnerHere(here);
      },
      onTyping: (durationMs) => setTypingUntil(Date.now() + durationMs),
      onMessage: (message) => takeOwner([message]),
    });
    sock.current = socket;
    return () => {
      sock.current = null;
      socket.close();
    };
  }, [open, thread, apiBase, catchUp, takeOwner]);

  useEffect(() => {
    if (!open || !thread || live) return undefined;
    catchUp();
    const timer = setInterval(catchUp, POLL_MS);
    return () => clearInterval(timer);
  }, [open, thread, live, catchUp]);

  useEffect(() => {
    if (!open || !thread) return undefined;
    function onShow() {
      if (document.visibilityState === 'visible') catchUp();
    }
    document.addEventListener('visibilitychange', onShow);
    return () => document.removeEventListener('visibilitychange', onShow);
  }, [open, thread, catchUp]);

  const ownerTyping = typingUntil > Date.now();
  useEffect(() => {
    const remainingMs = typingUntil - Date.now();
    if (remainingMs <= 0) return undefined;
    const timer = setTimeout(() => setTypingUntil(0), remainingMs);
    return () => clearTimeout(timer);
  }, [typingUntil]);

  const connect = useCallback(
    async (question) => {
      if (sending) return;
      setSending(true);
      const words = copyRef.current;
      try {
        const id = await client.start({
          question,
          name: (account && account.name) || '',
          email: (account && account.email) || '',
          page: String(page() || '').slice(0, 200),
        });
        setThread(id);
        let hours = words.hoursClosed;
        if (ownerHereRef.current) hours = words.hoursHere;
        else if (isAround()) hours = words.hoursOpen;
        say(`${words.connected} ${hours}`);
      } catch (e) {
        say(e.message || words.reachFailed);
      }
      setSending(false);
    },
    [sending, account, client, page, isAround],
  );

  const ask = useCallback(
    (question) => {
      const text = String(question || '').trim();
      if (!text || thinking || sending) return;
      setDraft('');
      setLog((prev) => [...prev, { id: uid(), from: 'me', text }]);

      if (thread) {
        deliver(thread, text);
        return;
      }

      setThinking(true);
      setTimeout(() => {
        const result = answerFor(text) || { kind: 'handoff' };
        const line = {
          id: uid(),
          from: 'bot',
          text: result.text,
          rows: result.rows,
          link: result.link,
          chips: result.chips,
        };
        if (result.kind === 'handoff') {
          line.text = copyRef.current.connecting;
          connect(text);
        }
        setLog((prev) => [...prev, line]);
        setThinking(false);
      }, THINK_MS);
    },
    [answerFor, thinking, sending, thread, connect, client],
  );

  useEffect(() => {
    if (!thread || mail !== 'idle') return undefined;
    if (account && account.email) {
      setMail('skip');
      return undefined;
    }
    if (!isAround()) {
      setMail('ask');
      return undefined;
    }
    const timer = setTimeout(() => setQuiet(true), copyRef.current.quietMs || 120000);
    return () => clearTimeout(timer);
  }, [thread, mail, account, isAround]);

  useEffect(() => {
    if (quiet && mail === 'idle' && !heard.current) setMail('ask');
  }, [quiet, mail]);

  function onDraft(value) {
    setDraft(value);
    if (!thread || !sock.current) return;
    const now = Date.now();
    if (now - lastTyped.current < TYPING_FRAME_MS) return;
    lastTyped.current = now;
    sock.current.typing();
  }

  async function saveEmail(e) {
    e.preventDefault();
    const address = mailDraft.trim();
    if (!address || !thread) return;
    setMailErr('');
    try {
      await client.setContact(thread, address);
      setMail('done');
      say(copyRef.current.emailDone);
    } catch (e) {
      setMailErr(e.message || copyRef.current.emailBad);
    }
  }

  return {
    log,
    draft,
    onDraft,
    ask,
    thinking,
    sending,
    thread,
    live,
    ownerHere,
    ownerTyping,
    mail,
    mailDraft,
    setMailDraft,
    mailErr,
    saveEmail,
    skipMail: () => setMail('skip'),
  };
}
