'use client';

import { useRef } from 'react';
import Modal from '@/components/ui/Modal';

function fmtDate(iso) {
  if (!iso) return '';
  try {
    return new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
  } catch (e) {
    return '';
  }
}

export default function ReviewDetailModal({ review, onClose }) {
  const isOpen = !!review;
  const lastRef = useRef(null);
  if (review) lastRef.current = review;
  const currentReview = review || lastRef.current || {};
  const starCount = Math.max(1, Math.min(5, parseInt(currentReview.rating, 10) || 0));
  const stars = '★'.repeat(starCount) + '☆'.repeat(5 - starCount);

  return (
    <Modal open={isOpen} onClose={onClose} title="Guest review">
      <div className="flex items-center justify-between gap-3 mb-1">
        <span className="font-semibold text-body text-green">{currentReview.name}</span>
        {currentReview.created_at && <span className="text-label text-muted">{fmtDate(currentReview.created_at)}</span>}
      </div>
      {currentReview.country && <div className="mb-2 text-label text-muted">{currentReview.country}</div>}
      {currentReview.service && (
        <div className="mb-2 text-label text-muted">
          {currentReview.services && currentReview.services.length > 1
            ? currentReview.services.join(' · ')
            : currentReview.service}
        </div>
      )}
      <div className="mb-3 text-amber tracking-[2px]" aria-label={`${starCount} out of 5`}>
        {stars}
      </div>
      <p className="m-0 text-body text-green leading-[var(--lh-body)] whitespace-pre-line">{currentReview.message}</p>
    </Modal>
  );
}
