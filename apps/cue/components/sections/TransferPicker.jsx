'use client';

import { useMemo, useState } from 'react';
import { useTripPrefs } from '@/state/TripPrefsProvider';
import { usePricing } from '@/state/PricingProvider';
import { useBooking } from '@/state/BookingProvider';
import { WHATSAPP_NUMBER } from '@/lib/constants';
import Select from '@/components/ui/Select';

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

  // Tailwind-native (migrasi Fase 2): .tpick* -> utilities. Toggle return pakai
  // pola `peer` (input hidden = peer, switch pakai peer-checked:). Select tetep
  // komponen shared. `.tpick__field` gak punya CSS sendiri (cuma wrapper).
  const LABEL = 'block text-small uppercase tracking-[0.14em] text-muted mb-[0.3rem] font-medium';
  const BTN = 'py-[0.8rem] rounded-pill font-semibold text-[1rem] text-center border border-gold cursor-pointer font-body disabled:opacity-50 disabled:cursor-not-allowed';
  return (
    <div className="bg-white border border-line rounded-xl shadow-xl pt-6 px-[1.4rem] pb-[1.6rem] text-left">
      {/* .tpick__route + .tpick__swap dibiarin sbg class (grid + swap punya interplay
          @media 600 yg sub-pixel; utility-nya beda ~2px di HP - hook kecil ini aman). */}
      <div className="tpick__route">
        <div>
          <label className={LABEL} htmlFor="tp-from">From</label>
          <Select id="tp-from" label="From" value={from} onChange={setFrom} options={options} placeholder="Select" />
        </div>
        <button type="button" className="tpick__swap" aria-label="Swap direction" onClick={swap}>&#8646;</button>
        <div>
          <label className={LABEL} htmlFor="tp-to">To</label>
          <Select id="tp-to" label="To" value={to} onChange={setTo} options={options} />
        </div>
      </div>

      <div className="text-center mt-[1.2rem] mb-[0.1rem]">
        <span className="font-body text-[2rem] text-amber font-semibold">{priceText}</span>
        <span className="block text-muted text-small mt-[0.1rem]">{amount == null ? '' : 'per car'}</span>
      </div>

      <label className="flex items-center justify-center gap-2 mt-[0.9rem] mb-[1.1rem] text-green text-small cursor-pointer">
        <input type="checkbox" className="peer absolute opacity-0 w-0 h-0" checked={isReturn} onChange={(e) => setIsReturn(e.target.checked)} />
        <span className="w-10 h-[23px] rounded-pill bg-line relative shrink-0 transition-[background] duration-200 peer-checked:bg-gold after:content-[''] after:absolute after:top-[3px] after:left-[3px] after:w-[17px] after:h-[17px] after:rounded-[50%] after:bg-white after:transition-[left] after:duration-200 peer-checked:after:left-[20px]" />
        <span>Add return trip <b className="text-gold-d">(save 10%)</b></span>
      </label>

      <div className="flex flex-col gap-[0.55rem]">
        <button type="button" className={`${BTN} bg-cta text-white hover:bg-cta-d`} onClick={book} disabled={!entry}>Book Now</button>
        <button type="button" className={`${BTN} bg-white text-green`} disabled={!entry}>Add to My Trip</button>
      </div>

      <p className="text-center text-[0.8rem] text-muted mt-[0.8rem] [&_a]:text-gold-d" hidden={!from || !!entry}>
        No fixed price for this pair -{' '}
        <a href={`https://wa.me/${WHATSAPP_NUMBER}`} target="_blank" rel="noopener">ask us on WhatsApp</a>.
      </p>
    </div>
  );
}
