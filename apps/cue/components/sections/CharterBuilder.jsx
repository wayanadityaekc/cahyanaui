'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { Car, ChevronLeft, ChevronRight, Clock, Route, UserRound } from 'lucide-react';
import { BTN_BOOK } from '@/components/ui/btnBookClasses';
import { GRID_PLANS } from '@/components/ui/gridClasses';
// The price box lives in its own module: the homepage's charter rates render the
// exact same block, and one copy is what keeps them from drifting.
import { PLAN_PRICE_BOX, PLAN_PRICE_KICK, PLAN_PRICE_BIG } from '@/components/ui/charterPlanClasses';
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

// Two points per card, on the listing card's meta shape: 11px icon, muted text.
const POINTS =
  'm-0 mt-[var(--space-1)] p-0 list-none flex flex-col gap-[3px] ' +
  '[&>li]:flex [&>li]:items-start [&>li]:gap-[6px] [&>li]:text-muted [&>li]:text-[0.66rem] [&>li]:leading-[1.45] ' +
  '[&_svg]:shrink-0 [&_svg]:mt-[2px] [&_svg]:w-[11px] [&_svg]:h-[11px] [&_svg]:text-muted';
const ARROW =
  'flex items-center justify-center w-[30px] h-[30px] rounded-[50%] bg-white cursor-pointer ' +
  '[border:1px_solid_var(--line)] text-gold [transition:opacity_var(--dur)_var(--ease),scale_var(--dur-fast)_var(--ease)] ' +
  'disabled:opacity-35 disabled:cursor-not-allowed min-[993px]:hidden';

export default function CharterBuilder() {
  const { currency, displayGuests, setGuests } = useTripPrefs();
  const pricing = usePricing();
  const { state, save } = useItinerary();

  const [area, setArea] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [guests, setLocalGuests] = useState('');
  const [extra, setExtra] = useState('1');

  // Which plan is on screen. With the cards a full 100% wide there is no peek to
  // hint at the others, so the arrows and the counter are the only thing saying
  // more plans exist - they have to track the real scroll position, including a
  // swipe the guest makes by hand.
  const track = useRef(null);
  const [idx, setIdx] = useState(0);
  const last = CHARTER.durations.length - 1;

  const syncIdx = useCallback(() => {
    const t = track.current;
    if (!t || !t.firstElementChild) return;
    const cards = [...t.children];
    const base = cards[0].offsetLeft;
    let near = 0;
    cards.forEach((c, i) => {
      if (Math.abs(c.offsetLeft - base - t.scrollLeft) < Math.abs(cards[near].offsetLeft - base - t.scrollLeft)) near = i;
    });
    setIdx(near);
  }, []);

  useEffect(() => {
    const t = track.current;
    if (!t) return undefined;
    t.addEventListener('scroll', syncIdx, { passive: true });
    return () => t.removeEventListener('scroll', syncIdx);
  }, [syncIdx]);

  const goTo = (i) => {
    const t = track.current;
    if (!t) return;
    const cards = [...t.children];
    const n = Math.max(0, Math.min(last, i));
    // Scroll the TRACK, never scrollIntoView: that would drag the page vertically
    // as well and throw the guest out of the form.
    t.scrollTo({ left: cards[n].offsetLeft - cards[0].offsetLeft, behavior: 'smooth' });
    setIdx(n);
  };

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

      {/* 2 - the plan. Heading and arrows share a row: the arrows are the only
          affordance on the phone now that no second card peeks in, and up here
          they sit right above what they move. */}
      <div className="mt-[var(--space-3)] mb-[var(--space-1)] flex items-center justify-between gap-[var(--space-1)]">
        <h3 className="m-0 text-h3 font-semibold text-gold">How long do you need the car?</h3>
        <div className="flex items-center gap-[var(--space-1)] min-[993px]:hidden">
          <span className="text-label text-muted whitespace-nowrap" aria-hidden="true">{idx + 1} / {last + 1}</span>
          <button type="button" className={ARROW} onClick={() => goTo(idx - 1)} disabled={idx === 0} aria-label="Previous option">
            <ChevronLeft strokeWidth={1.7} className="w-[var(--icon-sm)] h-[var(--icon-sm)]" aria-hidden="true" />
          </button>
          <button type="button" className={ARROW} onClick={() => goTo(idx + 1)} disabled={idx === last} aria-label="Next option">
            <ChevronRight strokeWidth={1.7} className="w-[var(--icon-sm)] h-[var(--icon-sm)]" aria-hidden="true" />
          </button>
        </div>
      </div>

      <div className={GRID_PLANS} ref={track} role="group" aria-label="Charter length">
        {CHARTER.durations.map((d) => {
          const v = tier(d.dur);
          return (
            <div className={CARD} key={d.dur}>
              {/* Top half is two columns: the plan on the left, its price boxed on
                  the right. Everything a guest compares sits on one line that way,
                  which is also what keeps the card short. */}
              <div className="flex items-start justify-between gap-[var(--space-2)]">
                <div className="min-w-0">
                  {/* Badge on its own line, not beside the title. Inline it pushed
                      "Full Day POPULAR" onto two lines at 320px and in the narrow
                      desktop columns - and it would do it again for any longer plan
                      name or currency. The nbsp keeps the three titles level. */}
                  <span className="block min-h-[0.95rem] text-label tracking-[0.1em] uppercase font-medium text-amber-d whitespace-nowrap">
                    {d.badge || '\u00a0'}
                  </span>
                  <span className="flex items-center gap-[6px]">
                    {/* The plan's own icon, beside the title rather than above it -
                        stacking them would add back the height this layout removes. */}
                    <Clock strokeWidth={1.7} className="w-[var(--icon-sm)] h-[var(--icon-sm)] shrink-0 text-gold" aria-hidden="true" />
                    <span className="text-h3 font-semibold text-gold whitespace-nowrap">{d.name}</span>
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
                </div>

                <span className={PLAN_PRICE_BOX}>
                  <span className={PLAN_PRICE_KICK}>
                    {area ? 'Total' : 'From'}
                  </span>
                  {/* No invented number while the catalog is still in flight: the
                      old card printed the word "from" with nothing after it. */}
                  <span className={PLAN_PRICE_BIG}>
                    {v == null ? '\u2014' : withSymbol(fmt(v))}
                  </span>
                </span>
              </div>

              {/* No label above this select, unlike the fields at the top. It is the
                  tallest thing in any card, and whatever it adds becomes empty space
                  above the button on the OTHER two - dropping the label halves that.
                  Its own value reads "+2 hours", so the control still says what it is.
                  The comment lives OUT here: inside the && parentheses it would be a
                  second child of a single-expression return and the build refuses it. */}
              {d.dur === 'extended' && (
                <div className="mt-[var(--space-1)]">
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

              {/* mt-auto keeps the button on the card's bottom edge, so all three
                  line up however much text sits above them. */}
              <button
                className={`${BTN_BOOK} mt-auto`}
                type="button"
                disabled={!ready || v == null}
                onClick={() => book(d.dur)}
              >
                Book this charter
              </button>
            </div>
          );
        })}
      </div>

      {!ready && (
        <p className="mt-[var(--space-1)] mb-0 text-small text-gold leading-[var(--lh-body)]">
          Pick your area, date, time and guests to book.
        </p>
      )}
    </div>
  );
}
