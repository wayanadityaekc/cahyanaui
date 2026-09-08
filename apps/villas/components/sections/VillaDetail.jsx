'use client';

import { useState } from 'react';
import Link from 'next/link';
import VillaGallery from '@/components/sections/VillaGallery';
import AmenityIcon from '@/components/ui/AmenityIcon';
import CheckAvailabilityButton from '@/components/booking/CheckAvailabilityButton';
import { useCurrency } from '@/components/providers/CurrencyProvider';
import { useBooking } from '@/components/providers/BookingProvider';
import { WHATSAPP_LINK, CUE_LINK } from '@/lib/constants';

export default function VillaDetail({ villa }) {
  const { format } = useCurrency();
  const { openBooking } = useBooking();
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');

  return (
    <>
      <section className="pt-6 sm:pt-10">
        <div className="wrap">
          <VillaGallery images={villa.gallery} />
        </div>
      </section>

      <section className="section pt-8">
        <div className="wrap grid lg:grid-cols-[1.7fr_1fr] gap-10 items-start">
          <div className="prose-copy">
            <p className="eyebrow">{villa.tagline}</p>
            <h1 className="text-display font-bold text-gold">{villa.name}</h1>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-2 text-small text-muted">
              <span>Up to {villa.guests} guests</span>
              <span>·</span>
              <span>{villa.bedrooms} bedrooms</span>
              <span>·</span>
              <span>Private pool</span>
              <span>·</span>
              <span className="stars-amber font-semibold">★ {villa.rating}</span>
              <span>({villa.reviews} reviews)</span>
            </div>

            <div className="mt-6 flex items-center gap-3 flex-wrap">
              {villa.amenities.map((a) => (
                <span key={a} className="flex items-center gap-2 px-3.5 py-2 rounded-full border border-line text-small text-gold">
                  <span className="text-cta"><AmenityIcon name={a} size={17} /></span>
                  {a}
                </span>
              ))}
            </div>

            <h2 className="text-h2 font-semibold mt-10 mb-3 text-gold">About the villa</h2>
            {villa.about.map((p, i) => <p key={i}>{p}</p>)}

            <h2 className="text-h2 font-semibold mt-10 mb-3 text-gold">The space</h2>
            <ul className="grid sm:grid-cols-2 gap-x-8">
              {villa.spaceList.map((s) => (
                <li key={s.title} className="py-3 border-b border-line text-small">
                  <strong className="block text-gold">{s.title}</strong>
                  <span className="text-muted">{s.desc}</span>
                </li>
              ))}
            </ul>

            <h2 className="text-h2 font-semibold mt-10 mb-3 text-gold">Getting around</h2>
            <ul className="border-t border-line">
              {villa.gettingAround.map((g) => (
                <li key={g.label} className="flex justify-between py-3 border-b border-line text-small">
                  <span className="text-muted">{g.label}</span>
                  <span className="text-gold">{g.value}</span>
                </li>
              ))}
            </ul>

            <h2 className="text-h2 font-semibold mt-10 mb-3 text-gold">Guest ratings</h2>
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-px rounded-lg overflow-hidden border border-line bg-line">
              {villa.scores.map(([label, value]) => (
                <div key={label} className="bg-white text-center py-4 px-2">
                  <strong className="block text-h2 font-bold text-gold">{value}</strong>
                  <span className="text-label text-muted">{label}</span>
                </div>
              ))}
            </div>
            {villa.reviewQuote && (
              <blockquote className="card p-6 mt-6">
                <p className="stars-amber text-small mb-2">★★★★★</p>
                <p className="text-gold">&ldquo;{villa.reviewQuote.text}&rdquo;</p>
                <cite className="block mt-3 text-label text-muted not-italic">{villa.reviewQuote.source}</cite>
              </blockquote>
            )}

            <h2 className="text-h2 font-semibold mt-10 mb-3 text-gold">Good to know</h2>
            <ul className="border-t border-line">
              {villa.goodToKnow.map((g) => (
                <li key={g.label} className="flex flex-col sm:flex-row sm:gap-6 py-3 border-b border-line text-small">
                  <span className="min-w-[120px] text-label uppercase tracking-wide text-muted">{g.label}</span>
                  <span className="text-gold">{g.value}</span>
                </li>
              ))}
            </ul>
          </div>

          <aside className="lg:sticky lg:top-24 flex flex-col gap-5">
            <div className="card p-6">
              <div className="flex items-end justify-between">
                <p>
                  <span className="text-label text-muted block">From</span>
                  <span className="text-h2 font-bold text-amber">{format(villa.nightlyRate)}</span>
                  <span className="text-label text-muted"> / night</span>
                </p>
              </div>

              <div className="grid grid-cols-2 gap-2 mt-5">
                <div className="field-shell">
                  <div className="w-full">
                    <label htmlFor={`${villa.slug}-checkin`}>Check-in</label>
                    <input id={`${villa.slug}-checkin`} type="date" value={checkIn} onChange={(e) => setCheckIn(e.target.value)} />
                  </div>
                </div>
                <div className="field-shell">
                  <div className="w-full">
                    <label htmlFor={`${villa.slug}-checkout`}>Check-out</label>
                    <input id={`${villa.slug}-checkout`} type="date" value={checkOut} min={checkIn || undefined} onChange={(e) => setCheckOut(e.target.value)} />
                  </div>
                </div>
              </div>

              <button
                type="button"
                className="btn btn-cta btn-full mt-4"
                onClick={() => openBooking({ villaSlug: villa.slug, checkIn, checkOut })}
              >
                Check availability
              </button>
              <a href={WHATSAPP_LINK} target="_blank" rel="noopener" className="btn btn-outline btn-full mt-2">Ask about dates</a>
              <p className="text-label text-muted text-center mt-3">Rates change by season — message us for a season-specific quote.</p>
            </div>

            <div className="card p-6 bg-cream">
              <p className="text-label font-semibold uppercase tracking-wide text-muted mb-3">Add to your stay</p>
              <ul className="flex flex-col">
                {[
                  { href: '/services/breakfast', label: 'Breakfast' },
                  { href: '/services/spa', label: 'Spa & Massage' },
                  { href: '/services/live-dinner', label: 'Live Dinner' },
                  { href: '/services/scooter-rental', label: 'Scooter Rental' },
                ].map((s) => (
                  <li key={s.href} className="border-b border-line last:border-b-0">
                    <Link href={s.href} className="flex items-center justify-between py-2.5 text-small text-gold">
                      {s.label}
                      <span>›</span>
                    </Link>
                  </li>
                ))}
                <li>
                  <a href={CUE_LINK} target="_blank" rel="noopener" className="flex items-center justify-between py-2.5 text-small text-gold">
                    Driver &amp; tours
                    <span>›</span>
                  </a>
                </li>
              </ul>
            </div>
          </aside>
        </div>
      </section>

      <section className="section text-center bg-gold">
        <div className="wrap">
          <h2 className="text-h2 font-semibold text-white">{villa.name}, your dates</h2>
          <p className="mt-2 text-small text-white/75">See if the villa is free when you are.</p>
          <div className="flex justify-center mt-6">
            <CheckAvailabilityButton villaSlug={villa.slug} className="btn btn-cta" />
          </div>
        </div>
      </section>
    </>
  );
}
