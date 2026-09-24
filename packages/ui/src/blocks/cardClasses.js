/**
 * Card surfaces. TWO SHAPES, and the difference is real, not a preference:
 *
 *   'framed'  white, hairline border, --r-lg, --shadow-md.
 *             The villa sites' card. It sits on a cream band, so it needs a
 *             border to separate itself from the tint.
 *
 *   'inset'   white, NO border, 5px of padding around the photo so the white
 *             shows as a mat, --shadow-md.
 *             CUE's `.experience__card`. It sits on white, where a border
 *             would be the only line on the page, and the mat is what reads as
 *             the edge instead.
 *
 * Neither sets `display`: a card is `flex flex-col` in one place and `block`
 * in another, and baking one in means every other call site has to fight it.
 * In Tailwind the winner is decided by the compiled stylesheet's order, not by
 * the order classes appear in a string, so a second `display` is a coin flip.
 */
const HOVER_LIFT =
  '[transition:transform_var(--dur-slow)_var(--ease-out),box-shadow_var(--dur-slow)_var(--ease-out)] ' +
  'hover:[box-shadow:var(--shadow-lg)]';

export const CARD_FRAMED =
  'relative rounded-lg overflow-hidden bg-white [border:1px_solid_var(--line)] ' +
  '[box-shadow:var(--shadow-md)] no-underline text-inherit';

export const CARD_INSET =
  'relative rounded-lg p-[5px] overflow-hidden bg-white ' +
  '[box-shadow:var(--shadow-md)] no-underline text-inherit';

export const CARD_SHAPES = { framed: CARD_FRAMED, inset: CARD_INSET };

// Hover lift, opt-in. --ease-out (gentle deceleration) rather than a plain
// `ease`: a card that snaps up under the cursor reads as twitchy.
export const CARD_HOVER_SM = `${HOVER_LIFT} hover:[transform:translateY(-2px)]`;
export const CARD_HOVER_LG = `${HOVER_LIFT} hover:[transform:translateY(-4px)]`;

/**
 * The photo slot inside a card.
 *
 * `ratio` is a caller decision, not baked in: a villa card is 4:3 (a room
 * reads better wide), CUE's programme cards are square. What IS baked in is
 * the wrapper owning the ratio/radius/overflow and the <img> filling it
 * absolutely - set the ratio on the <img> instead and an HTML `height`
 * attribute (which you want, for CLS) quietly wins over the CSS.
 */
export const CARD_MEDIA = 'relative overflow-hidden bg-green';
export const CARD_MEDIA_INSET = `${CARD_MEDIA} rounded-md`;
export const CARD_IMG = 'absolute inset-0 w-full h-full object-cover object-center';

// A dark wash rising from the bottom of the photo, so white text laid over it
// stays readable whatever the picture happens to be.
export const CARD_SCRIM =
  "after:content-[''] after:absolute after:inset-0 " +
  'after:bg-[linear-gradient(to_bottom,transparent_55%,rgba(31,61,43,0.45))]';

// The badge that rides the top-right of a photo: the real gold, reserved for
// "Popular"/featured. Spending amber anywhere else is what stops an accent
// meaning anything.
export const CARD_BADGE_POPULAR =
  'absolute top-[0.8rem] right-[0.8rem] bg-amber text-gold text-label font-semibold ' +
  'tracking-[0.04em] uppercase rounded-pill py-[0.2rem] px-[0.7rem]';
