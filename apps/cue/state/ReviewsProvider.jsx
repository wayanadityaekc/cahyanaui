'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { API_BASE } from '@/lib/constants';

const ReviewsContext = createContext(null);

// Star ratings shown on tour cards site-wide pull from here - one fetch of
// /reviews/summary (approved reviews only, grouped per service - avg_rating +
// count), instead of every card fetching its own. Mirrors PricingProvider's
// lookup(name) pattern. No currency/guests dependency, just fetch on mount.
export function ReviewsProvider({ children }) {
  const [summary, setSummary] = useState(null);

  useEffect(() => {
    let cancelled = false;
    fetch(`${API_BASE}/reviews/summary`)
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        if (cancelled || !Array.isArray(d)) return;
        const map = {};
        d.forEach((r) => { map[r.service] = r; });
        setSummary(map);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);

  const lookup = (service) => (summary && summary[service]) || null;

  return <ReviewsContext.Provider value={{ lookup }}>{children}</ReviewsContext.Provider>;
}

export function useReviews() {
  return useContext(ReviewsContext);
}
