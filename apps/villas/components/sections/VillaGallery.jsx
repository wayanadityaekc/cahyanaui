'use client';

import { useState } from 'react';

// Photo gallery with a slide counter ("1/6") and heart/share icon overlay,
// per the mobile mockup's villa detail screen. Heart/share are decorative
// (no wishlist/share backend exists) but keep the same visual affordance.
export default function VillaGallery({ images }) {
  const [index, setIndex] = useState(0);
  const total = images.length;

  const go = (delta) => setIndex((i) => (i + delta + total) % total);

  return (
    <div className="relative aspect-[4/3] sm:aspect-[16/9] overflow-hidden rounded-xl bg-cream">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={images[index].src}
        alt={images[index].alt}
        className="w-full h-full object-cover"
      />
      <div className="absolute top-3 right-3 flex gap-2">
        <button type="button" aria-label="Save" className="w-9 h-9 rounded-full bg-black/35 text-white flex items-center justify-center backdrop-blur cursor-pointer">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20.8 8.6c0 4.4-4.9 8-8.8 11.6-3.9-3.6-8.8-7.2-8.8-11.6a5.2 5.2 0 0 1 8.8-3.8 5.2 5.2 0 0 1 8.8 3.8Z" />
          </svg>
        </button>
        <button type="button" aria-label="Share" className="w-9 h-9 rounded-full bg-black/35 text-white flex items-center justify-center backdrop-blur cursor-pointer">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="18" cy="5" r="2.4" /><circle cx="6" cy="12" r="2.4" /><circle cx="18" cy="19" r="2.4" />
            <path d="m8.1 10.7 7.8-4.4M8.1 13.3l7.8 4.4" />
          </svg>
        </button>
      </div>

      {total > 1 && (
        <>
          <button type="button" aria-label="Previous photo" onClick={() => go(-1)} className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/85 flex items-center justify-center cursor-pointer">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M9 2.5 3.5 7 9 11.5" stroke="var(--color-gold)" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </button>
          <button type="button" aria-label="Next photo" onClick={() => go(1)} className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/85 flex items-center justify-center cursor-pointer">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="m5 2.5 5.5 4.5L5 11.5" stroke="var(--color-gold)" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </button>
          <span className="absolute bottom-3 right-3 px-2.5 py-1 rounded-full bg-black/45 text-white text-label backdrop-blur">
            {index + 1}/{total}
          </span>
        </>
      )}
    </div>
  );
}
