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

  // `name` is usually a catalog.items name (tour/experience/performance/combo/
  // villa), but a few <Price> callers (e.g. the homepage Airport band) pass a
  // transfer route instead ("Airport – Ubud") - transfers live in a separate
  // catalog.transfers array with a flat {route,usd,idr,display} shape (no
  // .standard/.exclusive nesting), so a plain catalog.items.find() never
  // matches it and <Price> falls back to its hardcoded placeholder forever,
  // in every currency (found while verifying the IDR-default change: the
  // Airport price stayed "$20" even after the catalog loaded). Normalized to
  // the items shape here so <Price> doesn't need its own transfer branch.
  const lookup = (name) => {
    if (!catalog) return null;
    const item = catalog.items.find((i) => i.name === name);
    if (item) return item;
    const transfer = catalog.transfers.find((t) => t.route === name);
    if (transfer) return { name: transfer.route, standard: { display: transfer.display }, exclusive: null, hasExclusive: false };
    return null;
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
