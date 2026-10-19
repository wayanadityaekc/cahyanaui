'use client';

import { usePricing } from '@/state/PricingProvider';
import { PRICE, PRICE_SYM, PRICE_TAIL, PRICE_WAS } from '@/components/ui/priceClasses';

export function withDeemphasizedThousands(priceNumber) {
  const decimalIndex = priceNumber.lastIndexOf('.');
  if (decimalIndex === -1) return priceNumber;
  return (
    <>
      {priceNumber.slice(0, decimalIndex + 1)}
      <span className={PRICE_TAIL}>{priceNumber.slice(decimalIndex + 1)}</span>
    </>
  );
}

export function withSymbol(text) {
  const priceMatch = String(text).match(/^(\D+)(\d.*)$/);
  if (!priceMatch) return text;
  const symbol = priceMatch[1];
  const numberText = priceMatch[2];
  return (
    <>
      <span className={`${PRICE_SYM} price__sym`}>{symbol}</span>
      {symbol === 'Rp' ? withDeemphasizedThousands(numberText) : numberText}
    </>
  );
}

export default function Price({ name, mode = 'standard', fallback, className = `${PRICE} price`, as: Tag = 'span' }) {
  const pricing = usePricing();
  const item = pricing && pricing.lookup ? pricing.lookup(name) : null;

  if (!item) {
    return (
      <Tag className={className} data-price={name}>
        {fallback ? withSymbol(fallback) : fallback}
      </Tag>
    );
  }

  const band = mode === 'exclusive' && item.exclusive ? item.exclusive : item.standard;
  const symbol = pricing.symbol || '$';
  const isIdr = symbol === 'Rp';
  const value = band.display;
  const formattedNumber = value.toLocaleString(isIdr ? 'id-ID' : 'en-US');

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
      <span className={`${PRICE_SYM} price__sym`}>{symbol}</span>
      {isIdr ? withDeemphasizedThousands(formattedNumber) : formattedNumber}
    </Tag>
  );
}
