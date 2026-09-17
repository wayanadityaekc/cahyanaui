'use client';

import { SECTION_TITLE, SECTION_TITLE_SUB, ST_LEFT } from '@/components/ui/sectionTitle';
import { useState } from 'react';
import { CATSEC, LROW_LIST } from '@/components/ui/listingClasses';
import ListingRow from '@/components/cards/ListingRow';
import CharterSection from '@/components/sections/CharterSection';
import TransferSection from '@/components/sections/TransferSection';
import { LISTINGS } from '@/content/shared/listings';
import { isHiddenTour } from '@/lib/routes';

const TABS = [
  { id: 'tour', label: 'Tours' },
  { id: 'activities', label: 'Experiences' },
  { id: 'charter', label: 'Charter' },
  { id: 'transfer', label: 'Transfer' },
  { id: 'destinations', label: 'Destinations' },
];

const flat = (key) =>
  (LISTINGS[key] ? LISTINGS[key].cats : [])
    .flatMap((c) => c.cards || [])
    .filter((c) => !isHiddenTour(c.href));

// .aphead + .zone-filter/.zone-chip (B-FINAL). Only consumer is this component, so
// the aphead-context zone-filter override (justify-center, max-w-none, my-0) is baked
// straight into the effective utility string. zone-chip is a <button>: bg-transparent
// kills UA buttonface; [border:none] then [border-bottom:...] mirrors the old two-decl
// border reset. Active state = full string swap (no is-active) to avoid utility order
// clashes. Dead (dropped): .lhead .zone-filter + .lhead::after (no zone-filter in lhead).
const APHEAD = 'max-w-[1200px] mx-auto mb-[1.6rem] pt-28 px-[var(--container-x)] text-center max-[768px]:pt-[5.5rem]';
const ZFILTER = 'flex flex-nowrap justify-center gap-[1.6rem] max-w-none mx-auto my-0 border-b border-b-line overflow-x-auto overflow-y-hidden [touch-action:pan-x] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden max-[768px]:justify-start max-[768px]:gap-[1.4rem] max-[768px]:px-4';
const ZC = 'inline-block font-body text-[length:var(--fs-small)] font-medium text-muted bg-transparent [border-top:none] [border-left:none] [border-right:none] [border-bottom:2px_solid_transparent] py-[0.6rem] px-[0.15rem] mb-[-1px] whitespace-nowrap cursor-pointer no-underline [transition:color_var(--dur-fast)_ease,border-color_var(--dur-fast)_ease,scale_var(--dur-fast)_var(--ease)] hover:text-green';
const ZC_ON = 'inline-block font-body text-[length:var(--fs-small)] font-semibold text-green bg-transparent [border-top:none] [border-left:none] [border-right:none] [border-bottom:2px_solid_var(--color-gold)] py-[0.6rem] px-[0.15rem] mb-[-1px] whitespace-nowrap cursor-pointer no-underline [transition:color_var(--dur-fast)_ease,border-color_var(--dur-fast)_ease,scale_var(--dur-fast)_var(--ease)] hover:text-green';

export default function AllPrograms() {
  const [tab, setTab] = useState('tour');
  const isForm = tab === 'charter' || tab === 'transfer';

  return (
    <div className="tourprog pb-20">
      <section className="bg-white py-[var(--section-gap)] px-6">
        <div className={APHEAD}>
          <h1 className={`${SECTION_TITLE} !mb-[1.4rem]`}>All Programs</h1>
          <div className={ZFILTER} role="tablist" aria-label="Program categories">
            {TABS.map((t) => (
              <button
                key={t.id}
                type="button"
                role="tab"
                aria-selected={tab === t.id}
                className={tab === t.id ? ZC_ON : ZC}
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
