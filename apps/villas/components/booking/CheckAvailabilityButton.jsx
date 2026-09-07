'use client';

import { useBooking } from '@/components/providers/BookingProvider';

// Reusable "Check availability" trigger — opens the booking sheet, optionally
// pre-selecting a villa (used on villa cards / detail pages).
export default function CheckAvailabilityButton({ villaSlug, className = 'btn btn-cta', children = 'Check availability' }) {
  const { openBooking } = useBooking();
  return (
    <button
      type="button"
      className={className}
      onClick={() => openBooking(villaSlug ? { villaSlug } : {})}
    >
      {children}
    </button>
  );
}
