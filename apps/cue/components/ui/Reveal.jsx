'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { AnimatePresence, LazyMotion, domAnimation, m as motionTags, useReducedMotion } from 'motion/react';

const COLLAPSE_DURATION_SECONDS = 0.24;
const OPACITY_DURATION_RATIO = 0.75;
const FADE_DURATION_SECONDS = 0.18;
const DROPDOWN_OFFSET_PX = 6;
const ENTER_OFFSET_PX = 8;

const EASE_OUT = [0.16, 1, 0.3, 1];

function Shell({ children }) {
  return <LazyMotion features={domAnimation}>{children}</LazyMotion>;
}

export function Collapse({ open, children }) {
  const reduced = useReducedMotion();
  const duration = reduced ? 0 : COLLAPSE_DURATION_SECONDS;
  return (
    <Shell>
      <AnimatePresence initial={false}>
        {open && (
          <motionTags.div
            key="collapse"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{
              height: { duration, ease: EASE_OUT },
              opacity: { duration: duration * OPACITY_DURATION_RATIO },
            }}
            style={{ overflow: 'hidden' }}
          >
            {children}
          </motionTags.div>
        )}
      </AnimatePresence>
    </Shell>
  );
}

export function PopMenu({ open, children }) {
  const reduced = useReducedMotion();
  const duration = reduced ? 0 : FADE_DURATION_SECONDS;
  return (
    <Shell>
      <AnimatePresence initial={false}>
        {open && (
          <motionTags.div
            key="pop"
            initial={{ opacity: 0, y: -DROPDOWN_OFFSET_PX }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -DROPDOWN_OFFSET_PX }}
            transition={{ duration, ease: EASE_OUT }}
          >
            {children}
          </motionTags.div>
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
    <motionTags.div
      initial={entered ? { opacity: 0, y: ENTER_OFFSET_PX } : false}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: FADE_DURATION_SECONDS,
        ease: EASE_OUT,
        delay: Math.min(index * STAGGER_STEP, STAGGER_CAP),
      }}
    >
      {children}
    </motionTags.div>
  );
}
