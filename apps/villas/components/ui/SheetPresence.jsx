'use client';

import { AnimatePresence, LazyMotion, domAnimation, m, useReducedMotion } from 'motion/react';
import useMobile from './useMobile';
import useBodyLock from './useBodyLock';

// The one job CSS genuinely cannot do: animating a panel OUT.
//
// This is CUE's ModalPresence idea. A dialog that only mounts while open can
// have a keyframe entrance — a keyframe plays from frame one regardless of
// prior state — but it can have no exit at all, because the element is gone
// from the DOM before any transition could run. That is exactly what the
// booking sheet did: it rose in nicely with `animate-[sheetIn]` and then
// vanished. AnimatePresence keeps the element in the tree until its exit
// animation has finished, then unmounts it.
//
// DIFFERENT FROM CUE'S IN ONE WAY, on purpose: CUE's dialogs are centred cards
// at every width, so it has one pair of variants. This sheet is a bottom sheet
// on a phone and a centred card on a desktop, so the motion has to differ too
// — sliding a centred card up from off-screen looks wrong, and scaling a
// bottom sheet looks like a card that lost its anchor. `useMobile` picks.
//
// Runs on the feature set already loaded site-wide through the navbar
// (domAnimation), so it costs nothing extra.
const EASE_OUT = [0.16, 1, 0.3, 1];

const SHEET_FROM = { y: '100%', opacity: 1 };
const SHEET_TO = { y: 0, opacity: 1 };
const CARD_FROM = { opacity: 0, y: 14, scale: 0.96 };
const CARD_TO = { opacity: 1, y: 0, scale: 1 };

export default function SheetPresence({ open, onClose, shell, box, children }) {
  const reduced = useReducedMotion();
  const isMobile = useMobile();
  useBodyLock(open);

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
            // pointerEvents belongs in `exit`, NOT in a style prop derived from
            // `open`: AnimatePresence re-renders the leaving element with the
            // props it already had, so anything computed from `open` is baked
            // in as "auto" and never updates — leaving the buttons clickable
            // for the whole fade out.
            exit={{ opacity: 0, pointerEvents: 'none' }}
            transition={{ duration: scrimDur, ease: EASE_OUT }}
            onClick={(e) => e.target === e.currentTarget && onClose?.()}
          >
            <m.div
              key="box"
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
