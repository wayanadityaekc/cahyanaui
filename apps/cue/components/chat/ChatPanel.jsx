'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Send, MessageCircle } from 'lucide-react';
import { usePricing } from '@/state/PricingProvider';
import { FIELD_INPUT } from '@/components/ui/formClasses';
import { PANEL_CLOSE } from '@/components/ui/hsClasses';
import { WHATSAPP_NUMBER } from '@/lib/constants';
import { SUGGESTIONS, CHAT_COPY } from '@/content/shared/chat';
import { answerFor } from '@/lib/chatAnswers';
import {
  PANEL, SCRIM, HEAD, HEAD_AVATAR, HEAD_STACK, HEAD_TITLE, HEAD_SUB, BODY,
  BUBBLE_BOT, BUBBLE_ME, ROW, ROW_NAME, ROW_NOTE, ROW_PRICE, LINK, HANDOFF_BTN,
  CHIPS, CHIP_Q, FOOT, SEND, DOTS, DOT,
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

  const ctx = useMemo(
    () => ({ catalog: pricing && pricing.catalog, lookup: pricing && pricing.lookup }),
    [pricing],
  );

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
    if (!q || thinking) return;
    setDraft('');
    setLog((prev) => [...prev, { id: uid(), from: 'me', text: q }]);
    setThinking(true);

    setTimeout(() => {
      const res = answerFor(q, ctx);
      const msg = { id: uid(), from: 'bot', text: res.text, rows: res.rows, link: res.link };
      // Handoff and off-topic both end in something to do next: one offers
      // Wayan, the other offers the questions this can actually answer. A dead
      // end is the one outcome that is never acceptable.
      if (res.kind === 'handoff') msg.handoff = true;
      if (res.kind === 'offtopic') { msg.chips = SUGGESTIONS; msg.nudge = CHAT_COPY.offtopicNudge; }
      setLog((prev) => [...prev, msg]);
      setThinking(false);
    }, THINK_MS);
  }, [ctx, thinking]);

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
          {log.map((m) => (
            m.from === 'me' ? (
              <p key={m.id} className={BUBBLE_ME}>{m.text}</p>
            ) : (
              <BotReply key={m.id} m={m} onAsk={ask} />
            )
          ))}

          {thinking && (
            <span className={DOTS} aria-label="Typing">
              <i className={DOT} /><i className={DOT} /><i className={DOT} />
            </span>
          )}
        </div>

        <form
          className={FOOT}
          onSubmit={(e) => { e.preventDefault(); ask(draft); }}
        >
          <input
            ref={inputRef}
            className={`${FIELD_INPUT} flex-1`}
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder={CHAT_COPY.placeholder}
            aria-label="Your question"
            maxLength={300}
          />
          <button type="submit" className={SEND} disabled={!draft.trim() || thinking} aria-label="Send">
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
        <a key={r.label} className={ROW} href={r.href}>
          <span className={ROW_NAME}>
            {r.label}
            {r.note && <small className={ROW_NOTE}>{r.note}</small>}
          </span>
          {r.price && <span className={ROW_PRICE}>{r.price}</span>}
        </a>
      ))}

      {m.link && <a className={LINK} href={m.link.href}>{m.link.label}</a>}

      {m.handoff && (
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
