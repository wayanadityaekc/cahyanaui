'use client';

import { useEffect, useState } from 'react';
import { API_BASE } from '@/lib/constants';
import ReviewCard from '@/components/cards/ReviewCard';
import ReviewCta from '@/components/reviews/ReviewCta';

export default function ReviewsStrip({ service, emptyText, showEmpty = true, emptyCta = false }) {
  const [rows, setRows] = useState(null);

  useEffect(() => {
    let cancelled = false;
    const url = service
      ? `${API_BASE}/reviews?service=${encodeURIComponent(service)}`
      : `${API_BASE}/reviews`;
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
  }, [service]);

  const list = rows || [];

  if (list.length === 0) {
    if (!showEmpty) return null;
    return (
      <div className="grid grid-cols-3 max-[768px]:grid-cols-1 gap-5 max-w-[1100px] mx-auto mt-6">
        <div className="col-[1/-1] flex flex-col items-center gap-[1.1rem] py-10 px-6 text-center border border-dashed border-[#d8d2c4] rounded-md text-muted">
          <p>{emptyText || 'No reviews yet - be the first to share your trip.'}</p>
          {emptyCta && <ReviewCta />}
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-3 max-[768px]:grid-cols-1 gap-5 max-w-[1100px] mx-auto mt-6">
      {list.map((r, i) => (
        <ReviewCard key={i} {...r} />
      ))}
    </div>
  );
}
