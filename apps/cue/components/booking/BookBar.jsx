'use client';
import { BTN_SM } from '@/components/ui/btnClasses';

import { useEffect, useState } from 'react';
import Price from '@/components/Price';
import { priceUnit } from '@/lib/priceUnit';
import { useTripPrefs } from '@/state/TripPrefsProvider';
import { BAR_SHELL, BAR_UPTO_LG } from '@/components/ui/stickyBar';
import { observeBookCtas, scrollToBookCard } from './bookScroll';

// Mobile sticky price + Book now bar; stays mounted when hidden, and layout.jsx body padding matches its height.

// Kept small and quiet so the amount stays the loudest thing in the bar.
const KICKER = 'text-[0.6rem] font-medium tracking-[0.12em] uppercase text-muted leading-none';
const UNIT = 'text-[0.68rem] font-normal text-muted leading-none';
// Bar price is soft black, not amber; pass the colour via <Price> className, a wrapper class loses.
const AMOUNT = 'price text-[1.2rem] font-semibold text-gold leading-none';
// CTA uses the standard BTN_SM height; don't self-stretch it to the bar height.
const CTA =
  `flex-none flex ${BTN_SM} bg-cta text-white no-underline whitespace-nowrap hover:bg-cta-d`;

export default function BookBar({ item, priceFallback, perPerson = false }) {
  const { displayGuests } = useTripPrefs();
  // Starts hidden so the static HTML doesn't flash the bar on screen before the observer decides.
  const [hidden, setHidden] = useState(true);

  useEffect(() => {
    if (!item) return undefined;
    // Hide while any booking CTA (the card or the inline Book now row) is on screen; the selector list lives in bookScroll.
    const self = document.querySelector('.bookbar');
    const stop = observeBookCtas(self, setHidden);
    // No CTAs to observe means nothing will ever reveal the bar, so show it now.
    if (!stop) setHidden(false);
    return stop;
  }, [item]);

  if (!item) return null;

  return (
    <div
      className={`${BAR_SHELL} ${BAR_UPTO_LG} bookbar [transition:translate_var(--dur-slow)_var(--ease),opacity_var(--dur)_var(--ease)] ${
        hidden ? 'translate-y-[150%] opacity-0 pointer-events-none' : 'translate-y-0 opacity-100'
      }`}
      inert={hidden || undefined}
    >
      <div className="flex-1 min-w-0">
        {/* 'From' is accurate: this is the base Standard price and guests, Exclusive or pickup only raise it. */}
        <span className={KICKER}>From</span>
        <span className="flex items-baseline gap-1.5 mt-[0.28rem]">
          <Price name={item} fallback={priceFallback} className={AMOUNT} />
          {/* Unit label from lib/priceUnit.js (per car vs total for N guests), shared with BookingForm so they never disagree. */}
          <span className={UNIT}>{priceUnit(perPerson, displayGuests)}</span>
        </span>
      </div>
      <a href="#booking" className={CTA} onClick={scrollToBookCard}>
        Book now
      </a>
    </div>
  );
}
