'use client';

import { useEffect, useId, useRef, useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { PopMenu } from '@/components/ui/Reveal';

// DESKTOP PAGE LINKS (WO1, Sep 2026). On wide screens the page links sit in the bar
// instead of behind the hamburger (standard navbar pattern - Flowbite/Preline
// "navbar with dropdown"). Phones keep the drawer. `min-[993px]` is paired with the
// drawer's `max-[992px]` - the 992px gotcha in CLAUDE.md applies to both.

export const PROGRAM_LINKS = [
  ['/tour.html', 'Tours'],
  ['/destinations.html', 'Destinations'],
  ['/activities.html', 'Experiences'],
  ['/transfer.html', 'Transfer'],
  ['/charter.html', 'Charter'],
];

function LINK(active) {
  return 'inline-flex items-center gap-1 h-[var(--btn-h)] px-3 rounded-[var(--r-md)] text-small no-underline font-body bg-transparent border-none cursor-pointer ' +
    '[transition:background-color_var(--dur)_var(--ease),scale_var(--dur-fast)_var(--ease)] hover:bg-cream ' +
    (active ? 'font-semibold text-green bg-cream' : 'font-medium text-gold');
}

export default function DesktopNav({ isActive }) {
  const [open, setOpen] = useState(false);
  const boxRef = useRef(null);
  const btnRef = useRef(null);
  const panelId = useId();
  const programActive = PROGRAM_LINKS.some(([h]) => isActive(h));

  useEffect(() => {
    if (!open) return undefined;
    function onDoc(e) { if (boxRef.current && !boxRef.current.contains(e.target)) setOpen(false); }
    function onKey(e) { if (e.key === 'Escape') { setOpen(false); btnRef.current?.focus(); } }
    document.addEventListener('click', onDoc);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('click', onDoc);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  return (
    <ul className="max-[992px]:hidden flex items-center gap-1 list-none m-0 p-0 mr-auto ml-2" data-desktop-nav>
      <li><a href="/" className={LINK(isActive('/'))}>Home</a></li>
      <li
        className="relative"
        ref={boxRef}
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
      >
        <button type="button" ref={btnRef} aria-expanded={open} aria-controls={panelId} className={LINK(programActive)} onClick={() => setOpen((v) => !v)}>
          Program
          <ChevronDown className={`w-[var(--icon-sm)] h-[var(--icon-sm)] transition-[rotate] duration-200 ${open ? 'rotate-180' : ''}`} strokeWidth={1.8} aria-hidden="true" />
        </button>
        <PopMenu open={open}>
          {/* pt instead of a gap, so the pointer can travel from the trigger into
              the panel without leaving the hover area. */}
          <div className="absolute left-0 top-full pt-[var(--space-1)] z-[130]">
            <ul id={panelId} className="list-none m-0 w-[12rem] bg-white border border-line rounded-[var(--r-md)] p-[var(--space-1)]">
              {PROGRAM_LINKS.map(([href, label]) => (
                <li key={href}>
                  <a href={href} className={`flex w-full px-3 py-[0.55rem] rounded-[var(--r-md)] text-small no-underline hover:bg-cream ${isActive(href) ? 'font-semibold text-green bg-cream' : 'font-medium text-gold'}`}>{label}</a>
                </li>
              ))}
            </ul>
          </div>
        </PopMenu>
      </li>
      <li><a href="/bali-guide.html" className={LINK(isActive('/bali-guide.html'))}>Guide</a></li>
      <li><a href="/all-reviews.html" className={LINK(isActive('/all-reviews.html'))}>Reviews</a></li>
      <li><a href="/our-company.html" className={LINK(isActive('/our-company.html'))}>Our Company</a></li>
    </ul>
  );
}
