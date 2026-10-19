'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { createChatThread } from './chatThread.js';
import { openChatSocket } from './chatSocket.js';

const MAX_PAGE_LENGTH = 200;
const DEFAULT_QUIET_DELAY_MS = 120000;

const THINK_MS = 400;
const POLL_MS = 5000;
const TYPING_FRAME_MS = 2000;

let seq = 0;
function createMessageId() {
  seq += 1;
  return `m${seq}`;
}

function extractFirstName(account) {
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
  const [log, setLog] = useState(() => [
    { id: createMessageId(), from: 'bot', text: copy.greeting, chips: suggestions },
  ]);
  const [draft, setDraft] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const [thread, setThread] = useState(null);
  const [isSending, setIsSending] = useState(false);
  const [mail, setMail] = useState('idle');
  const [mailDraft, setMailDraft] = useState('');
  const [mailErr, setMailErr] = useState('');
  const [isQuiet, setIsQuiet] = useState(false);
  const [isLive, setIsLive] = useState(false);
  const [isOwnerPresent, setIsOwnerPresent] = useState(false);
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

  function addBotMessage(text, extra = {}) {
    setLog((prev) => [...prev, { id: createMessageId(), from: 'bot', text, ...extra }]);
  }

  async function sendMessage(id, text) {
    try {
      await client.send(id, text);
    } catch (e) {
      addBotMessage(copyRef.current.sendFailed);
    }
  }

  useEffect(() => {
    const name = extractFirstName(account);
    if (!name || greeted.current) return;
    greeted.current = true;
    const line = {
      id: createMessageId(),
      from: 'bot',
      text: String(copy.hello || '').replace('{name}', name),
      chips: suggestions,
    };
    setLog((prev) => (prev.length === 1 && prev[0].from === 'bot' ? [line] : [...prev, line]));
  }, [account, copy.hello, suggestions]);

  useEffect(() => {
    const id = client.read();
    if (id) setThread(id);
  }, [client]);

  const takeOwner = useCallback((list) => {
    const freshMessages = [];
    list.forEach((message) => {
      if (message.id > lastSeen.current) lastSeen.current = message.id;
      if (message.sender !== 'owner' || seenIds.current.has(message.id)) return;
      seenIds.current.add(message.id);
      freshMessages.push(message);
    });
    if (!freshMessages.length) return;
    heard.current = true;
    setLog((prev) => [
      ...prev,
      ...freshMessages.map((message) => ({ id: createMessageId(), from: 'owner', text: message.body })),
    ]);
  }, []);

  const catchUp = useCallback(async () => {
    if (!thread) return;
    try {
      const { gone, messages } = await client.poll(thread, lastSeen.current);
      if (gone) {
        setThread(null);
        setLog((prev) => [
          ...prev,
          { id: createMessageId(), from: 'bot', text: copyRef.current.threadGone, chips: suggestions },
        ]);
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
      onLive: setIsLive,
      onPresence: (here) => {
        ownerHereRef.current = here;
        setIsOwnerPresent(here);
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
    const shouldSkipLiveSync = !open || !thread || isLive;
    if (shouldSkipLiveSync) return undefined;
    catchUp();
    const timer = setInterval(catchUp, POLL_MS);
    return () => clearInterval(timer);
  }, [open, thread, isLive, catchUp]);

  useEffect(() => {
    if (!open || !thread) return undefined;
    function handleVisibilityChange() {
      if (document.visibilityState === 'visible') catchUp();
    }
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [open, thread, catchUp]);

  const isOwnerTyping = typingUntil > Date.now();
  useEffect(() => {
    const remainingMs = typingUntil - Date.now();
    if (remainingMs <= 0) return undefined;
    const timer = setTimeout(() => setTypingUntil(0), remainingMs);
    return () => clearTimeout(timer);
  }, [typingUntil]);

  const connect = useCallback(
    async (question) => {
      if (isSending) return;
      setIsSending(true);
      const words = copyRef.current;
      try {
        const id = await client.start({
          question,
          name: (account && account.name) || '',
          email: (account && account.email) || '',
          page: String(page() || '').slice(0, MAX_PAGE_LENGTH),
        });
        setThread(id);
        let hours = words.hoursClosed;
        if (ownerHereRef.current) hours = words.hoursHere;
        else if (isAround()) hours = words.hoursOpen;
        addBotMessage(`${words.connected} ${hours}`);
      } catch (e) {
        addBotMessage(e.message || words.reachFailed);
      }
      setIsSending(false);
    },
    [isSending, account, client, page, isAround],
  );

  const ask = useCallback(
    (question) => {
      const text = String(question || '').trim();
      const isSendBlocked = !text || isThinking || isSending;
      if (isSendBlocked) return;
      setDraft('');
      setLog((prev) => [...prev, { id: createMessageId(), from: 'me', text }]);

      if (thread) {
        sendMessage(thread, text);
        return;
      }

      setIsThinking(true);
      setTimeout(() => {
        const result = answerFor(text) || { kind: 'handoff' };
        const line = {
          id: createMessageId(),
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
        setIsThinking(false);
      }, THINK_MS);
    },
    [answerFor, isThinking, isSending, thread, connect, client],
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
    const timer = setTimeout(() => setIsQuiet(true), copyRef.current.quietMs || DEFAULT_QUIET_DELAY_MS);
    return () => clearTimeout(timer);
  }, [thread, mail, account, isAround]);

  useEffect(() => {
    const shouldAskForEmail = isQuiet && mail === 'idle' && !heard.current;
    if (shouldAskForEmail) setMail('ask');
  }, [isQuiet, mail]);

  function handleDraftChange(value) {
    setDraft(value);
    if (!thread || !sock.current) return;
    const now = Date.now();
    if (now - lastTyped.current < TYPING_FRAME_MS) return;
    lastTyped.current = now;
    sock.current.typing();
  }

  async function saveEmail(event) {
    event.preventDefault();
    const address = mailDraft.trim();
    if (!address || !thread) return;
    setMailErr('');
    try {
      await client.setContact(thread, address);
      setMail('done');
      addBotMessage(copyRef.current.emailDone);
    } catch (e) {
      setMailErr(e.message || copyRef.current.emailBad);
    }
  }

  return {
    log,
    draft,
    onDraft: handleDraftChange,
    ask,
    thinking: isThinking,
    sending: isSending,
    thread,
    live: isLive,
    ownerHere: isOwnerPresent,
    ownerTyping: isOwnerTyping,
    mail,
    mailDraft,
    setMailDraft,
    mailErr,
    saveEmail,
    skipMail: () => setMail('skip'),
  };
}
