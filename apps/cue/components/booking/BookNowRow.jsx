'use client';
import { BTN_SM } from '@/components/ui/btnClasses';

import Price from '@/components/Price';
import { priceUnit } from '@/lib/priceUnit';
import { useTripPrefs } from '@/state/TripPrefsProvider';
import { scrollToBookCard } from './bookScroll';

// Price + Book now under the hero chips, scrolling to the one booking card; phone/tablet only (hidden from 993px).
const KICKER = 'text-[0.6rem] font-medium tracking-[0.12em] uppercase text-muted leading-none';
// Amount is soft black via <Price>'s own className (a wrapper loses to amber); shrinks under 360px to fit.
const AMOUNT = 'price font-head text-[1.6rem] max-[360px]:text-[1.25rem] font-bold leading-[1.05] tracking-[-0.02em] text-gold';
// Unit sits inline on the amount's baseline.
const UNIT = 'text-small text-muted';
const CTA =
  `flex-none flex ${BTN_SM} max-[360px]:px-3 bg-cta text-white font-body ` +
  'no-underline border-none cursor-pointer ' +
  '[transition:background-color_var(--dur)_var(--ease),scale_var(--dur-fast)_var(--ease)] hover:bg-cta-d';
// Row in normal flow that never hides itself (see below).
const ROW =
  'booknowrow flex items-center justify-between gap-4 mt-[1.1rem] py-[0.85rem] px-4 rounded-md bg-white ' +
  '[border:1px_solid_var(--line)] min-[993px]:hidden';

// No hide logic: hiding an in-flow row shifts the page mid-scroll; the fixed BookBar watches this row instead.
export default function BookNowRow({ item, priceFallback, perPerson = false }) {
  const { displayGuests } = useTripPrefs();
  if (!item) return null;

  return (
    <div className={ROW}>
      <span className="min-w-0">
        <span className={KICKER}>From</span>
        <span className="flex items-baseline gap-2 mt-[0.2rem] whitespace-nowrap">
          <Price name={item} fallback={priceFallback} className={AMOUNT} />
          <span className={UNIT}>{priceUnit(perPerson, displayGuests)}</span>
        </span>
      </span>
      <button type="button" className={CTA} onClick={scrollToBookCard} aria-label="Book now - go to the booking form">
        Book now
      </button>
    </div>
  );
}
