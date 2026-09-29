'use client';

import { usePricing } from '@/state/PricingProvider';
import { PRICE, PRICE_SYM, PRICE_TAIL, PRICE_WAS } from '@/components/ui/priceClasses';

// IDR only: shows the last '.000' group smaller; exported for bare numbers like HeroSearch's range.
export function withDeemphasizedThousands(num) {
  const i = num.lastIndexOf('.');
  if (i === -1) return num;
  return (
    <>
      {num.slice(0, i + 1)}
      <span className={PRICE_TAIL}>{num.slice(i + 1)}</span>
    </>
  );
}

// Splits a price string into a small symbol span + number (IDR thousands shrunk) for self-formatted prices.
export function withSymbol(text) {
  const m = String(text).match(/^(\D+)(\d.*)$/);
  if (!m) return text;
  const symbol = m[1];
  const num = m[2];
  return (
    <>
      <span className={`${PRICE_SYM} price__sym`}>{symbol}</span>
      {symbol === 'Rp' ? withDeemphasizedThousands(num) : num}
    </>
  );
}

// Default className keeps the bare `price` hook next to PRICE; ExperienceCard's [&_.price] mobile shrink targets it.
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

  // Strike the list price only when it differs from the current price, never because a sale flag is set.
  const listBand = mode === 'exclusive' && item.listExclusive ? item.listExclusive : item.listStandard;
  const was = listBand && listBand.display !== value ? listBand.display : null;
  const wasNum = was == null ? null : was.toLocaleString(isIdr ? 'id-ID' : 'en-US');

  return (
    <Tag className={className} data-price={name} data-mode={mode}>
      {wasNum != null && (
        <span className={PRICE_WAS} data-price-was>
          <span className={`${PRICE_SYM} price__sym`}>{symbol}</span>
          {isIdr ? withDeemphasizedThousands(wasNum) : wasNum}
        </span>
      )}
      <span className={`${PRICE_SYM} price__sym`}>{symbol}</span>{isIdr ? withDeemphasizedThousands(num) : num}
    </Tag>
  );
}
