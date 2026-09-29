'use client';

import { Star } from 'lucide-react';
import { useReviews } from '@/state/ReviewsProvider';

// Rating star stays solid - fill makes it read as a filled badge, not an outline.
function StarIcon() { return <Star fill="currentColor" stroke="none" aria-hidden="true" />; }

// Live review average + count for a service name, or "New" with no reviews; withWord spells out "reviews".
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
