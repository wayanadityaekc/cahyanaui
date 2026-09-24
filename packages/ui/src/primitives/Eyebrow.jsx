import { cn } from '../lib/cn.js';

/**
 * The small uppercase line above a heading, and the same treatment used inline
 * as a label.
 *
 * 10.24px / weight 500 / 0.14em tracking. The weight matters as much as the
 * size: at 600 the same text reads noticeably larger and heavier, which is
 * what it was before being measured against CUE and corrected. 600 belongs to
 * prices and buttons.
 *
 * THREE EXPORTS, and the split is the point:
 *
 *   CAPS          the treatment ONLY - no colour, no spacing. For an inline
 *                 label that has to take the colour of what it sits in
 *                 ("READ →" in the call-to-action green, a fact label in muted).
 *   EYEBROW       CAPS + the muted colour. The default for a standalone line.
 *   <Eyebrow>     EYEBROW as a block with its bottom margin.
 *
 * Colour is not baked into CAPS because these labels appear in three colours,
 * and appending `text-cta` after a `text-muted` that is already in the string
 * is a coin flip: between two utilities the winner is the compiled
 * stylesheet's order, not the order they were written in.
 */
export const CAPS = 'font-body text-label font-medium tracking-[0.14em] uppercase';

export const EYEBROW = `${CAPS} text-muted`;

/** The standalone line: block, with the gap to the heading under it. */
export const EYEBROW_LINE = `${EYEBROW} block mb-[0.6rem]`;

export default function Eyebrow({ as: Tag = 'p', className, children, ...rest }) {
  return (
    <Tag className={cn(EYEBROW_LINE, className)} {...rest}>
      {children}
    </Tag>
  );
}
