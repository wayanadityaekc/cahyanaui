'use client';

import { useEffect, useRef, useState } from 'react';
import { Info } from 'lucide-react';
import { PopMenu } from '@/components/ui/Reveal';

const BTN =
  'shrink-0 flex items-center p-0 bg-transparent border-none cursor-pointer text-muted ' +
  '[transition:color_var(--dur)_var(--ease),opacity_var(--dur)_var(--ease),scale_var(--dur-fast)_var(--ease)] hover:text-gold';
const PANEL_BASE =
  'absolute top-[calc(100%+var(--space-1))] z-30 p-[var(--space-1)] ' +
  'bg-white [border:1px_solid_var(--line)] rounded-md ' +
  'font-body text-body leading-[var(--lh-body)] text-ink text-left';
const PANEL_ALIGN = {
  start: 'left-0 w-[min(16rem,72vw)]',
  end: 'right-0 w-[min(16rem,58vw)]',
};

const ICON = {
  normal: 'w-[var(--icon-sm)] h-[var(--icon-sm)]',
  subtle: 'w-[0.8rem] h-[0.8rem]',
};
const FADE = {
  normal: '',
  subtle: ' opacity-55 hover:opacity-100 focus-visible:opacity-100 aria-expanded:opacity-100',
};

export default function InfoDot({ label = 'More information', align = 'start', subtle = false, children }) {
  const tone = subtle ? 'subtle' : 'normal';
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    if (!open) return undefined;
    function onDown(event) {
      if (!ref.current?.contains(event.target)) setOpen(false);
    }
    function onKey(event) {
      if (event.key === 'Escape') setOpen(false);
    }
    document.addEventListener('pointerdown', onDown);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('pointerdown', onDown);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  return (
    <span className="relative flex" ref={ref}>
      <button
        type="button"
        data-infodot
        aria-haspopup="true"
        aria-expanded={open}
        aria-label={label}
        className={BTN + FADE[tone]}
        onClick={() => setOpen((wasOpen) => !wasOpen)}
      >
        <Info strokeWidth={1.7} className={ICON[tone]} aria-hidden="true" />
      </button>
      <PopMenu open={open}>
        <span className={`${PANEL_BASE} ${PANEL_ALIGN[align] || PANEL_ALIGN.start}`} role="note">
          {children}
        </span>
      </PopMenu>
    </span>
  );
}
