'use client';

import Link from 'next/link';
import { ChevronLeft, MessageCircle, X } from 'lucide-react';
import { useEffect } from 'react';
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
import { whatsappLink } from '@/lib/constants';

// Booking sheet with no backend on purpose: step 2 opens a pre-filled wa.me link so a person continues on WhatsApp.
export default function BookingSheet() {
  const { isOpen, step, booking, closeBooking, updateBooking, goToSummary, goToDetails } = useBooking();
  const { currency, format, formatAmount, breakdown: convert } = useCurrency();
  const { setStay } = useCart();
  const isPhone = useMobile('(max-width: 639px)');

  // Save the stay only on reaching the summary, and in an effect: writing another provider mid-render makes React complain.
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
  const inRupiah = currency === 'IDR';
  const canContinue = booking.checkIn && booking.checkOut && breakdown && breakdown.nights > 0;

  const message = breakdown
    ? [
        `Hi! I'd like to book ${villa.name}.`,
        `Check-in: ${booking.checkIn || '-'}`,
        `Check-out: ${booking.checkOut || '-'}`,
        `Guests: ${booking.guests}`,
        `${shown.nights} night(s) x ${formatAmount(shown.nightly)} = ${formatAmount(shown.subtotal)}`,
        `Total: ${formatAmount(shown.total)}${inRupiah ? '' : ` (exact price ${formatRupiah(breakdown.totalIdr)})`}`,
      ].join('\n')
    : `Hi! I'd like to ask about booking ${villa.name}.`;

  return (
    <SheetPresence
      open={isOpen}
      onClose={closeBooking}
      label={step === 'details' ? 'Book Your Stay' : 'Price Summary'}
      shell="fixed inset-0 z-[100] flex items-end sm:items-center justify-center bg-black/45"
      box="relative w-full sm:max-w-md"
    >
      {/* Drag only where this is a bottom sheet: dragging the centred card above 640px reads as a bug. */}
      <DragSheet
        enabled={isPhone}
        onDismiss={closeBooking}
        handleClassName="absolute top-0 left-0 right-0 h-5 z-20 [touch-action:none] cursor-grab active:cursor-grabbing"
        className="relative bg-surface-raised rounded-t-xl sm:rounded-xl [box-shadow:var(--shadow-xl)] max-h-[92vh] overflow-y-auto max-[639px]:pt-5"
      >
        {/* Mobile grab pill; pointer-events-none is required, or it sits above the grab area and swallows the swipe. */}
        {isPhone && <span className="absolute top-2 left-1/2 -translate-x-1/2 z-30 w-10 h-1 rounded-pill bg-line pointer-events-none" aria-hidden="true" />}
        <div className="flex items-center justify-between px-5 py-4 border-b border-line sticky top-0 max-[639px]:top-5 bg-surface-raised z-10">
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
                  onChange={(slug) => updateBooking({ villaSlug: slug })}
                  options={VILLA_LIST.map((villaEntry) => ({ value: villaEntry.slug, label: villaEntry.name }))}
                />
              </div>
            )}

            <div>
              <p className={EYEBROW_LINE}>Stay dates</p>
              {/* One range picker, not two date fields: only a range can show the nights between, which decide the stay. */}
              <DateRangeField
                id="bk-checkin"
                value={{ checkIn: booking.checkIn, checkOut: booking.checkOut }}
                onChange={updateBooking}
              />
            </div>

            <div>
              <p className={EYEBROW_LINE}>Guests</p>
              <Select
                id="bk-guests"
                label="Guests"
                value={String(booking.guests)}
                onChange={(value) => updateBooking({ guests: Number(value) })}
                options={Array.from({ length: villa.guests }, (_, i) => i + 1).map((count) => ({ value: String(count), label: `${count} guest${count > 1 ? 's' : ''}` }))}
              />
            </div>

            <Button full disabled={!canContinue} onClick={goToSummary} className="disabled:opacity-50 disabled:cursor-not-allowed">
              Check availability
            </Button>
            {!canContinue && (
              <p className="text-label text-muted text-center -mt-3">Pick check-in and check-out dates to continue.</p>
            )}
          </div>
        ) : (
          <div className="p-5 flex flex-col gap-5">
            <div className="flex items-center gap-3 p-3 rounded-lg bg-cream">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={villa.cardImg} alt="" width={64} height={64} className="w-16 h-16 object-cover" />
              <div className="flex-1">
                <p className="text-h3 font-semibold text-gold">{villa.name}</p>
                <p className="text-small text-muted">{booking.checkIn} → {booking.checkOut} · {booking.guests} guest{booking.guests > 1 ? 's' : ''}</p>
              </div>
            </div>

            <div className="divide-y divide-line text-small">
              <div className="flex justify-between py-2.5">
                <span className="text-muted">{breakdown.nights} night{breakdown.nights > 1 ? 's' : ''}</span>
                <span className="text-gold">{formatAmount(shown.subtotal)}</span>
              </div>
              <div className="flex justify-between py-3">
                <span className="text-h3 font-semibold text-gold">Total</span>
                <span className="text-h3 font-bold text-amber">{formatAmount(shown.total)}</span>
              </div>
            </div>
            {inRupiah ? null : <p className="text-label text-muted -mt-3">Exact price {formatRupiah(breakdown.totalIdr)}; other currencies follow today's rate.</p>}

            <Button as="a" full href={whatsappLink(message)} target="_blank" rel="noopener">
              <MessageCircle className="w-[var(--icon-sm)] h-[var(--icon-sm)]" strokeWidth={1.8} aria-hidden="true" />
              Continue to WhatsApp
            </Button>
            {/* Extras live in My Booking, where the saved stay already is; the sheet only points there. */}
            <Button as={Link} href="/my-booking" variant="ghost" full onClick={closeBooking}>Add extras</Button>
            <p className="text-label text-muted text-center -mt-3">Tours, activities and airport transfers, with prices, in My Booking.</p>
            <BookingTerms className="text-center [&_ul]:inline-block [&_ul]:text-left" />
            <p className="text-label text-muted text-center">
              This sends your request to our team on WhatsApp - no payment is taken here.
            </p>
          </div>
        )}
      </DragSheet>
    </SheetPresence>
  );
}
