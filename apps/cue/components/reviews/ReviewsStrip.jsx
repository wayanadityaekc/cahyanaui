'use client';

import { useEffect, useState } from 'react';
import { API_BASE } from '@/lib/constants';
import ReviewCard from '@/components/cards/ReviewCard';
import ReviewCta from '@/components/reviews/ReviewCta';
import ReviewDetailModal from '@/components/reviews/ReviewDetailModal';
import Slider from '@/components/ui/Slider';
import { GRID_REVIEWS } from '@/components/ui/gridClasses';

const GRID = 'grid grid-cols-3 max-[768px]:grid-cols-1 gap-5 max-w-[1100px] mx-auto mt-6';

export default function ReviewsStrip({
  service, group, emptyText, showEmpty = true, emptyCta = false,
  // 'grid' = 3-column list (all-reviews, service pages); 'slider' = homepage card row with the same popup.
  variant = 'grid',
  // Optional cap on how many reviews to show (homepage); /all-reviews renders with no limit.
  limit,
}) {
  const [rows, setRows] = useState(null);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    let cancelled = false;
    // Multi-service pages (e.g. /transfer) ask by group; the server resolves the set from the pricing catalog.
    const query = group ? `?group=${encodeURIComponent(group)}`
      : (service ? `?service=${encodeURIComponent(service)}` : "");
    const url = `${API_BASE}/reviews${query}`;
    // load the reviews for this page
    async function load() {
      try {
        const r = await fetch(url);
        const d = r.ok ? await r.json() : [];
        if (!cancelled) setRows(Array.isArray(d) ? d : []);
      } catch (e) {
        if (!cancelled) setRows([]);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, [service, group]);

  const all = rows || [];
  const list = limit ? all.slice(0, limit) : all;

  if (list.length === 0) {
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

  const cards = list.map((r, i) => (
    <ReviewCard key={i} {...r} onClick={() => setSelected(r)} />
  ));

  return (
    <>
      {variant === 'slider' ? (
        <Slider gridClassName={GRID_REVIEWS}>{cards}</Slider>
      ) : (
        <div className={GRID} data-reviews-track>{cards}</div>
      )}
      <ReviewDetailModal review={selected} onClose={() => setSelected(null)} />
    </>
  );
}
