'use client';

import { useState } from 'react';
import { BTN_BOOK } from '@/components/ui/btnBookClasses';
// The plan row lives in its own module: the homepage's charter rates render the
// same shell, and one copy is what keeps them from drifting. The PRICE differs on
// purpose - boxed in the corner there, big under the name here.
import {
  PLAN_PRICE_KICK, PLAN_PRICE_LEAD,
  PLAN_ROW, PLAN_ROW_PICKED, PLAN_NAME, PLAN_SUB, PLAN_BADGE,
  PLAN_GRID, PLAN_CELL_NAME, PLAN_CELL_PRICE, PLAN_CELL_SUB,
} from '@/components/ui/charterPlanClasses';
import { useTripPrefs } from '@/state/TripPrefsProvider';
import { usePricing } from '@/state/PricingProvider';
import { useItinerary } from '@/state/ItineraryProvider';
import { CHARTER } from '@/content/shared/charter';
import Select from '@/components/ui/Select';
import DateField from '@/components/ui/DateField';
import InfoDot from '@/components/ui/InfoDot';
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

// The chosen plan is marked by a small tab straddling its top edge (Wayan, Sep
// 2026, picking option C from the indicator sheet). No circle, no control shape:
// it says the state in a word instead of borrowing the look of a radio button,
// and only one row carries it, so the list stays quiet.
//
// It sits OUTSIDE the row's box (-top), so the list needs headroom above it and a
// gap between rows wide enough for the tab to land in - see ROWS below.
const FLAG =
  'absolute -top-[9px] left-[14px] px-2 py-[2px] rounded-pill bg-cta text-white ' +
  'text-label tracking-[0.1em] uppercase font-semibold whitespace-nowrap';
// pt: room for the first row's tab under the heading. gap-3: the tab drops into
// the space between two rows instead of sitting on the row above.
const ROWS = 'flex flex-col gap-3 pt-[9px]';
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
          <div className={ROWS} role="radiogroup" aria-label="Charter length">
            {CHARTER.durations.map((d) => {
              const v = tier(d.dur);
              const on = d.dur === dur;
              return (
                <button
                  type="button"
                  key={d.dur}
                  role="radio"
                  aria-checked={on}
                  className={`${on ? PLAN_ROW_PICKED : PLAN_ROW} relative items-start min-[993px]:items-center ${ROW_BTN}`}
                  onClick={() => setDur(d.dur)}
                >
                  {on && <span className={FLAG} data-plan-flag>Selected</span>}
                  {/* One DOM order, two arrangements (Wayan, Sep 2026: "di desktop
                      jelek bro, harga bagusnya di kanan card"). On a phone the three
                      blocks stack in source order - name, price, sub - which is the
                      card option he picked. From 993px the grid puts the price in a
                      second column spanning both rows, so it sits right-aligned
                      against the name and the sub line, where a wide row has the
                      space for it. A grid rather than reordered flex children: it
                      moves the price without splitting the name from its sub line. */}
                  <span className={PLAN_GRID} data-plan-grid>
                    {/* flex-wrap, and the name itself never wraps. At 320px in rupiah
                        "Full Day POPULAR" broke the NAME across two lines - measured,
                        the same bug the old cards had with an inline badge. */}
                    <span className={`${PLAN_CELL_NAME} flex flex-wrap items-center gap-x-[6px]`}>
                      <span className={`${PLAN_NAME} whitespace-nowrap`}>{d.name}</span>
                      {d.badge && <span className={PLAN_BADGE}>{d.badge}</span>}
                    </span>
                    <span className={PLAN_CELL_PRICE}>
                      <span className={`${PLAN_PRICE_KICK} block mt-[2px] min-[993px]:mt-0`}>{area ? 'Total' : 'From'}</span>
                      {/* No invented number while the catalog is still in flight: the
                          old card printed the word "from" with nothing after it. */}
                      <span className={PLAN_PRICE_LEAD}>{v == null ? '\u2014' : withSymbol(fmt(v))}</span>
                    </span>
                    <span className={`${PLAN_CELL_SUB} ${PLAN_SUB} mt-[2px] min-[993px]:mt-0`}>{d.sub}</span>
                  </span>

                </button>
              );
            })}
          </div>
        </div>

        {/* 2 - the trip, then the one Book button. */}
        <div>
          <div className="flex items-center gap-[var(--space-1)] mb-[var(--space-1)]">
            <h3 className="m-0 text-h3 font-semibold text-gold">Your trip</h3>
            {/* The surcharge note used to be two lines of grey text sitting under the
                fields. It is an answer to a question, not something every guest needs
                to read, so it lives behind this dot now. */}
            <InfoDot label="About charter prices">
              Pick-up outside Ubud adds a small surcharge. It is already counted in the prices shown.
            </InfoDot>
          </div>
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
