'use client';

import AuthModal from '@/components/account/AuthModal';
import { useBooking } from '@/state/BookingProvider';

export default function BookingGate() {
  const { gate, cancelGate: handleGateCancel } = useBooking();
  return <AuthModal open={gate} onClose={handleGateCancel} reason="book" onSignedIn={() => {}} />;
}
