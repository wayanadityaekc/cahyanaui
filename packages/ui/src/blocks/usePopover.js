'use client';

import { useEffect, useRef, useState } from 'react';

/**
 * Open/close state for a small floating panel hung off a trigger: tap outside or
 * Escape closes it. Shared by AccountMenu and DesktopNav.
 *
 * Portaled popups (a Select inside the panel) render outside the panel's DOM, so a
 * click in one would read as "outside" and shut the panel mid-choice. Anything
 * under `[data-portal]` is ignored, and Escape is left to an open select first.
 */
export default function usePopover() {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  useEffect(() => {
    if (!open) return undefined;
    const onDoc = (e) => {
      if (e.target.closest && e.target.closest('[data-portal]')) return;
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    const onKey = (e) => {
      if (e.key !== 'Escape') return;
      if (document.querySelector('[data-portal][data-open]')) return;
      setOpen(false);
    };
    document.addEventListener('click', onDoc);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('click', onDoc);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);
  return { open, setOpen, ref };
}

/**
 * The panel's show/hide. CSS only - no animation library (see Collapse.jsx for
 * why): fade plus a 6px rise, and `invisible` + no pointer events when shut so a
 * keyboard tab cannot land inside a menu nobody can see.
 */
export const POP_PANEL =
  'absolute z-[130] bg-surface-raised [border:1px_solid_var(--line)] rounded-[var(--r-md)] p-[var(--space-1)] ' +
  '[transition:opacity_var(--dur-fast)_var(--ease),translate_var(--dur-fast)_var(--ease),visibility_var(--dur-fast)] ' +
  'motion-reduce:transition-none';
export const popState = (open) =>
  (open ? 'opacity-100 translate-y-0 visible' : 'opacity-0 -translate-y-[6px] invisible pointer-events-none');
