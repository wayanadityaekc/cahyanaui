'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Send, MessageCircle } from 'lucide-react';
import { usePricing } from '@/state/PricingProvider';
import { FIELD_INPUT } from '@/components/ui/formClasses';
import { PANEL_CLOSE } from '@/components/ui/hsClasses';
import { WHATSAPP_NUMBER } from '@/lib/constants';
import { SUGGESTIONS, CHAT_COPY, wayanIsAround } from '@/content/shared/chat';
import { readThread, writeThread, startThread, sendToThread, pollThread } from '@/lib/chatThread';
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
  const [form, setForm] = useState(null);     // the question waiting to be sent
  const [sending, setSending] = useState(false);
  const lastSeen = useRef(0);

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
      if (res.kind === 'handoff') { msg.handoff = true; setForm({ question: q, name: '', email: '' }); }
      if (res.kind === 'offtopic') { msg.chips = SUGGESTIONS; msg.nudge = CHAT_COPY.offtopicNudge; }
      setLog((prev) => [...prev, msg]);
      setThinking(false);
    }, THINK_MS);
  }, [ctx, thinking, sending, thread]);

  async function handOver(e) {
    e.preventDefault();
    if (!form || sending) return;
    setSending(true);
    try {
      const id = await startThread({
        name: form.name,
        email: form.email,
        question: form.question,
        page: typeof window !== 'undefined' ? window.location.pathname : '',
      });
      setThread(id);
      setForm(null);
      setLog((prev) => [...prev, {
        id: uid(), from: 'bot',
        text: CHAT_COPY.handoffSent + ' ' + (wayanIsAround() ? CHAT_COPY.hoursOpen : CHAT_COPY.hoursClosed),
      }]);
    } catch (err) {
      setLog((prev) => [...prev, { id: uid(), from: 'bot', text: err.message || 'Could not reach Wayan just now.' }]);
    }
    setSending(false);
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
            return <BotReply key={m.id} m={m} onAsk={ask} thread={thread} />;
          })}

          {form && (
            <form className={HANDOFF_FORM} onSubmit={handOver}>
              <p className={NOTE}>{CHAT_COPY.handoffIntro}</p>
              <span className={HANDOFF_ROW}>
                <input
                  className={FIELD_INPUT}
                  value={form.name}
                  onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
                  placeholder={CHAT_COPY.handoffName}
                  aria-label={CHAT_COPY.handoffName}
                  maxLength={120}
                />
                <input
                  className={FIELD_INPUT}
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
                  placeholder={CHAT_COPY.handoffEmail}
                  aria-label={CHAT_COPY.handoffEmail}
                  maxLength={200}
                />
              </span>
              <button type="submit" className={HANDOFF_BTN} disabled={sending}>
                <MessageCircle strokeWidth={1.8} aria-hidden="true" />
                {sending ? 'Sending...' : CHAT_COPY.handoffSend}
              </button>
              <p className={NOTE}>{wayanIsAround() ? CHAT_COPY.hoursOpen : CHAT_COPY.hoursClosed}</p>
              <a
                className={ALT_LINK}
                href={`https://wa.me/${WHATSAPP_NUMBER}`}
                target="_blank"
                rel="noopener"
              >
                {CHAT_COPY.handoffAlt}
              </a>
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
            {CHAT_COPY.connected}
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
          <button type="submit" className={SEND} disabled={!draft.trim() || thinking || sending} aria-label="Send">
            <Send strokeWidth={1.8} aria-hidden="true" />
          </button>
        </form>
      </div>
    </>
  );
}

// One reply from us: the sentence, then whatever it came with - price lines,
// a page to open, the way to reach Wayan, or the questions worth asking next.
function BotReply({ m, onAsk, thread }) {
  return (
    <>
      <p className={BUBBLE_BOT}>{m.text}</p>

      {m.rows && m.rows.map((r) => (
        <a key={r.label} className={ROW} href={r.href}>
          <span className={ROW_NAME}>
            {r.label}
            {r.note && <small className={ROW_NOTE}>{r.note}</small>}
          </span>
          {r.price && <span className={ROW_PRICE}>{r.price}</span>}
        </a>
      ))}

      {m.link && <a className={LINK} href={m.link.href}>{m.link.label}</a>}

      {m.handoff && !thread && (
        <a
          className={HANDOFF_BTN}
          href={`https://wa.me/${WHATSAPP_NUMBER}`}
          target="_blank"
          rel="noopener"
        >
          <MessageCircle strokeWidth={1.8} aria-hidden="true" />
          {CHAT_COPY.handoffCta}
        </a>
      )}

      {m.nudge && <p className={BUBBLE_BOT}>{m.nudge}</p>}

      {m.chips && (
        <span className={CHIPS}>
          {m.chips.map((q) => (
            <button key={q} type="button" className={CHIP_Q} onClick={() => onAsk(q)}>{q}</button>
          ))}
        </span>
      )}
    </>
  );
}
