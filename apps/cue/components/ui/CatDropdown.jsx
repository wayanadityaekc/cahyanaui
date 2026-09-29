'use client';

import { useEffect, useRef, useState } from 'react';
import { ChevronDown, LayoutGrid } from 'lucide-react';
import { PopMenu } from '@/components/ui/Reveal';

// Mobile category picker for Our Company and guide articles; PopMenu floats over content (Collapse would push it).
export function CAT_ITEM(active) { return `text-left font-body text-body leading-[var(--lh-body)] no-underline ${active ? 'font-semibold text-gold' : 'text-muted'}`; }
// Row padding gives a thumb-sized tap target inside the floating panel.
export function CAT_ITEM_TAP(active) { return `${CAT_ITEM(active)} py-[var(--space-1)]`; }

// Floating panel needs an opaque bg and border; all spacing is --space-1 to match the desktop column rhythm.
const PANEL =
  'absolute left-0 right-0 top-[calc(100%+var(--space-1))] z-30 flex flex-col p-[var(--space-1)] ' +
  'bg-white [border:1px_solid_var(--line)] rounded-md';

const TRIGGER =
  'flex items-center justify-between w-full gap-2 p-0 bg-transparent border-none cursor-pointer ' +
  'font-body text-body font-semibold text-gold';

export default function CatDropdown({ label, ariaLabel, className = '', children }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  // Close the floating panel on outside tap or Escape so it can't stay open over the article.
  useEffect(() => {
    if (!open) return undefined;
    function onDown(e) { if (!ref.current?.contains(e.target)) setOpen(false); }
    function onKey(e) { if (e.key === 'Escape') setOpen(false); }
    document.addEventListener('pointerdown', onDown);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('pointerdown', onDown);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  return (
    <div className={className}>
      {/* Wrapper must hug the trigger with no padding, or the PopMenu panel jumps when its entrance transform ends. */}
      <div className="relative" ref={ref}>
        {/* data-catnav is the stable hook; selecting by aria-expanded catches the navbar drawer's hidden toggle. */}
        <button
          type="button"
          data-catnav
          aria-haspopup="true"
          aria-expanded={open}
          className={TRIGGER}
          onClick={() => setOpen((v) => !v)}
        >
          <span className="flex items-center gap-[var(--space-1)]">
            {/* 2x2 grid = categories, not the navbar's three-line hamburger. */}
            <LayoutGrid className="w-[var(--icon-sm)] h-[var(--icon-sm)] shrink-0" aria-hidden="true" />
            {label}
          </span>
          <ChevronDown
            className={`w-[var(--icon-sm)] h-[var(--icon-sm)] shrink-0 text-muted transition-[rotate] duration-[var(--dur)] ease-[var(--ease)] ${open ? 'rotate-180' : ''}`}
            aria-hidden="true"
          />
        </button>
        <PopMenu open={open}>
          <div className={PANEL} aria-label={ariaLabel}>
            {children(() => setOpen(false))}
          </div>
        </PopMenu>
      </div>
    </div>
  );
}
