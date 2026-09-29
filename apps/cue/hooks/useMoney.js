'use client';

import { useTripPrefs } from '@/state/TripPrefsProvider';
import { usePricing } from '@/state/PricingProvider';

// Format prices in the guest's currency: symbol from the pricing context (fallback '$'), locale from currency.
export default function useMoney() {
  const { currency } = useTripPrefs();
  const pricing = usePricing();
  const symbol =
    (pricing && pricing.symbol) ||
    (pricing && pricing.catalog && pricing.catalog.symbol) ||
    '$';
  const locale = currency === 'IDR' ? 'id-ID' : 'en-US';
  function format(n) { return (n == null ? '-' : symbol + Number(n).toLocaleString(locale)); }
  return { symbol, currency, locale, format };
}
