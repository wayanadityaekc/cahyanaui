'use client';

import { useState } from 'react';
import ExperienceCard from '@/components/cards/ExperienceCard';
import CharterHome from '@/components/sections/home/CharterHome';
import { LISTINGS } from '@/content/shared/listings';
import { TRANSFER } from '@/content/shared/transfer';

const TABS = [
  { id: 'tour', label: 'Tours' },
  { id: 'activities', label: 'Experiences' },
  { id: 'charter', label: 'Charter' },
  { id: 'transfer', label: 'Transfer' },
  { id: 'destinations', label: 'Destinations' },
];

const flat = (key) => (LISTINGS[key] ? LISTINGS[key].cats : []).flatMap((c) => c.cards || []);

const TRANSFER_CARDS = TRANSFER.routes.map((r) => ({
  href: '/transfer.html',
  name: r.name,
  img: r.bg,
  alt: r.name,
  meta: r.meta,
  metaIcon: 'pin',
  priceName: r.priceName,
  priceFallback: r.priceFallback,
}));

export default function AllPrograms() {
  const [tab, setTab] = useState('tour');
  const cards = tab === 'transfer' ? TRANSFER_CARDS : flat(tab);

  return (
    <div className="tourprog">
      <section className="experience experience--alt">
        <div className="lhead">
          <h1 className="section__title">All Programs</h1>
          <div className="zone-filter" role="tablist" aria-label="Program categories">
            {TABS.map((t) => (
              <button
                key={t.id}
                type="button"
                role="tab"
                aria-selected={tab === t.id}
                className={`zone-chip${tab === t.id ? ' is-active' : ''}`}
                onClick={() => setTab(t.id)}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {tab === 'charter' ? (
          <CharterHome />
        ) : (
          <section className="catsec">
            <div className="experience__grid experience__grid--home4">
              {cards.map((c) => (
                <ExperienceCard key={(c.href || '') + c.name} {...c} width={c.w} height={c.hgt} />
              ))}
            </div>
          </section>
        )}
      </section>
    </div>
  );
}
