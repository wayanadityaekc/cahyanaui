'use client';

import { useMemo, useState } from 'react';
import { useTripPrefs } from '@/state/TripPrefsProvider';
import { usePricing } from '@/state/PricingProvider';
import { useBooking } from '@/state/BookingProvider';
import { WHATSAPP_NUMBER } from '@/lib/constants';

const UBUD = 'Ubud';

export default function TransferPicker() {
  const { displayGuests, currency } = useTripPrefs();
  const pricing = usePricing();
  const { openBooking } = useBooking();

  const catalog = pricing && pricing.catalog;
  const areas = useMemo(() => {
    if (!catalog) return [];
    return catalog.transfers.map((t) => ({ route: t.route, area: t.route.replace(/\s*–\s*Ubud$/, '') }));
  }, [catalog]);

  const [from, setFrom] = useState('');
  const [to, setTo] = useState(UBUD);
  const [isReturn, setIsReturn] = useState(false);

  const routeName = from && to === UBUD ? `${from} – Ubud` : to && from === UBUD ? `${to} – Ubud` : '';
  const entry = catalog && routeName ? catalog.transfers.find((t) => t.route === routeName) : null;

  const symbol = (catalog && catalog.symbol) || '$';
  const base = entry ? entry.display : null;
  const amount = base == null ? null : isReturn ? Math.round(base * 2 * 0.9) : base;
  const priceText = amount == null ? '—' : symbol + amount.toLocaleString(currency === 'IDR' ? 'id-ID' : 'en-US');

  const options = [{ value: UBUD, label: 'Ubud' }, ...areas.map((a) => ({ value: a.area, label: a.area }))];

  const swap = () => {
    setFrom(to === UBUD ? UBUD : to);
    setTo(from === UBUD ? UBUD : from);
  };

  const book = () => {
    if (!entry) return;
    openBooking({
      type: 'transfer',
      service: routeName,
      guests: String(displayGuests),
      date: '',
      pickupOptional: false,
      dropoffRequired: true,
      lines: [{ type: 'transfer', service: routeName, guests: displayGuests, return: isReturn }],
    });
  };

  return (
    <div className="tpick">
      <div className="tpick__route">
        <div className="tpick__field">
          <label htmlFor="tp-from">From</label>
          <select id="tp-from" className="tpick__select" value={from} onChange={(e) => setFrom(e.target.value)}>
            <option value="" disabled>Select</option>
            {options.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
        </div>
        <button type="button" className="tpick__swap" aria-label="Swap direction" onClick={swap}>&#8646;</button>
        <div className="tpick__field">
          <label htmlFor="tp-to">To</label>
          <select id="tp-to" className="tpick__select" value={to} onChange={(e) => setTo(e.target.value)}>
            {options.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
        </div>
      </div>

      <div className="tpick__price">
        <span className="tpick__amt">{priceText}</span>
        <span className="tpick__unit">{amount == null ? '' : 'per car'}</span>
      </div>

      <label className="tpick__return">
        <input type="checkbox" checked={isReturn} onChange={(e) => setIsReturn(e.target.checked)} />
        <span className="tpick__switch" />
        <span className="tpick__return-label">Add return trip <b>(save 10%)</b></span>
      </label>

      <div className="tpick__actions">
        <button type="button" className="tpick__btn tpick__btn--book" onClick={book} disabled={!entry}>Book Now</button>
        <button type="button" className="tpick__btn tpick__btn--add" disabled={!entry}>Add to My Trip</button>
      </div>

      <p className="tpick__na" hidden={!from || !!entry}>
        No fixed price for this pair -{' '}
        <a href={`https://wa.me/${WHATSAPP_NUMBER}`} target="_blank" rel="noopener">ask us on WhatsApp</a>.
      </p>
    </div>
  );
}
