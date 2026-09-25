'use client';

import { useState } from 'react';
import { ChevronLeft, ChevronRight, Heart, Share2 } from 'lucide-react';
import { PhotoGrid } from '@cahyana/ui';

// The villa's photographs. The lead image is still a flip-through, because on a
// villa page the first thing a guest wants is one big photo - but TAPPING it now
// opens the full-screen grid (PhotoGrid in @cahyana/ui) instead of doing nothing.
//
// Wayan: "clicking a photo should open a full-screen, no-chrome, scrollable grid
// gallery - not the current small flip-through". The flip-through stays as the
// lead; the grid is what it leads to.
//
// Heart and share are decorative - there is no wishlist and no share backend -
// so they are kept out of the grid entirely rather than repeated over the
// photographs where the whole point is no chrome. They also stopPropagation, or
// tapping them would open the grid behind them.
export default function VillaGallery({ images }) {
  const [index, setIndex] = useState(0);
  const [gridOpen, setGridOpen] = useState(false);
  const total = images.length;

  const go = (delta, e) => {
    e.stopPropagation();
    setIndex((i) => (i + delta + total) % total);
  };

  return (
    <>
      <div className="relative aspect-[4/3] sm:aspect-[16/9] overflow-hidden rounded-xl bg-cream">
        <button
          type="button"
          onClick={() => setGridOpen(true)}
          aria-label={`View all ${total} photos`}
          className="absolute inset-0 w-full h-full p-0 border-0 bg-transparent cursor-pointer"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={images[index].src} alt={images[index].alt} className="w-full h-full object-cover" />
        </button>

        <div className="absolute top-3 right-3 flex gap-2">
          <button type="button" aria-label="Save" onClick={(e) => e.stopPropagation()} className="w-9 h-9 rounded-full bg-black/35 text-white flex items-center justify-center backdrop-blur cursor-pointer">
            <Heart className="w-[var(--icon-sm)] h-[var(--icon-sm)]" strokeWidth={1.8} aria-hidden="true" />
          </button>
          <button type="button" aria-label="Share" onClick={(e) => e.stopPropagation()} className="w-9 h-9 rounded-full bg-black/35 text-white flex items-center justify-center backdrop-blur cursor-pointer">
            <Share2 className="w-[var(--icon-sm)] h-[var(--icon-sm)]" strokeWidth={1.8} aria-hidden="true" />
          </button>
        </div>

        {total > 1 && (
          <>
            <button type="button" aria-label="Previous photo" onClick={(e) => go(-1, e)} className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/85 flex items-center justify-center cursor-pointer">
              <ChevronLeft className="w-[var(--icon-sm)] h-[var(--icon-sm)] text-gold" strokeWidth={1.8} aria-hidden="true" />
            </button>
            <button type="button" aria-label="Next photo" onClick={(e) => go(1, e)} className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/85 flex items-center justify-center cursor-pointer">
              <ChevronRight className="w-[var(--icon-sm)] h-[var(--icon-sm)] text-gold" strokeWidth={1.8} aria-hidden="true" />
            </button>
            {/* The counter doubles as the way in for anyone who does not think
                to tap the photo itself. */}
            <button
              type="button"
              onClick={() => setGridOpen(true)}
              className="absolute bottom-3 right-3 px-2.5 py-1 rounded-full bg-black/45 text-white text-label backdrop-blur cursor-pointer hover:bg-black/65"
            >
              Show all {total} photos
            </button>
          </>
        )}
      </div>

      <PhotoGrid images={images} open={gridOpen} onClose={() => setGridOpen(false)} startAt={index} label="Villa photos" />
    </>
  );
}
