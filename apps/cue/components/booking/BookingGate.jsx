'use client';

import AuthModal from '@/components/account/AuthModal';
import { useBooking } from '@/state/BookingProvider';

// The sign-in popup the booking gate opens (WO2). One instance, mounted next to
// BookConfirmModal in the layout, so every Book path shares it. The rules live in
// BookingProvider; this only renders.
export default function BookingGate() {
  const { gate, cancelGate } = useBooking();
  // onSignedIn does nothing on purpose: BookingProvider sees the new account and
  // swaps this popup for the booking form itself. Calling cancelGate here would
  // drop the held booking a tick before that happens.
  return <AuthModal open={gate} onClose={cancelGate} reason="book" onSignedIn={() => {}} />;
}
