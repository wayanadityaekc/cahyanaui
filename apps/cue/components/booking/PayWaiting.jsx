'use client';

import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { WAIT_PHOTOS, WAIT_SLIDE_MS } from '@/content/shared/waitPhotos';
import { API_BASE, KEY, WHATSAPP_NUMBER } from '@/lib/constants';
import { readLocal } from '@/lib/storage';
import { BTN, BTN_WA, STACK } from '@/components/ui/modalClasses';
import useBodyLock from '@/components/ui/useBodyLock';

/**
 * PayWaiting - the locked screen between "the card went through" and "the
 * booking is confirmed" (Sep 2026, Wayan: "selagi menunggu email masuk dan
 * backend nerima notif dari webhook, lock layar dan kasi loading ... background
 * nya itu foto destinasi auto slide").
 *
 * Why it has to exist: capturing the card is NOT what confirms a booking here.
 * The money clearing is announced by PayPal's webhook, and only that flips the
 * booking to paid and sends the emails (see confirmPayment in cahyana-api).
 * Between those two moments the guest used to get a success screen that claimed
 * more than we knew.
 *
 * It asks the server rather than counting seconds: GET /api/booking-status/:ref
 * returns one word for a booking the caller has proved is theirs. A spinner on
 * a timer would either lie or spin forever.
 *
 * Nothing here can be dismissed while we are still waiting: no close button, and
 * the caller keeps the modal's own close disabled. The buttons only appear once
 * there is something true to say.
 */
const POLL_MS = 4000;
// After this we stop asking and tell the guest the truth: it is saved, the email
// will follow. Two minutes is far longer than a webhook normally takes, and a
// screen that never resolves is worse than one that hands back control.
const GIVE_UP_MS = 120000;

