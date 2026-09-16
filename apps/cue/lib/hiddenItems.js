import { HIDDEN_TOURS } from '@/lib/routes';
import { TOUR_CONTENT } from '@/content/tours';

// HIDDEN_TOURS holds slugs, so the href-based switch in lib/routes.js can answer
// "is this link parked?" but not "is this product parked?" - and an attraction
// page sells its tour by NAME (bookItem), never by link. That gap meant 13 live,
// indexed attraction pages kept a working Book Now for a tour we had parked.
//
// Derived rather than hand-listed so parking a tour stays one line in routes.js.
// SERVER-SIDE ONLY: TOUR_CONTENT is the whole tour dataset, so importing this
// into a client component would ship all of it to the browser. Client-side lists
// that name products (content/shared/suggest.js) are checked by hand instead.
export const HIDDEN_ITEM_NAMES = new Set(
  HIDDEN_TOURS.map((slug) => TOUR_CONTENT[slug] && TOUR_CONTENT[slug].bookItem).filter(Boolean)
);

export function isHiddenItem(name) {
  return !!name && HIDDEN_ITEM_NAMES.has(name);
}
