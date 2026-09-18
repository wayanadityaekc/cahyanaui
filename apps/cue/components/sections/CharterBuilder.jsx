'use client';

import { useState } from 'react';
import { BTN_BOOK } from '@/components/ui/btnBookClasses';
import { PRICE } from '@/components/ui/priceClasses';
import { GRID_PLANS } from '@/components/ui/gridClasses';
import { useTripPrefs } from '@/state/TripPrefsProvider';
import { usePricing } from '@/state/PricingProvider';
import { useItinerary } from '@/state/ItineraryProvider';
import { CHARTER } from '@/content/shared/charter';
import Select from '@/components/ui/Select';
import DateField from '@/components/ui/DateField';
import { withSymbol } from '@/components/Price';

const GUESTS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
const EXTRA_HOURS = [1, 2, 3, 4, 5, 6];

// Pick-up times, every half hour across the window a charter day realistically
// starts in. 24-hour clock, which is what the rest of the site's times use and
// what reads the same to every nationality that books here.
const TIMES = (() => {
  const out = [];
  for (let m = 6 * 60; m <= 17 * 60; m += 30) {
    out.push(`${String(Math.floor(m / 60)).padStart(2, '0')}:${String(m % 60).padStart(2, '0')}`);
  }
  return out;
})();

export default function CharterBuilder() {
  const { currency, displayGuests, setGuests } = useTripPrefs();
  const pricing = usePricing();
  const { state, save } = useItinerary();

  const [area, setArea] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [guests, setLocalGuests] = useState('');
  const [extra, setExtra] = useState('1');

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

  // Every card books, so the trip details have to be filled before ANY of them
  // is live - that is why the fields come first on the page and the cards after.
  const ready = !!(area && date && time && guests);

  // All booking flows go through the cart -> My Trips -> Make Payment (Wayan,
  // Sep 2026) - same as tours (BookSidebar/BookCta's `add(date, goto=true)`).
  const book = (d) => {
    if (!ready) return;
    save({
      ...state,
      charters: [...(state.charters || []), {
        date,
        time,
        guests,
        area,
        dur: d,
        extra: d === 'extended' ? extra : 0,
      }],
    });
    window.location.href = '/my-trips.html';
  };

  const areas = catalog ? ['Ubud', ...catalog.transfers.map((t) => t.route.replace(/\s*–\s*Ubud$/, ''))] : ['Ubud'];

  const FIELD_LABEL = 'block mb-[var(--space-1)] text-small font-medium text-green font-body tracking-normal';

  // One plan card. Self-contained on purpose: on a phone only one is on screen,
  // so it carries its own price and its own Book button rather than pointing at
  // a shared control further down the page.
  const CARD =
    'flex flex-col text-left p-[var(--space-2)] rounded-lg bg-white [border:1px_solid_var(--line)] ' +
    '[box-shadow:var(--shadow-sm)]';

  return (
    <div className="bg-white rounded-xl shadow-xl p-[var(--space-2)] text-left" id={CHARTER.boxId}>
      <h2 className="font-head text-h2 font-semibold text-gold text-center m-0 mb-[var(--space-2)]">{CHARTER.boxTitle}</h2>

      {/* 1 - the trip. Four fields, two per row, so the block reads as one unit
          instead of a numbered interrogation. */}
      <div className="grid grid-cols-2 gap-[var(--space-1)]">
        <div className="col-span-2">
          <label className={FIELD_LABEL} htmlFor="ch-pickup">Pick-up area</label>
          <Select
            id="ch-pickup"
            label="Pick-up area"
            value={area}
            onChange={setArea}
            options={areas.map((a) => ({ value: a, label: a }))}
            placeholder="Where should we collect you?"
          />
        </div>
        <div>
          <label className={FIELD_LABEL} htmlFor="ch-date">Date</label>
          <DateField id="ch-date" label="Date" value={date} onChange={setDate} />
        </div>
        <div>
          <label className={FIELD_LABEL} htmlFor="ch-time">Pick-up time</label>
          <Select
            id="ch-time"
            label="Pick-up time"
            value={time}
            onChange={setTime}
            options={TIMES.map((t) => ({ value: t, label: t }))}
            placeholder="Time"
          />
        </div>
        <div className="col-span-2">
          <label className={FIELD_LABEL} htmlFor="ch-guests">Guests</label>
          <Select
            id="ch-guests"
            label="Guests"
            value={guests}
            onChange={(v) => { setLocalGuests(v); setGuests(v); }}
            options={GUESTS.map((n) => ({ value: String(n), label: String(n) }))}
            placeholder="How many of you?"
          />
        </div>
      </div>
      <p className="mt-[var(--space-1)] text-small text-muted leading-[var(--lh-body)]" id="ch-pickup-hint">
        Pick-up outside Ubud adds a small surcharge, already counted in the prices below.
      </p>

      {/* 2 - the plan. Phone: one card at a time, swipe for the rest. Desktop:
          all three side by side (Wayan: "di desktop tampil biasa gak isi slider"). */}
      <h3 className="mt-[var(--space-3)] mb-[var(--space-1)] text-h3 font-semibold text-gold">How long do you need the car?</h3>
      <div className={GRID_PLANS} role="group" aria-label="Charter length">
        {CHARTER.durations.map((d) => {
          const v = tier(d.dur);
          return (
            <div className={CARD} key={d.dur}>
              {/* Badge sits INSIDE the card. Hung off the top edge it left the
                  three cards with a ragged top line, and in a scrolling track it
                  is the first thing `overflow` clips. */}
              <span className="min-h-[1rem] text-label tracking-[0.1em] uppercase font-medium text-amber-d">
                {d.badge || ' '}
              </span>
              <span className="mt-[var(--space-1)] text-h3 font-semibold text-gold">{d.name}</span>
              <span className="text-small text-muted leading-[var(--lh-body)]">{d.hours}</span>
              <p className="mt-[var(--space-1)] mb-0 text-small text-muted leading-[var(--lh-body)]">{d.note}</p>

              {d.dur === 'extended' && (
                <div className="mt-[var(--space-1)]">
                  <label className={FIELD_LABEL} htmlFor="ch-extra">Extra hours</label>
                  <Select
                    id="ch-extra"
                    label="Extra hours"
                    value={extra}
                    onChange={setExtra}
                    options={EXTRA_HOURS.map((n) => ({ value: String(n), label: `+${n} ${n === 1 ? 'hour' : 'hours'}` }))}
                    placeholder="Extra hours"
                  />
                </div>
              )}

              {/* mt-auto pins the price and button to the bottom, so all three
                  line up however much text sits above them. */}
              <div className="mt-auto pt-[var(--space-2)]">
                <span className="block text-label tracking-[0.1em] uppercase text-muted">
                  {area ? 'Total' : 'From'}
                </span>
                {/* No invented number while the catalog is still in flight: the
                    old card printed the word "from" with nothing after it. */}
                <span className={`${PRICE} text-[1.2rem] leading-[1.15]`}>
                  {v == null ? '—' : withSymbol(fmt(v))}
                </span>
                <button
                  className={`${BTN_BOOK} mt-[var(--space-1)]`}
                  type="button"
                  disabled={!ready || v == null}
                  onClick={() => book(d.dur)}
                >
                  Book this charter
                </button>
              </div>
            </div>
          );
        })}
      </div>

      <p className="mt-[var(--space-1)] mb-0 text-small text-muted leading-[var(--lh-body)]">
        {CHARTER.planTerms}
        {!ready && <span className="block text-gold">Pick your area, date, time and guests to book.</span>}
      </p>
    </div>
  );
}
