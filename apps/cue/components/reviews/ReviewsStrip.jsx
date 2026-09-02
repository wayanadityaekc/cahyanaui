'use client';

import { useEffect, useState } from 'react';
import { API_BASE } from '@/lib/constants';
import ReviewCard from '@/components/cards/ReviewCard';

export default function ReviewsStrip({ service, emptyText, showEmpty = true }) {
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
      <div className="reviews-strip">
        <div className="reviews__empty">
          <p>{emptyText || 'No reviews yet - be the first to share your trip.'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="reviews-strip">
      {list.map((r, i) => (
        <ReviewCard key={i} {...r} />
      ))}
    </div>
  );
}
