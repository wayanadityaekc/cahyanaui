'use client';

import { usePricing } from '@/state/PricingProvider';
import { PRICE, PRICE_SYM } from '@/components/ui/priceClasses';

// Render "$40" / "Rp700.000" with the currency symbol as its own span so it can
// be shown smaller than the number (PRICE_SYM + the price__sym hook). Only splits
// when the string actually has a number, so placeholders like "-" pass through.
export function withSymbol(text) {
  const m = String(text).match(/^(\D+)(\d.*)$/);
  if (!m) return text;
  return (
    <>
      <span className={`${PRICE_SYM} price__sym`}>{m[1]}</span>{m[2]}
    </>
  );
}

// Default keeps a bare `price` hook (no CSS) alongside the PRICE utilities so
// ExperienceCard's card-footer mobile shrink ([&_.price]:text-small) still targets it.
export default function Price({ name, mode = 'standard', fallback, className = `${PRICE} price`, as: Tag = 'span' }) {
  const ctx = usePricing();
  const item = ctx && ctx.lookup ? ctx.lookup(name) : null;

  if (!item) {
    return <Tag className={className} data-price={name}>{fallback ? withSymbol(fallback) : fallback}</Tag>;
  }

  const band = mode === 'exclusive' && item.exclusive ? item.exclusive : item.standard;
  const symbol = ctx.symbol || '$';
  const value = band.display;
  const num = value.toLocaleString(symbol === 'Rp' ? 'id-ID' : 'en-US');

  return (
    <Tag className={className} data-price={name} data-mode={mode}>
      <span className={`${PRICE_SYM} price__sym`}>{symbol}</span>{num}
    </Tag>
  );
}
