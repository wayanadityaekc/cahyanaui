'use client';

import Link from 'next/link';
import { ChevronLeft, MessageCircle, X as CloseIcon } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Button, DateRangeField, EYEBROW_LINE } from '@cahyana/ui';
import DragSheet from '@/components/ui/DragSheet';
import SheetPresence from '@/components/ui/SheetPresence';
import useMobile from '@/components/ui/useMobile';
import Select from '@/components/ui/Select';
import { useBooking } from '@/components/providers/BookingProvider';
import { useCart } from '@/components/providers/CartProvider';
import { useCurrency } from '@/components/providers/CurrencyProvider';
import { VILLAS, VILLA_LIST, priceBreakdown } from '@/lib/villas';
import { formatRupiah } from '@/lib/currency';
import BookingTerms from '@/components/booking/BookingTerms';
import { buildWhatsappLink } from '@/lib/constants';
import { AVAILABILITY_COPY, STAY_RULES, formatBaliToday, checkStay } from '@/lib/availability';
import StayCheckout from '@/components/booking/StayCheckout';
import useVillaAvailability from '@/components/booking/useVillaAvailability';

export default function BookingSheet() {
  const {
    isOpen,
    step,
    booking,
    closeBooking: handleBookingClose,
    updateBooking: handleBookingUpdate,
    goToSummary,
    goToDetails: handleDetailsOpen,
  } = useBooking();
  const { currency, format, formatAmount, breakdown: convert } = useCurrency();
  const { setStay } = useCart();
  const isPhone = useMobile('(max-width: 639px)');
  const [availability, setAvailability] = useState('');
  const [checkoutStay, setCheckoutStay] = useState(null);
  const [today, setToday] = useState('');
  useEffect(() => setToday(formatBaliToday()), []);
  const calendar = useVillaAvailability(isOpen ? booking.villaSlug : '');

  useEffect(() => {
    setAvailability('');
  }, [booking.villaSlug, booking.checkIn, booking.checkOut]);

  function handleBookNow() {
    const stay = {
      villaSlug: villa.slug,
      checkIn: booking.checkIn,
      checkOut: booking.checkOut,
      guests: booking.guests,
    };
    handleBookingClose();
    setCheckoutStay(stay);
  }

  async function handleAvailabilityCheck() {
    setAvailability('checking');
    const answer = await checkStay(booking.villaSlug, booking.checkIn, booking.checkOut);
    setAvailability(answer);
    if (answer !== 'taken') goToSummary();
  }

  useEffect(() => {
    if (!isOpen || step !== 'summary') return;
    setStay({
      villaSlug: booking.villaSlug,
      checkIn: booking.checkIn,
      checkOut: booking.checkOut,
      guests: booking.guests,
    });
  }, [isOpen, step, booking.villaSlug, booking.checkIn, booking.checkOut, booking.guests, setStay]);

  const villa = VILLAS[booking.villaSlug] || VILLA_LIST[0];
  const breakdown = priceBreakdown(villa.slug, booking.checkIn, booking.checkOut);
  const shown = convert(breakdown);
  const isInRupiah = currency === 'IDR';
  const canContinue = booking.checkIn && booking.checkOut && breakdown && breakdown.nights > 0;

  const message = breakdown
    ? [
        `Hi! I'd like to book ${villa.name}.`,
        `Check-in: ${booking.checkIn || '-'}`,
        `Check-out: ${booking.checkOut || '-'}`,
        `Guests: ${booking.guests}`,
        `${shown.nights} night(s) x ${formatAmount(shown.nightly)} = ${formatAmount(shown.subtotal)}`,
        `Total: ${formatAmount(shown.total)}${isInRupiah ? '' : ` (exact price ${formatRupiah(breakdown.totalIdr)})`}`,
      ].join('\n')
    : `Hi! I'd like to ask about booking ${villa.name}.`;

  return (
    <>
      <SheetPresence
        open={isOpen}
        onClose={handleBookingClose}
        label={step === 'details' ? 'Book Your Stay' : 'Price Summary'}
        shell="fixed inset-0 z-[100] flex items-end sm:items-center justify-center bg-black/45"
        box="relative w-full sm:max-w-md"
      >
        <DragSheet
          enabled={isPhone}
          onDismiss={handleBookingClose}
          handleClassName="absolute top-0 left-0 right-0 h-5 z-20 [touch-action:none] cursor-grab active:cursor-grabbing"
          className="relative bg-surface-raised rounded-t-xl sm:rounded-xl [box-shadow:var(--shadow-xl)] max-h-[92vh] overflow-y-auto max-[639px]:pt-5"
        >
          {isPhone && (
            <span
              className="absolute top-2 left-1/2 -translate-x-1/2 z-30 w-10 h-1 rounded-pill bg-line pointer-events-none"
              aria-hidden="true"
            />
          )}
          <div className="flex items-center justify-between px-5 py-4 border-b border-line sticky top-0 max-[639px]:top-5 bg-surface-raised z-10">
            <div className="flex items-center gap-2">
              {step === 'summary' && (
                <button
                  type="button"
                  onClick={handleDetailsOpen}
                  aria-label="Back"
                  className="text-gold cursor-pointer"
                >
                  <ChevronLeft className="w-[var(--icon-md)] h-[var(--icon-md)]" strokeWidth={1.8} aria-hidden="true" />
                </button>
              )}
              <h3 className="text-h3 font-semibold text-gold">
                {step === 'details' ? 'Book Your Stay' : 'Price Summary'}
              </h3>
            </div>
            <button type="button" onClick={handleBookingClose} aria-label="Close" className="text-gold cursor-pointer">
              <CloseIcon className="w-[var(--icon-md)] h-[var(--icon-md)]" strokeWidth={1.8} aria-hidden="true" />
            </button>
          </div>

          {step === 'details' ? (
            <div className="p-5 flex flex-col gap-5">
              <div className="flex items-center gap-3 p-3 rounded-lg bg-cream">
                <img src={villa.cardImg} alt="" width={64} height={64} className="w-16 h-16 object-cover" />
                <div className="flex-1">
                  <p className="text-h3 font-semibold text-gold">{villa.name}</p>
                  <p className="text-small text-muted">{format(villa.nightlyRateIdr)} / night</p>
                </div>
              </div>

              {VILLA_LIST.length > 1 && (
                <div>
                  <p className={EYEBROW_LINE}>Villa</p>
                  <Select
                    id="bk-villa"
                    label="Villa"
                    value={villa.slug}
                    onChange={(slug) => handleBookingUpdate({ villaSlug: slug })}
                    options={VILLA_LIST.map((villaEntry) => ({ value: villaEntry.slug, label: villaEntry.name }))}
                  />
                </div>
              )}

              <div>
                <p className={EYEBROW_LINE}>Stay dates</p>
                <DateRangeField
                  id="bk-checkin"
                  value={{ checkIn: booking.checkIn, checkOut: booking.checkOut }}
                  onChange={handleBookingUpdate}
                  min={today || undefined}
                  busy={calendar.busy}
                  minNights={STAY_RULES.minNights}
                  maxDaysAhead={STAY_RULES.maxDaysAhead}
                />
              </div>

              <div>
                <p className={EYEBROW_LINE}>Guests</p>
                <Select
                  id="bk-guests"
                  label="Guests"
                  value={String(booking.guests)}
                  onChange={(value) => handleBookingUpdate({ guests: Number(value) })}
                  options={Array.from({ length: villa.guests }, (unusedValue, index) => index + 1).map((count) => ({
                    value: String(count),
                    label: `${count} guest${count > 1 ? 's' : ''}`,
                  }))}
                />
              </div>

              <Button
                full
                disabled={!canContinue || availability === 'checking'}
                onClick={handleAvailabilityCheck}
                className="disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {availability === 'checking' ? 'Checking...' : 'Check availability'}
              </Button>
              {availability === 'taken' && (
                <p role="alert" className="text-small text-err text-center -mt-2" data-availability="taken">
                  {AVAILABILITY_COPY.taken}
                </p>
              )}
              {!canContinue && (
                <p className="text-label text-muted text-center -mt-3">
                  Pick check-in and check-out dates to continue.
                </p>
              )}
            </div>
          ) : (
            <div className="p-5 flex flex-col gap-5">
              <div className="flex items-center gap-3 p-3 rounded-lg bg-cream">
                <img src={villa.cardImg} alt="" width={64} height={64} className="w-16 h-16 object-cover" />
                <div className="flex-1">
                  <p className="text-h3 font-semibold text-gold">{villa.name}</p>
                  <p className="text-small text-muted">
                    {booking.checkIn} → {booking.checkOut} · {booking.guests} guest{booking.guests > 1 ? 's' : ''}
                  </p>
                </div>
              </div>

              <div className="divide-y divide-line text-small">
                <div className="flex justify-between py-2.5">
                  <span className="text-muted">
                    {breakdown.nights} night{breakdown.nights > 1 ? 's' : ''}
                  </span>
                  <span className="text-gold">{formatAmount(shown.subtotal)}</span>
                </div>
                <div className="flex justify-between py-3">
                  <span className="text-h3 font-semibold text-gold">Total</span>
                  <span className="text-h3 font-bold text-amber">{formatAmount(shown.total)}</span>
                </div>
              </div>
              {isInRupiah ? null : (
                <p className="text-label text-muted -mt-3">
                  Exact price {formatRupiah(breakdown.totalIdr)}; other currencies follow today's rate.
                </p>
              )}
              {(availability === 'free' || availability === 'unknown') && (
                <p
                  role="status"
                  className={`m-0 p-3 rounded-md text-small ${availability === 'free' ? 'bg-cream text-ok' : 'bg-cream text-green'}`}
                  data-availability={availability}
                >
                  {AVAILABILITY_COPY[availability]}
                </p>
              )}

              {availability === 'unknown' ? (
                <Button as="a" full href={buildWhatsappLink(message)} target="_blank" rel="noopener">
                  <MessageCircle
                    className="w-[var(--icon-sm)] h-[var(--icon-sm)]"
                    strokeWidth={1.8}
                    aria-hidden="true"
                  />
                  Continue to WhatsApp
                </Button>
              ) : (
                <Button full onClick={handleBookNow} data-book-now>
                  Book now
                </Button>
              )}
              <Button as={Link} href="/my-booking" variant="ghost" full onClick={handleBookingClose}>
                Add extras
              </Button>
              <p className="text-label text-muted text-center -mt-3">
                Tours, activities and airport transfers, with prices, in My Booking.
              </p>
              <BookingTerms className="text-center [&_ul]:inline-block [&_ul]:text-left" />
              {availability === 'unknown' && (
                <p className="text-label text-muted text-center">
                  This sends your request to our team on WhatsApp - no payment is taken here.
                </p>
              )}
            </div>
          )}
        </DragSheet>
      </SheetPresence>
      <StayCheckout stay={checkoutStay} open={!!checkoutStay} onClose={() => setCheckoutStay(null)} />
    </>
  );
}
