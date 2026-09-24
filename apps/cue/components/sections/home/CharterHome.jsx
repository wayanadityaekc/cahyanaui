'use client';

import { useEffect, useState } from 'react';
import CharterSurcharge from '@/components/CharterSurcharge';
import { BTN_BOOK } from '@/components/ui/btnBookClasses';
// The very same plan list the charter page renders (Wayan, Sep 2026: "reuse
// komponen bro, gimanapun styling dan structure di page charter pakai itu juga
// di section homepage"). Not a copy that looks like it - the component.
import CharterPlans from '@/components/sections/CharterPlans';
import { readCharterDraft, saveCharterDraft } from '@/lib/charterDraft';
import { CHARTER } from '@/content/shared/charter';

// The homepage gets the CARDS ONLY - no trip fields (Wayan: "di section homepage
// gua mau cuma card nya aja dan button yang mengarah ke page charter untuk
// melengkapi form"). The pick is saved, and the charter page reads it back on
// arrival, so nobody is asked the same question twice.
//
// area is left empty here on purpose: with no pick-up field there is no
// surcharge to count, so the kicker honestly reads "From" rather than "Total".
// paired = rendered beside About in the homepage's two-column row (desktop only).
// The wrapper becomes the container there, so this section drops its own width and
// gutters from 993px, and its vertical margin always: the wrapper spaces the pair.
const SECTION = 'max-w-[var(--container)] my-[var(--space-5)] mx-auto px-[var(--container-x)]';
const SECTION_PAIRED =
  'max-w-[var(--container)] mx-auto px-[var(--container-x)] my-0 ' +
  'min-[993px]:max-w-none min-[993px]:mx-0 min-[993px]:px-0';

export default function CharterHome({ paired = false }) {
  const [dur, setDur] = useState(CHARTER.durations[0].dur);

  // In an effect, never in the initial state: this is a static export, and
  // localStorage does not exist when the HTML is rendered.
  useEffect(() => {
    const d = readCharterDraft();
    if (d && CHARTER.durations.some((x) => x.dur === d.dur)) setDur(d.dur);
  }, []);

  const pick = (d) => { setDur(d); saveCharterDraft({ dur: d }); };

  return (
    <section className={paired ? SECTION_PAIRED : SECTION} id="charter-promo">
      <div className={`bg-white border border-line rounded-lg shadow-md p-[var(--space-5)] max-[560px]:p-[var(--space-4)_var(--space-3)] ${paired ? 'min-[993px]:h-full' : ''}`}>
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
