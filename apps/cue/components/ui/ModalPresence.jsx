'use client';

import { AnimatePresence, LazyMotion, domAnimation, m, useReducedMotion } from 'motion/react';
import { SHELL, BOX } from './modalClasses';
import useDialog from './useDialog';

// AnimatePresence wrapper so modals that mount only while open can animate out as well as in.
const EASE_OUT = [0.16, 1, 0.3, 1];
const BOX_FROM = { opacity: 0, y: 14, scale: 0.96 };
const BOX_TO = { opacity: 1, y: 0, scale: 1 };

// `label` is the dialog's accessible name (read out when it opens). Every caller passes one.
export default function ModalPresence({ open, onClose, label, box = BOX, shellClass = SHELL, children }) {
  const boxRef = useDialog({ shown: open, onClose });
  const reduced = useReducedMotion();
  const shell = reduced ? 0 : 0.25;
  const card = reduced ? 0 : 0.32;

  return (
    <LazyMotion features={domAnimation}>
      <AnimatePresence>
        {open && (
          <m.div
            key="shell"
            className={shellClass}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            // pointerEvents must be in `exit`, not a style keyed on `open`, or the leaving card stays clickable.
            exit={{ opacity: 0, pointerEvents: 'none' }}
            transition={{ duration: shell, ease: EASE_OUT }}
            // Backdrop click closes; clicks inside the card don't count.
            onClick={(e) => e.target === e.currentTarget && onClose?.()}
          >
            <m.div
              key="box"
              ref={boxRef}
              role="dialog"
              aria-modal="true"
              aria-label={label}
              className={`${box} outline-none`}
              initial={BOX_FROM}
              animate={BOX_TO}
              exit={BOX_FROM}
              transition={{ duration: card, ease: EASE_OUT }}
            >
              {children}
            </m.div>
          </m.div>
        )}
      </AnimatePresence>
    </LazyMotion>
  );
}
