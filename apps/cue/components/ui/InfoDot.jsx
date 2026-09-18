'use client';

import { useEffect, useRef, useState } from 'react';
import { Info } from 'lucide-react';
import { PopMenu } from '@/components/ui/Reveal';

// A small info button beside a heading: the long explanation lives behind it and
// only appears when a guest asks for it (Wayan, Sep 2026: "jangan terlalu banyak
// tulisan bro, isi aja icon tanda seru buat informasi di samping your trip terus
// deskripsi yang panjang ... pindahin kesana, akan muncul kalau di klik").
//
// It FLOATS, like every other panel on the site: an opaque surface, a border and
// --shadow-lg, or the text under it reads through; and tap-outside plus Escape to
// close, because a floating panel has no way of getting out of the way on its own.
const BTN =
  'shrink-0 flex items-center p-0 bg-transparent border-none cursor-pointer text-muted ' +
  '[transition:color_var(--dur)_var(--ease),scale_var(--dur-fast)_var(--ease)] hover:text-gold';
const PANEL =
  'absolute left-0 top-[calc(100%+var(--space-1))] z-30 w-[min(16rem,72vw)] p-[var(--space-1)] ' +
  'bg-white [border:1px_solid_var(--line)] rounded-md [box-shadow:var(--shadow-lg)] ' +
  'font-body text-body leading-[var(--lh-body)] text-ink text-left';

export default function InfoDot({ label = 'More information', children }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

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
    // This wrapper hugs the button and carries no padding of its own: the panel's
    // top:100% resolves against PopMenu's transformed div while the entrance runs
    // and against this wrapper once it settles, and those two only agree while the
    // wrapper ends where the button does.
    <span className="relative flex" ref={ref}>
      <button
        type="button"
        data-infodot
        aria-haspopup="true"
        aria-expanded={open}
        aria-label={label}
        className={BTN}
        onClick={() => setOpen((v) => !v)}
      >
        <Info strokeWidth={1.7} className="w-[var(--icon-sm)] h-[var(--icon-sm)]" aria-hidden="true" />
      </button>
      <PopMenu open={open}>
        <span className={PANEL} role="note">{children}</span>
      </PopMenu>
    </span>
  );
}
