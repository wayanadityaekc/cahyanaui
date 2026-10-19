'use client';

import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import Overlay from '../primitives/Overlay.jsx';
import { PANEL_CLOSE } from '../primitives/controlClasses.js';
import { starText } from './reviewClasses.js';

const BOX =
  'fixed z-[301] left-1/2 top-1/2 [transform:translate(-50%,-50%)] w-[min(460px,calc(100vw-2rem))] ' +
  'max-h-[calc(100dvh-2rem)] overflow-y-auto bg-surface-raised rounded-md px-6 pt-6 pb-7 font-body ' +
  'focus:outline-none';

function formatReviewDate(iso) {
  if (!iso) return '';
  const reviewDate = new Date(iso);
  return Number.isNaN(reviewDate.getTime())
    ? ''
    : reviewDate.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
}

export default function ReviewDetail({ review, onClose, title = 'Guest review' }) {
  const boxRef = useRef(null);
  const closeRef = useRef(onClose);
  closeRef.current = onClose;
  const isOpen = !!review;

  useEffect(() => {
    if (!isOpen) return undefined;
    const opener = document.activeElement;
    if (boxRef.current) boxRef.current.focus();
    function handleEscapeKeyDown(event) {
      if (event.key === 'Escape') closeRef.current();
    }
    document.addEventListener('keydown', handleEscapeKeyDown);
    return () => {
      document.removeEventListener('keydown', handleEscapeKeyDown);
      if (opener && typeof opener.focus === 'function') opener.focus();
    };
  }, [isOpen]);

  if (!isOpen || typeof document === 'undefined') return null;
  const currentReview = review;
  const { n: starCount, stars } = starText(currentReview.rating);
  const trips =
    currentReview.services && currentReview.services.length > 1
      ? currentReview.services.join(' · ')
      : currentReview.service;

  return (
    <>
      <Overlay open elevated onClose={onClose} />
      {createPortal(
        <div ref={boxRef} role="dialog" aria-modal="true" aria-label={title} tabIndex={-1} className={BOX}>
          <button
            type="button"
            className={`${PANEL_CLOSE} absolute right-4 top-4`}
            aria-label="Close"
            onClick={onClose}
          >
            &times;
          </button>
          <p className="m-0 mb-4 text-center font-semibold text-strong text-green">{title}</p>
          <div className="flex items-center justify-between gap-3 mb-1">
            <span className="font-semibold text-body text-green">{currentReview.name}</span>
            {currentReview.created_at && (
              <span className="text-label text-muted">{formatReviewDate(currentReview.created_at)}</span>
            )}
          </div>
          {currentReview.country && <div className="mb-2 text-label text-muted">{currentReview.country}</div>}
          {trips && <div className="mb-2 text-label text-muted">{trips}</div>}
          <div className="mb-3 text-amber tracking-[2px]" aria-label={`${starCount} out of 5`}>
            {stars}
          </div>
          <p className="m-0 text-body text-green leading-[var(--lh-body)] whitespace-pre-line">
            {currentReview.message}
          </p>
        </div>,
        document.body,
      )}
    </>
  );
}
