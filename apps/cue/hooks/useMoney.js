'use client';

import { useTripPrefs } from '@/state/TripPrefsProvider';
import { usePricing } from '@/state/PricingProvider';

export default function useMoney() {
  const { currency } = useTripPrefs();
  const pricing = usePricing();
  const symbol = (pricing && pricing.symbol) || (pricing && pricing.catalog && pricing.catalog.symbol) || '$';
  const locale = currency === 'IDR' ? 'id-ID' : 'en-US';
  function format(amount) {
    return amount == null ? '-' : symbol + Number(amount).toLocaleString(locale);
  }
  return { symbol, currency, locale, format };
}
