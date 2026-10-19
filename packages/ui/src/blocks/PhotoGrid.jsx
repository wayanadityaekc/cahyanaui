'use client';

import { useEffect, useRef } from 'react';
import { cn } from '../lib/cn.js';
import useBodyLock from '../lib/useBodyLock.js';
import useDialog from '../lib/useDialog.js';

export default function PhotoGrid({ images = [], open, onClose, startAt = 0, label = 'Photos' }) {
  const scroller = useRef(null);
  const pushed = useRef(false);

  useBodyLock(open);
  const dialogRef = useDialog({ shown: open, onClose, escape: false });

  useEffect(() => {
    if (!open) return;
    const element = scroller.current?.querySelector(`[data-photo="${startAt}"]`);
    if (element) element.scrollIntoView({ block: 'start', behavior: 'instant' });
    else scroller.current?.scrollTo(0, 0);
  }, [open, startAt]);

  useEffect(() => {
    if (!open) return undefined;
    function onKey(e) { if (e.key === 'Escape') onClose(); }
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  useEffect(() => {
    if (!open) {
      if (pushed.current) { pushed.current = false; history.back(); }
      return undefined;
    }
    history.pushState({ photoGrid: true }, '');
    pushed.current = true;
    function onPop() { pushed.current = false; onClose(); }
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, [open, onClose]);

  return (
    <div
      ref={dialogRef}
      className={cn(
        'fixed inset-0 z-[300] bg-surface-raised',
        '[transition:opacity_var(--dur)_var(--ease),visibility_var(--dur)_var(--ease)]',
        open ? 'opacity-100 visible' : 'opacity-0 invisible pointer-events-none',
      )}
      role="dialog"
      aria-modal="true"
      aria-label={label}
      aria-hidden={open ? undefined : 'true'}
      data-photogrid={open ? 'open' : 'closed'}
    >
      <button
        type="button"
        onClick={onClose}
        aria-label="Close photos"
        className="fixed z-[310] right-4 [top:max(1rem,env(safe-area-inset-top))] w-10 h-10 rounded-base bg-black/45 text-white grid place-items-center cursor-pointer backdrop-blur-[2px] hover:bg-black/65"
      >
        <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
          <path d="M6 6l12 12M18 6L6 18" />
        </svg>
      </button>

      <div ref={scroller} className="h-full overflow-y-auto overscroll-contain [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <div className="grid grid-cols-1 min-[768px]:grid-cols-2 gap-2 p-2 pb-16">
          {images.map((img, i) => (
            <figure key={img.src + i} data-photo={i} className="m-0 scroll-mt-1">
              <img
                src={img.src}
                alt={img.alt || ''}
                loading={i < 3 ? undefined : 'lazy'}
                className="block w-full h-auto object-cover rounded-base bg-cream"
              />
            </figure>
          ))}
        </div>
      </div>
    </div>
  );
}
