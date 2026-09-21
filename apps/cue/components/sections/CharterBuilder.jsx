'use client';

import { useEffect, useState } from 'react';
import { BTN_BOOK } from '@/components/ui/btnBookClasses';
// The plan list is its own component, shared with the homepage section: same
// markup, same prices, one file. This page adds the trip fields beside it.
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

const FIELD_LABEL = 'block mb-[var(--space-1)] text-small font-medium text-green font-body tracking-normal';

export default function CharterBuilder() {
  const { setGuests } = useTripPrefs();
  const { state, save } = useItinerary();

  const [area, setArea] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [guests, setLocalGuests] = useState('');
  // The plan is picked in the list and booked by the ONE button under the fields
  // (Wayan, Sep 2026: "button cuma satu di bawah input yaitu book"). That brings
  // back a selected-duration state, which an earlier pass had removed when every
  // card carried its own Book button - deliberate, not a regression.
  const [dur, setDur] = useState(CHARTER.durations[0].dur);

  // Pick up whatever was chosen on the homepage. In an effect, not in the
  // initial state: this is a static export, and reading localStorage during the
  // first render would make it disagree with the pre-rendered HTML.
  useEffect(() => {
    const d = readCharterDraft();
    if (!d) return;
    if (CHARTER.durations.some((x) => x.dur === d.dur)) setDur(d.dur);
  }, []);

  const pick = (d) => { setDur(d); saveCharterDraft({ dur: d }); };

  const { tier, fmt } = useCharterTier({ area });
  const catalog = usePricing()?.catalog;

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
          993px, not 769: below that there is not enough width for a 340px field
          column and a readable plan row side by side. FormHero only splits the
          page into form + photo from 1200px for the same reason, one level up -
          see the note there. */}
      <div className="flex flex-col gap-[var(--space-2)] min-[993px]:grid min-[993px]:grid-cols-[1fr_340px] min-[993px]:gap-[var(--space-3)] min-[993px]:items-start">

        {/* 1 - the plan. The same list the homepage shows; here it drives the
            Book button under the fields. */}
        <CharterPlans value={dur} onChange={pick} area={area} heading="How long do you need the car?" />

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
          </div>

          {/* Which plan the button books, restated where the button is. On a phone
              the list is above the fields, so by the time a guest reaches Book the
              row they picked can be off screen. */}
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
