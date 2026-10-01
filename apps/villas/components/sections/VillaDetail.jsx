'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import VillaGallery from '@/components/sections/VillaGallery';
import AmenityIcon from '@/components/ui/AmenityIcon';
import VillaAvailability from '@/components/sections/VillaAvailability';
import StaySummary from '@/components/booking/StaySummary';
import StayCheckout from '@/components/booking/StayCheckout';
import useVillaAvailability from '@/components/booking/useVillaAvailability';
import Select from '@/components/ui/Select';
import { BookingPanel, Button, CAPS, Card, Container, DateRangeField, EYEBROW_LINE, LinkList, PROSE_COPY, PriceBlock, SECONDARY_BTN, STARS, Section, StickyBar, useRevealWhenAway, SourceMark, stayIsOpen, stayLimits } from '@cahyana/ui';
import { useCurrency } from '@/components/providers/CurrencyProvider';
import { useCart } from '@/components/providers/CartProvider';
import { useTripPrefs } from '@/components/providers/TripPrefsProvider';
import BookingTerms from '@/components/booking/BookingTerms';
import { CUE_TOURS } from '@/content/crossSell';
import { SERVICES } from '@/lib/bookingCart';
import { WHATSAPP_LINK, CUE_LINK, whatsappLink } from '@/lib/constants';
import { STAY_RULES, baliToday } from '@/lib/availability';

function scrollToCalendar() {
  const target = document.getElementById('availability');
  if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

export default function VillaDetail({ villa }) {
  const { format } = useCurrency();
  const router = useRouter();
  const { setStay } = useCart();
  const { guests: preferredGuests } = useTripPrefs();
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [guests, setGuests] = useState(Math.min(preferredGuests || 2, villa.guests));
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  // Today in Bali, read in the browser: the page is a static export, so a build-time date would be stale.
  const [today, setToday] = useState('');
  useEffect(() => setToday(baliToday()), []);
  const availability = useVillaAvailability(villa.slug);
  const calendar = today ? availability : { status: 'loading', busy: [] };

  const limits = stayLimits({ today: today || '0000-00-00', ...STAY_RULES });
  const range = { checkIn, checkOut };
  const unknown = calendar.status === 'unknown';
  const ready = calendar.status === 'ready' && stayIsOpen(range, { busy: calendar.busy, limits });
  const stay = ready ? { villaSlug: villa.slug, checkIn, checkOut, guests } : null;
  const askMessage = `Hi! I'd like to book ${villa.name}${checkIn && checkOut ? ` from ${checkIn} to ${checkOut}` : ''} for ${guests} guest${guests > 1 ? 's' : ''}. Your online calendar wasn't loading - could you check these dates for me?`;

  function setRange(next) { setCheckIn(next.checkIn || ''); setCheckOut(next.checkOut || ''); }

  function bookNow() {
    if (!stay) { scrollToCalendar(); return; }
    setStay(stay);
    setCheckoutOpen(true);
  }

  function addExtrasFirst() {
    if (!stay) return;
    setStay(stay);
    router.push('/my-booking/');
  }

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
              <div className="flex flex-col gap-3">
                <DateRangeField
                  id={`${villa.slug}-dates`}
                  value={range}
                  onChange={setRange}
                  min={today || undefined}
                  busy={calendar.busy}
                  minNights={STAY_RULES.minNights}
                  maxDaysAhead={STAY_RULES.maxDaysAhead}
                />
                <Select
                  id={`${villa.slug}-guests`}
                  label="Guests"
                  value={String(guests)}
                  onChange={(value) => setGuests(Number(value))}
                  options={Array.from({ length: villa.guests }, (_, index) => index + 1).map((count) => ({ value: String(count), label: `${count} guest${count > 1 ? 's' : ''}` }))}
                />
                <StaySummary villaSlug={villa.slug} checkIn={checkIn} checkOut={checkOut} />
              </div>
            )}
            cta={unknown ? (
              <div className="flex flex-col gap-2">
                <p role="status" className="m-0 text-small text-green" data-availability="unknown">We can&apos;t load the live calendar right now, so our team will confirm your dates by hand.</p>
                <Button as="a" full href={whatsappLink(askMessage)} target="_blank" rel="noopener">Ask on WhatsApp</Button>
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                <Button full onClick={bookNow} disabled={calendar.status === 'loading'} data-book-now>Book now</Button>
                {!ready && <p className="m-0 text-label text-muted text-center">{calendar.status === 'loading' ? 'Loading availability...' : 'Pick your check-in and check-out to book.'}</p>}
              </div>
            )}
            secondary={(
              <>
                {ready && (
                  <button type="button" onClick={addExtrasFirst} className={SECONDARY_BTN}>Add tours or a transfer first</button>
                )}
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

      <VillaAvailability villa={villa} value={range} onChange={setRange} availability={calendar} today={today} />

      <Section tone="dark" className="text-center">
        <h2 className="text-h2 font-medium text-white">{villa.name}, your dates</h2>
        <p className="mt-2 text-small text-white/75">See if the villa is free when you are.</p>
        <div className="flex justify-center mt-6">
          {/* onDark - this band IS the action colour now. */}
          <Button variant="onDark" onClick={ready ? bookNow : scrollToCalendar}>{ready ? 'Book now' : 'See availability'}</Button>
        </div>
      </Section>

      {/* Mobile-only book bar, flush like CUE's; chat lives in the navbar, so the bar holds one action. */}
      <StickyBar variant="flush" show={showBookBar}>
        <PriceBlock tight amount={format(villa.nightlyRateIdr)} unit="/ night" size="sm" />
        <Button className="flex-shrink-0" onClick={ready ? bookNow : scrollToCalendar}>
          {ready ? 'Book now' : 'Pick dates'}
        </Button>
      </StickyBar>
      <StayCheckout stay={stay} open={checkoutOpen} onClose={() => setCheckoutOpen(false)} />
    </>
  );
}
