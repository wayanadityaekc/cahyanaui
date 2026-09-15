'use client';

import { useEffect, useRef, useState } from 'react';
import { Info } from 'lucide-react';

// Tailwind-native (full-portable). Popover info kecil (ikon "i" + tooltip). `variant`
// nyetir posisi popover + panah: 'default' (nempel bawah ikon, ke-center), 'hero'
// (search form: anchor kiri field), 'booking' (kolom Price). Konten (p / .binfo__lead)
// di-style lewat [&_p]/[&_.binfo__lead] di container popover.
const wrap = (v) => `inline-flex align-middle ${v === 'default' ? 'relative' : 'static'}`;
const BTN =
  'inline-flex items-center justify-center w-[18px] h-[18px] p-0 border-none border-current bg-none text-gold cursor-pointer rounded-[50%] ' +
  '[transition:color_var(--dur-fast)_ease,background_var(--dur-fast)_ease,scale_var(--dur-fast)_var(--ease)] ' +
  'hover:text-green hover:bg-[rgba(34,32,28,0.15)] aria-expanded:text-green aria-expanded:bg-[rgba(34,32,28,0.15)] ' +
  '[&_svg]:w-[var(--icon-sm)] [&_svg]:h-[var(--icon-sm)]';
const POP_BASE =
  "absolute z-[60] w-[min(272px,82vw)] py-[0.85rem] px-[0.9rem] bg-white [border:1px_solid_#ece6d8] rounded-md [box-shadow:var(--shadow-lg)] " +
  'text-left normal-case tracking-normal [transition:opacity_var(--dur-fast)_var(--ease),visibility_var(--dur-fast)] motion-reduce:[transition:none] ' +
  "before:content-[''] before:absolute before:top-[-6px] before:w-[11px] before:h-[11px] before:bg-white " +
  'before:[border-left:1px_solid_#ece6d8] before:[border-top:1px_solid_#ece6d8] before:[transform:rotate(45deg)] ' +
  '[&_p]:m-0 [&_p]:text-small [&_p]:leading-[1.45] [&_p]:font-normal [&_p]:text-[#6b6456]';
// Note: styling khusus baris "lead" (border-bottom + bold + green) di-set di konsumen
// (pola self-contained), pakai `!` biar ngalahin [&_p] (descendant, specificity 0,1,1).
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
    const onDoc = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    const onKey = (e) => e.key === 'Escape' && setOpen(false);
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
