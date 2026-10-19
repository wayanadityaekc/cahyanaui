'use client';

import { useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { BAR_SHELL, BAR_UPTO_MD } from '@/components/ui/stickyBar';

const SECTION_SCROLL_OFFSET_PX = 160;

function Chevron({ dir }) {
  const Icon = dir === 'left' ? ChevronLeft : ChevronRight;
  return <Icon aria-hidden="true" />;
}

export default function SectionSwitcher({ zones = [] }) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (!zones.length) return;
    function probe() {
      const scrollPosition = window.scrollY + SECTION_SCROLL_OFFSET_PX;
      let current = 0;
      zones.forEach((zone, indexItem) => {
        const section = document.getElementById(zone.id);
        if (!section) return;
        if (section.getBoundingClientRect().top + window.scrollY <= scrollPosition) current = indexItem;
      });
      setIndex(current);
    }
    probe();
    window.addEventListener('scroll', probe, { passive: true });
    window.addEventListener('resize', probe);
    return () => {
      window.removeEventListener('scroll', probe);
      window.removeEventListener('resize', probe);
    };
  }, [zones]);

  if (!zones.length) return null;

  function step(delta) {
    const nextIndex = Math.min(zones.length - 1, Math.max(0, index + delta));
    const section = document.getElementById(zones[nextIndex].id);
    if (section) section.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  const arrow =
    'w-[34px] h-[34px] flex-none flex items-center justify-center border-0 rounded-[50%] bg-cream text-ink cursor-pointer transition-[background-color,scale] duration-200 ease-[ease] enabled:hover:bg-line disabled:opacity-[0.35] disabled:cursor-default [&>svg]:w-[18px] [&>svg]:h-[18px]';

  return (
    <div className={`${BAR_SHELL} ${BAR_UPTO_MD}`} role="navigation" aria-label="Jump to category">
      <span className="flex-1 min-w-0 truncate font-semibold text-[0.8rem] text-ink">{zones[index].label}</span>
      <div className="flex-none flex items-center gap-1">
        <button
          type="button"
          className={arrow}
          onClick={() => step(-1)}
          disabled={index === 0}
          aria-label="Previous category"
        >
          <Chevron dir="left" />
        </button>
        <button
          type="button"
          className={arrow}
          onClick={() => step(1)}
          disabled={index === zones.length - 1}
          aria-label="Next category"
        >
          <Chevron dir="right" />
        </button>
      </div>
    </div>
  );
}
