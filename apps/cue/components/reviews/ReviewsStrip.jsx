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
  // 'grid' (default) = the plain 3-column list this component always was,
  // used on /all-reviews and the charter/transfer/airport pages. 'slider' =
  // the homepage's horizontal card row (Sep 2026, Wayan: "as a slider, not
  // scrolling to bottom because it's too long") - same cards, same click-to-
  // detail popup, just a Slider wrapper + fixed-width cards instead of a grid.
  variant = 'grid',
  // Homepage only needs a handful, not every review the server has (up to 30) -
  // the rest live on /all-reviews.html, which this same component renders
  // with no limit.
  limit,
}) {
  const [rows, setRows] = useState(null);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    let cancelled = false;
    // A page that sells MANY services asks by group - /transfer lists ten
    // routes and the guest reviewed the one they took, so no single name
    // answers for it. The server resolves the set from the pricing catalog.
    const q = group ? `?group=${encodeURIComponent(group)}`
      : (service ? `?service=${encodeURIComponent(service)}` : "");
    const url = `${API_BASE}/reviews${q}`;
    fetch(url)
      .then((r) => (r.ok ? r.json() : []))
      .then((d) => {
        if (!cancelled) setRows(Array.isArray(d) ? d : []);
      })
      .catch(() => {
        if (!cancelled) setRows([]);
      });
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
