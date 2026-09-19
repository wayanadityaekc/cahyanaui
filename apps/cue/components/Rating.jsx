'use client';

import { Star } from 'lucide-react';
import { useReviews } from '@/state/ReviewsProvider';

// Rating star stays solid - fill makes it read as a filled badge, not an outline.
const StarIcon = () => <Star fill="currentColor" stroke="none" aria-hidden="true" />;

// Twin of <Price name="..." /> - looks up the live review average for a tour by
// its service name (the same name used for data-price / booking), falls back to
// "New" when nobody's reviewed it yet (no fake numbers - CLAUDE.md). Review count
// is shown alongside the average in a lighter weight (Wayan, Sep 2026: "4.8 (1)"
// style) so a single 5-star review doesn't read as an established rating.
// withWord spells the count out ("4.8 (12 reviews)") - a bare "(12)" is clear in the
// corner of a card, where the stars sit right there, but it needs the noun once it is
// the only rating on a page. Same component either way, so the number can never differ
// between the hero and the card for the same tour.
export default function Rating({ name, className, minReviews = 1, withWord = false }) {
  const ctx = useReviews();
  const r = ctx && ctx.lookup ? ctx.lookup(name) : null;
  const show = r && r.count >= minReviews;
  return (
    <span className={className} data-rating={name}>
      <StarIcon />
      {show ? (
        <>
          {r.avg_rating.toFixed(1)}
          <span className="ml-[1px] text-[0.8em] font-normal opacity-70">
            ({r.count}{withWord ? ` review${r.count === 1 ? '' : 's'}` : ''})
          </span>
        </>
      ) : (
        'New'
      )}
    </span>
  );
}
