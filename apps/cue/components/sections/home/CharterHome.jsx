'use client';

import { useEffect, useState } from 'react';
import CharterSurcharge from '@/components/CharterSurcharge';
import { BTN_BOOK } from '@/components/ui/btnBookClasses';
// Same CharterPlans component the charter page renders, not a copy.
import CharterPlans from '@/components/sections/CharterPlans';
import { readCharterDraft, saveCharterDraft } from '@/lib/charterDraft';
import { CHARTER } from '@/content/shared/charter';

// Cards only, no fields (pick is saved for the charter page); paired drops width/gutters from 993px.
const SECTION = 'max-w-[var(--container)] my-[var(--space-5)] mx-auto px-[var(--container-x)]';
const SECTION_PAIRED =
  'max-w-[var(--container)] mx-auto px-[var(--container-x)] my-0 ' +
  'min-[993px]:max-w-none min-[993px]:mx-0 min-[993px]:px-0';

export default function CharterHome({ paired = false }) {
  const [dur, setDur] = useState(CHARTER.durations[0].dur);

  // Read the saved draft in an effect, never in initial state, or the static-export hydration breaks.
  useEffect(() => {
    const d = readCharterDraft();
    if (d && CHARTER.durations.some((x) => x.dur === d.dur)) setDur(d.dur);
  }, []);

  function pick(d) { setDur(d); saveCharterDraft({ dur: d }); }

  return (
    <section className={paired ? SECTION_PAIRED : SECTION} id="charter-promo">
      <div className={`bg-white border border-line rounded-lg p-[var(--space-5)] max-[560px]:p-[var(--space-4)_var(--space-3)] ${paired ? 'min-[993px]:h-full' : ''}`}>
        <div className="text-center mb-[var(--space-3)]">
          <span className="block uppercase tracking-[0.14em] text-label text-muted mb-[0.4rem]">One more way to explore</span>
          <h2 className="font-head text-h2 font-medium tracking-[-0.01em] mb-[0.6rem] text-gold">Charter a car for the whole day</h2>
          <p className="text-body leading-[1.6] text-ink mx-auto max-w-[60ch]">
            Private car and driver, yours for the day. Pick a length, build your own route. Petrol included, pick up
            anywhere on the island.
          </p>
        </div>

        <CharterPlans value={dur} onChange={pick} />

        {/* The page is where the trip gets filled in, so the button says so. */}
        <a className={`${BTN_BOOK} block max-w-[320px] mx-auto text-center`} href="/charter.html">Build charter</a>

        <p className="text-center mt-[var(--space-3)] text-small text-muted">
          Only a <b className="text-gold font-semibold">$10 deposit</b> to book &middot; prices per car, pick-up outside Ubud <CharterSurcharge />
        </p>
      </div>
    </section>
  );
}
