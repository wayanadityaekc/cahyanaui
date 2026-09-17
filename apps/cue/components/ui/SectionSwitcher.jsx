'use client';

import { useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { BAR_SHELL, BAR_ON, BAR_DIVIDER, BarChat } from '@/components/ui/stickyBar';

// Size comes from the parent button's [&>svg] rule, same as before.
function Chevron({ dir }) {
  const Ic = dir === 'left' ? ChevronLeft : ChevronRight;
  return <Ic aria-hidden="true" />;
}

// Category switcher for the listing pages: shows the section currently in view
// and steps to the previous / next section with the arrows.
//
// Wayan, Sep 2026: it used to be its own pill floating in the middle of the
// screen, which on a phone overlapped the floating chat button in the corner.
// It is now the same bar as BookBar - chat on the left, the arrows sitting
// where Book now sits on a detail page - so only one thing is ever stuck to
// the bottom of the screen.
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

  const arrow =
    'w-[34px] h-[34px] flex-none flex items-center justify-center border-0 rounded-[50%] bg-cream text-ink cursor-pointer transition-[background-color,scale] duration-200 ease-[ease] enabled:hover:bg-line disabled:opacity-[0.35] disabled:cursor-default [&>svg]:w-[18px] [&>svg]:h-[18px]';

  return (
    <div className={`${BAR_SHELL} ${BAR_ON}`} role="navigation" aria-label="Jump to category">
      <BarChat />
      <span className={BAR_DIVIDER} aria-hidden="true" />
      <span className="flex-1 min-w-0 truncate font-semibold text-[0.8rem] text-ink">{zones[idx].label}</span>
      <div className="flex-none flex items-center gap-1">
        <button type="button" className={arrow} onClick={() => go(-1)} disabled={idx === 0} aria-label="Previous category">
          <Chevron dir="left" />
        </button>
        <button type="button" className={arrow} onClick={() => go(1)} disabled={idx === zones.length - 1} aria-label="Next category">
          <Chevron dir="right" />
        </button>
      </div>
    </div>
  );
}
