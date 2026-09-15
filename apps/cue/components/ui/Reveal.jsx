'use client';

import { AnimatePresence, LazyMotion, domAnimation, m, useReducedMotion } from 'motion/react';

// Open/close animations for menus that used to be toggled with `display`, which
// cannot be animated at all - that is why they popped open and shut while the
// drawer sliding them in was smooth.
//
// LazyMotion + `m` rather than the full `motion` component: that is the leanest
// way to ship this library. Measured (gzip, JS the homepage actually loads):
//   no motion .................. 295.3 KB
//   LazyMotion + domAnimation .. 332.0 KB   <- what we ship
//   + features code-split ...... 338.9 KB
// Code-splitting the feature set is LARGER, not smaller: the async chunk ends up
// duplicating core runtime that LazyMotion needs eagerly anyway. Don't "optimise"
// it back into a dynamic import without re-measuring.
//
// Timing mirrors the CSS tokens the rest of the site animates on (--dur /
// --ease-out) so this does not read as a second, unrelated motion system.
const EASE_OUT = [0.16, 1, 0.3, 1];

function Shell({ children }) {
  return <LazyMotion features={domAnimation}>{children}</LazyMotion>;
}

// Inline menus that push the content below them down (navbar Program submenu,
// the mobile category list). Animating height needs overflow hidden, which is
// why this must NOT be used on an absolutely-positioned dropdown - it would clip
// the panel to nothing.
export function Collapse({ open, children }) {
  const reduced = useReducedMotion();
  const duration = reduced ? 0 : 0.24;
  return (
    <Shell>
      {/* initial={false}: an already-open menu should not animate on first paint. */}
      <AnimatePresence initial={false}>
        {open && (
          <m.div
            key="collapse"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ height: { duration, ease: EASE_OUT }, opacity: { duration: duration * 0.75 } }}
            style={{ overflow: 'hidden' }}
          >
            {children}
          </m.div>
        )}
      </AnimatePresence>
    </Shell>
  );
}

// Floating panels that sit on top of the page (the guide-hub category dropdown).
// Fade plus a short rise - no height animation, so nothing clips, and the child
// keeps whatever `absolute` positioning it already had.
export function PopMenu({ open, children }) {
  const reduced = useReducedMotion();
  const duration = reduced ? 0 : 0.18;
  return (
    <Shell>
      <AnimatePresence initial={false}>
        {open && (
          <m.div
            key="pop"
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration, ease: EASE_OUT }}
          >
            {children}
          </m.div>
        )}
      </AnimatePresence>
    </Shell>
  );
}
