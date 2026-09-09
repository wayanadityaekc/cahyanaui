'use client';

import { useEffect, useState } from 'react';
import HeroSearch from '@/components/search/HeroSearch';

export default function Hero() {
  const [sheetOpen, setSheetOpen] = useState(false);

  useEffect(() => {
    if (!sheetOpen) return;
    document.body.classList.add('hs-locked');
    const onKey = (e) => e.key === 'Escape' && setSheetOpen(false);
    document.addEventListener('keydown', onKey);
    return () => {
      document.body.classList.remove('hs-locked');
      document.removeEventListener('keydown', onKey);
    };
  }, [sheetOpen]);

  return (
    // "hero" kept as an inert marker class (no styling left on it) - required by
    // shared selectors elsewhere in style.css that key off its presence:
    // `.home > section:not(.hero)` (section-gap spacing) and `.hero::before { content:none }`
    // (divider-exclusion list). Actual visuals below are Tailwind utilities.
    <section
      className="hero relative flex items-center min-h-[88vh] pt-28 px-6 pb-12 bg-green
        min-[993px]:min-h-[92vh] min-[993px]:pt-36 min-[993px]:pb-20
        max-[992px]:bg-[#12100c] max-[992px]:min-h-[58vh] max-[992px]:pb-8
        after:content-[''] after:absolute after:inset-0 after:z-0 after:bg-cover after:[background-position:center_top]
        after:bg-[image:linear-gradient(100deg,rgba(0,0,0,0.62),rgba(0,0,0,0.3)_55%,rgba(0,0,0,0.12)),url(/assets/images/ubud-saraswati-temple-hero.webp)]
        max-[992px]:after:top-[53px]
        max-[992px]:after:bg-[image:linear-gradient(rgba(0,0,0,0.18),rgba(0,0,0,0.3)_45%,rgba(0,0,0,0.6)),url(/assets/images/ubud-saraswati-temple-hero-mobile.webp)]"
      id="hero"
    >
      {/* hero__inner/hero__content/hero__title kept fully as-is (untouched CSS classes,
          no new utilities added) - they are SHARED base rules used by many other
          non-homepage sections (subhero pages, legal pages, guide hub, etc). Out of
          scope for #325 (Hero/HeroSearch only); left for the shared-primitive cleanup
          in A11/B-FINAL once every other usage is also converted. */}
      <div className="hero__inner">
        <div className="hero__content max-[992px]:text-center">
          <h1 className="hero__title">Your Private Bali Trip Planner with a Driver</h1>
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

        {/* "hero-sheet-ov" kept as an inert marker; styling below is Tailwind-only. */}
        <div
          className={`hero-sheet-ov${sheetOpen ? ' is-open' : ''} max-[992px]:fixed max-[992px]:inset-0 max-[992px]:z-[44]
            max-[992px]:bg-[rgba(26,26,26,0.42)] max-[992px]:[transition:opacity_var(--dur)_var(--ease),visibility_var(--dur)]
            ${sheetOpen ? 'max-[992px]:opacity-100 max-[992px]:visible' : 'max-[992px]:opacity-0 max-[992px]:invisible'}`}
          onClick={() => setSheetOpen(false)}
        />
      </div>
    </section>
  );
}
