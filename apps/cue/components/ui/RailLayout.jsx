'use client';

import { ChevronRight, ChevronLeft } from 'lucide-react';
import {
  RAIL_FRAME, RAIL_ASIDE, RAIL_STICK, RAIL_LABEL, railItem, RAIL_SPLIT,
  RAIL_MAIN, RAIL_MLIST, RAIL_MLABEL, railMobileItem, RAIL_MCHEV, RAIL_BACK,
} from './railClasses';

// The "mail app" shell shared by Our Company and My Trips (Sep 2026, Wayan:
// "page my trip dan our company akan menggunakan layout yang sama ... kayak page
// email di desktop"). A component, not just a bag of class strings, because what
// has to stay the same between the two pages is the ORDER and the BEHAVIOUR -
// rail then content, list-then-section on the phone, back clears - and shared
// strings cannot hold that. Same reasoning as DetailHero and FormHero.
//
// State lives with the caller: Our Company drives the section from the URL hash,
// My Trips just keeps a tab. This only renders.
//
// `reading` is the phone's two screens: false = the list of sections, true = one
// section open with a back row. Desktop ignores it entirely (CSS decides there),
// so it is safe for the two pages to start it differently - Our Company opens on
// the list, My Trips opens straight on the cart, because that page has an obvious
// default and Our Company does not.
export default function RailLayout({
  label,
  items,
  active,
  onSelect,
  reading,
  onBack,
  help = null,
  children,
}) {
  const rows = (mobile) =>
    items.map((t) => (
      <div key={t.id} className="contents">
        {t.split && <span className={RAIL_SPLIT} aria-hidden="true" />}
        <button
          type="button"
          {...(mobile ? {} : { role: 'tab', 'aria-selected': active === t.id })}
          onClick={() => onSelect(t.id)}
          className={mobile ? railMobileItem(active === t.id) : railItem(active === t.id)}
        >
          {t.Icon && <t.Icon strokeWidth={1.7} aria-hidden="true" />}
          {t.label}
          {mobile && <ChevronRight className={RAIL_MCHEV} strokeWidth={1.7} aria-hidden="true" />}
        </button>
      </div>
    ));

  return (
    <div className={RAIL_FRAME}>
      {/* Desktop rail. It carries no height of its own: the flex row stretches
          it so the cream fills the box, and the menu inside is what sticks. */}
      <aside className={RAIL_ASIDE}>
        <div className={RAIL_STICK}>
          <p className={RAIL_LABEL}>{label}</p>
          <nav className="flex flex-col" role="tablist" aria-label={label}>
            {rows(false)}
          </nav>
          {help}
        </div>
      </aside>

      {/* Phone: the same sections as a full-width list. Hidden outright once one
          is open, and never shown at all on desktop. */}
      <div className={reading ? 'hidden' : RAIL_MLIST}>
        <p className={RAIL_MLABEL}>{label}</p>
        {rows(true)}
        {help}
      </div>

      <main className={`${RAIL_MAIN} ${reading ? '' : 'max-[992px]:hidden'}`}>
        <button type="button" className={RAIL_BACK} onClick={onBack}>
          <ChevronLeft strokeWidth={1.7} aria-hidden="true" />
          {label}
        </button>
        {children}
      </main>
    </div>
  );
}
