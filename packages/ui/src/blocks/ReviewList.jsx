'use client';

import { useState } from 'react';
import groupReviews from '../lib/groupReviews.js';
import Slider from './Slider.jsx';
import ReviewCard from './ReviewCard.jsx';
import ReviewDetail from './ReviewDetail.jsx';
import { REVIEW_SLIDER, REVIEW_GRID, REVIEW_EMPTY } from './reviewClasses.js';

export default function ReviewList({
  reviews,
  variant = 'slider',
  group = false,
  limit,
  emptyText = 'No reviews yet - be the first to share your trip.',
  emptyAction = null,
  logo = null,
  mark = null,
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
    <ReviewCard key={i} {...r} logo={logo} mark={mark} onClick={() => setSelected(r)} />
  ));

  return (
    <>
      {variant === 'grid' ? (
        <div className={`${REVIEW_GRID} ${className}`.trim()} data-reviews-track>
          {cards}
        </div>
      ) : (
        <Slider className={className} gridClassName={REVIEW_SLIDER}>
          {cards}
        </Slider>
      )}
      <ReviewDetail review={selected} onClose={() => setSelected(null)} />
    </>
  );
}
