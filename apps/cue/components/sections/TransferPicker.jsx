'use client';
import { FIELD_LABEL } from '@/components/ui/formClasses';
import { BTN_SM } from '@/components/ui/btnClasses';

import { useMemo, useState } from 'react';
import { useTripPrefs } from '@/state/TripPrefsProvider';
import { usePricing } from '@/state/PricingProvider';
import { useItinerary } from '@/state/ItineraryProvider';
import { WHATSAPP_NUMBER } from '@/lib/constants';
import Select from '@/components/ui/Select';
import { CART_TOAST } from '@/components/ui/cartToastClasses';
import LiveRegion from '@/components/ui/LiveRegion';
import { withSymbol } from '@/components/Price';
import { useTransferRoute } from '@/components/sections/TransferRouteProvider';

const UBUD = 'Ubud';

export default function TransferPicker() {
  const { displayGuests, currency } = useTripPrefs();
  const pricing = usePricing();
  const { state, save } = useItinerary();
  const [toast, setToast] = useState('');

  const catalog = pricing && pricing.catalog;
  const areas = useMemo(() => {
    if (!catalog) return [];
    return catalog.transfers.map((t) => ({ route: t.route, area: t.route.replace(/\s*–\s*Ubud$/, '') }));
  }, [catalog]);

  // From/To live in TransferRouteProvider because the Popular routes cards set them too; isReturn stays local.
  const { from, to, pickFrom, pickTo, pickerRef } = useTransferRoute();
  const [isReturn, setIsReturn] = useState(false);

  // One side is always Ubud, so the other names the route; both Ubud or one empty means nothing to price.
  const area = from === UBUD ? to : to === UBUD ? from : '';
  const routeName = area && area !== UBUD ? `${area} – Ubud` : '';
  const entry = catalog && routeName ? catalog.transfers.find((t) => t.route === routeName) : null;

  const symbol = (catalog && catalog.symbol) || '$';
  const base = entry ? entry.display : null;
  const amount = base == null ? null : isReturn ? Math.round(base * 2 * 0.9) : base;
  const priceText = amount == null ? '—' : symbol + amount.toLocaleString(currency === 'IDR' ? 'id-ID' : 'en-US');

  const options = [{ value: UBUD, label: 'Ubud' }, ...areas.map((a) => ({ value: a.area, label: a.area }))];

  // Swap direction; with one side always Ubud the route and price stay the same.
  function swap() { pickFrom(to); pickTo(from); }

  // Add to the cart undated; Book Now then goes to My Trips, Save trip stays on the page.
  function addToTrip(goto) {
    if (!entry) return;
    save({
      ...state,
      // Store pickup/dropoff so the driver knows which way round; the route name alone is the same both ways.
      transfers: [...(state.transfers || []), { route: routeName, guests: displayGuests, return: isReturn, date: '', pickup: from, dropoff: to }],
    });
    if (goto) window.location.href = '/my-trips.html';
    else {
      setToast('Added to My Trips');
      setTimeout(() => setToast(''), 2600);
    }
  }

  // Picker button base; the return toggle uses the peer pattern (hidden input + peer-checked switch).
  const BTN = `flex ${BTN_SM} border border-gold cursor-pointer font-body disabled:opacity-50 disabled:cursor-not-allowed`;
  return (
    <div ref={pickerRef} className="bg-white border border-line rounded-xl pt-6 px-[1.4rem] pb-[1.6rem] text-left">
      {/* From | swap | To. HP (<=600): ditumpuk vertikal, panah muter 90deg. */}
      <div className="grid grid-cols-[1fr_auto_1fr] [align-items:end] gap-[0.55rem] [@media(max-width:600px)]:grid-cols-[1fr] [@media(max-width:600px)]:items-stretch [@media(max-width:600px)]:gap-2 [@media(max-width:600px)]:justify-items-stretch">
        <div>
          <label className={FIELD_LABEL} htmlFor="tp-from">From</label>
          <Select id="tp-from" label="From" value={from} onChange={pickFrom} options={options} placeholder="Select" />
        </div>
        {/* Swap button keeps mb-[0.15rem] at every width to line up with the selects. */}
        <button type="button" className="inline-flex items-center justify-center w-[var(--btn-h)] h-[var(--btn-h)] rounded-sm border border-line bg-white text-gold-d text-small leading-none mb-[0.15rem] cursor-pointer [@media(max-width:600px)]:justify-self-center [@media(max-width:600px)]:[transform:rotate(90deg)]" aria-label="Swap direction" onClick={swap}>&#8646;</button>
        <div>
          <label className={FIELD_LABEL} htmlFor="tp-to">To</label>
          <Select id="tp-to" label="To" value={to} onChange={pickTo} options={options} placeholder="Select" />
        </div>
      </div>

      {/* Price slot with a prompt before a route is picked; min-h matches the priced block so the form and photo don't jump. */}
      <div className="text-center mt-[1.2rem] mb-[0.1rem] min-h-[57px] flex flex-col justify-center">
        {routeName ? (
          <>
            <span className="font-body text-[2rem] text-amber font-semibold">{withSymbol(priceText)}</span>
            <span className="block text-muted text-small mt-[0.1rem]">{amount == null ? '' : 'per car'}</span>
          </>
        ) : (
          <span className="block font-body text-body leading-[var(--lh-body)] text-muted">
            Pick a route to see the price
          </span>
        )}
      </div>

      <label className="flex items-center justify-center gap-2 mt-[0.9rem] mb-[1.1rem] text-green text-small cursor-pointer">
        <input type="checkbox" className="peer absolute opacity-0 w-0 h-0" checked={isReturn} onChange={(e) => setIsReturn(e.target.checked)} />
        {/* Return switch stays pill-shaped on purpose (switches are round), unlike the 8px buttons. */}
        <span className="w-10 h-[23px] rounded-pill bg-line relative shrink-0 transition-[background] duration-200 peer-checked:bg-gold after:content-[''] after:absolute after:top-[3px] after:left-[3px] after:w-[17px] after:h-[17px] after:rounded-[50%] after:bg-white after:transition-[left] after:duration-200 peer-checked:after:left-[20px]" />
        <span>Add return trip <b className="text-gold-d">(save 10%)</b></span>
      </label>

      <div className="flex flex-col gap-[0.55rem]">
        <button type="button" className={`${BTN} bg-cta text-white hover:bg-cta-d`} onClick={() => addToTrip(true)} disabled={!entry}>Book now</button>
        <button type="button" className={`${BTN} bg-white text-green`} onClick={() => addToTrip(false)} disabled={!entry}>Save trip</button>
      </div>

      {/* Safety net only: shows if a picked route has no catalog price. */}
      <p className="text-center text-[0.8rem] text-muted mt-[0.8rem] [&_a]:text-gold-d" hidden={!routeName || !!entry}>
        No fixed price for this pair -{' '}
        <a href={`https://wa.me/${WHATSAPP_NUMBER}`} target="_blank" rel="noopener">ask us on WhatsApp</a>.
      </p>

      <LiveRegion>{toast}</LiveRegion>
      {toast && <div className={CART_TOAST} aria-hidden="true">{toast}</div>}
    </div>
  );
}
