'use client';

import Link from 'next/link';
import { useState } from 'react';
import { ArrowRight, MessageCircle, Plus, Trash2 } from 'lucide-react';
import { useCart } from '@/components/providers/CartProvider';
import { useCurrency } from '@/components/providers/CurrencyProvider';
import { SERVICES, serviceById } from '@/lib/bookingCart';
import { VILLAS, nightsBetween, priceBreakdown } from '@/lib/villas';
import { formatApproxIDR, formatCurrency } from '@/lib/currency';
import { whatsappLink } from '@/lib/constants';

// My Booking — CUE's My Trips, fitted to what this site sells: one stay plus
// the villa services you want ready when you arrive, built up over a visit and
// handed over in a single WhatsApp message.
//
// The two kinds of line are shown differently ON PURPOSE. The stay has a real
// total (nights x rate, plus the service fee from lib/villas.js). The services
// do not: every service page says prices are confirmed with us, so they are
// listed as requests and the summary says so. A tidy-looking number beside
// "Spa & Massage" would be a price nobody set.
const CARD = 'bg-white border border-line rounded-lg [box-shadow:var(--shadow-md)]';
const ROW_H = 'text-h3 font-semibold text-gold';
const LABEL = 'text-label font-semibold uppercase tracking-[0.12em] text-muted';
const LINE = 'flex items-center justify-between gap-4 text-body';
const ICON_BTN =
  'inline-flex items-center gap-1.5 p-0 bg-transparent border-none cursor-pointer text-body text-muted ' +
  '[transition:color_var(--dur)_var(--ease)] hover:text-err';
const IC = 'w-[var(--icon-sm)] h-[var(--icon-sm)] shrink-0';

function EmptyState() {
  return (
    <div className={`${CARD} p-8 text-center`}>
      <h2 className={ROW_H}>Nothing here yet</h2>
      <p className="mt-2 text-body text-muted">
        Pick your dates on a villa and they will show up here, with whatever services you want waiting.
      </p>
      <div className="flex flex-wrap justify-center gap-3 mt-6">
        <Link href="/villas" className="btn btn-cta">See both villas</Link>
        <Link href="/experiences" className="btn btn-outline">Browse experiences</Link>
      </div>
    </div>
  );
}

