'use client';

import { ChevronLeft, MessageCircle, X } from 'lucide-react';
import { useEffect } from 'react';
import DateField from '@/components/ui/DateField';
import DragSheet from '@/components/ui/DragSheet';
import SheetPresence from '@/components/ui/SheetPresence';
import useMobile from '@/components/ui/useMobile';
import Select from '@/components/ui/Select';
import { useBooking } from '@/components/providers/BookingProvider';
import { useCart } from '@/components/providers/CartProvider';
import { useCurrency } from '@/components/providers/CurrencyProvider';
import { VILLAS, VILLA_LIST, priceBreakdown } from '@/lib/villas';
import { formatApproxIDR, formatCurrency } from '@/lib/currency';
import { whatsappLink } from '@/lib/constants';

// Full-screen mobile sheet / centered modal booking flow, per the mockup's
// "Book Your Stay" -> price-summary -> "Continue to WhatsApp" screens.
// There is no backend here on purpose: step 2's WhatsApp button just opens
// a wa.me link with a pre-filled summary so the conversation (and any real
// booking) continues with a person on WhatsApp.
export default function BookingSheet() {
  const { isOpen, step, booking, closeBooking, updateBooking, goToSummary, goToDetails } = useBooking();
  const { currency, format } = useCurrency();
  const { setStay } = useCart();
  const isPhone = useMobile('(max-width: 639px)');

  // Reaching the summary is the guest settling on a villa and dates, so that is
  // the moment the stay belongs in My Booking - not on every keystroke in step
  // one, which would fill the badge while they are still browsing. Runs in an
  // effect, never during render: writing to another provider mid-render is what
  // makes React complain about updating one component while rendering another.
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
  const canContinue = booking.checkIn && booking.checkOut && breakdown && breakdown.nights > 0;

  const message = breakdown
    ? [
        `Hi! I'd like to book ${villa.name}.`,
        `Check-in: ${booking.checkIn || '—'}`,
        `Check-out: ${booking.checkOut || '—'}`,
        `Guests: ${booking.guests}`,
        `${breakdown.nights} night(s) x ${formatCurrency(villa.nightlyRate, currency)} = ${formatCurrency(breakdown.subtotal, currency)}`,
        `Service fee: ${formatCurrency(breakdown.serviceFee, currency)}`,
        `Total: ${formatCurrency(breakdown.total, currency)} (approx. ${formatApproxIDR(breakdown.total)})`,
      ].join('\n')
    : `Hi! I'd like to ask about booking ${villa.name}.`;

  return (
    <SheetPresence
      open={isOpen}
      onClose={closeBooking}
      shell="fixed inset-0 z-[100] flex items-end sm:items-center justify-center bg-black/45"
      box="relative w-full sm:max-w-md"
    >
      {/* enabled only where this actually IS a bottom sheet. Above 640px it
          becomes a centred card, and dragging a centred card downwards to
          dismiss reads as a bug, not a gesture. DragSheet's own handle hides
          at 993px, which is CUE's sheet breakpoint, not this one. */}
      <DragSheet
        enabled={isPhone}
        onDismiss={closeBooking}
        handleClassName="absolute top-0 left-0 right-0 h-5 z-20 [touch-action:none] cursor-grab active:cursor-grabbing"
        className="relative bg-white rounded-t-xl sm:rounded-xl [box-shadow:var(--shadow-xl)] max-h-[92vh] overflow-y-auto max-[639px]:pt-5"
      >
        {/* The grab pill the handle sits over. Mobile only - there is nothing
            to grab on a centred card.

            pointer-events-none is load-bearing, not tidiness: DragSheet's
            invisible grab area is z-[2] and this pill sat above it at z-[3],
            so a finger landing on the one visible thing that says "drag me"
            hit the decoration and the gesture never started. Caught by the
            harness - the swipe-to-dismiss test failed while everything looked
            right on screen. */}
        {isPhone && <span className="absolute top-2 left-1/2 -translate-x-1/2 z-30 w-10 h-1 rounded-pill bg-line pointer-events-none" aria-hidden="true" />}
        <div className="flex items-center justify-between px-5 py-4 border-b border-line sticky top-0 max-[639px]:top-5 bg-white z-10">
          <div className="flex items-center gap-2">
            {step === 'summary' && (
              <button type="button" onClick={goToDetails} aria-label="Back" className="text-gold cursor-pointer">
                <ChevronLeft className="w-[var(--icon-md)] h-[var(--icon-md)]" strokeWidth={1.8} aria-hidden="true" />
              </button>
            )}
            <h3 className="text-h3 font-semibold text-gold">
              {step === 'details' ? 'Book Your Stay' : 'Price Summary'}
            </h3>
          </div>
          <button type="button" onClick={closeBooking} aria-label="Close" className="text-gold cursor-pointer">
            <X className="w-[var(--icon-md)] h-[var(--icon-md)]" strokeWidth={1.8} aria-hidden="true" />
          </button>
        </div>

        {step === 'details' ? (
          <div className="p-5 flex flex-col gap-5">
            <div className="flex items-center gap-3 p-3 rounded-lg bg-cream">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={villa.cardImg} alt="" width={64} height={64} className="w-16 h-16 rounded-md object-cover" />
              <div className="flex-1">
                <p className="text-h3 font-semibold text-gold">{villa.name}</p>
                <p className="text-small text-muted">{format(villa.nightlyRate)} / night</p>
              </div>
            </div>

            {VILLA_LIST.length > 1 && (
              <div>
                <p className="eyebrow">Villa</p>
                <Select
                  id="bk-villa"
                  label="Villa"
                  value={villa.slug}
                  onChange={(v) => updateBooking({ villaSlug: v })}
                  options={VILLA_LIST.map((v) => ({ value: v.slug, label: v.name }))}
                />
              </div>
            )}

            <div>
              <p className="eyebrow">Stay dates</p>
              <div className="grid grid-cols-2 gap-3">
                <div className="min-w-0">
                  <label className="" htmlFor="bk-checkin">Check-in</label>
                  <DateField
                    id="bk-checkin"
                    label="Check-in"
                    value={booking.checkIn}
                    onChange={(v) => updateBooking({ checkIn: v })}
                    placeholder="Add date"
                  />
                </div>
                <div className="min-w-0">
                  <label className="" htmlFor="bk-checkout">Check-out</label>
                  <DateField
                    id="bk-checkout"
                    label="Check-out"
                    value={booking.checkOut}
                    min={booking.checkIn || undefined}
                    onChange={(v) => updateBooking({ checkOut: v })}
                    placeholder="Add date"
                  />
                </div>
              </div>
            </div>

            <div>
              <p className="eyebrow">Guests</p>
              <Select
                id="bk-guests"
                label="Guests"
                value={String(booking.guests)}
                onChange={(v) => updateBooking({ guests: Number(v) })}
                options={Array.from({ length: villa.guests }, (_, i) => i + 1).map((n) => ({ value: String(n), label: `${n} guest${n > 1 ? 's' : ''}` }))}
              />
            </div>

            <button
              type="button"
              className="btn btn-cta btn-full disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={!canContinue}
              onClick={goToSummary}
            >
              Check availability
            </button>
            {!canContinue && (
              <p className="text-label text-muted text-center -mt-3">Pick check-in and check-out dates to continue.</p>
            )}
          </div>
        ) : (
          <div className="p-5 flex flex-col gap-5">
            <div className="flex items-center gap-3 p-3 rounded-lg bg-cream">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={villa.cardImg} alt="" width={64} height={64} className="w-16 h-16 rounded-md object-cover" />
              <div className="flex-1">
                <p className="text-h3 font-semibold text-gold">{villa.name}</p>
                <p className="text-small text-muted">{booking.checkIn} → {booking.checkOut} · {booking.guests} guest{booking.guests > 1 ? 's' : ''}</p>
              </div>
            </div>

            <div className="divide-y divide-line text-small">
              <div className="flex justify-between py-2.5">
                <span className="text-muted">{breakdown.nights} night{breakdown.nights > 1 ? 's' : ''}</span>
                <span className="text-gold">{format(breakdown.subtotal)}</span>
              </div>
              <div className="flex justify-between py-2.5">
                <span className="text-muted">Service fee</span>
                <span className="text-gold">{format(breakdown.serviceFee)}</span>
              </div>
              <div className="flex justify-between py-3">
                <span className="text-h3 font-semibold text-gold">Total</span>
                <span className="text-h3 font-bold text-amber">{format(breakdown.total)}</span>
              </div>
            </div>
            <p className="text-label text-muted -mt-3">(approx. {formatApproxIDR(breakdown.total)})</p>

            <a
              href={whatsappLink(message)}
              target="_blank"
              rel="noopener"
              className="btn btn-cta btn-full"
            >
              <MessageCircle className="w-[var(--icon-sm)] h-[var(--icon-sm)]" strokeWidth={1.8} aria-hidden="true" />
              Continue to WhatsApp
            </a>
            <p className="text-label text-muted text-center">
              This sends your request to our team on WhatsApp — no payment is taken here.
            </p>
          </div>
        )}
      </DragSheet>
    </SheetPresence>
  );
}
