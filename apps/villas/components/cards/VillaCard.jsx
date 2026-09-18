'use client';

import Link from 'next/link';
import { BedDouble, Users, Waves } from 'lucide-react';
import { useCurrency } from '@/components/providers/CurrencyProvider';

// Lucide, per CUE's rule that new icons come from the set and are never drawn
// by hand again (hand-drawn is reserved for marks Lucide does not carry, like
// payment logos). Size is always explicit — Lucide renders width/height=24, so
// an icon given no size class balloons to 24px.
function MetaIcon({ type }) {
  const cls = 'w-[var(--icon-sm)] h-[var(--icon-sm)] shrink-0';
  if (type === 'guests') return <Users className={cls} strokeWidth={1.8} aria-hidden="true" />;
  if (type === 'bedrooms') return <BedDouble className={cls} strokeWidth={1.8} aria-hidden="true" />;
  return <Waves className={cls} strokeWidth={1.8} aria-hidden="true" />;
}

export default function VillaCard({ villa }) {
  const { format } = useCurrency();

  return (
    <Link href={`/villas/${villa.slug}`} className="card card-hover flex flex-col overflow-hidden group">
      <div className="relative aspect-[4/3] overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={villa.cardImg}
          alt={`${villa.name} private pool and garden`}
          width={700}
          height={525}
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        {villa.badge && (
          <span className="badge badge-cta absolute top-3 left-3">{villa.badge}</span>
        )}
        <span className="badge absolute top-3 right-3">{villa.name}</span>
      </div>
      <div className="p-5 flex flex-col gap-3 flex-1">
        <h3 className="text-h3 font-semibold text-gold">{villa.name}</h3>
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 text-small text-muted [&>span]:whitespace-nowrap">
          <span className="flex items-center gap-1.5"><MetaIcon type="guests" />Up to {villa.guests} guests</span>
          <span className="flex items-center gap-1.5"><MetaIcon type="bedrooms" />{villa.bedrooms} bedrooms</span>
          <span className="flex items-center gap-1.5"><MetaIcon type="pool" />Private pool</span>
        </div>
        <p className="text-small text-muted">{villa.shortDesc}</p>
        <div className="mt-auto pt-3 flex items-end justify-between border-t border-line">
          <p>
            <span className="text-label text-muted block">From</span>
            <span className="text-h2 font-bold text-amber">{format(villa.nightlyRate)}</span>
            <span className="text-label text-muted"> / night</span>
          </p>
          <span className="btn btn-cta btn-sm">
            View details
            <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><path d="M3 6.5h7M7 3l3.5 3.5L7 10" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </span>
        </div>
      </div>
    </Link>
  );
}
