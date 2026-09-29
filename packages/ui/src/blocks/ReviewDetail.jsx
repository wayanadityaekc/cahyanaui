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

function fmtDate(iso) {
  if (!iso) return '';
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? '' : d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
}

/**
 * The full text of one review, over a dimmed page. Open = `review` is set.
 * Escape, the X and a tap on the backdrop close it; focus moves onto the box
 * (never onto a field, which would raise a phone keyboard) and returns to
 * whatever opened it. A merged review (groupReviews) lists every trip it covers.
 */
export default function ReviewDetail({ review, onClose, title = 'Guest review' }) {
  const boxRef = useRef(null);
  // Latest onClose in a ref, so a parent re-render never re-runs the open/close effect.
  const closeRef = useRef(onClose);
  closeRef.current = onClose;
  const open = !!review;

  useEffect(() => {
    if (!open) return undefined;
    const opener = document.activeElement;
    if (boxRef.current) boxRef.current.focus();
    const onKey = (e) => { if (e.key === 'Escape') closeRef.current(); };
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('keydown', onKey);
      if (opener && typeof opener.focus === 'function') opener.focus();
    };
  }, [open]);

  // Nothing until it opens: portaling the backdrop during the first render would not match the static HTML.
  if (!open || typeof document === 'undefined') return null;
  const r = review;
  const { n, stars } = starText(r.rating);
  const trips = r.services && r.services.length > 1 ? r.services.join(' · ') : r.service;

  return (
    <>
      <Overlay open elevated onClose={onClose} />
      {createPortal(
        <div ref={boxRef} role="dialog" aria-modal="true" aria-label={title} tabIndex={-1} className={BOX}>
          <button type="button" className={`${PANEL_CLOSE} absolute right-4 top-4`} aria-label="Close" onClick={onClose}>&times;</button>
          <p className="m-0 mb-4 text-center font-semibold text-strong text-green">{title}</p>
          <div className="flex items-center justify-between gap-3 mb-1">
            <span className="font-semibold text-body text-green">{r.name}</span>
            {r.created_at && <span className="text-label text-muted">{fmtDate(r.created_at)}</span>}
          </div>
          {r.country && <div className="mb-2 text-label text-muted">{r.country}</div>}
          {trips && <div className="mb-2 text-label text-muted">{trips}</div>}
          <div className="mb-3 text-amber tracking-[2px]" aria-label={`${n} out of 5`}>{stars}</div>
          <p className="m-0 text-body text-green leading-[var(--lh-body)] whitespace-pre-line">{r.message}</p>
        </div>,
        document.body,
      )}
    </>
  );
}
