'use client';

import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { WAIT_PHOTOS, WAIT_SLIDE_MS } from '@/content/shared/waitPhotos';
import { API_BASE, KEY, WHATSAPP_NUMBER } from '@/lib/constants';
import { readLocal } from '@/lib/storage';
import { BTN, BTN_WA, STACK } from '@/components/ui/modalClasses';
import useBodyLock from '@/components/ui/useBodyLock';

// Locked screen after payment: polls /booking-status/:ref until the webhook marks it paid; no way to close while waiting.
const POLL_MS = 4000;
// Stop polling after two minutes and tell the guest the booking is saved and the email will follow.
const GIVE_UP_MS = 120000;

export default function PayWaiting({ bookingRef, onClose, onConfirmed }) {
  const [phase, setPhase] = useState('waiting'); // waiting | paid | mismatch | slow | blind
  const [idx, setIdx] = useState(0);
  const [mounted, setMounted] = useState(false);
  const timer = useRef(null);

  useEffect(() => setMounted(true), []);
  useBodyLock(true);

  // Background slideshow; holds on the first photo when prefers-reduced-motion is set.
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
    // Without a session token the server can't verify ownership, so show the honest 'payment sent' state.
    if (!token) { setPhase('blind'); return; }
    let stop = false;
    const started = Date.now();
    async function ask() {
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
          // onConfirmed is for rails that leave the site (DOKU): clear the cart only once the server says paid.
          if (typeof onConfirmed === 'function') onConfirmed();
          return;
        }
        // A mismatch is not paid (amount or currency disagreed); never tell the guest it is confirmed.
        if (d && d.payment === 'mismatch') { setPhase('mismatch'); return; }
      } catch (e) {
        // A dropped request is not an answer - keep asking until we give up.
      }
      if (stop) return;
      if (Date.now() - started > GIVE_UP_MS) { setPhase('slow'); return; }
      timer.current = setTimeout(ask, POLL_MS);
    }
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
      {/* Destination photos; only the current and next slide are mounted so not every file loads at once. */}
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

        {/* Buttons appear only once there is a real outcome; no way out while still waiting. */}
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
