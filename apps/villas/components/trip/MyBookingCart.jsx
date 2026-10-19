'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { ArrowRight, MessageCircle, Trash2 } from 'lucide-react';
import { useCart } from '@/components/providers/CartProvider';
import { useCurrency } from '@/components/providers/CurrencyProvider';
import { findServiceById } from '@/lib/bookingCart';
import { findExtraProblem, calculateExtrasTotals } from '@/lib/extras';
import { buildBookingMessage } from '@/lib/bookingMessage';
import ExtrasSection from '@/components/trip/ExtrasSection';
import CharterCard from '@/components/sections/CharterCard';
import useExtrasCatalog from '@/components/trip/useExtrasCatalog';
import CheckoutSheet from '@/components/booking/CheckoutSheet';
import PayWaiting from '@/components/booking/PayWaiting';
import { VILLAS, countNightsBetween, priceBreakdown } from '@/lib/villas';
import { formatRupiah } from '@/lib/currency';
import { CUE_LINK, buildWhatsappLink } from '@/lib/constants';
import { Button, Container, EYEBROW_LINE } from '@cahyana/ui';

const CARD = 'bg-surface-raised border border-line [box-shadow:var(--shadow-md)]';
const ROW_H = 'text-h3 font-semibold text-gold';
const LABEL = 'caps text-muted';
const LINE = 'flex items-center justify-between gap-4 text-body';
const ICON_BTN =
  'inline-flex items-center gap-1.5 p-0 bg-transparent border-none cursor-pointer text-body text-muted ' +
  '[transition:color_var(--dur)_var(--ease)] hover:text-err';
const ICON = 'w-[var(--icon-sm)] h-[var(--icon-sm)] shrink-0';

function EmptyState() {
  return (
    <div className={`${CARD} p-8 text-center`}>
      <h2 className={ROW_H}>Nothing here yet</h2>
      <p className="mt-2 text-body text-muted">
        Pick your dates on a villa and they will show up here, with whatever services you want waiting.
      </p>
      <div className="flex flex-wrap justify-center gap-3 mt-6">
        <Button as={Link} href="/#villas">
          See villas
        </Button>
        <Button as="a" variant="ghost" href={CUE_LINK} target="_blank" rel="noopener">
          Bali tours
        </Button>
      </div>
    </div>
  );
}

