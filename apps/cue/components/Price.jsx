'use client';

import { usePricing } from '@/state/PricingProvider';
import { PRICE, PRICE_SYM, PRICE_TAIL } from '@/components/ui/priceClasses';

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

// IDR only: the trailing ".000" thousands group shown smaller (see PRICE_TAIL)
// instead of full-size, so long amounts ("Rp1.300.000") read clearly and take
// less width. Splits after the LAST dot, keeping it with the (normal-size)
// leading digits - e.g. "1.300.000" -> "1.300." + small "000".
function withDeemphasizedThousands(num) {
  const i = num.lastIndexOf('.');
  if (i === -1) return num;
  return (
    <>
      {num.slice(0, i + 1)}
      <span className={PRICE_TAIL}>{num.slice(i + 1)}</span>
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
  const isIdr = symbol === 'Rp';
  const value = band.display;
  const num = value.toLocaleString(isIdr ? 'id-ID' : 'en-US');

  return (
    <Tag className={className} data-price={name} data-mode={mode}>
      <span className={`${PRICE_SYM} price__sym`}>{symbol}</span>{isIdr ? withDeemphasizedThousands(num) : num}
    </Tag>
  );
}
