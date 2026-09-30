'use client';

import { Button } from '@cahyana/ui';
import { useBooking } from '@/components/providers/BookingProvider';

// Reusable 'Check availability' trigger: opens the booking sheet, optionally with a villa preselected.
export default function CheckAvailabilityButton({ villaSlug, variant = 'primary', full = false, className, children = 'Check availability' }) {
  const { openBooking } = useBooking();
  return (
    <Button
      variant={variant}
      full={full}
      className={className}
      onClick={() => openBooking(villaSlug ? { villaSlug } : {})}
    >
      {children}
    </Button>
  );
}
