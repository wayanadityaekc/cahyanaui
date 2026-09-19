'use client';

import { useEffect, useState } from 'react';
import Price from '@/components/Price';
import { BOOK_ON_SCREEN, observeBookCtas, scrollToBookCard } from './bookScroll';

// Inline price + Book now, directly under the hero chips (Wayan, Sep 2026, picking
// idea 2 from a sheet: "ganti button jadi book now dan langsung nge scroll ke
// booking form di bawah").
//
// WHY IT EXISTS: on a phone the booking card sits below the whole tab block - the
// measured gap was 2557px, roughly three screens - so the only way to book was the
// sticky bar, which has no date field until you tap it. This puts the price and a
// way in at the top, and the card it scrolls to is the same one, not a copy: there
// is still exactly one booking form on the page.
//
// HP/TABLET ONLY (`min-[993px]:hidden`). From 993px the booking card is already a
// sticky column beside the content, level with the first line of it, so a row here
// would be a second Book button on the same screen for no gain. The gap this closes
// is 769-992px too, where the card stacks below AND the sticky bar does not exist.
//
// NO "Free cancellation" badge, unlike the sticky bar: the chip row immediately
// above already makes that promise, and repeating it 20px later is noise. The
// "From" kicker DOES stay - it is the base Standard price, and guests, Exclusive
// mode and a pickup surcharge can only push it up, so the number needs the word.
const KICKER = 'text-[0.6rem] font-medium tracking-[0.12em] uppercase text-muted leading-none';
// Same exception as the sticky bar: the amount is soft black, not amber, because
// amber fights the green CTA sitting right next to it. It has to ride on <Price>'s
// own className - the amber default is attached to the [data-price] element itself,
// so text-gold on a wrapper loses.
const AMOUNT = 'price font-head text-[1.6rem] font-bold leading-[1.05] tracking-[-0.02em] text-gold';
const UNIT = 'block mt-[0.15rem] text-small text-muted';
const CTA =
  'flex-none flex items-center h-[2.9rem] px-[1.15rem] rounded-pill bg-cta text-white font-body text-[1rem] font-semibold ' +
  'no-underline whitespace-nowrap border-none cursor-pointer ' +
  '[transition:background-color_var(--dur)_var(--ease),scale_var(--dur-fast)_var(--ease)] hover:bg-cta-d';
// No `flex` here on purpose - it is added below only while the row is showing.
// Hiding via the `hidden` ATTRIBUTE would not work: Preflight is off, so the UA
// sheet's [hidden]{display:none} loses to a display utility on the same element.
const ROW =
  'booknowrow items-center justify-between gap-4 mt-[1.1rem] py-[0.85rem] px-4 rounded-md bg-white ' +
  '[border:1px_solid_var(--color-line)] min-[993px]:hidden';

export default function BookNowRow({ item, priceFallback, perPerson = false }) {
  const [hidden, setHidden] = useState(false);

  // Mirror of the sticky bar's rule, pointed the other way: this row stands down
  // while the card (or any other Book button) is on screen. Without it, scrolling
  // from the row to the card would briefly show both.
  useEffect(() => {
    if (!item) return undefined;
    const self = document.querySelector('.booknowrow');
    return observeBookCtas(self, setHidden);
  }, [item]);

  if (!item) return null;

  return (
    <div className={`${ROW} ${hidden ? 'hidden' : 'flex'}`}>
      <span className="min-w-0">
        <span className={KICKER}>From</span>
        <Price name={item} fallback={priceFallback} className={`block mt-[0.2rem] ${AMOUNT}`} />
        <span className={UNIT}>{perPerson ? 'per person' : 'per car'}</span>
      </span>
      <button type="button" className={CTA} onClick={scrollToBookCard} aria-label="Book now - go to the booking form">
        Book now
      </button>
    </div>
  );
}
