'use client';

import { useRef } from 'react';
import Modal from '@/components/ui/Modal';

// The full text behind a clicked ReviewCard (Sep 2026, Wayan: "fix box per
// review and it can see details when got clicked"). Reuses the same Modal
// shell every other popup on the site uses (AuthModal, ReviewModal) rather
// than a one-off dialog - one modal language, one close/Escape/backdrop
// behaviour, for free.
function fmtDate(iso) {
  if (!iso) return '';
  try {
    return new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
  } catch (e) {
    return '';
  }
}

export default function ReviewDetailModal({ review, onClose }) {
  const open = !!review;
  // Modal.jsx fades out over 300ms rather than unmounting instantly - reading
  // straight off `review` would blank the text mid-fade the moment it goes
  // null. Keep the last one on screen while it closes, same pattern as
  // BookConfirmModal's lastCtx.
  const lastRef = useRef(null);
  if (review) lastRef.current = review;
  const r = review || lastRef.current || {};
  const n = Math.max(1, Math.min(5, parseInt(r.rating, 10) || 0));
  const stars = '★'.repeat(n) + '☆'.repeat(5 - n);

  return (
    <Modal open={open} onClose={onClose} title="Guest review">
      <div className="flex items-center justify-between gap-3 mb-1">
        <span className="font-semibold text-body text-green">{r.name}</span>
        {r.created_at && <span className="text-label text-muted">{fmtDate(r.created_at)}</span>}
      </div>
      {r.country && <div className="mb-2 text-label text-muted">{r.country}</div>}
      {r.service && <div className="mb-2 text-label text-muted">{r.service}</div>}
      <div className="mb-3 text-amber tracking-[2px]" aria-label={`${n} out of 5`}>{stars}</div>
      <p className="m-0 text-body text-green leading-[var(--lh-body)] whitespace-pre-line">{r.message}</p>
    </Modal>
  );
}