export default function PayWaiting({ bookingRef, onClose, onConfirmed }) {
  const [phase, setPhase] = useState('waiting'); // waiting | paid | mismatch | slow | blind
  const [idx, setIdx] = useState(0);
  const [mounted, setMounted] = useState(false);
  const timer = useRef(null);

  useEffect(() => setMounted(true), []);
  useBodyLock(true);

  // --- background slideshow -------------------------------------------------
  // Honour the OS setting: a photo that changes by itself is exactly what
  // prefers-reduced-motion is asking us not to do, so it holds on the first one.
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const still = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (still || WAIT_PHOTOS.length < 2) return;
    const t = setInterval(() => setIdx((i) => (i + 1) % WAIT_PHOTOS.length), WAIT_SLIDE_MS);
    return () => clearInterval(t);
  }, []);

  // --- ask the server, don't guess -----------------------------------------
  useEffect(() => {
    if (!bookingRef) { setPhase('blind'); return; }
    const token = readLocal(KEY.token, '');
    // No session token means we cannot prove the booking is ours, so the server
    // will refuse - say so honestly instead of spinning against a 401.
    if (!token) { setPhase('blind'); return; }
    let stop = false;
    const started = Date.now();
    const ask = async () => {
      try {
        const r = await fetch(`${API_BASE}/booking-status/${encodeURIComponent(bookingRef)}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (stop) return;
        if (r.status === 401 || r.status === 404) { setPhase('blind'); return; }
        const d = await r.json().catch(() => null);
        if (stop) return;
        if (d && d.payment === 'paid') {
          setPhase('paid');
          // Only the rails that LEAVE the site need this: the guest comes back
          // with nothing provable, so "the server said paid" is the first
          // moment it is safe to clear their cart. The inline rails pass
          // nothing and are unaffected.
          if (typeof onConfirmed === 'function') onConfirmed();
          return;
        }
        // A mismatch is NOT paid: the amount or currency disagreed and a person
        // has to look at it. Telling the guest it is confirmed would be a lie.
        if (d && d.payment === 'mismatch') { setPhase('mismatch'); return; }
      } catch {
        // A dropped request is not an answer - keep asking until we give up.
      }
      if (stop) return;
      if (Date.now() - started > GIVE_UP_MS) { setPhase('slow'); return; }
      timer.current = setTimeout(ask, POLL_MS);
    };
    timer.current = setTimeout(ask, POLL_MS);
    return () => { stop = true; clearTimeout(timer.current); };
  }, [bookingRef, onConfirmed]);

  if (!mounted) return null;

  const waiting = phase === 'waiting';
  const wa = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
    `Hello, I just paid for booking ${bookingRef || ''} and I'd like to check it came through.`,
  )}`;

  const COPY = {
    waiting: {
      title: 'Confirming your payment',
      lines: [
        'Your card went through. We are waiting for the confirmation from our payment provider, which usually takes under a minute.',
        'Your confirmation email is sent the moment that lands, so please keep this screen open.',
      ],
    },
    paid: {
      title: 'Booking confirmed',
      lines: ['The payment cleared. Your confirmation email is on its way, with the details of every day we have booked for you.'],
    },
    mismatch: {
      title: 'We need to check this payment',
      lines: [
        'The amount we received does not match this booking, so we are checking it by hand rather than confirming it automatically.',
        'Nothing is lost: your booking and your payment are both on file. Message us and we will sort it out today.',
      ],
    },
    slow: {
      title: 'Still confirming',
      lines: [
        'This is taking longer than usual. Your payment and your booking are both saved.',
        'Your email will follow as soon as the confirmation lands. You can close this screen now.',
      ],
    },
    blind: {
      title: 'Payment sent',
      lines: [
        'Your card went through and your booking is saved.',
        'Your confirmation email is on its way as soon as the payment clears.',
      ],
    },
  }[phase];

  return createPortal(
    <div className="fixed inset-0 z-[300] overflow-hidden" role="dialog" aria-modal="true" aria-live="polite">
      {/* Photos of places we actually take guests. Only the current slide and
          the next one are mounted, so five files are not fetched at once. */}
      {WAIT_PHOTOS.map((p, i) =>
        i <= idx + 1 || i === WAIT_PHOTOS.length - 1 ? (
          <img
            key={p.src}
            src={p.src}
            alt={i === idx ? p.alt : ''}
            aria-hidden={i === idx ? undefined : 'true'}
            className={`absolute inset-0 w-full h-full object-cover [transition:opacity_1.2s_var(--ease)] ${i === idx ? 'opacity-100' : 'opacity-0'}`}
          />
        ) : null,
      )}
      {/* The text has to stay readable over any of the photos. */}
      <div className="absolute inset-0 bg-[rgba(20,19,16,0.62)]" />

      <div className="relative z-10 flex flex-col items-center justify-center h-full px-[var(--container-x)] text-center">
        {waiting && (
          <span
            className="w-[26px] h-[26px] mb-5 rounded-[50%] border-[3px] border-solid border-[rgba(255,255,255,0.28)] border-t-white animate-[spin_0.7s_linear_infinite]"
            aria-hidden="true"
          />
        )}
        <h2 className="mb-3 font-body text-h2 font-semibold text-white">{COPY.title}</h2>
        <div className="max-w-[420px]">
          {COPY.lines.map((t, i) => (
            <p className="mb-2 text-body leading-[var(--lh-body)] text-[rgba(255,255,255,0.86)]" key={i}>{t}</p>
          ))}
        </div>
        {bookingRef && (
          <p className="mt-2 text-small font-semibold tracking-[0.08em] uppercase text-[rgba(255,255,255,0.72)]">
            Booking {bookingRef}
          </p>
        )}

        {/* No way out while we are still waiting - the buttons appear only when
            there is something true to act on. */}
        {!waiting && (
          <div className="w-full max-w-[320px] mt-6">
            <button type="button" className={BTN} onClick={onClose}>Done</button>
            {(phase === 'mismatch' || phase === 'slow') && (
              <a className={`${BTN_WA} ${STACK}`} href={wa} target="_blank" rel="noopener noreferrer">WhatsApp</a>
            )}
          </div>
        )}
      </div>
    </div>,
    document.body,
  );
}
