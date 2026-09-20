'use client';

import { useState } from 'react';
import { ChevronLeft, ChevronRight, Heart, Share2 } from 'lucide-react';

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
          <Heart className="w-[var(--icon-sm)] h-[var(--icon-sm)]" strokeWidth={1.8} aria-hidden="true" />
        </button>
        <button type="button" aria-label="Share" className="w-9 h-9 rounded-full bg-black/35 text-white flex items-center justify-center backdrop-blur cursor-pointer">
          <Share2 className="w-[var(--icon-sm)] h-[var(--icon-sm)]" strokeWidth={1.8} aria-hidden="true" />
        </button>
      </div>

      {total > 1 && (
        <>
          <button type="button" aria-label="Previous photo" onClick={() => go(-1)} className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/85 flex items-center justify-center cursor-pointer">
            <ChevronLeft className="w-[var(--icon-sm)] h-[var(--icon-sm)] text-gold" strokeWidth={1.8} aria-hidden="true" />
          </button>
          <button type="button" aria-label="Next photo" onClick={() => go(1)} className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/85 flex items-center justify-center cursor-pointer">
            <ChevronRight className="w-[var(--icon-sm)] h-[var(--icon-sm)] text-gold" strokeWidth={1.8} aria-hidden="true" />
          </button>
          <span className="absolute bottom-3 right-3 px-2.5 py-1 rounded-full bg-black/45 text-white text-label backdrop-blur">
            {index + 1}/{total}
          </span>
        </>
      )}
    </div>
  );
}
