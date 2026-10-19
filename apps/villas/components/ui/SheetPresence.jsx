'use client';

import { AnimatePresence, LazyMotion, domAnimation, m as motionElement, useReducedMotion } from 'motion/react';
import { useDialog } from '@cahyana/ui';
import useMobile from './useMobile';
import useBodyLock from './useBodyLock';

const CARD_ENTER_OFFSET_PX = 14;
const CARD_ENTER_SCALE = 0.96;
const SCRIM_DURATION_SECONDS = 0.25;
const PANEL_DURATION_SECONDS = 0.3;

const EASE_OUT = [0.16, 1, 0.3, 1];

const SHEET_FROM = { y: '100%', opacity: 1 };
const SHEET_TO = { y: 0, opacity: 1 };
const CARD_FROM = { opacity: 0, y: CARD_ENTER_OFFSET_PX, scale: CARD_ENTER_SCALE };
const CARD_TO = { opacity: 1, y: 0, scale: 1 };

export default function SheetPresence({
  open = false,
  onClose = null,
  shell = '',
  box = '',
  label = 'Dialog',
  children,
}) {
  const reduced = useReducedMotion();
  const isMobile = useMobile();
  useBodyLock(open);
  const dialogRef = useDialog({ shown: open, onClose });

  const scrimDur = reduced ? 0 : SCRIM_DURATION_SECONDS;
  const panelDur = reduced ? 0 : PANEL_DURATION_SECONDS;
  const from = isMobile ? SHEET_FROM : CARD_FROM;
  const to = isMobile ? SHEET_TO : CARD_TO;

  return (
    <LazyMotion features={domAnimation}>
      <AnimatePresence>
        {open && (
          <motionElement.div
            key="shell"
            className={shell}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, pointerEvents: 'none' }}
            transition={{ duration: scrimDur, ease: EASE_OUT }}
            onClick={(event) => event.target === event.currentTarget && onClose?.()}
          >
            <motionElement.div
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
            </motionElement.div>
          </motionElement.div>
        )}
      </AnimatePresence>
    </LazyMotion>
  );
}
