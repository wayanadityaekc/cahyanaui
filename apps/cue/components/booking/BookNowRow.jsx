'use client';

import Price from '@/components/Price';
import { scrollToBookCard } from './bookScroll';

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
// MEASURED: at 320px the amount at 1.6rem plus "per car" runs to x=189 while the
// button starts at x=173 - the unit printed straight over the CTA. One line only
// fits down there if the type gives a little, so the amount steps down under 360px
// and the button loses some side padding with it. Everything from 360px up is
// untouched. (A Tailwind v4 `max-[N]` is width < N, so 360 here really does mean
// "below 360", not "360 and under".)
const AMOUNT = 'price font-head text-[1.6rem] max-[360px]:text-[1.25rem] font-bold leading-[1.05] tracking-[-0.02em] text-gold';
// Inline, on the amount's baseline (Wayan, Sep 2026: "harga per car jangan di
// tumpuk") - stacked it read as two facts when it is one.
const UNIT = 'text-small text-muted';
const CTA =
  'flex-none flex items-center h-[2.9rem] px-[1.15rem] max-[360px]:px-3 rounded-pill bg-cta text-white font-body text-[1rem] font-semibold ' +
  'no-underline whitespace-nowrap border-none cursor-pointer ' +
  '[transition:background-color_var(--dur)_var(--ease),scale_var(--dur-fast)_var(--ease)] hover:bg-cta-d';
// This row NEVER hides itself, and that is deliberate - see the note in the
// component below.
const ROW =
  'booknowrow flex items-center justify-between gap-4 mt-[1.1rem] py-[0.85rem] px-4 rounded-md bg-white ' +
  '[border:1px_solid_var(--color-line)] min-[993px]:hidden';

// This row has NO hide logic, on purpose. It used to mirror the sticky bar's rule
// and stand down while the booking card was on screen - but the two can never be on
// screen together: measured, the gap from this row's bottom to the card's top is
// 1692-2610px on every page at every width where the row shows (390x844, 768x1024,
// 992x1400), so a viewport would have to be taller than the whole tab block for
// them to meet.
//
// So the rule guarded nothing and cost something real. This row sits in NORMAL
// FLOW, so hiding it by swapping the display utility removed it from the flow: the
// document got 97px shorter mid-scroll, everything below slid up by 97px, and the
// browser's scroll position was yanked with it (asked for 2425, landed at 2328).
// That is why the page lurched while you scrolled. The sticky bar can hide safely
// because it is `fixed` and translates out instead of collapsing.
//
// The BAR still watches this row - that is what keeps the two Book buttons from
// ever showing at once, and it is the right direction for the rule, because the bar
// is the one that can hide without moving anything.
export default function BookNowRow({ item, priceFallback, perPerson = false }) {
  if (!item) return null;

  return (
    <div className={ROW}>
      <span className="min-w-0">
        <span className={KICKER}>From</span>
        <span className="flex items-baseline gap-2 mt-[0.2rem] whitespace-nowrap">
          <Price name={item} fallback={priceFallback} className={AMOUNT} />
          <span className={UNIT}>{perPerson ? 'per person' : 'per car'}</span>
        </span>
      </span>
      <button type="button" className={CTA} onClick={scrollToBookCard} aria-label="Book now - go to the booking form">
        Book now
      </button>
    </div>
  );
}
