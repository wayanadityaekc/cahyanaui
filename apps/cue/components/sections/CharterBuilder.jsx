'use client';

import { useState } from 'react';
import { BTN_BOOK } from '@/components/ui/btnBookClasses';
import { PRICE } from '@/components/ui/priceClasses';
import { useTripPrefs } from '@/state/TripPrefsProvider';
import { usePricing } from '@/state/PricingProvider';
import { useBooking } from '@/state/BookingProvider';
import { CHARTER } from '@/content/shared/charter';
import Select from '@/components/ui/Select';
import DateField from '@/components/ui/DateField';
import { FIELD_INPUT } from '@/components/ui/formClasses';
import { withSymbol } from '@/components/Price';

const GUESTS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

export default function CharterBuilder() {
  const { currency, displayGuests, setGuests } = useTripPrefs();
  const pricing = usePricing();
  const { openBooking } = useBooking();

  const [area, setArea] = useState('');
  const [dur, setDur] = useState('');
  const [extra, setExtra] = useState(1);
  const [date, setDate] = useState('');
  const [guests, setLocalGuests] = useState('');

  const catalog = pricing && pricing.catalog;
  const symbol = (catalog && catalog.symbol) || '$';
  const isIdr = currency === 'IDR';
  const fmt = (n) => symbol + n.toLocaleString(isIdr ? 'id-ID' : 'en-US');

  const tier = (d) => {
    if (!catalog) return null;
    const base = catalog.charters.find((c) => c.duration === (d === 'extended' ? 'full' : d));
    if (!base) return null;
    const hours = d === 'extended' ? Math.max(1, parseInt(extra, 10) || 1) : 0;
    const per = catalog.charterExtraHour || { usd: 0, idr: 0 };
    const value = isIdr ? base.idr + hours * per.idr : base.display + hours * per.usd;
    const surcharge = area && area !== 'Ubud' ? (isIdr ? 100000 : 7) : 0;
    return value + surcharge;
  };

  const total = dur ? tier(dur) : null;
  const ready = !!(area && dur && date && guests);

  const book = () => {
    if (!ready) return;
    openBooking({
      type: 'charter',
      service: `Charter - ${dur === 'half' ? 'Half Day' : dur === 'full' ? 'Full Day' : 'Extended'}`,
      guests: String(guests),
      date,
      pickupOptional: false,
      dropoffRequired: false,
      lines: [{ type: 'charter', service: 'Charter', guests, date, area, duration: dur === 'extended' ? 'extended' : dur, extra: dur === 'extended' ? extra : 0 }],
    });
  };

  const areas = catalog ? ['Ubud', ...catalog.transfers.map((t) => t.route.replace(/\s*–\s*Ubud$/, ''))] : ['Ubud'];

  // Tailwind-native (full-portable): .charter__*/.chdur* -> utilities; field input
  // pakai FIELD_INPUT shared (formClasses.js). Kept sbg shared primitive: `.price`/
  // `.price-cur` (harga), `.btn-book` (tombol), Select/DateField. NOTE: kartu durasi kepilih dulu
  // dikasih class `is-on` tapi CSS-nya `.chdur.active` -> highlight-nya gak pernah
  // muncul (bug). Di sini di-benerin: state terpilih dapet border gold + shadow +
  // angkat (sesuai maksud .chdur.active). Cuma keliatan pas diklik (bukan di sweep).
  const LABEL = 'block mb-2 text-small font-medium text-green font-body tracking-normal';
  // Date/Guests labels dulu di dalam .field -> `.field label` (mb 0.4rem) menang atas
  // `.charter__label` (0.5rem). Field-nya sekarang div polos, jadi pakai mb-[0.4rem].
  const FIELD_LABEL = 'block mb-[0.4rem] text-small font-medium text-green font-body tracking-normal';
  const chdur = (isOn) =>
    `relative flex flex-col items-center gap-[0.15rem] pt-[1.15rem] px-[0.6rem] pb-[1.1rem] border-[1.5px] border-solid rounded-lg bg-white text-center cursor-pointer transition-[border-color,box-shadow,transform,opacity,scale] duration-200 ease-[ease] disabled:opacity-50 disabled:cursor-not-allowed ${isOn ? 'border-gold shadow-md [transform:translateY(-2px)]' : 'border-line enabled:hover:border-gold'}`;
  return (
    <div className="bg-white rounded-xl shadow-xl pt-6 px-[1.4rem] pb-[1.6rem] text-left" id={CHARTER.boxId}>
      <h2 className="font-head text-[1.15rem] text-green text-center mt-0 mb-[1.1rem]">{CHARTER.boxTitle}</h2>

      <div className="mb-[1.3rem]">
        <label className={LABEL} htmlFor="ch-pickup">1. Pick-up area</label>
        <Select
          id="ch-pickup"
          label="Pick-up area"
          value={area}
          onChange={setArea}
          options={areas.map((a) => ({ value: a, label: a }))}
          placeholder="Select your pick-up area"
        />
        <p className="mt-[0.4rem] text-small text-muted" id="ch-pickup-hint">Pick-up outside Ubud adds a small surcharge.</p>
      </div>

      <div className="mb-[1.3rem]">
        <label className={LABEL}>2. How long do you need the car?</label>
        <div className="grid grid-cols-[repeat(3,1fr)] gap-[0.7rem]" id="ch-durations">
          {CHARTER.durations.map((d) => {
            const v = tier(d.dur);
            return (
              <button
                key={d.dur}
                className={chdur(dur === d.dur)}
                type="button"
                disabled={!catalog}
                onClick={() => setDur(d.dur)}
              >
                {d.badge && <span className="absolute top-[-0.6rem] left-1/2 [transform:translateX(-50%)] text-label tracking-[0.14em] uppercase font-medium text-white bg-amber rounded-pill py-[0.2rem] px-[0.6rem] whitespace-nowrap">{d.badge}</span>}
                <span className="font-body font-semibold text-[1.15rem] text-green">{d.name}</span>
                <span className="text-small text-muted mb-2">{d.sub}</span>
                <span className="font-semibold text-amber text-[1.2rem]">
                  <span className="text-label font-normal text-muted">{d.from}</span>
                  <span className={PRICE}>{v == null ? '' : withSymbol(fmt(v))}</span>
                </span>
              </button>
            );
          })}
        </div>
        <div className="mt-4" id="ch-extra-wrap" hidden={dur !== 'extended'}>
          <label className={LABEL} htmlFor="ch-extra">Extra hours after 10</label>
          <input type="number" className={FIELD_INPUT} id="ch-extra" min="1" max="6" value={extra} onChange={(e) => setExtra(e.target.value)} />
        </div>
      </div>

      <div className="mb-[1.3rem] grid grid-cols-[1fr_1fr] gap-4">
        <div>
          <label className={FIELD_LABEL} htmlFor="ch-date">Date</label>
          <DateField id="ch-date" label="Date" value={date} onChange={setDate} />
        </div>
        <div>
          <label className={FIELD_LABEL} htmlFor="ch-guests">Guests</label>
          <Select
            id="ch-guests"
            label="Guests"
            value={guests}
            onChange={(v) => {
              setLocalGuests(v);
              setGuests(v);
            }}
            options={GUESTS.map((n) => ({ value: String(n), label: String(n) }))}
            placeholder="Guests"
          />
        </div>
      </div>

      <div className="flex items-baseline justify-between border-t border-line pt-4 mt-5 mb-4 text-strong font-semibold">
        <span>Total</span>
        <span id="ch-total">
          <span className={PRICE}>{total == null ? '-' : withSymbol(fmt(total))}</span>
        </span>
      </div>

      <button className={BTN_BOOK} id="ch-book" disabled={!ready} onClick={book}>Book This Charter</button>
    </div>
  );
}
