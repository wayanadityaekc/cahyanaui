'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { AnimatePresence, LazyMotion, domAnimation, m, useReducedMotion } from 'motion/react';

// Menu open/close animations via LazyMotion + domAnimation; don't code-split the features (it measured larger).
const EASE_OUT = [0.16, 1, 0.3, 1];

function Shell({ children }) {
  return <LazyMotion features={domAnimation}>{children}</LazyMotion>;
}

// Inline menus that push content down; animates height with overflow hidden, so never use on absolute dropdowns.
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

// Floating panels: fade + short rise, no height animation, so absolute children are not clipped.
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

// Staggered fade for items mounted after the page (not layout animation, too heavy); no AnimatePresence initial={false}.
const STAGGER_STEP = 0.025;   // seconds between cards
const STAGGER_CAP = 0.2;      // ...capped, so a long list does not crawl

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
      // initial is read only on mount: none for cards that came with the page, a start state for later ones.
      initial={entered ? { opacity: 0, y: 8 } : false}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.18, ease: EASE_OUT, delay: Math.min(index * STAGGER_STEP, STAGGER_CAP) }}
    >
      {children}
    </m.div>
  );
}
