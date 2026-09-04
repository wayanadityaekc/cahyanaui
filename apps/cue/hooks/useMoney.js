'use client';

import { useTripPrefs } from '@/state/TripPrefsProvider';
import { usePricing } from '@/state/PricingProvider';

/**
 * useMoney - one place to format prices in the guest's chosen currency.
 * Symbol comes from the live pricing context (falls back to "$"), locale
 * from the selected currency. `format(n)` returns a display string.
 */
export default function useMoney() {
  const { currency } = useTripPrefs();
  const pricing = usePricing();
  const symbol =
    (pricing && pricing.symbol) ||
    (pricing && pricing.catalog && pricing.catalog.symbol) ||
    '$';
  const locale = currency === 'IDR' ? 'id-ID' : 'en-US';
  const format = (n) => (n == null ? '-' : symbol + Number(n).toLocaleString(locale));
  return { symbol, currency, locale, format };
}
