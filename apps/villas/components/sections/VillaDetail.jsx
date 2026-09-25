'use client';

import { useRef, useState } from 'react';
import { MessageCircle } from 'lucide-react';
import Link from 'next/link';
import VillaGallery from '@/components/sections/VillaGallery';
import AmenityIcon from '@/components/ui/AmenityIcon';
import CheckAvailabilityButton from '@/components/booking/CheckAvailabilityButton';
import { BookingPanel, Button, CAPS, Card, Container, DateRangeField, EYEBROW_LINE, LinkList, PROSE_COPY, PriceBlock, SECONDARY_BTN, STARS, Section, StickyBar, useRevealWhenAway } from '@cahyana/ui';
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

  // The mobile book bar shows only once BOTH the page title and the booking
  // card have scrolled out of view - the "no CTA on screen" rule, which is why
  // it never doubles up with a button the guest can already see. The hook is
  // useRevealWhenAway in @cahyana/ui; CUE runs the same rule on its book bar.
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
              {villa.amenities.map((a) => (
                <span key={a} className="flex items-center gap-2 px-3.5 py-2 rounded-full border border-line text-small text-gold">
                  <span className="text-cta"><AmenityIcon name={a} /></span>
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
              <Card as="blockquote" className="p-6 mt-6">
                <p className={`${STARS} text-small mb-2`}>★★★★★</p>
                <p className="text-gold">&ldquo;{villa.reviewQuote.text}&rdquo;</p>
                <cite className="block mt-3 text-label text-muted not-italic">{villa.reviewQuote.source}</cite>
              </Card>
            )}

            <h2 className="text-h2 font-semibold mt-10 mb-3 text-gold">Good to know</h2>
            <ul className="border-t border-line">
              {villa.goodToKnow.map((g) => (
                <li key={g.label} className="flex flex-col sm:flex-row sm:gap-6 py-3 border-b border-line text-small">
                  <span className={`${CAPS} min-w-[120px] text-muted`}>{g.label}</span>
                  <span className="text-gold">{g.value}</span>
                </li>
              ))}
            </ul>
          </div>

          <BookingPanel
            panelRef={cardRef}
            price={<PriceBlock amount={format(villa.nightlyRate)} unit="/ night" />}
            fields={(
              <DateRangeField
                id={`${villa.slug}-dates`}
                value={{ checkIn, checkOut }}
                onChange={(r) => { setCheckIn(r.checkIn); setCheckOut(r.checkOut); }}
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
                <a href={WHATSAPP_LINK} target="_blank" rel="noopener" className={SECONDARY_BTN}>Ask about dates</a>
                {/* The Airbnb hand-off goes here, as a second SECONDARY_BTN, the
                    moment there is a listing URL to send guests to. Both villas
                    are on Airbnb and some guests trust that checkout more, so
                    this is a real booking, not a leak. Left out until the URL
                    exists: a booking button that goes nowhere is a broken
                    promise. See the TODO in components/layout/Footer.jsx - the
                    same missing link. */}
              </>
            )}
            /* The terms replace the old season-rate note: a guest at the point
               of booking needs to know what they are paying and what happens if
               they cancel, which the note never said. */
            note={<BookingTerms />}
          >
            <Card tone="cream" className="p-6">
              <p className={`${CAPS} text-muted mb-3`}>Add to your stay</p>
              <LinkList linkAs={Link} items={SERVICES} />
            </Card>

            {/* THE TOURS SIT IN THE BOOKING FLOW, not in a band further down the
                page (Wayan). A guest who has just picked their dates is the one
                deciding what to do with those days; the same four cards at the
                bottom of the page are read by somebody who has already decided
                to leave.

                FOUR, NOT THE CATALOG. These are what a guest staying in Ubud
                actually books. The rest of Cahyana Ubud Experience is one link
                away, and that is the right amount of it to put here. */}
            <Card tone="cream" className="p-6">
              <p className={`${CAPS} text-muted mb-1`}>Add a driver or a tour</p>
              <p className="text-label text-muted mb-3">
                Run by Cahyana Ubud Experience - the same family, every price upfront.
              </p>
              <LinkList items={CUE_TOURS.map((t) => ({ ...t, external: true }))} />
              <a href={CUE_LINK} target="_blank" rel="noopener" className="inline-block mt-3 text-label text-gold underline">
                Explore more tours in Bali
              </a>
            </Card>
          </BookingPanel>
        </Container>
      </Section>

      <Section tone="dark" className="text-center">
        <h2 className="text-h2 font-semibold text-white">{villa.name}, your dates</h2>
        <p className="mt-2 text-small text-white/75">See if the villa is free when you are.</p>
        <div className="flex justify-center mt-6">
          <CheckAvailabilityButton villaSlug={villa.slug} />
        </div>
</Section>

      {/* Mobile-only book bar - lg:hidden, since the sticky panel above already
          covers desktop. 'floating' is this site's variant of the shared shell:
          an inset rounded card rather than CUE's flush edge-to-edge bar. */}
      <StickyBar variant="floating" show={showBookBar}>
        <PriceBlock tight amount={format(villa.nightlyRate)} unit="/ night" size="sm" />
        <div className="flex items-center gap-2 flex-shrink-0">
          <a
            href={WHATSAPP_LINK}
            target="_blank"
            rel="noopener"
            aria-label="Chat on WhatsApp"
            className="flex items-center justify-center w-11 h-11 rounded-full bg-cta text-white flex-shrink-0"
          >
            <MessageCircle className="w-[var(--icon-md)] h-[var(--icon-md)]" strokeWidth={1.8} aria-hidden="true" />
          </a>
          <Button onClick={() => openBooking({ villaSlug: villa.slug, checkIn, checkOut })}>
            Check availability
          </Button>
        </div>
      </StickyBar>
    </>
  );
}
