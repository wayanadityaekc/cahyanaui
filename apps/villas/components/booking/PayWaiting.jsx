'use client';

import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { Button } from '@cahyana/ui';
import { API_BASE, TOKEN_KEY, whatsappLink } from '@/lib/constants';
import { VILLA_LIST } from '@/lib/villas';
import useBodyLock from '@/components/ui/useBodyLock';

// Ported from CUE PayWaiting: asks /booking-status until the webhook marks the booking paid; no way out while waiting.
const POLL_MS = 4000;
const GIVE_UP_MS = 120000;
const SLIDE_MS = 6000;

const COPY = {
  waiting: {
    title: 'Confirming your payment',
    lines: [
      'Your payment went through. We are waiting for the confirmation from our payment provider, which usually takes under a minute.',
      'Your confirmation email is sent the moment that lands, so please keep this screen open.',
    ],
  },
  paid: {
    title: 'Booking confirmed',
    lines: ['The payment cleared. Your confirmation email is on its way, with your stay and every extra we have booked for you.'],
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
      'Your payment went through and your booking is saved.',
      'Your confirmation email is on its way as soon as the payment clears.',
    ],
  },
};

function readToken() {
  try { return window.localStorage.getItem(TOKEN_KEY) || ''; } catch (e) { return ''; }
}

export default function PayWaiting({ bookingRef = '', onClose = () => {}, onConfirmed = null }) {
  const [phase, setPhase] = useState('waiting');
  const [slide, setSlide] = useState(0);
  const [mounted, setMounted] = useState(false);
  const timer = useRef(null);
  const photos = VILLA_LIST.map((villa) => ({ src: villa.cardImg, alt: villa.name }));

  useEffect(() => setMounted(true), []);
  useBodyLock(true);

  useEffect(() => {
    const still = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (still || photos.length < 2) return undefined;
    const interval = setInterval(() => setSlide((current) => (current + 1) % photos.length), SLIDE_MS);
    return () => clearInterval(interval);
  }, [photos.length]);

  useEffect(() => {
    const token = readToken();
    // Without a session the server cannot check who is asking, so say what we know instead of spinning.
    if (!bookingRef || !token) { setPhase('blind'); return undefined; }
    let stop = false;
    const started = Date.now();
    async function ask() {
      try {
        const response = await fetch(`${API_BASE}/booking-status/${encodeURIComponent(bookingRef)}`, { headers: { Authorization: `Bearer ${token}` } });
        if (stop) return;
        if (response.status === 401 || response.status === 404) { setPhase('blind'); return; }
        const data = await response.json().catch(() => null);
        if (stop) return;
        if (data && data.payment === 'paid') {
          setPhase('paid');
          if (typeof onConfirmed === 'function') onConfirmed();
          return;
        }
        // A mismatch is not paid; never tell the guest it is confirmed.
        if (data && data.payment === 'mismatch') { setPhase('mismatch'); return; }
      } catch (e) {
        // A dropped request is not an answer; keep asking until we give up.
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
  const copy = COPY[phase];

  return createPortal(
    <div className="fixed inset-0 z-[300] overflow-hidden" role="dialog" aria-modal="true" aria-label={copy.title} aria-live="polite" data-pay-waiting={phase}>
      {photos.map((photo, index) => (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          key={photo.src}
          src={photo.src}
          alt={index === slide ? photo.alt : ''}
          aria-hidden={index === slide ? undefined : 'true'}
          className={`absolute inset-0 w-full h-full object-cover [transition:opacity_1.2s_var(--ease)] ${index === slide ? 'opacity-100' : 'opacity-0'}`}
        />
      ))}
      <div className="absolute inset-0 bg-[rgba(20,19,16,0.62)]" />
      <div className="relative z-10 flex flex-col items-center justify-center h-full px-[var(--container-x)] text-center">
        {waiting && (
          <span className="w-[26px] h-[26px] mb-5 rounded-[50%] border-[3px] border-solid border-[rgba(255,255,255,0.28)] border-t-white animate-[spin_0.7s_linear_infinite]" aria-hidden="true" />
        )}
        <h2 className="mb-3 font-body text-h2 font-semibold text-white">{copy.title}</h2>
        <div className="max-w-[420px]">
          {copy.lines.map((line) => <p className="mb-2 text-body leading-[var(--lh-body,1.6)] text-[rgba(255,255,255,0.86)]" key={line}>{line}</p>)}
        </div>
        {bookingRef && <p className="mt-2 text-small font-semibold tracking-[0.08em] uppercase text-[rgba(255,255,255,0.72)]">Booking {bookingRef}</p>}
        {!waiting && (
          <div className="w-full max-w-[320px] mt-6 flex flex-col gap-2">
            <Button full onClick={onClose}>Done</Button>
            {(phase === 'mismatch' || phase === 'slow') && (
              <Button as="a" full variant="onDark" href={whatsappLink(`Hello, I just paid for booking ${bookingRef} and I'd like to check it came through.`)} target="_blank" rel="noopener">WhatsApp</Button>
            )}
          </div>
        )}
      </div>
    </div>,
    document.body,
  );
}
