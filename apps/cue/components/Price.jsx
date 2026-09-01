'use client';

import { usePricing } from '@/state/PricingProvider';

export default function Price({ name, mode = 'standard', fallback, className = 'price' }) {
  const ctx = usePricing();
  const item = ctx && ctx.lookup ? ctx.lookup(name) : null;

  if (!item) return <span className={className} data-price={name}>{fallback}</span>;

  const band = mode === 'exclusive' && item.exclusive ? item.exclusive : item.standard;
  const symbol = ctx.symbol || '$';
  const value = band.display;
  const text = symbol + value.toLocaleString(symbol === 'Rp' ? 'id-ID' : 'en-US');

  return <span className={className} data-price={name} data-mode={mode}>{text}</span>;
}
