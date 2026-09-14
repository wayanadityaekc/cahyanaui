'use client';

import { usePricing } from '@/state/PricingProvider';
import { withSymbol } from '@/components/Price';

// Renders the live "+$6" / "+Rp100.000" pick-up-outside-Ubud charter surcharge
// from catalog.charterSurcharge (cahyana-api/pricing.js), so CharterHome's copy
// stays currency-correct and never drifts from CHARTER.surchargeUsd/Idr again -
// it used to be a hardcoded "+$7" that was both USD-only and stale (real value
// is 6, not 7).
export default function CharterSurcharge({ fallback = '+$6' }) {
  const ctx = usePricing();
  const catalog = ctx && ctx.catalog;
  const sur = catalog && catalog.charterSurcharge;

  if (!sur) return fallback;

  const isIdr = catalog.currency === 'IDR';
  const symbol = catalog.symbol || '$';
  const text = symbol + sur.display.toLocaleString(isIdr ? 'id-ID' : 'en-US');

  return <>+{withSymbol(text)}</>;
}
