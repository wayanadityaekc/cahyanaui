'use client';

import { useEffect, useState } from 'react';
import clsx from 'clsx';
import HeroSearch from '@/components/search/HeroSearch';
import useBodyLock from '@/components/ui/useBodyLock';

export default function Hero() {
  const [sheetOpen, setSheetOpen] = useState(false);

  useEffect(() => {
    if (!sheetOpen) return;
    const onKey = (e) => e.key === 'Escape' && setSheetOpen(false);
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [sheetOpen]);

  useBodyLock(sheetOpen);

  return (
    // Homepage hero. No marker class needed anymore: the section-gap engine keys off
    // :first-of-type (this is the first <section> child) and the old divider is gone.
    <section
      className="relative flex items-center min-h-[88vh] pt-28 px-6 pb-12 bg-green
        min-[993px]:min-h-[92vh] min-[993px]:pt-36 min-[993px]:pb-20
        max-[992px]:bg-[#12100c] max-[992px]:min-h-[58vh] max-[992px]:pb-8
        after:content-[''] after:absolute after:inset-0 after:z-0 after:bg-cover after:[background-position:center_top]
        after:bg-[image:linear-gradient(100deg,rgba(0,0,0,0.62),rgba(0,0,0,0.3)_55%,rgba(0,0,0,0.12)),url(/assets/images/ubud-saraswati-temple-hero.webp)]
        max-[992px]:after:top-[53px]
        max-[992px]:after:bg-[image:linear-gradient(rgba(0,0,0,0.18),rgba(0,0,0,0.3)_45%,rgba(0,0,0,0.6)),url(/assets/images/ubud-saraswati-temple-hero-mobile.webp)]"
      id="hero"
    >
      {/* Homepage-only hero inner (no .hero__inner marker; the mobile sheet-open z-bump
          is conditioned on the sheetOpen state). */}
      <div className={clsx(
        'relative z-[1] w-full max-w-[1200px] mx-auto flex items-center gap-8 min-[993px]:gap-12 max-[992px]:flex-col max-[992px]:items-stretch',
        sheetOpen && 'max-[992px]:z-[46]',
      )}>
        <div className="flex-1 min-w-0 text-white max-[992px]:text-center">
          <h1 className="font-head text-[length:var(--fs-display)] leading-[var(--lh-heading)] text-white font-bold tracking-[-0.01em] animate-[heroTextIn_0.6s_var(--ease)_backwards] [animation-delay:0.08s] motion-reduce:animate-none">Your Private Bali Trip Planner with a Driver</h1>
          <p className="mt-4 text-cream max-w-[52ch] animate-[heroTextIn_0.6s_var(--ease)_backwards] [animation-delay:0.18s] motion-reduce:animate-none">
            Tours, transfers, experiences &amp; villas - build your trip day by day, with real prices before you book.
          </p>
          <button
            type="button"
            className="hidden max-[992px]:inline-flex max-[992px]:items-center max-[992px]:justify-center max-[992px]:mt-6
              max-[992px]:w-auto max-[992px]:h-[2.9rem] max-[992px]:px-[1.9rem] max-[992px]:border-none max-[992px]:rounded-pill
              max-[992px]:bg-cta max-[992px]:text-white max-[992px]:font-body max-[992px]:font-semibold max-[992px]:text-[1rem] max-[992px]:cursor-pointer
              max-[992px]:shadow-lg max-[992px]:[transition:background_var(--dur)_var(--ease),transform_var(--dur-fast)_var(--ease)]
              max-[992px]:active:scale-[0.99] max-[992px]:hover:bg-cta-d"
            onClick={() => setSheetOpen(true)}
          >
            Plan your trip
          </button>
        </div>

        <div id="search-placeholder" className="min-h-[470px] max-[992px]:min-h-0">
          <HeroSearch sheetOpen={sheetOpen} onClose={() => setSheetOpen(false)} />
        </div>

        {/* Mobile scrim behind the plan-your-trip sheet; visibility driven by sheetOpen. */}
        <div
          className={`max-[992px]:fixed max-[992px]:inset-0 max-[992px]:z-[44]
            max-[992px]:bg-[rgba(26,26,26,0.42)] max-[992px]:[transition:opacity_var(--dur)_var(--ease),visibility_var(--dur)]
            ${sheetOpen ? 'max-[992px]:opacity-100 max-[992px]:visible' : 'max-[992px]:opacity-0 max-[992px]:invisible'}`}
          onClick={() => setSheetOpen(false)}
        />
      </div>
    </section>
  );
}
