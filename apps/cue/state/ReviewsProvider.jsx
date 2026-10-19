'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { API_BASE } from '@/lib/constants';

const ReviewsContext = createContext(null);

export function ReviewsProvider({ children }) {
  const [summary, setSummary] = useState(null);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const response = await fetch(`${API_BASE}/reviews/summary`);
        const d = response.ok ? await response.json() : null;
        if (cancelled || !Array.isArray(d)) return;
        const map = {};
        d.forEach((r) => {
          map[r.service] = r;
        });
        setSummary(map);
      } catch (e) {}
    }
    load();
    return () => {
      cancelled = true;
    };
  }, []);

  function lookup(service) {
    return (summary && summary[service]) || null;
  }

  return <ReviewsContext.Provider value={{ lookup }}>{children}</ReviewsContext.Provider>;
}

export function useReviews() {
  return useContext(ReviewsContext);
}
