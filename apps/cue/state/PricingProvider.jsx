'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { API_BASE } from '@/lib/constants';
import { useTripPrefs } from './TripPrefsProvider';

const PricingContext = createContext(null);

// A valid catalog needs an `items` array; a partial response (e.g. `transfers`
// or `charters` missing) must NOT reach consumers as-is — several of them do
// `catalog.transfers.map(...)` / `catalog.charters.find(...)` with no per-call
// guard, so one malformed 200 would crash whole pages to the error boundary.
// Normalize here (the single source) so a partial catalog degrades to empty
// price data instead of a white screen. Returns null for a non-catalog (keeps
// the "leave prices null" path), which is why callers only set on a truthy result.
function normalizeCatalog(c) {
  if (!c || !Array.isArray(c.items)) return null;
  return {
    ...c,
    items: c.items,
    transfers: Array.isArray(c.transfers) ? c.transfers : [],
    charters: Array.isArray(c.charters) ? c.charters : [],
  };
}

export function PricingProvider({ children, initialCatalog = null }) {
  const { currency, displayGuests, stay, hydrated } = useTripPrefs();
  const [catalog, setCatalog] = useState(() => normalizeCatalog(initialCatalog));

  useEffect(() => {
    if (!hydrated) return;
    let cancelled = false;
    const qs = new URLSearchParams({ currency, guests: String(displayGuests), stay: stay || '' });
    fetch(`${API_BASE}/pricing/catalog?${qs}`)
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        const c = normalizeCatalog(d);
        if (!cancelled && c) setCatalog(c);
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
