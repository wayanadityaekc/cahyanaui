'use client';

import { useEffect } from 'react';
import { useAccount } from '@/state/AccountProvider';
import { ROW_RULE } from '@/components/ui/separatorClasses';

const MAX_RATING_STARS = 5;
const RADIX_DECIMAL = 10;

function formatDate(iso) {
  if (!iso) return '';
  try {
    return new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
  } catch (e) {
    return '';
  }
}

export default function MyReviews() {
  const { myReviews, refreshMyReviews } = useAccount();

  useEffect(() => {
    refreshMyReviews();
  }, [refreshMyReviews]);

  if (myReviews === null) return null;
  if (myReviews.length === 0) {
    return <p className="text-body text-muted m-0">You haven&apos;t written a review yet.</p>;
  }

  return (
    <ul className="list-none m-0 p-0" data-my-reviews>
      {myReviews.map((myReview) => {
        const ratingStars = Math.max(1, Math.min(MAX_RATING_STARS, parseInt(myReview.rating, RADIX_DECIMAL) || 0));
        const stars = '★'.repeat(ratingStars) + '☆'.repeat(MAX_RATING_STARS - ratingStars);
        return (
          <li key={myReview.id} className={`py-3 ${ROW_RULE}`}>
            <div className="flex items-center justify-between gap-3 flex-wrap">
              <span className="font-semibold text-small text-green">{myReview.service}</span>
              <span className="text-label text-muted">{formatDate(myReview.created_at)}</span>
            </div>
            <div className="text-amber tracking-[2px] my-1" aria-label={`${ratingStars} out of 5`}>
              {stars}
            </div>
            <p className="m-0 text-body text-green leading-[var(--lh-body)]">{myReview.message}</p>
            {myReview.status !== 'approved' && (
              <span className="inline-block mt-1 text-label text-muted italic">Not currently shown on the site</span>
            )}
          </li>
        );
      })}
    </ul>
  );
}
