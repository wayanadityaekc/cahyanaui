'use client';

import { AnimatePresence, LazyMotion, domAnimation, m, useReducedMotion } from 'motion/react';
import { useCurrency } from '@/components/providers/CurrencyProvider';
import { priceBreakdown } from '@/lib/villas';

// Nights and total for the picked stay, fading in once both dates are set (Wayan: Framer Motion on date selection).
export default function StaySummary({ villaSlug = '', checkIn = '', checkOut = '' }) {
  const { formatAmount, breakdown: convert } = useCurrency();
  const reduce = useReducedMotion();
  const breakdown = checkIn && checkOut ? priceBreakdown(villaSlug, checkIn, checkOut) : null;
  const shown = breakdown && breakdown.nights > 0 ? convert(breakdown) : null;

  return (
    <LazyMotion features={domAnimation}>
      <AnimatePresence initial={false}>
        {shown && (
          <m.div
            key={`${checkIn}-${checkOut}`}
            initial={{ opacity: 0, y: reduce ? 0 : 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: reduce ? 0 : 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="divide-y divide-line text-small"
            data-stay-summary
          >
            <div className="flex justify-between py-2">
              <span className="text-muted">{formatAmount(shown.nightly)} x {shown.nights} night{shown.nights === 1 ? '' : 's'}</span>
              <span className="text-gold">{formatAmount(shown.subtotal)}</span>
            </div>
            <div className="flex justify-between py-2.5">
              <span className="font-semibold text-gold">Total</span>
              <span className="font-bold text-amber" data-stay-total>{formatAmount(shown.total)}</span>
            </div>
          </m.div>
        )}
      </AnimatePresence>
    </LazyMotion>
  );
}
