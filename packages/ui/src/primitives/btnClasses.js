/**
 * Button shape, as a string, so a hand-written button and the Button component
 * cannot drift apart. Ported from CUE (components/ui/btnClasses.js) - this IS
 * the same system, not a second one.
 *
 * ONE SIZE. CUE ran a census and found 28 button variants, with the green CTA
 * alone appearing at ELEVEN different heights (30/33/34/40/42/43/45/46/47/48/49px)
 * and four text sizes, in a codebase whose own docs said 46. Wayan picked "A -
 * semua small" off the measured sheet, plus "make sure semua text align center,
 * margin bottom top center juga". So there is one height and there is no `size`
 * prop to re-open the question.
 *
 *   height  --btn-h 2.1rem (33.6px), a token of its own
 *   text    --fs-small 0.8rem (12.8px)
 *   radius  --r-sm 8px. That is also what shadcn's `rounded-md` computes to, so
 *           agreeing with shadcn here costs no new number.
 *   centre  BOTH axes: items-center + justify-center + text-center, py-0 so no
 *           leftover vertical padding shifts the label, and leading-none to
 *           remove the line-box slack that made short labels sit low.
 *
 * GEOMETRY ONLY - colour, width, display and transition stay with the caller.
 * `display` is deliberately NOT in here: some callers need `flex`, some
 * `inline-flex`, some scope it to a breakpoint, and in Tailwind the winner is
 * the compiled stylesheet's order, not the order classes appear in a string.
 * A CALLER MUST BRING ITS OWN FLEX, or items-center/justify-center do nothing.
 *
 * CONVERTING AN OLD BUTTON: delete its h- / py- / px- / text- / rounded-
 * classes. Adding BTN_SM beside them overrides NOTHING - CSS order decides.
 * CUE got caught by this twice.
 */
export const BTN_SM =
  'items-center justify-center text-center leading-none whitespace-nowrap ' +
  'h-[var(--btn-h)] py-0 px-4 rounded-sm text-small font-semibold';

/**
 * The ghost/secondary pill - "All tours", "View all", a review CTA. Outlined in
 * the soft black, filling on hover. This is the one place a pill survives: it
 * marks "see more of this", which is a different job from "do the thing".
 */
export const BTN_PILL =
  `inline-flex ${BTN_SM} [border:1px_solid_var(--color-gold)] ` +
  'bg-white text-gold-d font-body no-underline ' +
  '[transition:background-color_var(--dur)_ease,color_var(--dur)_ease,scale_var(--dur-fast)_var(--ease)] ' +
  'hover:bg-gold hover:text-white';

/** Stretch a button across its container. Pairs with any variant. */
export const BTN_FULL = 'flex w-full';
