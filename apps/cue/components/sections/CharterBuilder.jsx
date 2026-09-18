'use client';

import { useState } from 'react';
import { Car, Clock, Route, UserRound } from 'lucide-react';
import { BTN_BOOK } from '@/components/ui/btnBookClasses';
// The price box and the plan row live in their own module: the homepage's charter
// rates render the exact same blocks, and one copy is what keeps them from drifting.
import {
  PLAN_PRICE_BOX, PLAN_PRICE_KICK, PLAN_PRICE_BIG,
  PLAN_ROW, PLAN_ROW_ON, PLAN_NAME,
} from '@/components/ui/charterPlanClasses';
import { useTripPrefs } from '@/state/TripPrefsProvider';
import { usePricing } from '@/state/PricingProvider';
import { useItinerary } from '@/state/ItineraryProvider';
import { CHARTER } from '@/content/shared/charter';
import Select from '@/components/ui/Select';
import DateField from '@/components/ui/DateField';
import { withSymbol } from '@/components/Price';

const GUESTS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
const EXTRA_HOURS = [1, 2, 3, 4, 5, 6];
const ICONS = { clock: Clock, route: Route, car: Car, users: UserRound };

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

// Icon points inside a plan row, on the listing card's meta shape: 11px icon,
// muted text.
const POINTS =
  'm-0 mt-[3px] p-0 list-none flex flex-col gap-[2px] ' +
  '[&>li]:flex [&>li]:items-start [&>li]:gap-[6px] [&>li]:text-muted [&>li]:text-[0.66rem] [&>li]:leading-[1.45] ' +
  '[&_svg]:shrink-0 [&_svg]:mt-[2px] [&_svg]:w-[11px] [&_svg]:h-[11px] [&_svg]:text-muted';
// The rows are buttons now, so they need what a button does not inherit: full
// width, left-aligned text, a pointer, and a transition that names `scale` so the
// site-wide press feedback stays smooth instead of snapping.
const ROW_BTN =
  'w-full text-left cursor-pointer ' +
  '[transition:border-color_var(--dur)_var(--ease),box-shadow_var(--dur)_var(--ease),scale_var(--dur-fast)_var(--ease)]';
const FIELD_LABEL = 'block mb-[var(--space-1)] text-small font-medium text-green font-body tracking-normal';

