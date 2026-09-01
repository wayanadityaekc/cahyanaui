'use client';

import { TripPrefsProvider } from './TripPrefsProvider';
import { ItineraryProvider } from './ItineraryProvider';
import { AccountProvider } from './AccountProvider';
import { ReferralProvider } from './ReferralProvider';
import { PricingProvider } from './PricingProvider';

export default function Providers({ children }) {
  return (
    <TripPrefsProvider>
      <ReferralProvider>
        <AccountProvider>
          <ItineraryProvider>
            <PricingProvider>{children}</PricingProvider>
          </ItineraryProvider>
        </AccountProvider>
      </ReferralProvider>
    </TripPrefsProvider>
  );
}
