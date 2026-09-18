'use client';

import { useEffect, useRef, useState } from 'react';
import { ChevronDown, LayoutGrid } from 'lucide-react';
import { PopMenu } from '@/components/ui/Reveal';

// The mobile category picker shared by Our Company and the guide articles: a row
// showing the CURRENT category, tapped to reveal the rest.
//
// It FLOATS over the page rather than pushing it down (Sep 2026, Wayan: "gua mau
// dropdownya itu behaviornya seperti hamburger menu, kalo di buka gak buat konten
// geser menurun"). Both pages used <Collapse>, which animates height and therefore
// shoves everything below it - open the list while reading and the paragraph you
// were looking at slides off. <PopMenu> fades a panel in on top instead, so the
// article stays exactly where it was.
//
// Shared because the two are now the same control; keeping one copy is what stops
// them drifting apart again.
export const CAT_ITEM = (active) =>
  `text-left font-body text-body no-underline ${active ? 'font-semibold text-gold' : 'text-muted'}`;

// Floating, so it needs its own surface - an opaque background, a border and an
// elevation, or the article's text reads straight through it.
const PANEL =
  'absolute left-0 right-0 top-[calc(100%+6px)] z-30 flex flex-col gap-1 p-3 ' +
  'bg-white [border:1px_solid_var(--line)] rounded-md [box-shadow:var(--shadow-lg)]';

const TRIGGER =
  'flex items-center justify-between w-full gap-2 p-0 bg-transparent border-none cursor-pointer ' +
  'font-body text-body font-semibold text-gold';

export default function CatDropdown({ label, ariaLabel, className = '', children }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  // A floating panel has no way of getting out of the guest's way on its own: it
  // would otherwise stay open over the article while they scroll or tap past it.
  useEffect(() => {
    if (!open) return undefined;
    const onDown = (e) => { if (!ref.current?.contains(e.target)) setOpen(false); };
    const onKey = (e) => { if (e.key === 'Escape') setOpen(false); };
    document.addEventListener('pointerdown', onDown);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('pointerdown', onDown);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  return (
    <div className={className}>
      {/* This wrapper must hug the trigger and carry no padding of its own. The
          panel's top:100% resolves against PopMenu's own transformed div while the
          entrance animation runs, and against this wrapper once it settles - both
          land in the same place only while the wrapper ends where the button does.
          Spacing belongs on the element around this one. */}
      <div className="relative" ref={ref}>
        {/* data-catnav: a stable hook for this control. Selecting it by
            "button with aria-expanded" instead picks up the navbar drawer's own
            submenu toggle, which sits off-screen in the DOM on every page. */}
        <button
          type="button"
          data-catnav
          aria-haspopup="true"
          aria-expanded={open}
          className={TRIGGER}
          onClick={() => setOpen((v) => !v)}
        >
          <span className="flex items-center gap-[0.6rem]">
            {/* 2x2 grid = categories, not the navbar's three-line hamburger. */}
            <LayoutGrid className="w-[18px] h-[18px] shrink-0" aria-hidden="true" />
            {label}
          </span>
          <ChevronDown
            className={`w-4 h-4 shrink-0 text-muted transition-[rotate] duration-200 ${open ? 'rotate-180' : ''}`}
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
