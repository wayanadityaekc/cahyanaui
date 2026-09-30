'use client';

import Link from 'next/link';
import { useState } from 'react';
import { ArrowRight, MessageCircle, Trash2 } from 'lucide-react';
import { useCart } from '@/components/providers/CartProvider';
import { useCurrency } from '@/components/providers/CurrencyProvider';
import { serviceById } from '@/lib/bookingCart';
import { extraProblem, extrasTotals } from '@/lib/extras';
import { bookingMessage } from '@/lib/bookingMessage';
import ExtrasSection from '@/components/trip/ExtrasSection';
import useExtrasCatalog from '@/components/trip/useExtrasCatalog';
import { VILLAS, nightsBetween, priceBreakdown } from '@/lib/villas';
import { formatRupiah } from '@/lib/currency';
import { CUE_LINK, whatsappLink } from '@/lib/constants';
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
        <Button as={Link} href="/#villas">See villas</Button>
        {/* Tours belong to the sister site, so this button leaves the site. */}
        <Button as="a" variant="ghost" href={CUE_LINK} target="_blank" rel="noopener">Bali tours</Button>
      </div>
    </div>
  );
}

// My Booking: the stay (paid in full), CUE extras from the price list (deposit now), villa services paid at the villa.
export default function MyBookingCart() {
  const { cart, ready, clearStay, toggleService, addExtra, removeExtra, updateExtra, clear } = useCart();
  const { currency, formatAmount, breakdown: convert } = useCurrency();
  const [sent, setSent] = useState(false);
  const catalog = useExtrasCatalog(currency, cart.stay?.guests || 2);

  // Draw nothing until the stored booking is read, or 'nothing here yet' flashes at guests who have one.
  if (!ready) return <div className="min-h-[40vh]" aria-busy="true" />;

  const stay = cart.stay;
  const breakdown = stay ? priceBreakdown(stay.villaSlug, stay.checkIn, stay.checkOut) : null;
  const villa = stay ? VILLAS[stay.villaSlug] : null;
  const nights = stay ? nightsBetween(stay.checkIn, stay.checkOut) : 0;
  const shown = convert(breakdown);
  const inRupiah = currency === 'IDR';
  const chosen = cart.services.map(serviceById).filter(Boolean);
  const extras = stay ? cart.extras : [];
  const totals = extrasTotals(extras, catalog);
  const blocked = extras.some((extra) => extraProblem(extra, stay, catalog?.items[extra.key]?.category || null)) || (extras.length > 0 && !totals);
  const isEmpty = !stay && chosen.length === 0;

  const message = bookingMessage({ stay, villa, nights, shown, breakdown, inRupiah, extras, totals, catalog, services: chosen, formatAmount });

  return (
    <Container className="py-10">
      <p className={EYEBROW_LINE}>My Booking</p>
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
                  <img src={villa.cardImg} alt="" width={72} height={72} className="w-[72px] h-[72px] object-cover shrink-0" />
                  <div className="flex-1 min-w-0">
                    <h2 className={ROW_H}>{villa.name}</h2>
                    <p className="mt-1 text-body text-muted">
                      {stay.checkIn || '-'} to {stay.checkOut || '-'} · {stay.guests} {stay.guests === 1 ? 'guest' : 'guests'}
                      {nights > 0 ? ` · ${nights} ${nights === 1 ? 'night' : 'nights'}` : ''}
                    </p>
                    <div className="flex flex-wrap items-center gap-4 mt-3">
                      <Link href={`/villas/${villa.slug}`} className="inline-flex items-center gap-1.5 text-body text-gold hover:text-cta">
                        Change dates <ArrowRight className={ICON} strokeWidth={1.6} aria-hidden="true" />
                      </Link>
                      <button type="button" className={ICON_BTN} onClick={clearStay}>
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
                Tours, activities and airport transfers are run by Cahyana Ubud Experience, our sister company, with prices from its price list.
              </p>
              <ExtrasSection
                stay={stay}
                extras={extras}
                services={cart.services}
                catalog={catalog}
                formatAmount={formatAmount}
                onToggleService={toggleService}
                addExtra={addExtra}
                removeExtra={removeExtra}
                updateExtra={updateExtra}
              />
            </div>
          </div>

          <div className={`${CARD} p-5 lg:sticky lg:top-[calc(var(--header-h,58px)+1.5rem)]`}>
            <h2 className={ROW_H}>Summary</h2>

            {breakdown && nights > 0 ? (
              <div className="mt-4 flex flex-col gap-2">
                <p className={LINE}>
                  <span className="text-muted">{nights} {nights === 1 ? 'night' : 'nights'} x {formatAmount(shown.nightly)}</span>
                  <span>{formatAmount(shown.subtotal)}</span>
                </p>
                <p className={`${LINE} pt-3 mt-1 border-t border-line`}>
                  <span className={LABEL}>Stay total, paid in full</span>
                  <span className="text-h2 font-bold text-amber">{formatAmount(shown.total)}</span>
                </p>
                {inRupiah ? null : <p className="text-label text-muted">Exact price {formatRupiah(breakdown.totalIdr)}; other currencies follow today's rate.</p>}
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
                    <p className={LINE}><span className="text-muted">{extras.length} {extras.length === 1 ? 'extra' : 'extras'}</span><span>{formatAmount(totals.total)}</span></p>
                    <p className={LINE}><span className="text-muted">Deposit now</span><span data-deposit>{formatAmount(totals.deposit)}</span></p>
                    <p className={LINE}><span className="text-muted">Rest on the day</span><span>{formatAmount(totals.rest)}</span></p>
                  </div>
                ) : (
                  <p className="mt-2 text-body text-muted">Prices are loading. If this stays, please try again in a moment.</p>
                )}
              </div>
            )}

            {chosen.length > 0 && (
              <div className="mt-5 pt-4 border-t border-line">
                <p className={LABEL}>At the villa</p>
                <ul className="list-none mt-2 flex flex-col gap-1.5">
                  {chosen.map((service) => (
                    <li key={service.id} className={LINE}>
                      <span className="text-muted">{service.label}</span>
                      <span className="text-muted">paid at the villa</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <Button
              as="a"
              full
              href={blocked ? undefined : whatsappLink(message)}
              aria-disabled={blocked || undefined}
              target="_blank"
              rel="noopener"
              onClick={(event) => { if (blocked) { event.preventDefault(); return; } setSent(true); }}
              className={`mt-6 ${blocked ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <MessageCircle className={ICON} strokeWidth={1.8} aria-hidden="true" />
              Send to WhatsApp
            </Button>
            {blocked && <p className="mt-3 text-label text-err text-center" role="status">Add a date and time for each extra first.</p>}
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
    </Container>
  );
}
