'use client';

import { BTN_PILL } from '@/components/ui/btnClasses';

export default function ReviewCta({ label = 'Leave a review' }) {
  return (
    <button
      type="button"
      className={BTN_PILL}
      onClick={() => {
        window.location.href = '/my-trips.html';
      }}
    >
      {label}
    </button>
  );
}
