'use client';

import { Star } from 'lucide-react';
import { useReviews } from '@/state/ReviewsProvider';

// Rating star stays solid - fill makes it read as a filled badge, not an outline.
const StarIcon = () => <Star fill="currentColor" stroke="none" aria-hidden="true" />;

// Twin of <Price name="..." /> - looks up the live review average for a tour by
// its service name (the same name used for data-price / booking), falls back to
// "New" when nobody's reviewed it yet (no fake numbers - CLAUDE.md).
export default function Rating({ name, className, minReviews = 1 }) {
  const ctx = useReviews();
  const r = ctx && ctx.lookup ? ctx.lookup(name) : null;
  const show = r && r.count >= minReviews;
  return (
    <span className={className} data-rating={name}>
      <StarIcon />
      {show ? r.avg_rating.toFixed(1) : 'New'}
    </span>
  );
}
