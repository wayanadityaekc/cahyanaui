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
    // load the star summary for every service
    async function load() {
      try {
        const res = await fetch(`${API_BASE}/reviews/summary`);
        const d = res.ok ? await res.json() : null;
        if (cancelled || !Array.isArray(d)) return;
        const map = {};
        d.forEach((r) => { map[r.service] = r; });
        setSummary(map);
      } catch (e) {}
    }
    load();
    return () => {
      cancelled = true;
    };
  }, []);

  function lookup(service) { return (summary && summary[service]) || null; }

  return <ReviewsContext.Provider value={{ lookup }}>{children}</ReviewsContext.Provider>;
}

export function useReviews() {
  return useContext(ReviewsContext);
}
