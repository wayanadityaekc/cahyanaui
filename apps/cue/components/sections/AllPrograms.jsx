'use client';

import { SECTION_TITLE, SECTION_TITLE_SUB, ST_LEFT } from '@/components/ui/sectionTitle';
import { useState } from 'react';
import { CATSEC, LROW_LIST } from '@/components/ui/listingClasses';
import ListingRow from '@/components/cards/ListingRow';
import CharterSection from '@/components/sections/CharterSection';
import TransferSection from '@/components/sections/TransferSection';
import { LISTINGS } from '@/content/shared/listings';

const TABS = [
  { id: 'tour', label: 'Tours' },
  { id: 'activities', label: 'Experiences' },
  { id: 'charter', label: 'Charter' },
  { id: 'transfer', label: 'Transfer' },
  { id: 'destinations', label: 'Destinations' },
];

const flat = (key) => (LISTINGS[key] ? LISTINGS[key].cats : []).flatMap((c) => c.cards || []);

export default function AllPrograms() {
  const [tab, setTab] = useState('tour');
  const isForm = tab === 'charter' || tab === 'transfer';

  return (
    <div className="tourprog">
      <section className="experience experience--alt">
        <div className="aphead">
          <h1 className={`${SECTION_TITLE} !mb-[1.4rem]`}>All Programs</h1>
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

        {tab === 'charter' && <CharterSection />}
        {tab === 'transfer' && <TransferSection />}
        {!isForm && (
          <section className={CATSEC}>
            <div className={LROW_LIST}>
              {flat(tab).map((c) => (
                <ListingRow key={(c.href || '') + c.name} {...c} />
              ))}
            </div>
          </section>
        )}
      </section>
    </div>
  );
}
