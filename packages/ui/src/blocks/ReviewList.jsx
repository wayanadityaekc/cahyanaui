'use client';

import { useState } from 'react';
import groupReviews from '../lib/groupReviews.js';
import Slider from './Slider.jsx';
import ReviewCard from './ReviewCard.jsx';
import ReviewDetail from './ReviewDetail.jsx';
import { REVIEW_SLIDER, REVIEW_GRID, REVIEW_EMPTY } from './reviewClasses.js';

/**
 * Reviews as cards, each opening its full text. Presentational: the site
 * fetches and passes `reviews` in (null while loading renders nothing, so the
 * empty state never flashes before the data lands).
 *
 *   variant  'slider' (default) = one row that slides sideways, for a review
 *            SECTION, so it never grows down the page; 'grid' = the full list.
 *   group    merge one review posted for several trips into one card
 *            ("Ubud Tour + 2 more"). Turn it on for lists that mix trips; leave
 *            it off on one trip's own page, which should show its own copy.
 *   emptyAction  optional node under the empty message (e.g. a write-review
 *            button). Leave it out if the page already has one nearby.
 */
export default function ReviewList({
  reviews,
  variant = 'slider',
  group = false,
  limit,
  emptyText = 'No reviews yet - be the first to share your trip.',
  emptyAction = null,
  logo = null,
  className = '',
}) {
  const [selected, setSelected] = useState(null);
  if (!reviews) return null;

  const all = group ? groupReviews(reviews) : reviews;
  const list = limit ? all.slice(0, limit) : all;

  if (list.length === 0) {
    return (
      <div className={`${REVIEW_GRID} ${className}`.trim()}>
        <div className={REVIEW_EMPTY}>
          <p className="m-0">{emptyText}</p>
          {emptyAction}
        </div>
      </div>
    );
  }

  const cards = list.map((r, i) => (
    <ReviewCard key={i} {...r} logo={logo} onClick={() => setSelected(r)} />
  ));

  return (
    <>
      {variant === 'grid'
        ? <div className={`${REVIEW_GRID} ${className}`.trim()} data-reviews-track>{cards}</div>
        : <Slider className={className} gridClassName={REVIEW_SLIDER}>{cards}</Slider>}
      <ReviewDetail review={selected} onClose={() => setSelected(null)} />
    </>
  );
}
