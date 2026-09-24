/**
 * Page-level boxes: how wide content is allowed to be, and how much air sits
 * between one band and the next.
 *
 * These used to be `.wrap` / `.wrap-mid` / `.wrap-read` / `.section` written as
 * CSS in the villa app's globals.css. They move here because the library owns
 * shape, and because two sites that disagree about their page width do not
 * look like one brand. The tokens they read (--container-*, --container-x,
 * --section-gap) are Layer 1, so a brand can still move its own edges.
 *
 * THREE WIDTHS, AND EACH ANSWERS A DIFFERENT QUESTION:
 *   WRAP      --container-wide  cards, listings, anything in a grid
 *   WRAP_MID  --container-mid   a page whose content is mostly one column
 *   WRAP_READ --container-read  running prose, capped for line length
 * Pick one. A fourth width invented at a call site is how CUE ended up with
 * 1000/1040/1100/1200 all in play at once.
 *
 * The side gutter is a TOKEN (16px phone / 24px from 993px), never a
 * percentage. A percentage gutter changes with the viewport, so nothing lines
 * up with anything at two different widths - and it can never agree with a
 * full-bleed slider, which insets its first card by a fixed 1rem.
 */
const BOX = 'w-full mx-auto px-[var(--container-x)]';

export const WRAP = `${BOX} max-w-[var(--container-wide)]`;
export const WRAP_MID = `${BOX} max-w-[var(--container-mid)]`;
export const WRAP_READ = `${BOX} max-w-[var(--container-read)]`;

export const CONTAINER_WIDTHS = { wide: WRAP, mid: WRAP_MID, read: WRAP_READ };

/**
 * Vertical rhythm. --section-gap (36px) on a phone, where 56px between every
 * band meant a guest scrolled past more nothing than content; 5rem from 768px
 * up, which has the width to carry it.
 */
export const SECTION = 'py-[var(--section-gap)] md:py-20';

/**
 * Band surfaces. A section is either the page surface, the tinted one, or
 * white - there is no fourth. `cream` is what separates two bands on a page
 * with no divider lines, which is how both sites work now.
 */
export const SECTION_TONES = {
  plain: '',
  cream: 'bg-cream',
  white: 'bg-white',
  // Surface only, no text colour: a band that also sets `text-white` changes
  // what every child inherits, including ones that had never asked. The two
  // dark bands on the villa site already colour their own heading and copy.
  dark: 'bg-gold',
};

/**
 * Small helpers that were CSS classes in the villa app and are shared enough to
 * belong here. Each is a string rather than a component: there is no behaviour
 * and no shape to hold together, just a bundle of utilities with a name.
 */

// A circle holding a small icon - the "why stay with us" rows, a card's glyph.
export const ICON_CIRCLE =
  'inline-flex items-center justify-center w-11 h-11 rounded-pill bg-cream text-cta flex-none';

// A row of ★ characters. Amber, because rating stars are one of only three
// jobs the real gold has site-wide. The extra tracking is what stops the stars
// running into each other at small sizes.
export const STARS = 'text-amber tracking-[0.1em]';

/**
 * Running body copy: paragraphs take the body size, the muted colour and a gap.
 *
 * This is a CLASS NAME, not a bundle of utilities, and that is deliberate - the
 * rule lives in tokens.css inside @layer components so that it LOSES to any
 * paragraph that states its own size or colour. See the comment there; it was
 * ported as a utility string first and quietly overruled a gold review quote
 * and nine eyebrows.
 */
export const PROSE_COPY = 'prose-copy';
