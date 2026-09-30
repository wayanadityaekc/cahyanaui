'use client';

import { Check, Plus } from 'lucide-react';
import { useState } from 'react';
import { Button, LiveRegion } from '@cahyana/ui';
import { useCart } from '@/components/providers/CartProvider';
import { serviceById } from '@/lib/bookingCart';

// Toggle, not one-way add, so a second tap undoes the first; no price, services are requests.
export default function AddToBooking({ serviceId, variant = 'ghost', className = 'mt-2' }) {
  const { cart, ready, toggleService } = useCart();
  const [announcement, setAnnouncement] = useState('');
  const service = serviceById(serviceId);
  if (!service) return null;

  const on = ready && cart.services.includes(serviceId);

  function toggle() {
    toggleService(serviceId);
    setAnnouncement(on ? `${service.label} removed from My Booking` : `${service.label} added to My Booking`);
  }

  return (
    <>
      <Button
        variant={variant}
        full
        onClick={toggle}
        aria-pressed={on}
        className={className}
      >
        {on
          ? <><Check className="w-[var(--icon-sm)] h-[var(--icon-sm)]" strokeWidth={2} aria-hidden="true" /> Added to My Booking</>
          : <><Plus className="w-[var(--icon-sm)] h-[var(--icon-sm)]" strokeWidth={2} aria-hidden="true" /> Add to My Booking</>}
      </Button>
      <LiveRegion>{announcement}</LiveRegion>
    </>
  );
}
