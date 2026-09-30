'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { AnimatePresence, LazyMotion, domAnimation, m, useReducedMotion } from 'motion/react';

// Mirrors the CSS --ease-out token so menus and CSS transitions share one motion rhythm.
const EASE_OUT = [0.16, 1, 0.3, 1];

// LazyMotion + m is the leanest setup; code-splitting features measured larger, so re-measure before changing.
function Shell({ children }) {
  return <LazyMotion features={domAnimation}>{children}</LazyMotion>;
}

// Inline menu that pushes content down; never use it on an absolute dropdown, overflow hidden clips it to nothing.
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

// Floating panel over the page: fade and short rise, no height animation, so an absolute child is not clipped.
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

// Seconds between cards in a staggered fade (not `layout`, which costs +12 KB gzip on every page).
const STAGGER_STEP = 0.025;
// Cap on the total delay, so a long list does not crawl.
const STAGGER_CAP = 0.2;

// No AnimatePresence initial={false}: it suppresses every descendant forever, so this flips after mount instead.
const Entered = createContext(false);

export function Stagger({ children, className }) {
  const [entered, setEntered] = useState(false);
  useEffect(() => setEntered(true), []);
  return (
    <Shell>
      <Entered.Provider value={entered}>
        <div className={className}>{children}</div>
      </Entered.Provider>
    </Shell>
  );
}

export function StaggerItem({ index = 0, children }) {
  const reduced = useReducedMotion();
  const entered = useContext(Entered);
  if (reduced) return children;
  return (
    <m.div
      // initial is read only on mount: false for cards that arrive with the page, a real start for later ones.
      initial={entered ? { opacity: 0, y: 8 } : false}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.18, ease: EASE_OUT, delay: Math.min(index * STAGGER_STEP, STAGGER_CAP) }}
    >
      {children}
    </m.div>
  );
}
