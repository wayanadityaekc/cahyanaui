'use client';

import { useEffect, useState } from 'react';
import { ShieldCheck } from 'lucide-react';
import Price from '@/components/Price';
import { BAR_SHELL, BAR_UPTO_LG } from '@/components/ui/stickyBar';
import { observeBookCtas, scrollToBookCard } from './bookScroll';

// Sticky price + CTA on mobile, rendered by the page that actually sells
// something (TourPage/AttractionPage pass their bookItem). Wayan, Sep 2026:
// - hidden whenever the booking form is on screen, so its "Book now" and the
//   card's own CTA are never both visible - same rule initBookBar had.
//
// It stays mounted while hidden (slides out instead of unmounting) so the
// reserved body padding doesn't flip; `stickybar` is the marker <body> reads for
// that - see components/ui/stickyBar.jsx. Chat lives in the navbar now, not in
// here.
//
// LAYOUT (Sep 2026, Wayan: "style book bar kayak GetYourGuide"): stacked price
// block on the left - kicker, amount + unit, reassurance badge - with the CTA
// filling the right. Two things from that reference are deliberately NOT copied:
//   - the struck-through "was" price. We have no list price to strike out, so
//     any number there would be an invented discount.
//   - "Likely to sell out". We do not track remaining seats, so it would be
//     fake scarcity. The badge says what is actually true and answers the same
//     hesitation: the booking can be cancelled for free.
// `bookbar` is a second marker: this bar is taller than SectionSwitcher, and
// <body> reserves a different height for each (see app/layout.jsx).

// Kept small and quiet so the amount stays the loudest thing in the bar.
const KICKER = 'text-[0.6rem] font-medium tracking-[0.12em] uppercase text-muted leading-none';
const UNIT = 'text-[0.68rem] font-normal text-muted leading-none';
const BADGE = 'inline-flex items-center gap-1 mt-[0.3rem] text-[0.62rem] font-medium leading-none text-cta';
// Harga di bar ini HITAM (`text-gold` = soft black), BUKAN amber - pengecualian
// yang disengaja dari aturan "semua harga amber": di sini amber nabrak tombol CTA
// hijau tepat di sebelahnya. Warnanya WAJIB dioper lewat className-nya <Price>
// sendiri - default-nya (PRICE, amber) nempel LANGSUNG di elemen [data-price],
// jadi text-gold di wrapper kalah. Class `price` tetep dibawa (hook, bukan warna).
const AMOUNT = 'price text-[1.2rem] font-semibold text-gold leading-none';
// Tinggi CTA = token 2.9rem/46px yang dipakai tombol aksi lain (lihat CLAUDE.md),
// BUKAN `self-stretch`: di-stretch dia jadi 81% tinggi kartu dan bentuknya lonjong
// banget. GYG sendiri tombolnya cuma ~54% tinggi kartu.
const CTA =
  'flex-none flex items-center h-[2.9rem] px-[1.4rem] rounded-pill bg-cta text-white font-semibold no-underline whitespace-nowrap hover:bg-cta-d';

export default function BookBar({ item, priceFallback, perPerson = false }) {
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    if (!item) return undefined;
    // The card holds the second Book button, so the whole card counts as "the
    // form is on screen", not just the button at its bottom - and since Sep 2026
    // the inline BookNowRow under the hero chips counts too (Wayan: "gaada
    // booking now button double"). The selector lives in bookScroll so the row
    // and the bar read the same list.
    const self = document.querySelector('.bookbar');
    return observeBookCtas(self, setHidden);
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
        {/* "From" is accurate, not a sales tic: this is the base Standard price,
            and guests, Exclusive mode and pickup can only push it up. */}
        <span className={KICKER}>From</span>
        <span className="flex items-baseline gap-1.5 mt-[0.28rem]">
          <Price name={item} fallback={priceFallback} className={AMOUNT} />
          {/* Tours are sold per car, experiences per person - same wording
              BookingForm uses, so the bar and the form never disagree. */}
          <span className={UNIT}>{perPerson ? 'per person' : 'per car'}</span>
        </span>
        <span className={BADGE}>
          <ShieldCheck className="w-[0.8rem] h-[0.8rem] shrink-0" strokeWidth={2} aria-hidden="true" />
          Free cancellation
        </span>
      </div>
      <a href="#booking" className={CTA} onClick={scrollToBookCard}>
        Book now
      </a>
    </div>
  );
}
