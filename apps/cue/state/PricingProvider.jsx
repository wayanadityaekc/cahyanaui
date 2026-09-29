'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { API_BASE } from '@/lib/constants';
import { useTripPrefs } from './TripPrefsProvider';

const PricingContext = createContext(null);

// Normalize the catalog so missing transfers/charters become [] instead of crashing consumers; null if no items.
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
    const query = new URLSearchParams({ currency, guests: String(displayGuests), stay: stay || '' });
    // load the live catalog for this currency / group / pickup
    async function load() {
      try {
        const r = await fetch(`${API_BASE}/pricing/catalog?${query}`);
        const d = r.ok ? await r.json() : null;
        const c = normalizeCatalog(d);
        if (!cancelled && c) setCatalog(c);
      } catch (e) {}
    }
    load();
    return () => {
      cancelled = true;
    };
  }, [currency, displayGuests, stay, hydrated]);

  // Look up a catalog item, or a transfer route normalized to the item shape so <Price> works for both.
  function lookup(name) {
    if (!catalog) return null;
    const item = catalog.items.find((i) => i.name === name);
    if (item) return item;
    const transfer = catalog.transfers.find((t) => t.route === name);
    if (transfer) return { name: transfer.route, standard: { display: transfer.display }, exclusive: null, hasExclusive: false };
    return null;
  }

  return (
    <PricingContext.Provider value={{ catalog, lookup, symbol: (catalog && catalog.symbol) || '$' }}>
      {children}
    </PricingContext.Provider>
  );
}

export function usePricing() {
  return useContext(PricingContext);
}
