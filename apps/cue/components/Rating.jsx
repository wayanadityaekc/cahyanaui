'use client';

import { Star } from 'lucide-react';
import { useReviews } from '@/state/ReviewsProvider';

function StarIcon() {
  return <Star fill="currentColor" stroke="none" aria-hidden="true" />;
}

export default function Rating({ name, className, minReviews = 1, withWord = false }) {
  const reviews = useReviews();
  const ratingSummary = reviews && reviews.lookup ? reviews.lookup(name) : null;
  const show = ratingSummary && ratingSummary.count >= minReviews;
  return (
    <span className={className} data-rating={name}>
      <StarIcon />
      {show ? (
        <>
          {ratingSummary.avg_rating.toFixed(1)}
          <span className="ml-[1px] text-[0.8em] font-normal opacity-70">
            ({ratingSummary.count}
            {withWord ? ` review${ratingSummary.count === 1 ? '' : 's'}` : ''})
          </span>
        </>
      ) : (
        'New'
      )}
    </span>
  );
}
