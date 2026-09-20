'use client';

import { Check, Plus } from 'lucide-react';
import { useCart } from '@/components/providers/CartProvider';
import { serviceById } from '@/lib/bookingCart';

// "Add to My Booking" for a service page. It is a toggle, not a one-way add:
// a guest who taps it twice expects the second tap to undo the first, and a
// button that only ever adds silently stacks duplicates.
//
// Nothing here quotes a price. Services are carried on the booking as requests
// (see lib/bookingCart.js) because the service pages say prices are confirmed
// with us, so the label promises a conversation, not a charge.
export default function AddToBooking({ serviceId, className = 'btn btn-outline btn-full mt-2' }) {
  const { cart, ready, toggleService } = useCart();
  const service = serviceById(serviceId);
  if (!service) return null;

  const on = ready && cart.services.includes(serviceId);

  return (
    <button
      type="button"
      onClick={() => toggleService(serviceId)}
      aria-pressed={on}
      className={className}
    >
      {on
        ? <><Check className="w-[var(--icon-sm)] h-[var(--icon-sm)]" strokeWidth={2} aria-hidden="true" /> Added to My Booking</>
        : <><Plus className="w-[var(--icon-sm)] h-[var(--icon-sm)]" strokeWidth={2} aria-hidden="true" /> Add to My Booking</>}
    </button>
  );
}
