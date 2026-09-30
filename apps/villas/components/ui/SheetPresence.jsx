'use client';

import { AnimatePresence, LazyMotion, domAnimation, m, useReducedMotion } from 'motion/react';
import { useDialog } from '@cahyana/ui';
import useMobile from './useMobile';
import useBodyLock from './useBodyLock';

// AnimatePresence keeps the panel mounted until its exit finishes: CSS alone cannot animate an unmounting element.
const EASE_OUT = [0.16, 1, 0.3, 1];

// Bottom sheet on a phone, centred card on desktop, so each gets its own motion; useMobile picks.
const SHEET_FROM = { y: '100%', opacity: 1 };
const SHEET_TO = { y: 0, opacity: 1 };
const CARD_FROM = { opacity: 0, y: 14, scale: 0.96 };
const CARD_TO = { opacity: 1, y: 0, scale: 1 };

export default function SheetPresence({ open = false, onClose = null, shell = '', box = '', label = 'Dialog', children }) {
  const reduced = useReducedMotion();
  const isMobile = useMobile();
  useBodyLock(open);
  const dialogRef = useDialog({ shown: open, onClose });

  const scrimDur = reduced ? 0 : 0.25;
  const panelDur = reduced ? 0 : 0.3;
  const from = isMobile ? SHEET_FROM : CARD_FROM;
  const to = isMobile ? SHEET_TO : CARD_TO;

  return (
    <LazyMotion features={domAnimation}>
      <AnimatePresence>
        {open && (
          <m.div
            key="shell"
            className={shell}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            // pointerEvents goes in exit, not a style from open: the leaving element keeps old props, so buttons stay clickable.
            exit={{ opacity: 0, pointerEvents: 'none' }}
            transition={{ duration: scrimDur, ease: EASE_OUT }}
            onClick={(e) => e.target === e.currentTarget && onClose?.()}
          >
            <m.div
              key="box"
              ref={dialogRef}
              role="dialog"
              aria-modal="true"
              aria-label={label}
              className={box}
              initial={from}
              animate={to}
              exit={from}
              transition={{ duration: panelDur, ease: EASE_OUT }}
            >
              {children}
            </m.div>
          </m.div>
        )}
      </AnimatePresence>
    </LazyMotion>
  );
}
