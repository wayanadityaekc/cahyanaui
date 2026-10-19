'use client';

import { useEffect, useState } from 'react';
import { API_BASE } from '@/lib/constants';
import ReviewCard from '@/components/cards/ReviewCard';
import ReviewCta from '@/components/reviews/ReviewCta';
import ReviewDetailModal from '@/components/reviews/ReviewDetailModal';
import Slider from '@/components/ui/Slider';
import { GRID_REVIEWS } from '@/components/ui/gridClasses';
import { groupReviews } from '@/lib/groupReviews';

const GRID = 'grid grid-cols-3 max-[768px]:grid-cols-1 gap-5 max-w-[1100px] mx-auto mt-6';

export default function ReviewsStrip({
  service,
  group,
  emptyText,
  showEmpty = true,
  emptyCta = false,
  variant = 'slider',
  limit,
}) {
  const [rows, setRows] = useState(null);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    let cancelled = false;
    function buildGroupQuery() {
      if (group) return `?group=${encodeURIComponent(group)}`;
      if (service) return `?service=${encodeURIComponent(service)}`;
      return '';
    }

    const query = buildGroupQuery();
    const url = `${API_BASE}/reviews${query}`;
    async function load() {
      try {
        const response = await fetch(url);
        const reviews = response.ok ? await response.json() : [];
        if (!cancelled) setRows(Array.isArray(reviews) ? reviews : []);
      } catch (e) {
        if (!cancelled) setRows([]);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, [service, group]);

  const all = service ? rows || [] : groupReviews(rows || []);
  const visibleReviews = limit ? all.slice(0, limit) : all;

  if (visibleReviews.length === 0) {
    if (!showEmpty) return null;
    return (
      <div className={GRID}>
        <div className="col-[1/-1] flex flex-col items-center gap-[1.1rem] py-10 px-6 text-center border border-dashed border-[#d8d2c4] rounded-md text-muted">
          <p>{emptyText || 'No reviews yet - be the first to share your trip.'}</p>
          {emptyCta && <ReviewCta />}
        </div>
      </div>
    );
  }

  const cards = visibleReviews.map((review, index) => (
    <ReviewCard key={index} {...review} onClick={() => setSelected(review)} />
  ));

  return (
    <>
      {variant === 'slider' ? (
        <Slider gridClassName={GRID_REVIEWS}>{cards}</Slider>
      ) : (
        <div className={GRID} data-reviews-track>
          {cards}
        </div>
      )}
      <ReviewDetailModal review={selected} onClose={() => setSelected(null)} />
    </>
  );
}
