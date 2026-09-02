'use client';

import { useState } from 'react';
import ExperienceCard from '@/components/cards/ExperienceCard';
import { EXPLORE_TOURS, EXPLORE_EXPERIENCES } from '@/content/shared/home';

const TABS = [
  { key: 'tours', label: 'Tours', cards: EXPLORE_TOURS, more: ['/tour.html', 'View all tours'] },
  { key: 'exp', label: 'Experiences', cards: EXPLORE_EXPERIENCES, more: ['/activities.html', 'View all experiences'] },
];

export default function Explore() {
  const [active, setActive] = useState('tours');

  return (
    <section className="xplore" id="explore">
      <div className="xplore__head">
        <div className="xplore__intro">
          <h2 className="xplore__t">Explore Bali</h2>
        </div>
        <div className="xtabs" role="tablist">
          {TABS.map((t) => (
            <button
              key={t.key}
              type="button"
              className={`xtab${active === t.key ? ' is-on' : ''}`}
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
        <div className="xpanel" data-xpanel={t.key} key={t.key} hidden={active !== t.key}>
          <div className="experience__grid experience__grid--home4">
            {t.cards.map((c) => (
              <ExperienceCard key={c.href + c.name} variant="article" {...c} />
            ))}
          </div>
          <div className="xplore__more">
            <a href={t.more[0]} className="btn-pill">{t.more[1]}</a>
          </div>
        </div>
      ))}
    </section>
  );
}
