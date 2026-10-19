'use client';

import { usePricing } from '@/state/PricingProvider';
import { withSymbol } from '@/components/Price';

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
