'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Send, MessageCircle } from 'lucide-react';
import { usePricing } from '@/state/PricingProvider';
import { useAccount } from '@/state/AccountProvider';
import AuthModal from '@/components/account/AuthModal';
import { FIELD_INPUT } from '@/components/ui/formClasses';
import { PANEL_CLOSE } from '@/components/ui/hsClasses';
import { SUGGESTIONS, CHAT_COPY, wayanIsAround } from '@/content/shared/chat';
import { readThread, startThread, sendToThread, pollThread, setContact } from '@/lib/chatThread';
import { openChatSocket } from '@/lib/chatSocket';
import { answerFor } from '@/lib/chatAnswers';
import {
  PANEL,
  SCRIM,
  HEAD,
  HEAD_AVATAR,
  HEAD_STACK,
  HEAD_TITLE,
  HEAD_SUB,
  BODY,
  BUBBLE_BOT,
  BUBBLE_ME,
  ROW,
  ROW_NAME,
  ROW_NOTE,
  ROW_PRICE,
  LINK,
  HANDOFF_BTN,
  CHIPS,
  CHIP_Q,
  FOOT,
  SEND,
  DOTS,
  DOT,
  TYPING_ROW,
  TYPING_WHO,
  DOT_LIVE,
  HANDOFF_FORM,
  HANDOFF_ROW,
  NOTE,
  ALT_LINK,
  BUBBLE_WAYAN,
  WHO,
  CONNECTED,
  SIGNIN_BAR,
  SIGNIN_TEXT,
  SIGNIN_BTN,
} from './chatClasses';

const THINK_MS = 400;

let seq = 0;
function uid() {
  return `m${(seq += 1)}`;
}

