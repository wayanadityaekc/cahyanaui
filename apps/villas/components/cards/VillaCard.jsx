'use client';

import Link from 'next/link';
import { useCurrency } from '@/components/providers/CurrencyProvider';

function MetaIcon({ type }) {
  const common = { width: 15, height: 15, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 1.8, strokeLinecap: 'round', strokeLinejoin: 'round' };
  if (type === 'guests') return <svg {...common}><circle cx="12" cy="8" r="3.2" /><path d="M5 20c0-3.9 3.1-7 7-7s7 3.1 7 7" /></svg>;
  if (type === 'bedrooms') return <svg {...common}><path d="M3 18v-6a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v6M3 18v2M21 18v2M3 12V8a2 2 0 0 1 2-2h3v4" /></svg>;
  return <svg {...common}><path d="M4 16c1.5-1 2.5-1 4 0s2.5 1 4 0 2.5-1 4 0 2.5 1 4 0M4 12c1.5-1 2.5-1 4 0s2.5 1 4 0 2.5-1 4 0 2.5 1 4 0" /><path d="M6 12V8a2 2 0 0 1 2-2h1v2" /></svg>;
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
        <h3 className="text-h3 font-semibold" style={{ color: 'var(--color-gold)' }}>{villa.name}</h3>
        <div className="flex items-center gap-4 text-small text-muted">
          <span className="flex items-center gap-1.5"><MetaIcon type="guests" />Up to {villa.guests} guests</span>
          <span className="flex items-center gap-1.5"><MetaIcon type="bedrooms" />{villa.bedrooms} bedrooms</span>
          <span className="flex items-center gap-1.5"><MetaIcon type="pool" />Private pool</span>
        </div>
        <p className="text-small text-muted">{villa.shortDesc}</p>
        <div className="mt-auto pt-3 flex items-end justify-between border-t border-line">
          <p>
            <span className="text-label text-muted block">From</span>
            <span className="text-h2 font-bold" style={{ color: 'var(--color-amber)' }}>{format(villa.nightlyRate)}</span>
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
