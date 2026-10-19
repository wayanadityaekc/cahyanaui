'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { AnimatePresence, LazyMotion, domAnimation, m as motionElement, useReducedMotion } from 'motion/react';

const EASE_OUT = [0.16, 1, 0.3, 1];

function Shell({ children }) {
  return <LazyMotion features={domAnimation}>{children}</LazyMotion>;
}

export function Collapse({ open, children }) {
  const reduced = useReducedMotion();
  const duration = reduced ? 0 : 0.24;
  return (
    <Shell>
      <AnimatePresence initial={false}>
        {open && (
          <motionElement.div
            key="collapse"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ height: { duration, ease: EASE_OUT }, opacity: { duration: duration * 0.75 } }}
            style={{ overflow: 'hidden' }}
          >
            {children}
          </motionElement.div>
        )}
      </AnimatePresence>
    </Shell>
  );
}

export function PopMenu({ open, children }) {
  const reduced = useReducedMotion();
  const duration = reduced ? 0 : 0.18;
  return (
    <Shell>
      <AnimatePresence initial={false}>
        {open && (
          <motionElement.div
            key="pop"
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration, ease: EASE_OUT }}
          >
            {children}
          </motionElement.div>
        )}
      </AnimatePresence>
    </Shell>
  );
}

const STAGGER_STEP = 0.025;
const STAGGER_CAP = 0.2;

const Entered = createContext(false);

export function Stagger({ children, className }) {
  const [isEntered, setIsEntered] = useState(false);
  useEffect(() => setIsEntered(true), []);
  return (
    <Shell>
      <Entered.Provider value={isEntered}>
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
    <motionElement.div
      initial={entered ? { opacity: 0, y: 8 } : false}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.18, ease: EASE_OUT, delay: Math.min(index * STAGGER_STEP, STAGGER_CAP) }}
    >
      {children}
    </motionElement.div>
  );
}