export default function MyBookingCart() {
  const {
    cart,
    ready,
    clearStay: handleStayClear,
    toggleService: handleServiceToggle,
    addExtra,
    removeExtra,
    updateExtra,
    clear: handleStayClearItem,
  } = useCart();
  const { currency, formatAmount, breakdown: convert } = useCurrency();
  const [isSent, setIsSent] = useState(false);
  const catalog = useExtrasCatalog(currency, cart.stay?.guests || 2);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [waitingRef, setWaitingRef] = useState('');

  useEffect(() => {
    const ref = new URLSearchParams(window.location.search).get('ref');
    if (!ref) return;
    try {
      if (window.top !== window.self) {
        window.top.location.replace(window.location.href);
        return;
      }
    } catch (e) {}
    setWaitingRef(ref);
  }, []);

  function handleWaitingClose() {
    setWaitingRef('');
    window.history.replaceState({}, '', window.location.pathname);
  }

  if (!ready) return <div className="min-h-[40vh]" aria-busy="true" />;

  const stay = cart.stay;
  const breakdown = stay ? priceBreakdown(stay.villaSlug, stay.checkIn, stay.checkOut) : null;
  const villa = stay ? VILLAS[stay.villaSlug] : null;
  const nights = stay ? countNightsBetween(stay.checkIn, stay.checkOut) : 0;
  const shown = convert(breakdown);
  const isInRupiah = currency === 'IDR';
  const chosenServices = cart.services.map(findServiceById).filter(Boolean);
  const extras = stay ? cart.extras : [];
  const totals = calculateExtrasTotals(extras, catalog);
  const isBlocked =
    extras.some((extra) => findExtraProblem(extra, stay, catalog?.items[extra.key]?.category || null)) ||
    (extras.length > 0 && !totals);
  const isEmpty = !stay && chosenServices.length === 0;

  const message = buildBookingMessage({
    stay,
    villa,
    nights,
    shown,
    breakdown,
    inRupiah: isInRupiah,
    extras,
    totals,
    catalog,
    services: chosenServices,
    formatAmount,
  });

  return (
    <Container className="py-10">
      <p className={EYEBROW_LINE}>My Booking</p>
      <h1 className="text-display font-bold text-gold">Your stay so far</h1>
      <p className="mt-3 max-w-xl text-body text-muted">
        Everything you have picked, in one place. Nothing is reserved until we confirm it with you.
      </p>

      {isEmpty ? (
        <div className="mt-8">
          <EmptyState />
        </div>
      ) : (
        <div className="grid lg:grid-cols-[1.6fr_1fr] gap-6 items-start mt-8">
          <div className="flex flex-col gap-6">
            {stay && villa && (
              <div className={`${CARD} p-5`}>
                <div className="flex items-start gap-4">
                  <img
                    src={villa.cardImg}
                    alt=""
                    width={72}
                    height={72}
                    className="w-[72px] h-[72px] object-cover shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <h2 className={ROW_H}>{villa.name}</h2>
                    <p className="mt-1 text-body text-muted">
                      {stay.checkIn || '-'} to {stay.checkOut || '-'} · {stay.guests}{' '}
                      {stay.guests === 1 ? 'guest' : 'guests'}
                      {nights > 0 ? ` · ${nights} ${nights === 1 ? 'night' : 'nights'}` : ''}
                    </p>
                    <div className="flex flex-wrap items-center gap-4 mt-3">
                      <Link
                        href={`/villas/${villa.slug}`}
                        className="inline-flex items-center gap-1.5 text-body text-gold hover:text-cta"
                      >
                        Change dates <ArrowRight className={ICON} strokeWidth={1.6} aria-hidden="true" />
                      </Link>
                      <button type="button" className={ICON_BTN} onClick={handleStayClear}>
                        <Trash2 className={ICON} strokeWidth={1.6} aria-hidden="true" /> Remove
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className={`${CARD} p-5`}>
              <h2 className={ROW_H}>Add to your stay</h2>
              <p className="mt-1 mb-4 text-body text-muted">
                Tours, activities and airport transfers are run by Cahyana Ubud Experience, our sister company, with
                prices from its price list.
              </p>
              <ExtrasSection
                stay={stay}
                extras={extras}
                services={cart.services}
                catalog={catalog}
                formatAmount={formatAmount}
                onToggleService={handleServiceToggle}
                addExtra={addExtra}
                removeExtra={removeExtra}
                updateExtra={updateExtra}
              />
            </div>

            <div className={`${CARD} p-5`}>
              <CharterCard compact />
            </div>
          </div>

          <div className={`${CARD} p-5 lg:sticky lg:top-[calc(var(--header-h,58px)+1.5rem)]`}>
            <h2 className={ROW_H}>Summary</h2>

            {breakdown && nights > 0 ? (
              <div className="mt-4 flex flex-col gap-2">
                <p className={LINE}>
                  <span className="text-muted">
                    {nights} {nights === 1 ? 'night' : 'nights'} x {formatAmount(shown.nightly)}
                  </span>
                  <span>{formatAmount(shown.subtotal)}</span>
                </p>
                <p className={`${LINE} pt-3 mt-1 border-t border-line`}>
                  <span className={LABEL}>Stay total, paid in full</span>
                  <span className="text-h2 font-bold text-amber">{formatAmount(shown.total)}</span>
                </p>
                {isInRupiah ? null : (
                  <p className="text-label text-muted">
                    Exact price {formatRupiah(breakdown.totalIdr)}; other currencies follow today's rate.
                  </p>
                )}
              </div>
            ) : (
              <p className="mt-3 text-body text-muted">
                {stay ? 'Pick a check-out date and the total appears here.' : 'No dates yet, so no total to show.'}
              </p>
            )}

            {extras.length > 0 && (
              <div className="mt-5 pt-4 border-t border-line" data-extras-summary>
                <p className={LABEL}>Extras</p>
                {totals ? (
                  <div className="mt-2 flex flex-col gap-1.5">
                    <p className={LINE}>
                      <span className="text-muted">
                        {extras.length} {extras.length === 1 ? 'extra' : 'extras'}
                      </span>
                      <span>{formatAmount(totals.total)}</span>
                    </p>
                    <p className={LINE}>
                      <span className="text-muted">Deposit now</span>
                      <span data-deposit>{formatAmount(totals.deposit)}</span>
                    </p>
                    <p className={LINE}>
                      <span className="text-muted">Rest on the day</span>
                      <span>{formatAmount(totals.rest)}</span>
                    </p>
                  </div>
                ) : (
                  <p className="mt-2 text-body text-muted">
                    Prices are loading. If this stays, please try again in a moment.
                  </p>
                )}
              </div>
            )}

            {chosenServices.length > 0 && (
              <div className="mt-5 pt-4 border-t border-line">
                <p className={LABEL}>At the villa</p>
                <ul className="list-none mt-2 flex flex-col gap-1.5">
                  {chosenServices.map((service) => (
                    <li key={service.id} className={LINE}>
                      <span className="text-muted">{service.label}</span>
                      <span className="text-muted">paid at the villa</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <Button
              full
              onClick={() => setIsCheckoutOpen(true)}
              disabled={isBlocked || !breakdown || nights < 1}
              className="mt-6 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Book now
            </Button>
            <Button
              as="a"
              full
              variant="ghost"
              href={isBlocked ? undefined : buildWhatsappLink(message)}
              aria-disabled={isBlocked || undefined}
              target="_blank"
              rel="noopener"
              onClick={(event) => {
                if (isBlocked) {
                  event.preventDefault();
                  return;
                }
                setIsSent(true);
              }}
              className={`mt-2 ${isBlocked ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <MessageCircle className={ICON} strokeWidth={1.8} aria-hidden="true" />
              Ask on WhatsApp
            </Button>
            {isBlocked && (
              <p className="mt-3 text-label text-err text-center" role="status">
                Add a date and time for each extra first.
              </p>
            )}
            <p className="mt-3 text-label text-muted text-center">
              Book now to pay online and confirm straight away, or ask us first on WhatsApp.
            </p>
            {isSent && (
              <button
                type="button"
                onClick={handleStayClearItem}
                className="mt-4 w-full text-body text-muted hover:text-err bg-transparent border-none cursor-pointer"
              >
                Clear this booking
              </button>
            )}
          </div>
        </div>
      )}
      <CheckoutSheet
        open={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        cart={cart}
        onPaid={(ref) => {
          setIsCheckoutOpen(false);
          setWaitingRef(ref);
        }}
      />
      {waitingRef && (
        <PayWaiting bookingRef={waitingRef} onClose={handleWaitingClose} onConfirmed={handleStayClearItem} />
      )}
    </Container>
  );
}
