'use client';

import AuthModal from '@/components/account/AuthModal';
import { useBooking } from '@/state/BookingProvider';

export default function BookingGate() {
  const { gate, cancelGate } = useBooking();
  return <AuthModal open={gate} onClose={cancelGate} reason="book" onSignedIn={() => {}} />;
}
