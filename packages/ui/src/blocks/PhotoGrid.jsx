'use client';

import { useEffect, useRef } from 'react';
import { cn } from '../lib/cn.js';
import useBodyLock from '../lib/useBodyLock.js';

/**
 * FULL-SCREEN PHOTO GRID. Tap a photo anywhere and this opens over the whole
 * screen: no header, no card, no arrows - just the photographs, scrolled.
 *
 * WHY A GRID AND NOT A FLIP-THROUGH. A carousel shows one photo and hides how
 * many more there are, so the guest has to press a button as many times as
 * there are rooms to find out whether they like the place. A scrolled grid
 * answers "what does this villa look like" in one gesture, which is the
 * question they actually have. It is also what the big hotel sites do, for the
 * same reason.
 *
 * NO CHROME IS A REAL CONSTRAINT, NOT A STYLE. The only thing drawn over the
 * photographs is the close control, and it is small and in the corner. Nothing
 * else - no counter, no captions on top of the image, no share button. Adding
 * any of them puts the interface back in front of the thing being looked at.
 *
 * CLOSING: the X, Escape, and the browser's own back gesture. Back matters most
 * on a phone, where a full-screen overlay looks exactly like a page and every
 * guest will swipe back out of it - so a history entry is pushed on open and
 * popped on close, and the overlay closes when that entry is popped. Without
 * it, "back" leaves the villa page entirely and the guest loses their place.
 */
export default function PhotoGrid({ images = [], open, onClose, startAt = 0, label = 'Photos' }) {
  const scroller = useRef(null);
  const pushed = useRef(false);

  useBodyLock(open);

  // Open on the photo that was tapped, not at the top - the guest pointed at
  // something and expects to land on it.
  useEffect(() => {
    if (!open) return;
    const el = scroller.current?.querySelector(`[data-photo="${startAt}"]`);
    if (el) el.scrollIntoView({ block: 'start', behavior: 'instant' });
    else scroller.current?.scrollTo(0, 0);
  }, [open, startAt]);

  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  // The back gesture. A history entry is pushed when the overlay opens; popping
  // it closes the overlay instead of leaving the page.
  useEffect(() => {
    if (!open) {
      // Closed some other way (the X, Escape) while our entry is still on the
      // stack - take it back off, or the guest's next "back" does nothing.
      if (pushed.current) { pushed.current = false; history.back(); }
      return undefined;
    }
    history.pushState({ photoGrid: true }, '');
    pushed.current = true;
    const onPop = () => { pushed.current = false; onClose(); };
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, [open, onClose]);

  return (
    <div
      className={cn(
        'fixed inset-0 z-[300] bg-white',
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
        // The one piece of chrome. Dark disc so it reads against a pale photo
        // and a dark one alike, and inside the safe area on a notched phone.
        className="fixed z-[310] right-4 [top:max(1rem,env(safe-area-inset-top))] w-10 h-10 rounded-[50%] bg-black/45 text-white grid place-items-center cursor-pointer backdrop-blur-[2px] hover:bg-black/65"
      >
        <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
          <path d="M6 6l12 12M18 6L6 18" />
        </svg>
      </button>

      <div ref={scroller} className="h-full overflow-y-auto overscroll-contain [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {/* One column on a phone, two from 768px. Not three: these are rooms,
            and a room at a third of a laptop screen is a thumbnail. */}
        <div className="grid grid-cols-1 min-[768px]:grid-cols-2 gap-1 min-[768px]:gap-2 p-1 min-[768px]:p-2 pb-16">
          {images.map((img, i) => (
            <figure key={img.src + i} data-photo={i} className="m-0 scroll-mt-1">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={img.src}
                alt={img.alt || ''}
                // `loading` is not lazy for the first few: the guest is looking
                // at them the moment this opens.
                loading={i < 3 ? undefined : 'lazy'}
                className="block w-full h-auto object-cover bg-cream"
              />
            </figure>
          ))}
        </div>
      </div>
    </div>
  );
}
