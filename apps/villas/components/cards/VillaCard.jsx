'use client';

import Link from 'next/link';
import { ArrowRight, BedDouble, Users, Waves } from 'lucide-react';
import { VillaCard as VillaCardBlock } from '@cahyana/ui';
import { useCurrency } from '@/components/providers/CurrencyProvider';

// The block lives in @cahyana/ui (blocks/VillaCard.jsx). This file supplies the
// two things the library must not hold: the formatted price (which comes from
// this app's currency provider) and the fact row (which is editorial).
//
// Lucide, per CUE's rule that new icons come from the set and are never drawn by
// hand again - hand-drawn is reserved for marks Lucide does not carry, like
// payment logos and the Airbnb Bélo. Size is always explicit: Lucide renders
// width/height=24, so an icon given no size class balloons to 24px.
const META_ICON = 'w-[var(--icon-sm)] h-[var(--icon-sm)] shrink-0';

export default function VillaCard({ villa }) {
  const { format } = useCurrency();

  return (
    <VillaCardBlock
      villa={villa}
      linkAs={Link}
      price={format(villa.nightlyRate)}
      ctaIcon={<ArrowRight className={META_ICON} strokeWidth={1.6} aria-hidden="true" />}
      meta={(
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 text-small text-muted [&>span]:whitespace-nowrap">
          <span className="flex items-center gap-1.5">
            <Users className={META_ICON} strokeWidth={1.8} aria-hidden="true" />Up to {villa.guests} guests
          </span>
          <span className="flex items-center gap-1.5">
            <BedDouble className={META_ICON} strokeWidth={1.8} aria-hidden="true" />{villa.bedrooms} bedrooms
          </span>
          <span className="flex items-center gap-1.5">
            <Waves className={META_ICON} strokeWidth={1.8} aria-hidden="true" />Private pool
          </span>
        </div>
      )}
    />
  );
}
