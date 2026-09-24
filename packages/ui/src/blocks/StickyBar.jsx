'use client';

import { cn } from '../lib/cn.js';

/**
 * THE ONE THING ALLOWED TO STICK TO THE BOTTOM OF THE SCREEN ON MOBILE.
 *
 * That is the whole reason this is a component. A guest should see one bar, in
 * one place, whatever page they are on, and never two things stacked at the
 * bottom edge. CUE learned this the hard way: a floating chat button and a
 * section switcher fought over the same strip.
 *
 *   variant  'flush'     full width, hard against the bottom edge, top corners
 *                        only. CUE's book bar (the GetYourGuide pattern).
 *            'floating'  an inset rounded card. The villa detail page's bar.
 *   show     false slides it out of view. It stays MOUNTED - unmounting it
 *            makes the body padding that reserves its room flicker.
 *
 * THE TWO VARIANTS ARE NOT INTERCHANGEABLE DECORATION. Each one implies three
 * other things, and the pairs are opposites:
 *
 *   flush     border on the TOP only (the sides and bottom are off-screen);
 *             shadow cast UPWARD, because a downward shadow is swallowed by the
 *             screen edge and the bar reads as pasted on with no elevation;
 *             env(safe-area-inset-bottom) is REQUIRED - on an iPhone the home
 *             indicator lives in that strip and the CTA lands under it.
 *   floating  all four borders and a full radius are on screen, so the normal
 *             downward --shadow-xl is right; `bottom-4` already clears the home
 *             indicator, so no safe-area inset.
 *
 * Switch a bar from one to the other and all three have to move with it.
 *
 * `stickybar` is the marker class. It is the hook a page uses to reserve room
 * at the bottom (`has-[.stickybar]:pb-…`) and the hook a test uses to assert
 * only ONE bar is mounted. Scope any such rule to the mobile band: the element
 * stays in the DOM at every width, it is only `display:none` above the
 * breakpoint.
 *
 * NOTE `transition-transform`, the keyword, not `transition-[transform]`. In
 * Tailwind v4 `translate-y-*` compiles to the standalone `translate:` property,
 * so a transition naming only `transform` animates nothing and the bar jumps.
 * The keyword expands to `transform,translate,scale,rotate`, which covers it.
 */
export const BAR_MARK = 'stickybar';

const SHELLS = {
  flush: `${BAR_MARK} fixed inset-x-0 bottom-0 z-40 lg:hidden transition-transform duration-300 ease-out`,
  floating: `${BAR_MARK} fixed left-4 right-4 bottom-4 z-40 lg:hidden transition-transform duration-300 ease-out`,
};

const CARDS = {
  flush:
    'bg-white rounded-t-[var(--r-xl)] [border-top:1px_solid_var(--line)] ' +
    '[box-shadow:0_-6px_22px_rgba(26,26,26,0.12)] ' +
    'flex items-center justify-between gap-3 px-4 pt-3 ' +
    '[padding-bottom:max(0.75rem,env(safe-area-inset-bottom))]',
  // rounded-lg, not rounded-xl: defining --radius-* in @theme does NOT clear
  // Tailwind's own radius scale, so `rounded-2xl` keeps resolving to the stock
  // 16px while `rounded-xl` resolves to this project's --r-xl (22px). --r-lg IS
  // 16px, so rounded-lg is both on-token and pixel-identical to what shipped.
  floating:
    'bg-white rounded-lg [border:1px_solid_var(--line)] [box-shadow:var(--shadow-xl)] ' +
    'flex items-center justify-between gap-3 px-4 py-3',
};

export const BAR_SHELL = SHELLS.floating;
export const BAR_CARD = CARDS.floating;

export default function StickyBar({
  variant = 'floating',
  show = true,
  className,
  cardClassName,
  children,
}) {
  return (
    <div className={cn(SHELLS[variant] || SHELLS.floating, show ? 'translate-y-0' : 'translate-y-[150%]', className)}>
      <div className={cn(CARDS[variant] || CARDS.floating, cardClassName)}>{children}</div>
    </div>
  );
}
