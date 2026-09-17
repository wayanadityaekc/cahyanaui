'use client';

import { AnimatePresence, LazyMotion, domAnimation, m, useReducedMotion } from 'motion/react';
import { SHELL, BOX } from './modalClasses';

// The one job CSS genuinely cannot do: animating a modal OUT.
//
// These dialogs mount only while open, so they had a keyframe entrance (it plays
// from frame one regardless of prior state) and no exit at all - on close the
// element was gone from the DOM before any transition could run, which is why
// closing felt abrupt while opening did not. AnimatePresence holds the element in
// the tree until its exit animation finishes, then unmounts it.
//
// Uses the feature set already loaded site-wide via the navbar (domAnimation), so
// this costs nothing extra. Entrance values match the keyframes it replaces
// (heroFadeIn on the backdrop, popCardIn on the card) so nothing looks different
// on the way in.
const EASE_OUT = [0.16, 1, 0.3, 1];
const BOX_FROM = { opacity: 0, y: 14, scale: 0.96 };
const BOX_TO = { opacity: 1, y: 0, scale: 1 };

export default function ModalPresence({ open, onClose, box = BOX, children }) {
  const reduced = useReducedMotion();
  const shell = reduced ? 0 : 0.25;
  const card = reduced ? 0 : 0.32;

  return (
    <LazyMotion features={domAnimation}>
      <AnimatePresence>
        {open && (
          <m.div
            key="shell"
            className={SHELL}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            // pointerEvents belongs in `exit`, NOT in a style prop keyed on
            // `open`: AnimatePresence re-renders the leaving element with the
            // props it already had, so a style computed from `open` is baked in
            // as "auto" and never updates. Measured - the first attempt left the
            // card clickable all the way out.
            exit={{ opacity: 0, pointerEvents: 'none' }}
            transition={{ duration: shell, ease: EASE_OUT }}
            // Backdrop click closes, same as before. The check keeps clicks
            // inside the card from bubbling up and closing it.
            onClick={(e) => e.target === e.currentTarget && onClose?.()}
          >
            <m.div
              key="box"
              className={box}
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
