'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { API_BASE } from '@/lib/constants';
import { useTripPrefs } from './TripPrefsProvider';

const PricingContext = createContext(null);

export function PricingProvider({ children, initialCatalog = null }) {
  const { currency, displayGuests, stay, hydrated } = useTripPrefs();
  const [catalog, setCatalog] = useState(initialCatalog);

  useEffect(() => {
    if (!hydrated) return;
    let cancelled = false;
    const qs = new URLSearchParams({ currency, guests: String(displayGuests), stay: stay || '' });
    fetch(`${API_BASE}/pricing/catalog?${qs}`)
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        if (!cancelled && d && Array.isArray(d.items)) setCatalog(d);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [currency, displayGuests, stay, hydrated]);

  const lookup = (name) => {
    if (!catalog) return null;
    return catalog.items.find((i) => i.name === name) || null;
  };

  return (
    <PricingContext.Provider value={{ catalog, lookup, symbol: (catalog && catalog.symbol) || '$' }}>
      {children}
    </PricingContext.Provider>
  );
}

export function usePricing() {
  return useContext(PricingContext);
}
