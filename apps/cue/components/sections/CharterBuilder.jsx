'use client';
import { fmtTime } from '@/content/shared/timeSlots';
import { FIELD_LABEL } from '@/components/ui/formClasses';

import { useEffect, useState } from 'react';
import { BTN_BOOK } from '@/components/ui/btnBookClasses';
// Plan list shared with the homepage charter section; this page adds the trip fields.
import CharterPlans, { useCharterTier } from '@/components/sections/CharterPlans';
import { readCharterDraft, saveCharterDraft } from '@/lib/charterDraft';
import { useTripPrefs } from '@/state/TripPrefsProvider';
// Still needed here for the pick-up area list, which comes from the transfers.
import { usePricing } from '@/state/PricingProvider';
import { useItinerary } from '@/state/ItineraryProvider';
import { CHARTER } from '@/content/shared/charter';
import Select from '@/components/ui/Select';
import DateField from '@/components/ui/DateField';
import InfoDot from '@/components/ui/InfoDot';
import { withSymbol } from '@/components/Price';

const GUESTS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

// Pick-up times 06:00-17:00 every 30 min; values stay 24-hour, labels are shown 12-hour via fmtTime.
const TIMES = (() => {
  const out = [];
  // 06:00 to 17:00, every 30 minutes
  [...Array(23).keys()].map((k) => 6 * 60 + k * 30).forEach((m) => {
    out.push(`${String(Math.floor(m / 60)).padStart(2, '0')}:${String(m % 60).padStart(2, '0')}`);
  });
  return out;
})();


export default function CharterBuilder() {
  const { setGuests } = useTripPrefs();
  const { state, save } = useItinerary();

  const [area, setArea] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [guests, setLocalGuests] = useState('');
  // Selected plan, booked by the single Book button under the fields.
  const [dur, setDur] = useState(CHARTER.durations[0].dur);

  // Seed the plan from the homepage draft; in an effect, not initial state, or hydration breaks.
  useEffect(() => {
    const d = readCharterDraft();
    if (!d) return;
    if (CHARTER.durations.some((x) => x.dur === d.dur)) setDur(d.dur);
  }, []);

  function pick(d) { setDur(d); saveCharterDraft({ dur: d }); }

  const { tier, fmt } = useCharterTier({ area });
  const catalog = usePricing()?.catalog;

  const ready = !!(area && date && time && guests);
  const selected = CHARTER.durations.find((d) => d.dur === dur) || CHARTER.durations[0];
  const total = tier(dur);

  // Adds a charters row to the cart and goes to My Trips, like every booking flow.
  function book() {
    if (!ready || total == null) return;
    save({
      ...state,
      charters: [...(state.charters || []), {
        date,
        time,
        guests,
        area,
        dur,
      }],
    });
    window.location.href = '/my-trips.html';
  }

  const areas = catalog ? ['Ubud', ...catalog.transfers.map((t) => t.route.replace(/\s*–\s*Ubud$/, ''))] : ['Ubud'];

  return (
    <div className="bg-white rounded-xl p-[var(--space-2)] text-left" id={CHARTER.boxId}>
      <h2 className="font-head text-h2 font-semibold text-gold text-center m-0 mb-[var(--space-2)]">{CHARTER.boxTitle}</h2>

      {/* Plans left, fields right from 993px (not 769: too narrow for a 340px field column); stacked on phones. */}
      <div className="flex flex-col gap-[var(--space-2)] min-[993px]:grid min-[993px]:grid-cols-[1fr_340px] min-[993px]:gap-[var(--space-3)] min-[993px]:items-start">

        {/* 1 - the plan list (same as the homepage); it drives the Book button below. */}
        <CharterPlans value={dur} onChange={pick} area={area} heading="How long do you need the car?" />

        {/* 2 - the trip, then the one Book button. */}
        <div>
          <div className="flex items-center gap-[var(--space-1)] mb-[var(--space-1)]">
            <h3 className="m-0 text-h3 font-semibold text-gold">Your trip</h3>
            {/* Surcharge note lives behind the info dot instead of under the fields. */}
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
                options={TIMES.map((t) => ({ value: t, label: fmtTime(t) }))}
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

          {/* Restates the picked plan and total next to Book, since on phones the list may be off screen. */}
          <div className="mt-[var(--space-2)] flex items-baseline justify-between gap-[var(--space-1)] [border-top:1px_solid_var(--line)] pt-[var(--space-1)]">
            <span className="text-small text-muted">{selected.name}</span>
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
            Book charter
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