export default function ChatPanel({ open, onClose }) {
  const pricing = usePricing();
  const { account, hydrated } = useAccount();
  const [log, setLog] = useState(() => [{ id: uid(), from: 'bot', text: CHAT_COPY.greeting, chips: SUGGESTIONS }]);
  const [draft, setDraft] = useState('');
  const [thinking, setThinking] = useState(false);
  const bodyRef = useRef(null);
  const inputRef = useRef(null);

  const [authOpen, setAuthOpen] = useState(false);
  const greeted = useRef(false);

  const [thread, setThread] = useState(null);
  const [sending, setSending] = useState(false);
  const [mail, setMail] = useState('idle');
  const [mailDraft, setMailDraft] = useState('');
  const [mailErr, setMailErr] = useState('');
  const [quiet, setQuiet] = useState(false);
  const lastSeen = useRef(0);
  const heard = useRef(false);

  const [live, setLive] = useState(false);
  const [ownerHere, setOwnerHere] = useState(false);
  const [typingUntil, setTypingUntil] = useState(0);
  const sock = useRef(null);
  const seenIds = useRef(new Set());
  const ownerHereRef = useRef(false);
  const lastTyped = useRef(0);

  const pricingContext = useMemo(
    () => ({ catalog: pricing && pricing.catalog, lookup: pricing && pricing.lookup }),
    [pricing],
  );

  useEffect(() => {
    const name =
      account &&
      String(account.name || '')
        .trim()
        .split(/\s+/)[0];
    if (!name || greeted.current) return;
    greeted.current = true;
    const line = { id: uid(), from: 'bot', text: CHAT_COPY.hello.replace('{name}', name), chips: SUGGESTIONS };
    setLog((prev) => (prev.length === 1 && prev[0].from === 'bot' ? [line] : [...prev, line]));
  }, [account]);

  useEffect(() => {
    const id = readThread();
    if (id) setThread(id);
  }, []);

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
    setLog((prev) => [...prev, ...fresh.map((message) => ({ id: uid(), from: 'wayan', text: message.body }))]);
  }, []);

  const catchUp = useCallback(async () => {
    try {
      const { gone, messages } = await pollThread(thread, lastSeen.current);
      if (gone) {
        setThread(null);
        setLog((prev) => [...prev, { id: uid(), from: 'bot', text: CHAT_COPY.threadGone, chips: SUGGESTIONS }]);
        return;
      }
      takeOwner(messages);
    } catch (e) {}
  }, [thread, takeOwner]);

  useEffect(() => {
    if (!open || !thread) return undefined;
    const chatSocket = openChatSocket(thread, {
      onOpen: catchUp,
      onLive: setLive,
      onPresence: (isPresent) => {
        ownerHereRef.current = isPresent;
        setOwnerHere(isPresent);
      },
      onTyping: (durationMs) => setTypingUntil(Date.now() + durationMs),
      onMessage: (message) => takeOwner([message]),
    });
    sock.current = chatSocket;
    return () => {
      sock.current = null;
      chatSocket.close();
    };
  }, [open, thread, catchUp, takeOwner]);

  useEffect(() => {
    if (!open || !thread || live) return undefined;
    catchUp();
    const pollTimer = setInterval(catchUp, 5000);
    return () => clearInterval(pollTimer);
  }, [open, thread, live, catchUp]);

  useEffect(() => {
    if (!open || !thread) return undefined;
    function onShow() {
      if (document.visibilityState === 'visible') catchUp();
    }
    document.addEventListener('visibilitychange', onShow);
    return () => document.removeEventListener('visibilitychange', onShow);
  }, [open, thread, catchUp]);

  const wayanTyping = typingUntil > Date.now();
  useEffect(() => {
    const remainingMs = typingUntil - Date.now();
    if (remainingMs <= 0) return undefined;
    const typingTimer = setTimeout(() => setTypingUntil(0), remainingMs);
    return () => clearTimeout(typingTimer);
  }, [typingUntil]);

  useEffect(() => {
    const body = bodyRef.current;
    if (body) body.scrollTop = body.scrollHeight;
  }, [log, thinking]);

  useEffect(() => {
    if (!open) return undefined;
    const focusTimer = setTimeout(() => inputRef.current && inputRef.current.focus(), 60);
    function onKey(event) {
      if (event.key === 'Escape' && !authOpen) onClose();
    }
    document.addEventListener('keydown', onKey);
    return () => {
      clearTimeout(focusTimer);
      document.removeEventListener('keydown', onKey);
    };
  }, [open, onClose, authOpen]);

  const connect = useCallback(
    async (question) => {
      if (sending) return;
      setSending(true);
      try {
        const id = await startThread({
          question,
          name: (account && account.name) || '',
          email: (account && account.email) || '',
          page: typeof window !== 'undefined' ? window.location.pathname : '',
        });
        setThread(id);
        setLog((prev) => [
          ...prev,
          {
            id: uid(),
            from: 'bot',
            text: `${CHAT_COPY.connected} ${
              ownerHereRef.current ? CHAT_COPY.hoursHere : wayanIsAround() ? CHAT_COPY.hoursOpen : CHAT_COPY.hoursClosed
            }`,
          },
        ]);
      } catch (e) {
        setLog((prev) => [...prev, { id: uid(), from: 'bot', text: e.message || 'Could not reach Wayan just now.' }]);
      }
      setSending(false);
    },
    [sending, account],
  );

  const ask = useCallback(
    (question) => {
      const text = String(question || '').trim();
      if (!text || thinking || sending) return;
      setDraft('');
      setLog((prev) => [...prev, { id: uid(), from: 'me', text: text }]);

      if (thread) {
        sendToThread(thread, text).catch(() => {
          setLog((prev) => [...prev, { id: uid(), from: 'bot', text: 'That did not send. Try again in a moment.' }]);
        });
        return;
      }

      setThinking(true);

      setTimeout(() => {
        const result = answerFor(text, pricingContext);
        const message = { id: uid(), from: 'bot', text: result.text, rows: result.rows, link: result.link };
        if (result.kind === 'handoff') {
          message.text = CHAT_COPY.connecting;
          connect(text);
        }
        setLog((prev) => [...prev, message]);
        setThinking(false);
      }, THINK_MS);
    },
    [pricingContext, thinking, sending, thread, connect],
  );

  useEffect(() => {
    if (!thread || mail !== 'idle') return undefined;
    if (account && account.email) {
      setMail('skip');
      return undefined;
    }
    if (!wayanIsAround()) {
      setMail('ask');
      return undefined;
    }
    const quietTimer = setTimeout(() => setQuiet(true), CHAT_COPY.quietMs);
    return () => clearTimeout(quietTimer);
  }, [thread, mail, account]);

  useEffect(() => {
    if (quiet && mail === 'idle' && !heard.current) setMail('ask');
  }, [quiet, mail]);

  function onDraft(draftText) {
    setDraft(draftText);
    if (!thread || !sock.current) return;
    const now = Date.now();
    if (now - lastTyped.current < 2000) return;
    lastTyped.current = now;
    sock.current.typing();
  }

  async function saveEmail(event) {
    event.preventDefault();
    const emailAddress = mailDraft.trim();
    if (!emailAddress || !thread) return;
    setMailErr('');
    try {
      await setContact(thread, emailAddress);
      setMail('done');
      setLog((prev) => [...prev, { id: uid(), from: 'bot', text: CHAT_COPY.emailDone }]);
    } catch (e) {
      setMailErr(e.message || CHAT_COPY.emailBad);
    }
  }

  return (
    <>
      <AuthModal open={authOpen} onClose={() => setAuthOpen(false)} />
      <div className={SCRIM(open)} onClick={onClose} aria-hidden="true" />
      <div
        className={PANEL(open)}
        role="dialog"
        data-live={live ? '1' : '0'}
        aria-label={CHAT_COPY.title}
        aria-modal="false"
        {...(open ? {} : { inert: '' })}
      >
        <div className={HEAD}>
          <span className={HEAD_AVATAR} aria-hidden="true">
            <MessageCircle strokeWidth={1.6} />
          </span>
          <span className={HEAD_STACK}>
            <span className={HEAD_TITLE}>{CHAT_COPY.title}</span>
            <span className={HEAD_SUB}>{CHAT_COPY.sub}</span>
          </span>
          <button type="button" className={PANEL_CLOSE} onClick={onClose} aria-label="Close chat">
            ×
          </button>
        </div>

        <div className={BODY} ref={bodyRef}>
          {hydrated && !account && (
            <p className={SIGNIN_BAR}>
              <span className={SIGNIN_TEXT}>{CHAT_COPY.signedOut}</span>
              <button type="button" className={SIGNIN_BTN} data-cta data-signin onClick={() => setAuthOpen(true)}>
                {CHAT_COPY.signIn}
              </button>
            </p>
          )}

          {log.map((entry) => {
            if (entry.from === 'me')
              return (
                <p key={entry.id} className={BUBBLE_ME}>
                  {entry.text}
                </p>
              );
            if (entry.from === 'wayan') {
              return (
                <p key={entry.id} className={BUBBLE_WAYAN}>
                  <small className={WHO}>Wayan</small>
                  {entry.text}
                </p>
              );
            }
            return <BotReply key={entry.id} m={entry} onAsk={ask} />;
          })}

          {mail === 'ask' && (
            <form className={HANDOFF_FORM} onSubmit={saveEmail}>
              <p className={NOTE}>{CHAT_COPY.emailAsk}</p>
              <span className={HANDOFF_ROW}>
                <input
                  className={FIELD_INPUT}
                  type="email"
                  value={mailDraft}
                  onChange={(event) => setMailDraft(event.target.value)}
                  placeholder={CHAT_COPY.emailField}
                  aria-label={CHAT_COPY.emailField}
                  maxLength={200}
                />
              </span>
              {mailErr && <p className={NOTE}>{mailErr}</p>}
              <span className="flex items-center gap-[0.6rem]">
                <button type="submit" className={HANDOFF_BTN} data-cta data-mailsend disabled={!mailDraft.trim()}>
                  {CHAT_COPY.emailSend}
                </button>
                <button type="button" className={ALT_LINK} onClick={() => setMail('skip')}>
                  {CHAT_COPY.emailSkip}
                </button>
              </span>
            </form>
          )}

          {thinking && (
            <span className={DOTS} aria-label="Typing">
              <i className={DOT} />
              <i className={DOT} />
              <i className={DOT} />
            </span>
          )}

          {wayanTyping && (
            <span className={TYPING_ROW} data-typing aria-live="polite">
              <small className={TYPING_WHO}>{CHAT_COPY.typing}</small>
              <i className={DOT_LIVE(0)} />
              <i className={DOT_LIVE(1)} />
              <i className={DOT_LIVE(2)} />
            </span>
          )}
        </div>

        {thread && (
          <p className={CONNECTED}>
            <MessageCircle strokeWidth={2} aria-hidden="true" />
            {ownerHere ? CHAT_COPY.ownerHere : CHAT_COPY.connectedStrip}
          </p>
        )}

        <form
          className={FOOT}
          onSubmit={(event) => {
            event.preventDefault();
            ask(draft);
          }}
        >
          <input
            ref={inputRef}
            className={`${FIELD_INPUT} flex-1`}
            value={draft}
            onChange={(event) => onDraft(event.target.value)}
            placeholder={thread ? 'Write to Wayan...' : CHAT_COPY.placeholder}
            aria-label="Your question"
            maxLength={300}
          />
          <button
            type="submit"
            className={SEND}
            data-cta
            disabled={!draft.trim() || thinking || sending}
            aria-label="Send"
          >
            <Send strokeWidth={1.8} aria-hidden="true" />
          </button>
        </form>
      </div>
    </>
  );
}

function BotReply({ m: reply, onAsk }) {
  return (
    <>
      <p className={BUBBLE_BOT}>{reply.text}</p>

      {reply.rows &&
        reply.rows.map((row) => (
          <a key={row.label} className={ROW} data-pricerow href={row.href}>
            <span className={ROW_NAME}>
              {row.label}
              {row.note && <small className={ROW_NOTE}>{row.note}</small>}
            </span>
            {row.price && <span className={ROW_PRICE}>{row.price}</span>}
          </a>
        ))}

      {reply.link && (
        <a className={LINK} data-cta href={reply.link.href}>
          {reply.link.label}
        </a>
      )}

      {reply.nudge && <p className={BUBBLE_BOT}>{reply.nudge}</p>}

      {reply.chips && (
        <span className={CHIPS}>
          {reply.chips.map((chip) => (
            <button key={chip} type="button" className={CHIP_Q} data-chip onClick={() => onAsk(chip)}>
              {chip}
            </button>
          ))}
        </span>
      )}
    </>
  );
}