export default function MyBookingCart() {
  const { cart, ready, clearStay, toggleService, clear } = useCart();
  const { currency, format } = useCurrency();
  const [sent, setSent] = useState(false);

  // Before the stored booking has been read there is nothing truthful to draw -
  // rendering the empty state here would flash "nothing here yet" at a guest
  // who does have a booking saved.
  if (!ready) return <div className="min-h-[40vh]" aria-busy="true" />;

  const stay = cart.stay;
  const breakdown = stay ? priceBreakdown(stay.villaSlug, stay.checkIn, stay.checkOut) : null;
  const villa = stay ? VILLAS[stay.villaSlug] : null;
  const nights = stay ? nightsBetween(stay.checkIn, stay.checkOut) : 0;
  const chosen = cart.services.map(serviceById).filter(Boolean);
  const isEmpty = !stay && chosen.length === 0;

  const message = [
    stay && villa ? `Hi! I'd like to book ${villa.name}.` : "Hi! I'd like to ask about staying with you.",
    stay ? `Check-in: ${stay.checkIn || '-'}` : null,
    stay ? `Check-out: ${stay.checkOut || '-'}` : null,
    stay ? `Guests: ${stay.guests}` : null,
    breakdown && nights > 0
      ? `${nights} night(s) x ${formatCurrency(villa.nightlyRate, currency)} = ${formatCurrency(breakdown.subtotal, currency)}`
      : null,
    breakdown && nights > 0 ? `Service fee: ${formatCurrency(breakdown.serviceFee, currency)}` : null,
    breakdown && nights > 0
      ? `Stay total: ${formatCurrency(breakdown.total, currency)} (approx. ${formatApproxIDR(breakdown.total)})`
      : null,
    chosen.length ? `Services I'd like: ${chosen.map((s) => s.label).join(', ')}` : null,
    chosen.length ? '(Happy to hear the prices for those.)' : null,
  ].filter(Boolean).join('\n');

  return (
    <div className="wrap py-10">
      <p className="eyebrow">My Booking</p>
      <h1 className="text-display font-bold text-gold">Your stay so far</h1>
      <p className="mt-3 max-w-xl text-body text-muted">
        Everything you have picked, in one place. Nothing is reserved until we confirm it with you.
      </p>

      {isEmpty ? (
        <div className="mt-8"><EmptyState /></div>
      ) : (
        <div className="grid lg:grid-cols-[1.6fr_1fr] gap-6 items-start mt-8">
          <div className="flex flex-col gap-6">
            {stay && villa && (
              <div className={`${CARD} p-5`}>
                <div className="flex items-start gap-4">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={villa.cardImg} alt="" width={72} height={72} className="w-[72px] h-[72px] rounded-md object-cover shrink-0" />
                  <div className="flex-1 min-w-0">
                    <h2 className={ROW_H}>{villa.name}</h2>
                    <p className="mt-1 text-body text-muted">
                      {stay.checkIn || '-'} to {stay.checkOut || '-'} · {stay.guests} {stay.guests === 1 ? 'guest' : 'guests'}
                      {nights > 0 ? ` · ${nights} ${nights === 1 ? 'night' : 'nights'}` : ''}
                    </p>
                    <div className="flex flex-wrap items-center gap-4 mt-3">
                      <Link href={`/villas/${villa.slug}`} className="inline-flex items-center gap-1.5 text-body text-gold hover:text-cta">
                        Change dates <ArrowRight className={IC} strokeWidth={1.6} aria-hidden="true" />
                      </Link>
                      <button type="button" className={ICON_BTN} onClick={clearStay}>
                        <Trash2 className={IC} strokeWidth={1.6} aria-hidden="true" /> Remove
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className={`${CARD} p-5`}>
              <h2 className={ROW_H}>Add to your stay</h2>
              <p className="mt-1 text-body text-muted">
                Tick whatever you want waiting for you. We confirm the prices when we reply - they are not fixed on this page.
              </p>
              <ul className="list-none mt-4 flex flex-col">
                {SERVICES.map((s) => {
                  const on = cart.services.includes(s.id);
                  return (
                    <li key={s.id} className="flex items-center justify-between gap-4 py-3 [&+&]:border-t [&+&]:border-line">
                      <Link href={s.href} className="min-w-0 text-body font-medium text-gold hover:text-cta">{s.label}</Link>
                      <button
                        type="button"
                        onClick={() => toggleService(s.id)}
                        aria-pressed={on}
                        className={on
                          ? 'inline-flex items-center gap-1.5 shrink-0 rounded-pill px-3 h-8 border-none bg-cta text-white text-small font-semibold cursor-pointer'
                          : 'inline-flex items-center gap-1.5 shrink-0 rounded-pill px-3 h-8 [border:1px_solid_var(--line)] bg-white text-gold text-small font-semibold cursor-pointer hover:[border-color:var(--color-cta)]'}
                      >
                        {on
                          ? <><Trash2 className={IC} strokeWidth={1.8} aria-hidden="true" /> Remove</>
                          : <><Plus className={IC} strokeWidth={1.8} aria-hidden="true" /> Add</>}
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>

          <div className={`${CARD} p-5 lg:sticky lg:top-[calc(var(--header-h,58px)+1.5rem)]`}>
            <h2 className={ROW_H}>Summary</h2>

            {breakdown && nights > 0 ? (
              <div className="mt-4 flex flex-col gap-2">
                <p className={LINE}>
                  <span className="text-muted">{nights} {nights === 1 ? 'night' : 'nights'} x {format(villa.nightlyRate)}</span>
                  <span>{format(breakdown.subtotal)}</span>
                </p>
                <p className={LINE}>
                  <span className="text-muted">Service fee</span>
                  <span>{format(breakdown.serviceFee)}</span>
                </p>
                <p className={`${LINE} pt-3 mt-1 border-t border-line`}>
                  <span className={LABEL}>Stay total</span>
                  <span className="text-h2 font-bold text-amber">{format(breakdown.total)}</span>
                </p>
                <p className="text-label text-muted">approx. {formatApproxIDR(breakdown.total)}</p>
              </div>
            ) : (
              <p className="mt-3 text-body text-muted">
                {stay ? 'Pick a check-out date and the total appears here.' : 'No dates yet, so no total to show.'}
              </p>
            )}

            {chosen.length > 0 && (
              <div className="mt-5 pt-4 border-t border-line">
                <p className={LABEL}>Services requested</p>
                <ul className="list-none mt-2 flex flex-col gap-1.5">
                  {chosen.map((s) => (
                    <li key={s.id} className={LINE}>
                      <span className="text-muted">{s.label}</span>
                      <span className="text-muted">price on request</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <a
              href={whatsappLink(message)}
              target="_blank"
              rel="noopener"
              onClick={() => setSent(true)}
              className="btn btn-cta btn-full mt-6"
            >
              <MessageCircle className={IC} strokeWidth={1.8} aria-hidden="true" />
              Send to WhatsApp
            </a>
            <p className="mt-3 text-label text-muted text-center">
              Opens WhatsApp with this already written out. Nothing is sent until you press send there.
            </p>
            {sent && (
              <button type="button" onClick={clear} className="mt-4 w-full text-body text-muted hover:text-err bg-transparent border-none cursor-pointer">
                Clear this booking
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
