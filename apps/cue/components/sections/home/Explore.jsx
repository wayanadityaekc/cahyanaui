'use client';

import { useState } from 'react';
import { GRID_XPLORE, XPLORE_SECTION } from '@/components/ui/gridClasses';
import HomepageCard from '@/components/cards/HomepageCard';
import { EXPLORE_TOURS, EXPLORE_EXPERIENCES } from '@/content/shared/home';
import { BTN_PILL } from '@/components/ui/btnClasses';

const TABS = [
  { key: 'tours', label: 'Tours', cards: EXPLORE_TOURS, more: ['/tour.html', 'View all tours'] },
  { key: 'exp', label: 'Experiences', cards: EXPLORE_EXPERIENCES, more: ['/activities.html', 'View all experiences'] },
];

export default function Explore() {
  const [active, setActive] = useState('tours');

  // Tailwind-native (B-FINAL): the Explore section is now fully self-contained. The old
  // `.xplore{max-width/margin/padding/text-align}` + `.home .xplore{padding-top/bottom:0}`
  // collapse to the utilities below (vertical padding was always zeroed on the homepage,
  // the only place xplore existed, so it's just omitted). The grid engine (GRID_XPLORE)
  // no longer needs `.xplore` as a context ancestor - it's self-contained.
  return (
    <section className={XPLORE_SECTION} id="explore">
      <div className="flex justify-between items-end gap-8 flex-wrap mb-[2.2rem] max-[768px]:mb-[1.6rem]">
        <div>
          <h2 className="font-head font-medium tracking-[-0.01em] text-h2 leading-[var(--lh-heading)] text-gold m-0">Our Best Bali Tours</h2>
        </div>
        <div className="flex gap-[1.8rem] max-[768px]:w-full max-[768px]:gap-[1.1rem] max-[768px]:mt-[0.4rem] max-[768px]:[border-bottom:1px_solid_var(--line)] max-[768px]:overflow-x-auto max-[768px]:[scrollbar-width:none] max-[768px]:[&::-webkit-scrollbar]:hidden" role="tablist">
          {TABS.map((t) => (
            <button
              key={t.key}
              type="button"
              className={`bg-transparent [border-top:0] [border-right:0] [border-left:0] mb-[-1px] [padding:0_0_0.9rem] font-body text-small cursor-pointer ${active === t.key ? '[border-bottom:2px_solid_var(--color-gold)] font-semibold text-green' : '[border-bottom:2px_solid_transparent] font-medium text-muted'}`}
              role="tab"
              aria-selected={active === t.key}
              onClick={() => setActive(t.key)}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {TABS.map((t) => (
        <div key={t.key} hidden={active !== t.key}>
          <div className={GRID_XPLORE}>
            {t.cards.map((c) => (
              <HomepageCard key={c.href + c.name} {...c} />
            ))}
          </div>
          <div className="mt-8 text-right max-[768px]:mt-[1.6rem]">
            <a href={t.more[0]} className={BTN_PILL}>{t.more[1]}</a>
          </div>
        </div>
      ))}
    </section>
  );
}
