'use client';

import { useRef } from 'react';
import Modal from '@/components/ui/Modal';

// Full text of a clicked ReviewCard, in the shared Modal shell.
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
  // Keep the last review on screen while the modal fades out, or the text blanks mid-fade.
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
      {r.service && (
        <div className="mb-2 text-label text-muted">
          {r.services && r.services.length > 1 ? r.services.join(' · ') : r.service}
        </div>
      )}
      <div className="mb-3 text-amber tracking-[2px]" aria-label={`${n} out of 5`}>{stars}</div>
      <p className="m-0 text-body text-green leading-[var(--lh-body)] whitespace-pre-line">{r.message}</p>
    </Modal>
  );
}
