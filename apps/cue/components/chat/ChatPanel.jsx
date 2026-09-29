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
  PANEL, SCRIM, HEAD, HEAD_AVATAR, HEAD_STACK, HEAD_TITLE, HEAD_SUB, BODY,
  BUBBLE_BOT, BUBBLE_ME, ROW, ROW_NAME, ROW_NOTE, ROW_PRICE, LINK, HANDOFF_BTN,
  CHIPS, CHIP_Q, FOOT, SEND, DOTS, DOT, TYPING_ROW, TYPING_WHO, DOT_LIVE,
  HANDOFF_FORM, HANDOFF_ROW, NOTE, ALT_LINK, BUBBLE_WAYAN, WHO, CONNECTED,
  SIGNIN_BAR, SIGNIN_TEXT, SIGNIN_BTN,
} from './chatClasses';

// Support chat panel; answers only come from lib/chatAnswers (published facts), shown after a short 400ms pause.
const THINK_MS = 400;

let seq = 0;
function uid() { return `m${(seq += 1)}`; }

export default function ChatPanel({ open, onClose }) {
  const pricing = usePricing();
  const { account, hydrated } = useAccount();
  const [log, setLog] = useState(() => [
    { id: uid(), from: 'bot', text: CHAT_COPY.greeting, chips: SUGGESTIONS },
  ]);
  const [draft, setDraft] = useState('');
  const [thinking, setThinking] = useState(false);
  const bodyRef = useRef(null);
  const inputRef = useRef(null);

  // Sign-in popup for the chat; optional, guests can chat without signing in.
  const [authOpen, setAuthOpen] = useState(false);
  // Tracks whether we've greeted by name so a mid-conversation sign-in greets only once.
  const greeted = useRef(false);

  const [thread, setThread] = useState(null);
  const [sending, setSending] = useState(false);
  // Email ask after handover, only when useful: 'idle' not asked, 'ask' on screen, 'done' | 'skip' settled.
  const [mail, setMail] = useState('idle');
  const [mailDraft, setMailDraft] = useState('');
  const [mailErr, setMailErr] = useState('');
  const [quiet, setQuiet] = useState(false);
  const lastSeen = useRef(0);
  const heard = useRef(false);

  // Socket state: `live` switches between socket updates and the polling fallback; never shown to the guest.
  const [live, setLive] = useState(false);
  const [ownerHere, setOwnerHere] = useState(false);
  const [typingUntil, setTypingUntil] = useState(0);
  const sock = useRef(null);
  // Dedupe messages by database id; the socket and a reconnect catch-up can both deliver the same one.
  const seenIds = useRef(new Set());
  // Presence kept in a ref so connect() and ask() are not re-memoised (a stale ask() once sent nameless handovers).
  const ownerHereRef = useRef(false);
  const lastTyped = useRef(0);

  const ctx = useMemo(
    () => ({ catalog: pricing && pricing.catalog, lookup: pricing && pricing.lookup }),
    [pricing],
  );

  // Greet a signed-in guest by first name once per conversation, on open or right after signing in.
  useEffect(() => {
    const name = account && String(account.name || '').trim().split(/\s+/)[0];
    if (!name || greeted.current) return;
    greeted.current = true;
    const line = { id: uid(), from: 'bot', text: CHAT_COPY.hello.replace('{name}', name), chips: SUGGESTIONS };
    setLog((prev) => (
      // Replace the unread opener when opened signed-in (avoids two greetings); append when signing in mid-chat.
      prev.length === 1 && prev[0].from === 'bot' ? [line] : [...prev, line]
    ));
  }, [account]);

  // Restore an earlier thread in an effect, not during render, so first paint matches the static HTML.
  useEffect(() => {
    const id = readThread();
    if (id) setThread(id);
  }, []);

  // Turns owner messages into log lines from any source; every message advances lastSeen to keep catch-ups small.
  const takeOwner = useCallback((list) => {
    const fresh = [];
    list.forEach((m) => {
      if (m.id > lastSeen.current) lastSeen.current = m.id;
      if (m.sender !== 'owner' || seenIds.current.has(m.id)) return;
      seenIds.current.add(m.id);
      fresh.push(m);
    });
    if (!fresh.length) return;
    heard.current = true;
    setLog((prev) => [...prev, ...fresh.map((m) => ({ id: uid(), from: 'wayan', text: m.body }))]);
  }, []);

  // Fetch everything since the last seen id; must run on EVERY socket connect, or replies sent while it was down are lost.
  const catchUp = useCallback(async () => {
    try {
      const { gone, messages } = await pollThread(thread, lastSeen.current);
      if (gone) {
        setThread(null);
        setLog((prev) => [...prev, { id: uid(), from: 'bot', text: CHAT_COPY.threadGone, chips: SUGGESTIONS }]);
        return;
      }
      takeOwner(messages);
    } catch (e) {
      /* a dropped read is not worth a message on screen; the next one retries */
    }
  }, [thread, takeOwner]);

  // Open the socket only while the panel is open and a thread exists.
  useEffect(() => {
    if (!open || !thread) return undefined;
    const s = openChatSocket(thread, {
      onOpen: catchUp,
      onLive: setLive,
      onPresence: (v) => { ownerHereRef.current = v; setOwnerHere(v); },
      onTyping: (durationMs) => setTypingUntil(Date.now() + durationMs),
      onMessage: (m) => takeOwner([m]),
    });
    sock.current = s;
    return () => { sock.current = null; s.close(); };
  }, [open, thread, catchUp, takeOwner]);

  // Polling fallback every 5s whenever the socket is down; this is the whole behaviour for guests without WebSockets.
  useEffect(() => {
    if (!open || !thread || live) return undefined;
    catchUp();
    const t = setInterval(catchUp, 5000);
    return () => clearInterval(t);
  }, [open, thread, live, catchUp]);

  // Catch up when the tab becomes visible again; a slept phone's socket looks open but isn't.
  useEffect(() => {
    if (!open || !thread) return undefined;
    function onShow() { if (document.visibilityState === 'visible') catchUp(); }
    document.addEventListener('visibilitychange', onShow);
    return () => document.removeEventListener('visibilitychange', onShow);
  }, [open, thread, catchUp]);

  // Typing indicator expires on its own so a stale 'typing' never stays on screen.
  const wayanTyping = typingUntil > Date.now();
  useEffect(() => {
    const remainingMs = typingUntil - Date.now();
    if (remainingMs <= 0) return undefined;
    const t = setTimeout(() => setTypingUntil(0), remainingMs);
    return () => clearTimeout(t);
  }, [typingUntil]);

  // New message, or the dots appearing: keep the newest line in view.
  useEffect(() => {
    const body = bodyRef.current;
    if (body) body.scrollTop = body.scrollHeight;
  }, [log, thinking]);

  useEffect(() => {
    if (!open) return undefined;
    const t = setTimeout(() => inputRef.current && inputRef.current.focus(), 60);
    function onKey(e) { if (e.key === 'Escape' && !authOpen) onClose(); }
    document.addEventListener('keydown', onKey);
    return () => { clearTimeout(t); document.removeEventListener('keydown', onKey); };
  }, [open, onClose, authOpen]);

  // Hand the question to Wayan straight away, without asking for details first.
  const connect = useCallback(async (question) => {
    if (sending) return;
    setSending(true);
    try {
      const id = await startThread({
        question,
        // Send whatever we know about the guest so the thread opens with a name and email.
        name: (account && account.name) || '',
        email: (account && account.email) || '',
        page: typeof window !== 'undefined' ? window.location.pathname : '',
      });
      setThread(id);
      setLog((prev) => [...prev, {
        id: uid(), from: 'bot',
        // Owner presence beats the office-hours guess when choosing the status line.
        text: `${CHAT_COPY.connected} ${
          ownerHereRef.current ? CHAT_COPY.hoursHere
            : wayanIsAround() ? CHAT_COPY.hoursOpen : CHAT_COPY.hoursClosed
        }`,
      }]);
    } catch (e) {
      setLog((prev) => [...prev, { id: uid(), from: 'bot', text: e.message || 'Could not reach Wayan just now.' }]);
    }
    setSending(false);
  }, [sending, account]);

  const ask = useCallback((question) => {
    const text = String(question || '').trim();
    if (!text || thinking || sending) return;
    setDraft('');
    setLog((prev) => [...prev, { id: uid(), from: 'me', text: text }]);

    // Handed over already: this goes to Wayan, not to the matcher.
    if (thread) {
      sendToThread(thread, text).catch(() => {
        setLog((prev) => [...prev, { id: uid(), from: 'bot', text: 'That did not send. Try again in a moment.' }]);
      });
      return;
    }

    setThinking(true);

    setTimeout(() => {
      const res = answerFor(text, ctx);
      const msg = { id: uid(), from: 'bot', text: res.text, rows: res.rows, link: res.link };
      // Only two outcomes: answered here or handed to Wayan; never a dead end or a polite decline.
      if (res.kind === 'handoff') { msg.text = CHAT_COPY.connecting; connect(text); }
      setLog((prev) => [...prev, msg]);
      setThinking(false);
    }, THINK_MS);
  }, [ctx, thinking, sending, thread, connect]);

  // Ask for an email right away outside Wayan's hours; inside them only after a wait with no reply.
  useEffect(() => {
    if (!thread || mail !== 'idle') return undefined;
    // We already have an address - nothing to ask for.
    if (account && account.email) { setMail('skip'); return undefined; }
    if (!wayanIsAround()) { setMail('ask'); return undefined; }
    const t = setTimeout(() => setQuiet(true), CHAT_COPY.quietMs);
    return () => clearTimeout(t);
  }, [thread, mail, account]);

  useEffect(() => {
    if (quiet && mail === 'idle' && !heard.current) setMail('ask');
  }, [quiet, mail]);

  // Send a typing frame at most every 2s, enough to keep the other side's indicator alive.
  function onDraft(v) {
    setDraft(v);
    if (!thread || !sock.current) return;
    const t = Date.now();
    if (t - lastTyped.current < 2000) return;
    lastTyped.current = t;
    sock.current.typing();
  }

  async function saveEmail(e) {
    e.preventDefault();
    const v = mailDraft.trim();
    if (!v || !thread) return;
    setMailErr('');
    try {
      await setContact(thread, v);
      setMail('done');
      setLog((prev) => [...prev, { id: uid(), from: 'bot', text: CHAT_COPY.emailDone }]);
    } catch (e) {
      setMailErr(e.message || CHAT_COPY.emailBad);
    }
  }

  // data-live marks socket vs polling for tests; not shown or styled, both look identical to the guest.
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
          <span className={HEAD_AVATAR} aria-hidden="true"><MessageCircle strokeWidth={1.6} /></span>
          <span className={HEAD_STACK}>
            <span className={HEAD_TITLE}>{CHAT_COPY.title}</span>
            <span className={HEAD_SUB}>{CHAT_COPY.sub}</span>
          </span>
          <button type="button" className={PANEL_CLOSE} onClick={onClose} aria-label="Close chat">×</button>
        </div>

        <div className={BODY} ref={bodyRef}>
          {/* Optional sign-in offer for guests; chatting works without it and it disappears once signed in. */}
          {hydrated && !account && (
            <p className={SIGNIN_BAR}>
              <span className={SIGNIN_TEXT}>{CHAT_COPY.signedOut}</span>
              <button type="button" className={SIGNIN_BTN} data-cta data-signin onClick={() => setAuthOpen(true)}>
                {CHAT_COPY.signIn}
              </button>
            </p>
          )}

          {log.map((m) => {
            if (m.from === 'me') return <p key={m.id} className={BUBBLE_ME}>{m.text}</p>;
            if (m.from === 'wayan') {
              return (
                <p key={m.id} className={BUBBLE_WAYAN}>
                  <small className={WHO}>Wayan</small>
                  {m.text}
                </p>
              );
            }
            return <BotReply key={m.id} m={m} onAsk={ask} />;
          })}

          {mail === 'ask' && (
            <form className={HANDOFF_FORM} onSubmit={saveEmail}>
              <p className={NOTE}>{CHAT_COPY.emailAsk}</p>
              <span className={HANDOFF_ROW}>
                <input
                  className={FIELD_INPUT}
                  type="email"
                  value={mailDraft}
                  onChange={(e) => setMailDraft(e.target.value)}
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
              <i className={DOT} /><i className={DOT} /><i className={DOT} />
            </span>
          )}

          {wayanTyping && (
            <span className={TYPING_ROW} data-typing aria-live="polite">
              <small className={TYPING_WHO}>{CHAT_COPY.typing}</small>
              <i className={DOT_LIVE(0)} /><i className={DOT_LIVE(1)} /><i className={DOT_LIVE(2)} />
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
          onSubmit={(e) => { e.preventDefault(); ask(draft); }}
        >
          <input
            ref={inputRef}
            className={`${FIELD_INPUT} flex-1`}
            value={draft}
            onChange={(e) => onDraft(e.target.value)}
            placeholder={thread ? 'Write to Wayan...' : CHAT_COPY.placeholder}
            aria-label="Your question"
            maxLength={300}
          />
          <button type="submit" className={SEND} data-cta disabled={!draft.trim() || thinking || sending} aria-label="Send">
            <Send strokeWidth={1.8} aria-hidden="true" />
          </button>
        </form>
      </div>
    </>
  );
}

// One bot reply: the sentence plus any price rows, page link, handoff or suggested questions.
function BotReply({ m, onAsk }) {
  return (
    <>
      <p className={BUBBLE_BOT}>{m.text}</p>

      {m.rows && m.rows.map((r) => (
        <a key={r.label} className={ROW} data-pricerow href={r.href}>
          <span className={ROW_NAME}>
            {r.label}
            {r.note && <small className={ROW_NOTE}>{r.note}</small>}
          </span>
          {r.price && <span className={ROW_PRICE}>{r.price}</span>}
        </a>
      ))}

      {m.link && <a className={LINK} data-cta href={m.link.href}>{m.link.label}</a>}

      {m.nudge && <p className={BUBBLE_BOT}>{m.nudge}</p>}

      {m.chips && (
        <span className={CHIPS}>
          {m.chips.map((chip) => (
            <button key={chip} type="button" className={CHIP_Q} data-chip onClick={() => onAsk(chip)}>{chip}</button>
          ))}
        </span>
      )}
    </>
  );
}
