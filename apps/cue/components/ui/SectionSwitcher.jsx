'use client';

import { useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

// Size comes from the parent button's [&>svg] rule, same as before.
function Chevron({ dir }) {
  const Ic = dir === 'left' ? ChevronLeft : ChevronRight;
  return <Ic aria-hidden="true" />;
}

// Floating category switcher (bottom-center): shows the section currently in
// view and steps to the previous / next section with the arrows. Replaces the
// inline tab strip on the listing pages.
export default function SectionSwitcher({ zones = [] }) {
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    if (!zones.length) return;
    const probe = () => {
      const y = window.scrollY + 160;
      let cur = 0;
      zones.forEach((z, i) => {
        const el = document.getElementById(z.id);
        if (!el) return;
        if (el.getBoundingClientRect().top + window.scrollY <= y) cur = i;
      });
      setIdx(cur);
    };
    probe();
    window.addEventListener('scroll', probe, { passive: true });
    window.addEventListener('resize', probe);
    return () => {
      window.removeEventListener('scroll', probe);
      window.removeEventListener('resize', probe);
    };
  }, [zones]);

  if (!zones.length) return null;

  const go = (delta) => {
    const n = Math.min(zones.length - 1, Math.max(0, idx + delta));
    const el = document.getElementById(zones[n].id);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  // Tailwind-native (migrasi Fase 2): .ssw* -> utilities. Floating pill, HP-only
  // (min-[769px]:hidden = dulu `@media(min-width:769px){.ssw{display:none}}`).
  const arrow =
    'w-[34px] h-[34px] flex-none flex items-center justify-center border-0 rounded-[50%] bg-cream text-ink cursor-pointer transition-[background-color] duration-200 ease-[ease] enabled:hover:bg-line disabled:opacity-[0.35] disabled:cursor-default [&>svg]:w-[18px] [&>svg]:h-[18px]';
  return (
    <div className="fixed left-1/2 [transform:translateX(-50%)] bottom-[1.3rem] z-50 flex items-center gap-1 py-[5px] px-[6px] bg-white border border-line rounded-pill shadow-xl min-[769px]:hidden" role="navigation" aria-label="Jump to category">
      <button type="button" className={arrow} onClick={() => go(-1)} disabled={idx === 0} aria-label="Previous category">
        <Chevron dir="left" />
      </button>
      <span className="min-w-[148px] px-[6px] text-center font-semibold text-[0.8rem] text-ink whitespace-nowrap">{zones[idx].label}</span>
      <button type="button" className={arrow} onClick={() => go(1)} disabled={idx === zones.length - 1} aria-label="Next category">
        <Chevron dir="right" />
      </button>
    </div>
  );
}
