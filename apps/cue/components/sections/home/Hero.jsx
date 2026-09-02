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
    <section className="hero" id="hero">
      <div className="hero__inner">
        <div className="hero__content">
          <h1 className="hero__title">Your Private Bali Trip Planner with a Driver</h1>
          <p className="hero__subtitle">
            Tours, transfers, experiences &amp; villas - build your trip day by day, with real prices before you book.
          </p>
          <button type="button" className="hero__planbtn" onClick={() => setSheetOpen(true)}>
            Plan your trip
          </button>
        </div>

        <div id="search-placeholder">
          <HeroSearch sheetOpen={sheetOpen} onClose={() => setSheetOpen(false)} />
        </div>

        <div
          className={`hero-sheet-ov${sheetOpen ? ' is-open' : ''}`}
          onClick={() => setSheetOpen(false)}
        />
      </div>
    </section>
  );
}
