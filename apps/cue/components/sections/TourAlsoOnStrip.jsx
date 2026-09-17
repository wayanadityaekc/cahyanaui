'use client';

import { useState } from 'react';
import { X } from 'lucide-react';
import Price from '@/components/Price';

// One-line strip under the navbar on an attraction page: this place is also a
// stop on a full day, here is what that day costs, one tap to go there.
//
// Rendered at build time with its content already in the HTML - no referrer
// sniffing, no ?from= parameter, so it reads the same for a guest arriving from
// Google, from the Destinations listing or from a tour page, and Google sees
// what the guest sees.
//
// `fixed`, not sticky: a sticky strip occupies flow, so dismissing it would
// shift the hero up under the reader. Fixed means dismissing changes nothing
// below it. The dismissal is component state only - deliberately not persisted,
// so a reload never has to repaint it away.
export default function TourAlsoOnStrip({ tours }) {
  const [open, setOpen] = useState(true);
  if (!tours || !tours.length || !open) return null;
  const t = tours[0];
  const more = tours.length - 1;
  return (
    <div className="fixed left-0 right-0 top-[var(--header-h,52.8px)] z-40 min-[769px]:top-[var(--header-h,57.6px)]">
      <div className="flex items-center gap-3 mx-auto max-w-[1200px] py-[0.5rem] px-[var(--space-3)] bg-cream [border-bottom:1px_solid_var(--line)]">
        <a
          href={t.href}
          className="flex-1 min-w-0 no-underline text-small text-green hover:underline"
        >
          Also on <b className="font-semibold text-gold">{t.name}</b> - {t.stops} stops, from{' '}
          <span className="font-semibold text-amber">
            <Price name={t.priceName} fallback={t.priceFallback || ''} />
          </span>
          {more > 0 && <span className="text-muted"> +{more} more</span>}
        </a>
        <button
          type="button"
          aria-label="Dismiss"
          onClick={() => setOpen(false)}
          className="flex-none inline-flex items-center justify-center w-6 h-6 border-none rounded-[50%] bg-transparent text-muted cursor-pointer transition-[background-color,color,scale] duration-[var(--dur-fast)] ease-[ease] hover:bg-[rgba(34,32,28,0.08)] hover:text-gold [&>svg]:w-4 [&>svg]:h-4"
        >
          <X strokeWidth={1.8} aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}
