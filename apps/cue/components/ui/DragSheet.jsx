'use client';

import { useRef } from 'react';

// Swipe-down-to-close for a bottom sheet, layered on top of the CSS that already
// slides it in and out.
//
// Framer Motion was tried for this first and measured: drag lives in its larger
// feature set (domMax), and pulling that in cost +12 KB gzip on EVERY page -
// including pages with no sheet at all - because motion/react already sits in the
// shared chunk via the navbar, so the extra features land there too. Splitting it
// into a dynamic import did not move the number. Pointer events do the same job
// in this file for nothing, so that is what this is.
//
// The two systems do not fight: the CSS class sets the standalone `translate`
// property for open/closed, this sets `transform` for the finger, and the browser
// composes them. The resting position is still entirely the CSS's business.
//
// Dragging starts from a handle, never the whole sheet: the sheet is a form with
// a scrollable body, and a sheet-wide listener would swallow scrolling and field
// taps on a phone.
const CLOSE_DISTANCE = 90;    // px dragged down
const CLOSE_VELOCITY = 0.5;   // px/ms, so a short fast flick also closes
const SPRING_BACK = 'transform 0.25s var(--ease-out)';

export default function DragSheet({ enabled, onDismiss, className, children, ...rest }) {
  const ref = useRef(null);
  const drag = useRef(null);

  const onPointerDown = (e) => {
    if (!enabled || !ref.current) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    drag.current = { y0: e.clientY, t0: e.timeStamp, dy: 0 };
    ref.current.style.transition = 'none';
  };

  const onPointerMove = (e) => {
    const d = drag.current;
    if (!d || !ref.current) return;
    // Downward only - pulling up must not lift the sheet off the screen edge.
    d.dy = Math.max(0, e.clientY - d.y0);
    ref.current.style.transform = `translateY(${d.dy}px)`;
  };

  const onPointerUp = (e) => {
    const d = drag.current;
    if (!d || !ref.current) return;
    drag.current = null;
    const el = ref.current;
    const velocity = d.dy / Math.max(1, e.timeStamp - d.t0);

    // Hand the resting position back to CSS, and let the finger offset ease out.
    el.style.transition = SPRING_BACK;
    el.style.transform = 'translateY(0px)';
    const clear = () => {
      el.style.transition = '';
      el.style.transform = '';
      el.removeEventListener('transitionend', clear);
    };
    el.addEventListener('transitionend', clear);

    if (d.dy > CLOSE_DISTANCE || velocity > CLOSE_VELOCITY) onDismiss?.();
  };

  return (
    <div ref={ref} className={className} {...rest}>
      {/* The grab area, sitting over the pill the sheet already draws as a
          ::before. touch-action:none keeps the browser from scrolling the page
          instead of handing us the gesture. */}
      {enabled && (
        <span
          className="absolute top-0 left-0 right-0 h-8 z-[2] [touch-action:none] cursor-grab active:cursor-grabbing min-[993px]:hidden"
          aria-hidden="true"
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerUp}
        />
      )}
      {children}
    </div>
  );
}
