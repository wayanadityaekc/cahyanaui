'use client';

import { TripPrefsProvider } from './TripPrefsProvider';
import { ItineraryProvider } from './ItineraryProvider';
import { AccountProvider } from './AccountProvider';
import { ReferralProvider } from './ReferralProvider';
import { PricingProvider } from './PricingProvider';
import { BookingProvider } from './BookingProvider';

export default function Providers({ children }) {
  return (
    <TripPrefsProvider>
      <ReferralProvider>
        <AccountProvider>
          <ItineraryProvider>
            <PricingProvider>
              <BookingProvider>{children}</BookingProvider>
            </PricingProvider>
          </ItineraryProvider>
        </AccountProvider>
      </ReferralProvider>
    </TripPrefsProvider>
  );
}
