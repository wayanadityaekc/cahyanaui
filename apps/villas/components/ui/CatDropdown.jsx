'use client';

import { useEffect, useRef, useState } from 'react';
import { ChevronDown, LayoutGrid } from 'lucide-react';
import { PopMenu } from '@/components/ui/Reveal';

// Rows sit on the body line-height, which also lifts each panel row to a thumb-sized 36px.
export function CAT_ITEM(active) { return `text-left font-body text-body leading-[var(--lh-body)] no-underline ${active ? 'font-semibold text-gold' : 'text-muted'}`; }
// Row padding makes the ~20px text box big enough to hit with a thumb.
export function CAT_ITEM_TAP(active) { return `${CAT_ITEM(active)} py-[var(--space-1)]`; }

// Floating panel needs its own opaque surface, border and shadow, or the article reads through it.
const PANEL =
  'absolute left-0 right-0 top-[calc(100%+var(--space-1))] z-30 flex flex-col p-[var(--space-1)] ' +
  'bg-surface-raised [border:1px_solid_var(--line)] rounded-md [box-shadow:var(--shadow-lg)]';

const TRIGGER =
  'flex items-center justify-between w-full gap-2 p-0 bg-transparent border-none cursor-pointer ' +
  'font-body text-body font-semibold text-gold';

// Mobile category picker for Our Company and guides: floats over the page instead of pushing content down.
export default function CatDropdown({ label, ariaLabel, className = '', children }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  // Close on outside tap or Escape, or the floating panel stays open over the article while scrolling.
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
      {/* Must hug the trigger with no padding, or the panel jumps when PopMenu's entrance transform ends. */}
      <div className="relative" ref={ref}>
        {/* data-catnav: stable hook; matching 'button with aria-expanded' also hits the navbar drawer's hidden toggle. */}
        <button
          type="button"
          data-catnav
          aria-haspopup="true"
          aria-expanded={open}
          className={TRIGGER}
          onClick={() => setOpen((wasOpen) => !wasOpen)}
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
