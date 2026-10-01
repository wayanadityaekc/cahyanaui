'use client';

import { useState } from 'react';
import CheckoutSheet from '@/components/booking/CheckoutSheet';
import PayWaiting from '@/components/booking/PayWaiting';
import { useCart } from '@/components/providers/CartProvider';

// Extras already in My Booking ride along only when they fit inside the stay being booked here.
function fitsStay(extra, stay) {
  if (extra.kind === 'transfer' || !extra.date) return true;
  return extra.date >= stay.checkIn && extra.date <= stay.checkOut;
}

// Book now from anywhere on the site: the same 3-step checkout as My Booking, then the waiting screen after paying.
export default function StayCheckout({ stay = null, open = false, onClose = () => {} }) {
  const { cart, clear } = useCart();
  const [waitingRef, setWaitingRef] = useState('');
  const booking = stay ? { ...cart, stay, extras: cart.extras.filter((extra) => fitsStay(extra, stay)) } : null;

  return (
    <>
      {booking && (
        <CheckoutSheet
          open={open}
          onClose={onClose}
          cart={booking}
          onPaid={(ref) => { onClose(); setWaitingRef(ref); }}
        />
      )}
      {waitingRef && <PayWaiting bookingRef={waitingRef} onClose={() => setWaitingRef('')} onConfirmed={clear} />}
    </>
  );
}
