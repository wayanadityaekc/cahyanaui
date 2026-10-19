'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { API_BASE } from '@/lib/constants';
import { useTripPrefs } from './TripPrefsProvider';

const PricingContext = createContext(null);

function normalizeCatalog(catalog) {
  if (!catalog || !Array.isArray(catalog.items)) return null;
  return {
    ...catalog,
    items: catalog.items,
    transfers: Array.isArray(catalog.transfers) ? catalog.transfers : [],
    charters: Array.isArray(catalog.charters) ? catalog.charters : [],
  };
}

export function PricingProvider({ children, initialCatalog = null }) {
  const { currency, displayGuests, stay, hydrated } = useTripPrefs();
  const [catalog, setCatalog] = useState(() => normalizeCatalog(initialCatalog));

  useEffect(() => {
    if (!hydrated) return;
    let cancelled = false;
    const query = new URLSearchParams({ currency, guests: String(displayGuests), stay: stay || '' });
    async function load() {
      try {
        const response = await fetch(`${API_BASE}/pricing/catalog?${query}`);
        const catalogData = response.ok ? await response.json() : null;
        const normalizedCatalog = normalizeCatalog(catalogData);
        if (!cancelled && normalizedCatalog) setCatalog(normalizedCatalog);
      } catch (e) {}
    }
    load();
    return () => {
      cancelled = true;
    };
  }, [currency, displayGuests, stay, hydrated]);

  function lookup(name) {
    if (!catalog) return null;
    const item = catalog.items.find((catalogEntry) => catalogEntry.name === name);
    if (item) return item;
    const transfer = catalog.transfers.find((transferItem) => transferItem.route === name);
    if (transfer)
      return { name: transfer.route, standard: { display: transfer.display }, exclusive: null, hasExclusive: false };
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
