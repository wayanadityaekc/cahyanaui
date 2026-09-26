'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Send, MessageCircle } from 'lucide-react';
import { usePricing } from '@/state/PricingProvider';
import { FIELD_INPUT } from '@/components/ui/formClasses';
import { PANEL_CLOSE } from '@/components/ui/hsClasses';
import { SUGGESTIONS, CHAT_COPY, wayanIsAround } from '@/content/shared/chat';
import { readThread, startThread, sendToThread, pollThread, setContact } from '@/lib/chatThread';
import { answerFor } from '@/lib/chatAnswers';
import {
  PANEL, SCRIM, HEAD, HEAD_AVATAR, HEAD_STACK, HEAD_TITLE, HEAD_SUB, BODY,
  BUBBLE_BOT, BUBBLE_ME, ROW, ROW_NAME, ROW_NOTE, ROW_PRICE, LINK, HANDOFF_BTN,
  CHIPS, CHIP_Q, FOOT, SEND, DOTS, DOT,
  HANDOFF_FORM, HANDOFF_ROW, NOTE, ALT_LINK, BUBBLE_WAYAN, WHO, CONNECTED,
} from './chatClasses';

// The support panel. Every answer comes out of lib/chatAnswers, which can only
// return something the site already publishes - so nothing here can invent a
// price or promise a tour we do not run.
//
// The short pause before an answer is deliberate: an instant swap reads as a
// page updating, a beat reads as somebody replying. It is 400ms, not a
// pretend-typing delay long enough to waste the guest's time.
const THINK_MS = 400;

let seq = 0;
const uid = () => `m${(seq += 1)}`;

