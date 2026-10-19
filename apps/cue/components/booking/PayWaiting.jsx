'use client';

import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { WAIT_PHOTOS, WAIT_SLIDE_MS } from '@/content/shared/waitPhotos';
import { API_BASE, KEY, WHATSAPP_NUMBER } from '@/lib/constants';
import { readLocal } from '@/lib/storage';
import { BTN, BTN_WA, STACK } from '@/components/ui/modalClasses';
import useBodyLock from '@/components/ui/useBodyLock';

const POLL_MS = 4000;
const GIVE_UP_MS = 120000;

export default function PayWaiting({ bookingRef, onClose, onConfirmed }) {
  const [phase, setPhase] = useState('waiting');
  const [index, setIndex] = useState(0);
  const [isMounted, setIsMounted] = useState(false);
  const timer = useRef(null);

  useEffect(() => setIsMounted(true), []);
  useBodyLock(true);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const still = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (still || WAIT_PHOTOS.length < 2) return;
    const slideTimer = setInterval(
      () => setIndex((previousIndex) => (previousIndex + 1) % WAIT_PHOTOS.length),
      WAIT_SLIDE_MS,
    );
    return () => clearInterval(slideTimer);
  }, []);

  useEffect(() => {
    if (!bookingRef) {
      setPhase('blind');
      return;
    }
    const token = readLocal(KEY.token, '');
    if (!token) {
      setPhase('blind');
      return;
    }
    let stop = false;
    const started = Date.now();
    async function ask() {
      try {
        const response = await fetch(`${API_BASE}/booking-status/${encodeURIComponent(bookingRef)}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (stop) return;
        if (response.status === 401 || response.status === 404) {
          setPhase('blind');
          return;
        }
        const data = await response.json().catch(() => null);
        if (stop) return;
        if (data && data.payment === 'paid') {
          setPhase('paid');
          if (typeof onConfirmed === 'function') onConfirmed();
          return;
        }
        if (data && data.payment === 'mismatch') {
          setPhase('mismatch');
          return;
        }
      } catch (e) {}
      if (stop) return;
      if (Date.now() - started > GIVE_UP_MS) {
        setPhase('slow');
        return;
      }
      timer.current = setTimeout(ask, POLL_MS);
    }
    timer.current = setTimeout(ask, POLL_MS);
    return () => {
      stop = true;
      clearTimeout(timer.current);
    };
  }, [bookingRef, onConfirmed]);

  if (!isMounted) return null;

  const isWaiting = phase === 'waiting';
  const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
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
      lines: [
        'The payment cleared. Your confirmation email is on its way, with the details of every day we have booked for you.',
      ],
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
      {WAIT_PHOTOS.map((photo, indexItem) =>
        indexItem <= index + 1 || indexItem === WAIT_PHOTOS.length - 1 ? (
          <img
            key={photo.src}
            src={photo.src}
            alt={indexItem === index ? photo.alt : ''}
            aria-hidden={indexItem === index ? undefined : 'true'}
            className={`absolute inset-0 w-full h-full object-cover [transition:opacity_1.2s_var(--ease)] ${indexItem === index ? 'opacity-100' : 'opacity-0'}`}
          />
        ) : null,
      )}
      <div className="absolute inset-0 bg-[rgba(20,19,16,0.62)]" />

      <div className="relative z-10 flex flex-col items-center justify-center h-full px-[var(--container-x)] text-center">
        {isWaiting && (
          <span
            className="w-[26px] h-[26px] mb-5 rounded-[50%] border-[3px] border-solid border-[rgba(255,255,255,0.28)] border-t-white animate-[spin_0.7s_linear_infinite]"
            aria-hidden="true"
          />
        )}
        <h2 className="mb-3 font-body text-h2 font-semibold text-white">{COPY.title}</h2>
        <div className="max-w-[420px]">
          {COPY.lines.map((line, indexItem) => (
            <p className="mb-2 text-body leading-[var(--lh-body)] text-[rgba(255,255,255,0.86)]" key={indexItem}>
              {line}
            </p>
          ))}
        </div>
        {bookingRef && (
          <p className="mt-2 text-small font-semibold tracking-[0.08em] uppercase text-[rgba(255,255,255,0.72)]">
            Booking {bookingRef}
          </p>
        )}

        {!isWaiting && (
          <div className="w-full max-w-[320px] mt-6">
            <button type="button" className={BTN} onClick={onClose}>
              Done
            </button>
            {(phase === 'mismatch' || phase === 'slow') && (
              <a className={`${BTN_WA} ${STACK}`} href={whatsappUrl} target="_blank" rel="noopener noreferrer">
                WhatsApp
              </a>
            )}
          </div>
        )}
      </div>
    </div>,
    document.body,
  );
}
