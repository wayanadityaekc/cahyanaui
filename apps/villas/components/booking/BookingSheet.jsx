'use client';

import { ChevronLeft, MessageCircle, X } from 'lucide-react';
import { useEffect } from 'react';
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

  // Hooks above, bail-out here: an early return before them would change the
  // hook order between renders.
  if (!isOpen) return null;

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
    <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center">
      <button
        type="button"
        aria-label="Close booking"
        onClick={closeBooking}
        className="absolute inset-0 bg-black/45 cursor-default"
      />

      <div className="relative w-full sm:max-w-md bg-white rounded-t-xl sm:rounded-xl shadow-xl max-h-[92vh] overflow-y-auto animate-[sheetIn_0.25s_ease-out]">
        <div className="flex items-center justify-between px-5 py-4 border-b border-line sticky top-0 bg-white z-10">
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
                <div className="field-shell">
                  <select
                    value={villa.slug}
                    onChange={(e) => updateBooking({ villaSlug: e.target.value })}
                  >
                    {VILLA_LIST.map((v) => (
                      <option key={v.slug} value={v.slug}>{v.name}</option>
                    ))}
                  </select>
                </div>
              </div>
            )}

            <div>
              <p className="eyebrow">Stay dates</p>
              <div className="grid grid-cols-2 gap-3">
                <div className="field-shell">
                  <div className="w-full">
                    <label htmlFor="bk-checkin">Check-in</label>
                    <input
                      id="bk-checkin"
                      type="date"
                      value={booking.checkIn}
                      onChange={(e) => updateBooking({ checkIn: e.target.value })}
                      className={booking.checkIn ? undefined : 'is-empty'}
                    />
                  </div>
                </div>
                <div className="field-shell">
                  <div className="w-full">
                    <label htmlFor="bk-checkout">Check-out</label>
                    <input
                      id="bk-checkout"
                      type="date"
                      value={booking.checkOut}
                      min={booking.checkIn || undefined}
                      onChange={(e) => updateBooking({ checkOut: e.target.value })}
                      className={booking.checkOut ? undefined : 'is-empty'}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div>
              <p className="eyebrow">Guests</p>
              <div className="field-shell">
                <select
                  value={booking.guests}
                  onChange={(e) => updateBooking({ guests: Number(e.target.value) })}
                >
                  {Array.from({ length: villa.guests }, (_, i) => i + 1).map((n) => (
                    <option key={n} value={n}>{n} guest{n > 1 ? 's' : ''}</option>
                  ))}
                </select>
              </div>
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
      </div>
    </div>
  );
}