export default function ChatPanel({ open, onClose }) {
  const pricing = usePricing();
  const [log, setLog] = useState(() => [
    { id: uid(), from: 'bot', text: CHAT_COPY.greeting, chips: SUGGESTIONS },
  ]);
  const [draft, setDraft] = useState('');
  const [thinking, setThinking] = useState(false);
  const bodyRef = useRef(null);
  const inputRef = useRef(null);

  // Once a guest has been handed over, typed messages go to Wayan instead of to
  // the matcher. Deliberately one or the other: a panel that sometimes answers
  // and sometimes forwards would leave the guest unsure who is reading.
  const [thread, setThread] = useState(null);
  const [sending, setSending] = useState(false);
  // The email is asked AFTER the handover, and only when it would change
  // anything: outside Wayan's hours, or once a wait has gone by with no reply.
  // 'idle' = not asked, 'ask' = on screen, 'done' | 'skip' = settled.
  const [mail, setMail] = useState('idle');
  const [mailDraft, setMailDraft] = useState('');
  const [mailErr, setMailErr] = useState('');
  const [quiet, setQuiet] = useState(false);
  const lastSeen = useRef(0);
  const heard = useRef(false);

  const ctx = useMemo(
    () => ({ catalog: pricing && pricing.catalog, lookup: pricing && pricing.lookup }),
    [pricing],
  );

  // A thread from an earlier visit. Read in an effect, never during render -
  // this is a static export, so the first paint has to match the prerendered
  // HTML.
  useEffect(() => {
    const id = readThread();
    if (id) setThread(id);
  }, []);

  // While the panel is open and a thread exists, watch for Wayan's reply. Only
  // while open: a tab left on another page should not poll all afternoon.
  useEffect(() => {
    if (!open || !thread) return undefined;
    let stop = false;
    const tick = async () => {
      try {
        const { gone, messages } = await pollThread(thread, lastSeen.current);
        if (stop) return;
        if (gone) {
          setThread(null);
          setLog((prev) => [...prev, { id: uid(), from: 'bot', text: CHAT_COPY.threadGone, chips: SUGGESTIONS }]);
          return;
        }
        const fresh = messages.filter((m) => m.sender === 'owner');
        if (messages.length) lastSeen.current = messages[messages.length - 1].id;
        if (fresh.length) {
          heard.current = true;
          setLog((prev) => [...prev, ...fresh.map((m) => ({ id: uid(), from: 'wayan', text: m.body }))]);
        }
      } catch {
        /* a dropped poll is not worth a message on screen; the next one retries */
      }
    };
    tick();
    const t = setInterval(tick, 5000);
    return () => { stop = true; clearInterval(t); };
  }, [open, thread]);

  // New message, or the dots appearing: keep the newest line in view.
  useEffect(() => {
    const el = bodyRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [log, thinking]);

  useEffect(() => {
    if (!open) return undefined;
    const t = setTimeout(() => inputRef.current && inputRef.current.focus(), 60);
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', onKey);
    return () => { clearTimeout(t); document.removeEventListener('keydown', onKey); };
  }, [open, onClose]);

  const ask = useCallback((question) => {
    const q = String(question || '').trim();
    if (!q || thinking || sending) return;
    setDraft('');
    setLog((prev) => [...prev, { id: uid(), from: 'me', text: q }]);

    // Handed over already: this goes to Wayan, not to the matcher.
    if (thread) {
      sendToThread(thread, q).catch(() => {
        setLog((prev) => [...prev, { id: uid(), from: 'bot', text: 'That did not send. Try again in a moment.' }]);
      });
      return;
    }

    setThinking(true);

    setTimeout(() => {
      const res = answerFor(q, ctx);
      const msg = { id: uid(), from: 'bot', text: res.text, rows: res.rows, link: res.link };
      // Handoff and off-topic both end in something to do next: one offers
      // Wayan, the other offers the questions this can actually answer. A dead
      // end is the one outcome that is never acceptable.
      if (res.kind === 'handoff') { msg.text = CHAT_COPY.connecting; connect(q); }
      if (res.kind === 'offtopic') { msg.chips = SUGGESTIONS; msg.nudge = CHAT_COPY.offtopicNudge; }
      setLog((prev) => [...prev, msg]);
      setThinking(false);
    }, THINK_MS);
  }, [ctx, thinking, sending, thread]);

  // Hands over straight away. Nothing is asked first - the guest already typed
  // the question, and a form in front of somebody mid-sentence is a brake.
  const connect = useCallback(async (question) => {
    if (sending) return;
    setSending(true);
    try {
      const id = await startThread({
        question,
        page: typeof window !== 'undefined' ? window.location.pathname : '',
      });
      setThread(id);
      setLog((prev) => [...prev, {
        id: uid(), from: 'bot',
        text: `${CHAT_COPY.connected} ${wayanIsAround() ? CHAT_COPY.hoursOpen : CHAT_COPY.hoursClosed}`,
      }]);
    } catch (err) {
      setLog((prev) => [...prev, { id: uid(), from: 'bot', text: err.message || 'Could not reach Wayan just now.' }]);
    }
    setSending(false);
  }, [sending]);

  // Outside his hours the wait is certain, so the offer comes right away. Inside
  // them it waits, and never appears at all if he answers first.
  useEffect(() => {
    if (!thread || mail !== 'idle') return undefined;
    if (!wayanIsAround()) { setMail('ask'); return undefined; }
    const t = setTimeout(() => setQuiet(true), CHAT_COPY.quietMs);
    return () => clearTimeout(t);
  }, [thread, mail]);

  useEffect(() => {
    if (quiet && mail === 'idle' && !heard.current) setMail('ask');
  }, [quiet, mail]);

  async function saveEmail(e) {
    e.preventDefault();
    const v = mailDraft.trim();
    if (!v || !thread) return;
    setMailErr('');
    try {
      await setContact(thread, v);
      setMail('done');
      setLog((prev) => [...prev, { id: uid(), from: 'bot', text: CHAT_COPY.emailDone }]);
    } catch (err) {
      setMailErr(err.message || CHAT_COPY.emailBad);
    }
  }

  return (
    <>
      <div className={SCRIM(open)} onClick={onClose} aria-hidden="true" />
      <div
        className={PANEL(open)}
        role="dialog"
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
        </div>

        {thread && (
          <p className={CONNECTED}>
            <MessageCircle strokeWidth={2} aria-hidden="true" />
            {CHAT_COPY.connectedStrip}
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
            onChange={(e) => setDraft(e.target.value)}
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

// One reply from us: the sentence, then whatever it came with - price lines,
// a page to open, the way to reach Wayan, or the questions worth asking next.
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
          {m.chips.map((q) => (
            <button key={q} type="button" className={CHIP_Q} data-chip onClick={() => onAsk(q)}>{q}</button>
          ))}
        </span>
      )}
    </>
  );
}
