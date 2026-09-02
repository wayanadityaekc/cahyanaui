'use client';

import { useState } from 'react';
import { useTripPrefs } from '@/state/TripPrefsProvider';
import { usePricing } from '@/state/PricingProvider';
import { useBooking } from '@/state/BookingProvider';
import { CHARTER } from '@/content/shared/charter';

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

  return (
    <div className="charter__box" id={CHARTER.boxId}>
      <h2 className="charter__box-title">{CHARTER.boxTitle}</h2>

      <div className="charter__step">
        <label className="charter__label" htmlFor="ch-pickup">1. Pick-up area</label>
        <select className="charter__select" id="ch-pickup" value={area} onChange={(e) => setArea(e.target.value)}>
          <option value="" disabled>Select your pick-up area</option>
          {areas.map((a) => <option key={a} value={a}>{a}</option>)}
        </select>
        <p className="charter__hint" id="ch-pickup-hint">Pick-up outside Ubud adds a small surcharge.</p>
      </div>

      <div className="charter__step">
        <label className="charter__label">2. How long do you need the car?</label>
        <div className="charter__durations" id="ch-durations">
          {CHARTER.durations.map((d) => {
            const v = tier(d.dur);
            return (
              <button
                key={d.dur}
                className={`chdur${dur === d.dur ? ' is-on' : ''}`}
                type="button"
                disabled={!catalog}
                onClick={() => setDur(d.dur)}
              >
                {d.badge && <span className="chdur__badge">{d.badge}</span>}
                <span className="chdur__name">{d.name}</span>
                <span className="chdur__sub">{d.sub}</span>
                <span className="chdur__price">
                  <span className="chdur__from">{d.from}</span>
                  <span className="price">{v == null ? '' : fmt(v)}</span>
                </span>
              </button>
            );
          })}
        </div>
        <div className="charter__extra" id="ch-extra-wrap" hidden={dur !== 'extended'}>
          <label className="charter__label" htmlFor="ch-extra">Extra hours after 10</label>
          <input type="number" className="charter__select" id="ch-extra" min="1" max="6" value={extra} onChange={(e) => setExtra(e.target.value)} />
        </div>
      </div>

      <div className="charter__step charter__fields">
        <div className="field">
          <label className="charter__label" htmlFor="ch-date">Date</label>
          <input type="date" className="charter__select" id="ch-date" value={date} onChange={(e) => setDate(e.target.value)} />
        </div>
        <div className="field">
          <label className="charter__label" htmlFor="ch-guests">Guests</label>
          <select
            className="charter__select"
            id="ch-guests"
            value={guests}
            onChange={(e) => {
              setLocalGuests(e.target.value);
              setGuests(e.target.value);
            }}
          >
            <option value="" disabled>Guests</option>
            {GUESTS.map((n) => <option key={n} value={n}>{n}</option>)}
          </select>
        </div>
      </div>

      <div className="charter__total">
        <span>Total</span>
        <span className="amount" id="ch-total">
          <span className="price-cur">{total == null ? '-' : fmt(total)}</span>
        </span>
      </div>

      <button className="btn-book" id="ch-book" disabled={!ready} onClick={book}>Book This Charter</button>
    </div>
  );
}
