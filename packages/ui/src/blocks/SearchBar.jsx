'use client';

import { cn } from '../lib/cn.js';
import Card from './Card.jsx';

/**
 * The row of booking controls: dates, guests, and the button that acts on them.
 *
 *   variant  'hero'   a card overlapping the hero above it, four columns wide
 *           'panel'  the same fields inside a booking panel, two columns
 *           'stack'  one field per row, for a narrow space
 *   fields   the controls, as children of the grid
 *   action   the submit button
 *
 * THE CONTROLS ARE THE LIBRARY'S OWN, NOT NATIVE ONES. A native <select> and
 * <input type="date"> render as a different widget on every platform, and the
 * date input shows an American "mm/dd/yyyy" hint to guests who do not write
 * dates that way. CUE replaced every native control site-wide for exactly that
 * reason; a booking form is the last place to leave one in.
 *
 * `-mt-10 sm:-mt-12` on the hero variant is what makes the card overlap the
 * photo above it. That is also why the hero's mobile scrim is dark at the
 * BOTTOM - it is carrying this card.
 *
 * `items-end` on the desktop row, not `items-center`: the fields have labels
 * above them and the button does not, so centring the whole stack leaves the
 * button sitting high. Aligning the bottom edges makes them line up, since the
 * button and the fields are the same height by token.
 */
const GRIDS = {
  hero: 'relative z-10 mx-auto -mt-10 sm:-mt-12 max-w-4xl grid grid-cols-1 sm:grid-cols-4 gap-3 p-3 sm:items-end',
  panel: 'grid grid-cols-2 gap-2',
  stack: 'grid grid-cols-1 gap-3',
};

export default function SearchBar({ variant = 'hero', className, children, action = null }) {
  const grid = GRIDS[variant] || GRIDS.hero;
  // Only the hero variant is its own card; inside a panel the panel IS the card.
  if (variant !== 'hero') {
    return (
      <>
        <div className={cn(grid, className)}>{children}</div>
        {action}
      </>
    );
  }
  return (
    <Card className={cn(grid, className)}>
      {children}
      {action}
    </Card>
  );
}

// The label above each control. `caps` used to be a CSS class in the app; it is
// the same 10.24px / 500 / 0.14em as every other label on the sites.
export const SEARCH_LABEL = 'block mb-1 text-label font-medium tracking-[0.14em] uppercase text-muted';
