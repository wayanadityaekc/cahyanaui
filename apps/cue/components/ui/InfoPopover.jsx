'use client';

import { useEffect, useRef, useState } from 'react';
import { Info } from 'lucide-react';

// Small info icon + popover; `variant` sets popover and arrow position (default, hero, booking).
function wrap(v) { return `inline-flex align-middle ${v === 'default' ? 'relative' : 'static'}`; }
const BTN =
  'inline-flex items-center justify-center w-[18px] h-[18px] p-0 border-none border-current bg-none text-gold cursor-pointer rounded-[50%] ' +
  '[transition:color_var(--dur-fast)_ease,background_var(--dur-fast)_ease,scale_var(--dur-fast)_var(--ease)] ' +
  'hover:text-green hover:bg-[rgba(34,32,28,0.15)] aria-expanded:text-green aria-expanded:bg-[rgba(34,32,28,0.15)] ' +
  '[&_svg]:w-[var(--icon-sm)] [&_svg]:h-[var(--icon-sm)]';
const POP_BASE =
  "absolute z-[60] w-[min(272px,82vw)] py-[0.85rem] px-[0.9rem] bg-white [border:1px_solid_var(--line)] rounded-md " +
  'text-left normal-case tracking-normal [transition:opacity_var(--dur-fast)_var(--ease),visibility_var(--dur-fast)] motion-reduce:[transition:none] ' +
  "before:content-[''] before:absolute before:top-[-6px] before:w-[11px] before:h-[11px] before:bg-white " +
  'before:[border-left:1px_solid_var(--line)] before:[border-top:1px_solid_var(--line)] before:[transform:rotate(45deg)] ' +
  '[&_p]:m-0 [&_p]:text-small [&_p]:leading-[1.45] [&_p]:font-normal [&_p]:text-[#6b6456]';
// Popover position per variant; consumer 'lead' row styles need ! to beat the [&_p] descendant rule.
const POP_POS = {
  default: 'top-[calc(100%+9px)] left-1/2 [transform:translateX(-50%)] before:left-1/2 before:ml-[-5px]',
  hero: 'top-[2.1rem] left-0 right-auto [transform:none] before:left-[242px] before:ml-0',
  booking: 'top-[1.95rem] left-0 right-auto [transform:none] before:left-[40px] before:ml-0',
};
const POP_OPEN = 'opacity-100 visible pointer-events-auto';
const POP_CLOSED = 'opacity-0 invisible pointer-events-none';

export default function InfoPopover({ children, label = 'How to use this form', variant = 'default' }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    if (!open) return;
    function onDoc(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    }
    function onKey(e) { return e.key === 'Escape' && setOpen(false); }
    document.addEventListener('click', onDoc);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('click', onDoc);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  return (
    <span className={wrap(variant)} ref={ref}>
      <button
        type="button"
        className={BTN}
        aria-expanded={open}
        aria-label={label}
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setOpen((v) => !v);
        }}
      >
        <Info />
      </button>
      <div className={`${POP_BASE} ${POP_POS[variant] || POP_POS.default} ${open ? POP_OPEN : POP_CLOSED}`} role="tooltip">
        {children}
      </div>
    </span>
  );
}