export default function CharterBuilder() {
  const { currency, setGuests } = useTripPrefs();
  const pricing = usePricing();
  const { state, save } = useItinerary();

  const [area, setArea] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [guests, setLocalGuests] = useState('');
  const [extra, setExtra] = useState('1');
  // The plan is picked in the list and booked by the ONE button under the fields
  // (Wayan, Sep 2026: "button cuma satu di bawah input yaitu book"). That brings
  // back a selected-duration state, which an earlier pass had removed when every
  // card carried its own Book button - deliberate, not a regression.
  const [dur, setDur] = useState(CHARTER.durations[0].dur);

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

  const ready = !!(area && date && time && guests);
  const selected = CHARTER.durations.find((d) => d.dur === dur) || CHARTER.durations[0];
  const total = tier(dur);

  // All booking flows go through the cart -> My Trips -> Make Payment (Wayan,
  // Sep 2026) - same as tours (BookSidebar/BookCta's `add(date, goto=true)`).
  const book = () => {
    if (!ready || total == null) return;
    save({
      ...state,
      charters: [...(state.charters || []), {
        date,
        time,
        guests,
        area,
        dur,
        extra: dur === 'extended' ? extra : 0,
      }],
    });
    window.location.href = '/my-trips.html';
  };

  const areas = catalog ? ['Ubud', ...catalog.transfers.map((t) => t.route.replace(/\s*–\s*Ubud$/, ''))] : ['Ubud'];

  return (
    <div className="bg-white rounded-xl shadow-xl p-[var(--space-2)] text-left" id={CHARTER.boxId}>
      <h2 className="font-head text-h2 font-semibold text-gold text-center m-0 mb-[var(--space-2)]">{CHARTER.boxTitle}</h2>

      {/* Two columns from 993px: the plans on the left, the trip on the right
          (Wayan, Sep 2026: "di desktop jadiin 2 kolom, di kiri list charternya di
          kanan kolom inputnya"). On a phone they stack in DOM order, which is the
          order he asked for - the list first, the fields after it.
          993px, not 769: it has to change at the same width as the panel itself
          (CHARTER_HERO_INNER_WIDE), or the two columns land inside a 600px box. */}
      <div className="flex flex-col gap-[var(--space-2)] min-[993px]:grid min-[993px]:grid-cols-[1fr_340px] min-[993px]:gap-[var(--space-3)] min-[993px]:items-start">

        {/* 1 - the plan. A list you pick from, not cards that each book. */}
        <div>
          <h3 className="m-0 mb-[var(--space-1)] text-h3 font-semibold text-gold">How long do you need the car?</h3>
          <div className="flex flex-col gap-2" role="radiogroup" aria-label="Charter length">
            {CHARTER.durations.map((d) => {
              const v = tier(d.dur);
              const on = d.dur === dur;
              return (
                <button
                  type="button"
                  key={d.dur}
                  role="radio"
                  aria-checked={on}
                  className={`${on ? PLAN_ROW_ON : PLAN_ROW} ${ROW_BTN}`}
                  onClick={() => setDur(d.dur)}
                >
                  <span className="flex-1 min-w-0">
                    {/* flex-wrap, and the name itself never wraps. At 320px in rupiah
                        the price box leaves so little room that "Full Day POPULAR" broke
                        the NAME across two lines - measured, it is the same bug the old
                        cards had. Wrapping drops the word onto its own line there and
                        keeps it beside the name everywhere else. */}
                    <span className="flex flex-wrap items-center gap-x-[6px]">
                      <Clock strokeWidth={1.7} className="w-[var(--icon-sm)] h-[var(--icon-sm)] shrink-0 text-gold" aria-hidden="true" />
                      <span className={`${PLAN_NAME} whitespace-nowrap`}>{d.name}</span>
                      {d.badge && (
                        <span className="text-label tracking-[0.1em] uppercase font-medium text-amber-d whitespace-nowrap">{d.badge}</span>
                      )}
                    </span>
                    <ul className={POINTS}>
                      {d.points.map((pt) => {
                        const Icon = ICONS[pt.icon] || Clock;
                        return (
                          <li key={pt.text}>
                            <Icon strokeWidth={1.7} aria-hidden="true" />
                            {pt.text}
                          </li>
                        );
                      })}
                    </ul>
                  </span>

                  <span className={PLAN_PRICE_BOX}>
                    <span className={PLAN_PRICE_KICK}>{area ? 'Total' : 'From'}</span>
                    {/* No invented number while the catalog is still in flight: the
                        old card printed the word "from" with nothing after it. */}
                    <span className={PLAN_PRICE_BIG}>{v == null ? '—' : withSymbol(fmt(v))}</span>
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* 2 - the trip, then the one Book button. */}
        <div>
          <h3 className="m-0 mb-[var(--space-1)] text-h3 font-semibold text-gold">Your trip</h3>
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
            {/* Extra hours is a field, so it sits with the fields - and only for the
                plan that has them. It gets its label back here: the reason it lost
                one was card-height equalising, which this layout no longer does. */}
            {dur === 'extended' && (
              <div className="col-span-2">
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
          </div>

          <p className="mt-[var(--space-1)] text-small text-muted leading-[var(--lh-body)]" id="ch-pickup-hint">
            Pick-up outside Ubud adds a small surcharge, already counted in the prices.
          </p>

          {/* Which plan the button books, restated where the button is. On a phone
              the list is above the fields, so by the time a guest reaches Book the
              row they picked can be off screen. */}
          <div className="mt-[var(--space-2)] flex items-baseline justify-between gap-[var(--space-1)] [border-top:1px_solid_var(--line)] pt-[var(--space-1)]">
            <span className="text-small text-muted">{selected.name}{dur === 'extended' ? ` +${extra}h` : ''}</span>
            <span className="text-gold font-semibold text-[1.05rem] whitespace-nowrap">
              {total == null ? '—' : withSymbol(fmt(total))}
            </span>
          </div>

          <button
            className={BTN_BOOK}
            type="button"
            disabled={!ready || total == null}
            onClick={book}
          >
            Book this charter
          </button>

          {!ready && (
            <p className="mt-[var(--space-1)] mb-0 text-small text-gold leading-[var(--lh-body)]">
              Pick your area, date, time and guests to book.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
