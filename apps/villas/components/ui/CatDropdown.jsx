'use client';

import { useEffect, useRef, useState } from 'react';
import { ChevronDown, LayoutGrid } from 'lucide-react';
import { PopMenu } from '@/components/ui/Reveal';

export function CAT_ITEM(active) {
  return `text-left font-body text-body leading-[var(--lh-body)] no-underline ${active ? 'font-semibold text-gold' : 'text-muted'}`;
}
export function CAT_ITEM_TAP(active) {
  return `${CAT_ITEM(active)} py-[var(--space-1)]`;
}

const PANEL =
  'absolute left-0 right-0 top-[calc(100%+var(--space-1))] z-30 flex flex-col p-[var(--space-1)] ' +
  'bg-surface-raised [border:1px_solid_var(--line)] rounded-md [box-shadow:var(--shadow-lg)]';

const TRIGGER =
  'flex items-center justify-between w-full gap-2 p-0 bg-transparent border-none cursor-pointer ' +
  'font-body text-body font-semibold text-gold';

export default function CatDropdown({ label, ariaLabel, className = '', children }) {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    if (!isOpen) return undefined;
    function onDown(event) {
      if (!ref.current?.contains(event.target)) setIsOpen(false);
    }
    function onKey(event) {
      if (event.key === 'Escape') setIsOpen(false);
    }
    document.addEventListener('pointerdown', onDown);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('pointerdown', onDown);
      document.removeEventListener('keydown', onKey);
    };
  }, [isOpen]);

  return (
    <div className={className}>
      <div className="relative" ref={ref}>
        <button
          type="button"
          data-catnav
          aria-haspopup="true"
          aria-expanded={isOpen}
          className={TRIGGER}
          onClick={() => setIsOpen((wasOpen) => !wasOpen)}
        >
          <span className="flex items-center gap-[var(--space-1)]">
            <LayoutGrid className="w-[var(--icon-sm)] h-[var(--icon-sm)] shrink-0" aria-hidden="true" />
            {label}
          </span>
          <ChevronDown
            className={`w-[var(--icon-sm)] h-[var(--icon-sm)] shrink-0 text-muted transition-[rotate] duration-[var(--dur)] ease-[var(--ease)] ${isOpen ? 'rotate-180' : ''}`}
            aria-hidden="true"
          />
        </button>
        <PopMenu open={isOpen}>
          <div className={PANEL} aria-label={ariaLabel}>
            {children(() => setIsOpen(false))}
          </div>
        </PopMenu>
      </div>
    </div>
  );
}
