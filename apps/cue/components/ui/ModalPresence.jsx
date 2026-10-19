'use client';

import { AnimatePresence, LazyMotion, domAnimation, m as motionTags, useReducedMotion } from 'motion/react';
import { SHELL, BOX } from './modalClasses';
import useDialog from './useDialog';

const EASE_OUT = [0.16, 1, 0.3, 1];
const BOX_FROM = { opacity: 0, y: 14, scale: 0.96 };
const BOX_TO = { opacity: 1, y: 0, scale: 1 };

export default function ModalPresence({ open, onClose, label, box = BOX, shellClass = SHELL, children }) {
  const boxRef = useDialog({ shown: open, onClose });
  const reduced = useReducedMotion();
  const shell = reduced ? 0 : 0.25;
  const card = reduced ? 0 : 0.32;

  return (
    <LazyMotion features={domAnimation}>
      <AnimatePresence>
        {open && (
          <motionTags.div
            key="shell"
            className={shellClass}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, pointerEvents: 'none' }}
            transition={{ duration: shell, ease: EASE_OUT }}
            onClick={(event) => event.target === event.currentTarget && onClose?.()}
          >
            <motionTags.div
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
            </motionTags.div>
          </motionTags.div>
        )}
      </AnimatePresence>
    </LazyMotion>
  );
}
