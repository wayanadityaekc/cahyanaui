'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Send, MessageCircle } from 'lucide-react';
import { usePricing } from '@/state/PricingProvider';
import { useAccount } from '@/state/AccountProvider';
import AuthModal from '@/components/account/AuthModal';
import { FIELD_INPUT } from '@/components/ui/formClasses';
import { PANEL_CLOSE } from '@/components/ui/hsClasses';
import { SUGGESTIONS, CHAT_COPY, checkIsWayanAround } from '@/content/shared/chat';
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

const CHAT_POLL_INTERVAL_MS = 5000;
const INPUT_FOCUS_DELAY_MS = 60;
const TYPING_NOTIFY_THROTTLE_MS = 2000;
const ICON_STROKE_WIDTH_LIGHT = 1.6;
const CHAT_EMAIL_MAX_LENGTH = 200;
const CHAT_MESSAGE_MAX_LENGTH = 300;
const ICON_STROKE_WIDTH_MEDIUM = 1.8;

const THINK_MS = 400;

let seq = 0;
function createMessageId() {
  return `m${(seq += 1)}`;
}

export default function ChatPanel({ open, onClose }) {
  const pricing = usePricing();
  const { account, hydrated } = useAccount();
  const [log, setLog] = useState(() => [
    { id: createMessageId(), from: 'bot', text: CHAT_COPY.greeting, chips: SUGGESTIONS },
  ]);
  const [draft, setDraft] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const bodyRef = useRef(null);
  const inputRef = useRef(null);

  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const greeted = useRef(false);

  const [thread, setThread] = useState(null);
  const [isSending, setIsSending] = useState(false);
  const [mail, setMail] = useState('idle');
  const [mailDraft, setMailDraft] = useState('');
  const [mailErr, setMailErr] = useState('');
  const [isQuiet, setIsQuiet] = useState(false);
  const lastSeen = useRef(0);
  const heard = useRef(false);

  const [isLive, setIsLive] = useState(false);
  const [isOwnerPresent, setIsOwnerPresent] = useState(false);
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
    const line = {
      id: createMessageId(),
      from: 'bot',
      text: CHAT_COPY.hello.replace('{name}', name),
      chips: SUGGESTIONS,
    };
    setLog((prev) => (prev.length === 1 && prev[0].from === 'bot' ? [line] : [...prev, line]));
  }, [account]);

  useEffect(() => {
    const id = readThread();
    if (id) setThread(id);
  }, []);

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
      ...freshMessages.map((message) => ({ id: createMessageId(), from: 'wayan', text: message.body })),
    ]);
  }, []);

  const catchUp = useCallback(async () => {
    try {
      const { gone, messages } = await pollThread(thread, lastSeen.current);
      if (gone) {
        setThread(null);
        setLog((prev) => [
          ...prev,
          { id: createMessageId(), from: 'bot', text: CHAT_COPY.threadGone, chips: SUGGESTIONS },
        ]);
        return;
      }
      takeOwner(messages);
    } catch (e) {}
  }, [thread, takeOwner]);

  useEffect(() => {
    if (!open || !thread) return undefined;
    const chatSocket = openChatSocket(thread, {
      onOpen: catchUp,
      onLive: setIsLive,
      onPresence: (isPresent) => {
        ownerHereRef.current = isPresent;
        setIsOwnerPresent(isPresent);
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
    const shouldSkipLiveSync = !open || !thread || isLive;
    if (shouldSkipLiveSync) return undefined;
    catchUp();
    const pollTimer = setInterval(catchUp, CHAT_POLL_INTERVAL_MS);
    return () => clearInterval(pollTimer);
  }, [open, thread, isLive, catchUp]);

  useEffect(() => {
    if (!open || !thread) return undefined;
    function handleVisibilityShow() {
      if (document.visibilityState === 'visible') catchUp();
    }
    document.addEventListener('visibilitychange', handleVisibilityShow);
    return () => document.removeEventListener('visibilitychange', handleVisibilityShow);
  }, [open, thread, catchUp]);

  const isWayanTyping = typingUntil > Date.now();
  useEffect(() => {
    const remainingMs = typingUntil - Date.now();
    if (remainingMs <= 0) return undefined;
    const typingTimer = setTimeout(() => setTypingUntil(0), remainingMs);
    return () => clearTimeout(typingTimer);
  }, [typingUntil]);

  useEffect(() => {
    const body = bodyRef.current;
    if (body) body.scrollTop = body.scrollHeight;
  }, [log, isThinking]);

  useEffect(() => {
    if (!open) return undefined;
    const focusTimer = setTimeout(() => inputRef.current && inputRef.current.focus(), INPUT_FOCUS_DELAY_MS);
    function handleKeyDown(event) {
      if (event.key === 'Escape' && !isAuthOpen) onClose();
    }
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      clearTimeout(focusTimer);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [open, onClose, isAuthOpen]);

  const connect = useCallback(
    async (question) => {
      if (isSending) return;
      setIsSending(true);
      try {
        const id = await startThread({
          question,
          name: (account && account.name) || '',
          email: (account && account.email) || '',
          page: typeof window !== 'undefined' ? window.location.pathname : '',
        });
        setThread(id);
        setLog((prev) => {
          function pickHoursText() {
            if (ownerHereRef.current) return CHAT_COPY.hoursHere;
            if (checkIsWayanAround()) return CHAT_COPY.hoursOpen;
            return CHAT_COPY.hoursClosed;
          }
          return [
            ...prev,
            {
              id: createMessageId(),
              from: 'bot',
              text: `${CHAT_COPY.connected} ${pickHoursText()}`,
            },
          ];
        });
      } catch (e) {
        setLog((prev) => [
          ...prev,
          { id: createMessageId(), from: 'bot', text: e.message || 'Could not reach Wayan just now.' },
        ]);
      }
      setIsSending(false);
    },
    [isSending, account],
  );

  const handleQuestionAsk = useCallback(
    (question) => {
      const text = String(question || '').trim();
      const isSendBlocked = !text || isThinking || isSending;
      if (isSendBlocked) return;
      setDraft('');
      setLog((prev) => [...prev, { id: createMessageId(), from: 'me', text: text }]);

      if (thread) {
        sendToThread(thread, text).catch(() => {
          setLog((prev) => [
            ...prev,
            { id: createMessageId(), from: 'bot', text: 'That did not send. Try again in a moment.' },
          ]);
        });
        return;
      }

      setIsThinking(true);

      setTimeout(() => {
        const result = answerFor(text, pricingContext);
        const message = { id: createMessageId(), from: 'bot', text: result.text, rows: result.rows, link: result.link };
        if (result.kind === 'handoff') {
          message.text = CHAT_COPY.connecting;
          connect(text);
        }
        setLog((prev) => [...prev, message]);
        setIsThinking(false);
      }, THINK_MS);
    },
    [pricingContext, isThinking, isSending, thread, connect],
  );

  useEffect(() => {
    if (!thread || mail !== 'idle') return undefined;
    if (account && account.email) {
      setMail('skip');
      return undefined;
    }
    if (!checkIsWayanAround()) {
      setMail('ask');
      return undefined;
    }
    const quietTimer = setTimeout(() => setIsQuiet(true), CHAT_COPY.quietMs);
    return () => clearTimeout(quietTimer);
  }, [thread, mail, account]);

  useEffect(() => {
    const shouldAskForEmail = isQuiet && mail === 'idle' && !heard.current;
    if (shouldAskForEmail) setMail('ask');
  }, [isQuiet, mail]);

  function handleDraftChange(draftText) {
    setDraft(draftText);
    if (!thread || !sock.current) return;
    const now = Date.now();
    if (now - lastTyped.current < TYPING_NOTIFY_THROTTLE_MS) return;
    lastTyped.current = now;
    sock.current.typing();
  }

  async function handleEmailSave(event) {
    event.preventDefault();
    const emailAddress = mailDraft.trim();
    if (!emailAddress || !thread) return;
    setMailErr('');
    try {
      await setContact(thread, emailAddress);
      setMail('done');
      setLog((prev) => [...prev, { id: createMessageId(), from: 'bot', text: CHAT_COPY.emailDone }]);
    } catch (e) {
      setMailErr(e.message || CHAT_COPY.emailBad);
    }
  }

  return (
    <>
      <AuthModal open={isAuthOpen} onClose={() => setIsAuthOpen(false)} />
      <div className={SCRIM(open)} onClick={onClose} aria-hidden="true" />
      <div
        className={PANEL(open)}
        role="dialog"
        data-live={isLive ? '1' : '0'}
        aria-label={CHAT_COPY.title}
        aria-modal="false"
        {...(open ? {} : { inert: '' })}
      >
        <div className={HEAD}>
          <span className={HEAD_AVATAR} aria-hidden="true">
            <MessageCircle strokeWidth={ICON_STROKE_WIDTH_LIGHT} />
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
              <button type="button" className={SIGNIN_BTN} data-cta data-signin onClick={() => setIsAuthOpen(true)}>
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
            return <BotReply key={entry.id} m={entry} onAsk={handleQuestionAsk} />;
          })}

          {mail === 'ask' && (
            <form className={HANDOFF_FORM} onSubmit={handleEmailSave}>
              <p className={NOTE}>{CHAT_COPY.emailAsk}</p>
              <span className={HANDOFF_ROW}>
                <input
                  className={FIELD_INPUT}
                  type="email"
                  value={mailDraft}
                  onChange={(event) => setMailDraft(event.target.value)}
                  placeholder={CHAT_COPY.emailField}
                  aria-label={CHAT_COPY.emailField}
                  maxLength={CHAT_EMAIL_MAX_LENGTH}
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

          {isThinking && (
            <span className={DOTS} aria-label="Typing">
              <i className={DOT} />
              <i className={DOT} />
              <i className={DOT} />
            </span>
          )}

          {isWayanTyping && (
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
            {isOwnerPresent ? CHAT_COPY.ownerHere : CHAT_COPY.connectedStrip}
          </p>
        )}

        <form
          className={FOOT}
          onSubmit={(event) => {
            event.preventDefault();
            handleQuestionAsk(draft);
          }}
        >
          <input
            ref={inputRef}
            className={`${FIELD_INPUT} flex-1`}
            value={draft}
            onChange={(event) => handleDraftChange(event.target.value)}
            placeholder={thread ? 'Write to Wayan...' : CHAT_COPY.placeholder}
            aria-label="Your question"
            maxLength={CHAT_MESSAGE_MAX_LENGTH}
          />
          <button
            type="submit"
            className={SEND}
            data-cta
            disabled={!draft.trim() || isThinking || isSending}
            aria-label="Send"
          >
            <Send strokeWidth={ICON_STROKE_WIDTH_MEDIUM} aria-hidden="true" />
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
