'use client';

import { usePricing } from '@/state/PricingProvider';
import { withSymbol } from '@/components/Price';

export default function CharterPrice({ duration, extra, fallback, className = 'chcard__amt' }) {
  const ctx = usePricing();
  const catalog = ctx && ctx.catalog;

  if (!catalog || !catalog.charters) {
    return <span className={className} data-charter={duration} data-charter-extra={extra}>{fallback}</span>;
  }

  const base = catalog.charters.find((c) => c.duration === duration);
  if (!base) {
    return <span className={className} data-charter={duration} data-charter-extra={extra}>{fallback}</span>;
  }

  const hours = parseInt(extra, 10) || 0;
  const perHour = catalog.charterExtraHour || { usd: 0, idr: 0 };
  const isIdr = catalog.currency === 'IDR';
  const value = isIdr ? base.idr + hours * perHour.idr : base.display + hours * perHour.usd;
  const symbol = catalog.symbol || '$';

  return (
    <span className={className} data-charter={duration} data-charter-extra={extra}>
      {withSymbol(symbol + value.toLocaleString(isIdr ? 'id-ID' : 'en-US'))}
    </span>
  );
}
