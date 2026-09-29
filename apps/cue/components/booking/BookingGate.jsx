'use client';

import AuthModal from '@/components/account/AuthModal';
import { useBooking } from '@/state/BookingProvider';

// Sign-in popup opened by the booking gate; one instance in the layout, the rules live in BookingProvider.
export default function BookingGate() {
  const { gate, cancelGate } = useBooking();
  // onSignedIn is a no-op on purpose: calling cancelGate here would drop the held booking before it opens.
  return <AuthModal open={gate} onClose={cancelGate} reason="book" onSignedIn={() => {}} />;
}
