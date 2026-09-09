'use client';

import { INFO_SECTION_ARTICLE, INFO_CONTAINER_ARTICLE } from '@/components/ui/infoClasses';
import { useState } from 'react';
import AboutPage from './AboutPage';
import ContactSection from './ContactSection';
import { LEGAL } from '@/content/shared/legal';
import Prose from '@/components/prose/Prose';

const TABS = [
  { id: 'about', label: 'About Us' },
  { id: 'terms', label: 'Terms', legal: 'terms-conditions' },
  { id: 'privacy', label: 'Privacy', legal: 'privacy-policy' },
  { id: 'cancellation', label: 'Cancellation', legal: 'cancellation-policy' },
  { id: 'contact', label: 'Contact' },
];

// .company-* chrome -> utilities (B-FINAL). Desktop (>=993) = white page, content sits
// in a recessed white "sheet" (inset shadow) with a sticky sidebar-nav card on the right;
// mobile (<=992) = single column white sheet + floating bottom tabbar. .company-page .reg*
// was dead (no .reg renders) so no hooks are kept. Base padding/max-width of .company-layout
// was always overridden by one of the two breakpoints (contiguous), so only the effective
// per-breakpoint values are reproduced. min-[993px]/max-[992px] mirror the @media split.
const C_PAGE = 'bg-white min-[993px]:pt-[calc(var(--header-h,104px)+1.9rem)] min-[993px]:px-[var(--container-x)] min-[993px]:pb-[var(--space-5)]';
const C_LAYOUT = 'flex flex-row-reverse items-start gap-10 max-w-[var(--container)] mx-auto min-[993px]:max-w-[1180px] min-[993px]:p-0 max-[992px]:flex-col max-[992px]:items-stretch max-[992px]:gap-0 max-[992px]:pt-[calc(var(--header-h,92px)+1.4rem)] max-[992px]:px-[var(--container-x)] max-[992px]:pb-[6.5rem]';
const C_NAV = 'flex-[0_0_260px] sticky top-[var(--header-h,104px)] flex flex-col gap-1 p-4 bg-white [border:1px_solid_var(--line)] rounded-lg [box-shadow:0_10px_30px_rgba(31,61,43,0.08)] max-[992px]:hidden';
const C_NAV_TITLE = 'font-head text-[length:var(--fs-h3)] font-semibold text-green text-center mt-[0.2rem] mx-0 mb-[0.6rem]';
const C_NAV_ITEM = 'font-body text-[length:var(--fs-small)] font-medium text-left text-green bg-transparent [border:none] rounded-sm py-[0.55rem] px-[0.7rem] cursor-pointer [transition:background_var(--dur-fast)_ease,color_var(--dur-fast)_ease] hover:bg-cream';
const C_NAV_ITEM_ON = 'font-body text-[length:var(--fs-small)] font-semibold text-left text-gold bg-cream [border:none] rounded-sm py-[0.55rem] px-[0.7rem] cursor-pointer [transition:background_var(--dur-fast)_ease,color_var(--dur-fast)_ease] hover:bg-cream';
const C_MAIN = 'flex-[1_1_auto] min-w-0 bg-white [border:1px_solid_var(--line)] [box-shadow:inset_0_1px_6px_rgba(34,32,28,0.05)] min-[993px]:rounded-xl min-[993px]:pt-8 min-[993px]:px-[clamp(1.6rem,2.5vw,2.4rem)] min-[993px]:pb-[2.4rem] max-[992px]:rounded-lg max-[992px]:pt-[1.4rem] max-[992px]:px-[1.2rem] max-[992px]:pb-[1.8rem]';
const C_HEADING = 'font-head text-[length:var(--fs-h2)] font-bold text-gold m-0 mb-4';
const C_TABBAR = 'hidden max-[992px]:flex max-[992px]:items-center max-[992px]:justify-center max-[992px]:gap-[0.9rem] max-[992px]:fixed max-[992px]:left-1/2 max-[992px]:bottom-4 max-[992px]:[transform:translateX(-50%)] max-[992px]:z-30 max-[992px]:min-w-[220px] max-[992px]:py-2 max-[992px]:px-[0.6rem] max-[992px]:bg-white max-[992px]:[border:1px_solid_var(--line)] max-[992px]:rounded-pill max-[992px]:[box-shadow:var(--shadow-xl)]';
const C_ARROW = 'max-[992px]:flex-[0_0_auto] max-[992px]:flex max-[992px]:items-center max-[992px]:justify-center max-[992px]:w-[34px] max-[992px]:h-[34px] max-[992px]:rounded-[50%] max-[992px]:[border:none] max-[992px]:bg-cream max-[992px]:text-gold-d max-[992px]:text-[1.3rem] max-[992px]:leading-none max-[992px]:cursor-pointer max-[992px]:[transition:background_var(--dur-fast)_ease] max-[992px]:hover:bg-line';
const C_LABEL = 'max-[992px]:flex-[1_1_auto] max-[992px]:text-center max-[992px]:font-body max-[992px]:text-[length:var(--fs-small)] max-[992px]:font-semibold max-[992px]:text-green';

function LegalBody({ data }) {
  return (
    <section className={`${INFO_SECTION_ARTICLE} !pt-0`}>
      <div className={INFO_CONTAINER_ARTICLE}>
        <h1 className={C_HEADING}>{data.title}</h1>
        <div>
          <Prose blocks={data.body} headingVariant="company" />
        </div>
      </div>
    </section>
  );
}

export default function OurCompany() {
  const [tab, setTab] = useState('about');
  const activeIndex = TABS.findIndex((t) => t.id === tab);
  const active = TABS[activeIndex];

  const step = (dir) => {
    const next = (activeIndex + dir + TABS.length) % TABS.length;
    setTab(TABS[next].id);
  };

  return (
    <div className={C_PAGE}>
      <div className={C_LAYOUT}>
        <nav className={C_NAV} role="tablist" aria-label="Our company">
          <p className={C_NAV_TITLE}>Our Company</p>
          {TABS.map((t) => (
            <button
              key={t.id}
              type="button"
              role="tab"
              aria-selected={tab === t.id}
              className={tab === t.id ? C_NAV_ITEM_ON : C_NAV_ITEM}
              onClick={() => setTab(t.id)}
            >
              {t.label}
            </button>
          ))}
        </nav>

        <div className={C_MAIN}>
          {tab === 'about' && <AboutPage company />}
          {active.legal && <LegalBody data={LEGAL[active.legal]} />}
          {tab === 'contact' && <ContactSection company />}
        </div>
      </div>

      <div className={C_TABBAR}>
        <button type="button" className={C_ARROW} aria-label="Previous section" onClick={() => step(-1)}>
          &lsaquo;
        </button>
        <span className={C_LABEL}>{active.label}</span>
        <button type="button" className={C_ARROW} aria-label="Next section" onClick={() => step(1)}>
          &rsaquo;
        </button>
      </div>
    </div>
  );
}
