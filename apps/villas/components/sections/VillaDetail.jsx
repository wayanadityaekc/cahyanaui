'use client';

import { useRef, useState } from 'react';
import Link from 'next/link';
import VillaGallery from '@/components/sections/VillaGallery';
import AmenityIcon from '@/components/ui/AmenityIcon';
import CheckAvailabilityButton from '@/components/booking/CheckAvailabilityButton';
import { BookingPanel, Button, CAPS, Card, Container, DateRangeField, EYEBROW_LINE, LinkList, PROSE_COPY, PriceBlock, SECONDARY_BTN, STARS, Section, StickyBar, useRevealWhenAway, SourceMark } from '@cahyana/ui';
import { useCurrency } from '@/components/providers/CurrencyProvider';
import { useBooking } from '@/components/providers/BookingProvider';
import BookingTerms from '@/components/booking/BookingTerms';
import { CUE_TOURS } from '@/content/crossSell';
import { SERVICES } from '@/lib/bookingCart';
import { WHATSAPP_LINK, CUE_LINK } from '@/lib/constants';

export default function VillaDetail({ villa }) {
  const { format } = useCurrency();
  const { openBooking } = useBooking();
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');

  // Mobile book bar shows only when both the title and the booking card are off screen, so it never doubles a CTA.
  const titleRef = useRef(null);
  const cardRef = useRef(null);
  const showBookBar = useRevealWhenAway([titleRef, cardRef]);

  return (
    <>
      <section className="pt-6 sm:pt-10">
        <Container>
          <VillaGallery images={villa.gallery} />
        </Container>
      </section>

      <Section bare className="!pt-8">
        <Container className="grid lg:grid-cols-[1.7fr_1fr] gap-10 items-start">
          <div className={PROSE_COPY}>
            <p className={EYEBROW_LINE}>{villa.tagline}</p>
            <h1 ref={titleRef} className="text-display font-bold text-gold">{villa.name}</h1>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-2 text-small text-muted">
              <span>Up to {villa.guests} guests</span>
              <span>·</span>
              <span>{villa.bedrooms} bedrooms</span>
              <span>·</span>
              <span>Private pool</span>
              <span>·</span>
              <span className={`${STARS} font-semibold`}>★ {villa.rating}</span>
              <span>({villa.reviews} reviews)</span>
            </div>

            <div className="mt-6 flex items-center gap-3 flex-wrap">
              {villa.amenities.map((amenity) => (
                <span key={amenity} className="flex items-center gap-2 px-3.5 py-2 rounded-full border border-line text-small text-gold">
                  <span className="text-cta"><AmenityIcon name={amenity} /></span>
                  {amenity}
                </span>
              ))}
            </div>

            <h2 className="text-h2 font-medium mt-10 mb-3 text-gold">About the villa</h2>
            {villa.about.map((para, i) => <p key={i}>{para}</p>)}

            <h2 className="text-h2 font-medium mt-10 mb-3 text-gold">The space</h2>
            <ul className="grid sm:grid-cols-2 gap-x-8">
              {villa.spaceList.map((space) => (
                <li key={space.title} className="py-3 border-b border-line text-small">
                  <strong className="block text-gold">{space.title}</strong>
                  <span className="text-muted">{space.desc}</span>
                </li>
              ))}
            </ul>

            <h2 className="text-h2 font-medium mt-10 mb-3 text-gold">Getting around</h2>
            <ul className="border-t border-line">
              {villa.gettingAround.map((tip) => (
                <li key={tip.label} className="flex justify-between py-3 border-b border-line text-small">
                  <span className="text-muted">{tip.label}</span>
                  <span className="text-gold">{tip.value}</span>
                </li>
              ))}
            </ul>

            <h2 className="text-h2 font-medium mt-10 mb-3 text-gold">Guest ratings</h2>
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-px overflow-hidden border border-line bg-line">
              {villa.scores.map(([label, value]) => (
                <div key={label} className="bg-surface-raised text-center py-4 px-2">
                  <strong className="block text-h2 font-bold text-gold">{value}</strong>
                  <span className="text-label text-muted">{label}</span>
                </div>
              ))}
            </div>
            {villa.reviewQuote && (
              <Card as="blockquote" className="relative p-6 pb-[2.3rem] mt-6">
                <p className={`${STARS} text-small mb-2`}>★★★★★</p>
                <p className="text-gold">&ldquo;{villa.reviewQuote.text}&rdquo;</p>
                <cite className="block mt-3 pr-8 text-label text-muted not-italic">{villa.reviewQuote.source}</cite>
                <SourceMark platform={villa.reviewQuote.platform} />
              </Card>
            )}

            <h2 className="text-h2 font-medium mt-10 mb-3 text-gold">Good to know</h2>
            <ul className="border-t border-line">
              {villa.goodToKnow.map((note) => (
                <li key={note.label} className="flex flex-col sm:flex-row sm:gap-6 py-3 border-b border-line text-small">
                  <span className={`${CAPS} min-w-[120px] text-muted`}>{note.label}</span>
                  <span className="text-gold">{note.value}</span>
                </li>
              ))}
            </ul>
          </div>

          <BookingPanel
            panelRef={cardRef}
            price={<PriceBlock amount={format(villa.nightlyRateIdr)} unit="/ night" />}
            fields={(
              <DateRangeField
                id={`${villa.slug}-dates`}
                value={{ checkIn, checkOut }}
                onChange={(range) => { setCheckIn(range.checkIn); setCheckOut(range.checkOut); }}
              />
            )}
            cta={(
              <Button full onClick={() => openBooking({ villaSlug: villa.slug, checkIn, checkOut })}
              >
                Check availability
              </Button>
            )}
            secondary={(
              <>
                <a href={WHATSAPP_LINK} target="_blank" rel="noopener" className={SECONDARY_BTN}>WhatsApp</a>
                {/* TODO: add the Airbnb hand-off as a second SECONDARY_BTN once a listing URL exists (same gap as Footer.jsx). */}
              </>
            )}
            // Booking terms replace the old season-rate note: at checkout a guest needs to know the payment and cancel rules.
            note={<BookingTerms />}
          >
            <Card tone="cream" className="p-6">
              <p className={`${CAPS} text-muted mb-3`}>Add to your stay</p>
              <LinkList linkAs={Link} items={SERVICES} />
            </Card>

            {/* Tours sit in the booking flow on purpose (Wayan): the guest who just picked dates is deciding those days. */}
            <Card tone="cream" className="p-6">
              <p className={`${CAPS} text-muted mb-1`}>Add a driver or a tour</p>
              <p className="text-label text-muted mb-3">
                Run by Cahyana Ubud Experience - the same family, every price upfront.
              </p>
              <LinkList items={CUE_TOURS.map((tour) => ({ ...tour, external: true }))} />
              <a href={CUE_LINK} target="_blank" rel="noopener" className="inline-block mt-3 text-label text-gold underline">
                Explore more tours in Bali
              </a>
            </Card>
          </BookingPanel>
        </Container>
      </Section>

      <Section tone="dark" className="text-center">
        <h2 className="text-h2 font-medium text-white">{villa.name}, your dates</h2>
        <p className="mt-2 text-small text-white/75">See if the villa is free when you are.</p>
        <div className="flex justify-center mt-6">
          {/* onDark - this band IS the action colour now. */}
          <CheckAvailabilityButton villaSlug={villa.slug} variant="onDark" />
        </div>
</Section>

      {/* Mobile-only book bar, flush like CUE's; chat lives in the navbar, so the bar holds one action. */}
      <StickyBar variant="flush" show={showBookBar}>
        <PriceBlock tight amount={format(villa.nightlyRateIdr)} unit="/ night" size="sm" />
        <Button className="flex-shrink-0" onClick={() => openBooking({ villaSlug: villa.slug, checkIn, checkOut })}>
          Check availability
        </Button>
      </StickyBar>
    </>
  );
}
