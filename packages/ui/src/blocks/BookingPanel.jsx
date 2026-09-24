'use client';

import { cn } from '../lib/cn.js';
import Card from './Card.jsx';

/**
 * The booking panel that rides alongside a stay or a tour: price, the dates,
 * the one green CTA, then the quieter ways out.
 *
 *   price      node - the "From Rp… / night" block. Passed in, because what a
 *              price MEANS is the app's business (per night, per car, per
 *              person) and getting that wrong is worse than getting it ugly.
 *   fields     node - the date/guest controls
 *   cta        node - the single primary action
 *   secondary  node - quieter actions under it (ask on WhatsApp, and the
 *              Airbnb hand-off; see SECONDARY_BTN below)
 *   note       node - the fine print under the buttons
 *   sticky     desktop only: the panel follows the reader down the page
 *
 * WHY `sticky` IS ON THE PANEL AND NOT ON A WRAPPER. `position: sticky` binds
 * to the nearest scrolling ancestor, and any ancestor with `overflow: hidden`
 * silently becomes one - the panel then scrolls away with the page and nothing
 * anywhere reports an error. If this stops sticking, look up the tree for an
 * `overflow-hidden` and change it to `overflow-clip`: clip crops the same way
 * without creating a scroll container.
 *
 * THE AIRBNB BUTTON. Both villas are also listed on Airbnb, and some guests
 * simply trust a platform's checkout more than a villa's own form. Sending them
 * there is a real conversion, not a leak - so it belongs in the panel, as a
 * SECONDARY action under the direct CTA. It is only rendered when a URL is
 * actually supplied: a booking button that goes nowhere is a broken promise,
 * unlike a social icon in a footer where aria-disabled is enough.
 */

// Full-width, outlined, stacked under the CTA. Same height as the CTA so the
// stack reads as one block of choices rather than three unrelated buttons.
export const SECONDARY_BTN =
  'flex items-center justify-center gap-2 w-full h-[2.9rem] rounded-pill ' +
  '[border:1px_solid_var(--line)] bg-transparent text-gold font-body font-semibold text-small ' +
  'no-underline cursor-pointer transition-[color,border-color,scale] duration-200 ease-in-out ' +
  'hover:[border-color:var(--color-cta)] hover:text-cta active:scale-[0.97]';

export default function BookingPanel({
  as,
  price = null,
  fields = null,
  cta = null,
  secondary = null,
  note = null,
  sticky = true,
  className,
  panelRef,
  children,
  ...rest
}) {
  return (
    <aside
      className={cn('flex flex-col gap-5', sticky && 'lg:sticky lg:top-24', className)}
      {...rest}
    >
      <Card as={as} ref={panelRef} className="p-6">
        {price}
        {fields ? <div className="mt-5">{fields}</div> : null}
        {cta ? <div className="mt-4">{cta}</div> : null}
        {secondary ? <div className="mt-2 flex flex-col gap-2">{secondary}</div> : null}
        {note ? <p className="text-label text-muted text-center mt-3">{note}</p> : null}
      </Card>
      {children}
    </aside>
  );
}
