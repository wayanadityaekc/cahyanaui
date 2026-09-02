'use client';

import { useState } from 'react';

export default function Hero() {
  const [sheetOpen, setSheetOpen] = useState(false);

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
        <div id="search-placeholder" />
        {sheetOpen && <div className="hero-sheet-ov" onClick={() => setSheetOpen(false)} />}
      </div>
    </section>
  );
}
