'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { readLocalJSON, writeLocal } from '@/lib/storage';
import { KEY } from '@/lib/constants';

const ItineraryContext = createContext(null);

const EMPTY = { days: [], transfers: [], charters: [] };

function normalise(state) {
  if (!state || typeof state !== 'object') return { ...EMPTY };
  return {
    days: Array.isArray(state.days) ? state.days : [],
    transfers: Array.isArray(state.transfers) ? state.transfers : [],
    charters: Array.isArray(state.charters) ? state.charters : [],
  };
}

export function ItineraryProvider({ children }) {
  const [state, setState] = useState(EMPTY);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setState(normalise(readLocalJSON(KEY.itinerary, EMPTY)));
    setHydrated(true);
  }, []);

  const save = (next) => {
    const clean = normalise(next);
    setState(clean);
    writeLocal(KEY.itinerary, clean);
  };

  const count =
    state.days.reduce((n, d) => n + ((d.items && d.items.length) || 0), 0) +
    state.transfers.length +
    state.charters.length;

  return (
    <ItineraryContext.Provider value={{ state, save, count, hydrated }}>
      {children}
    </ItineraryContext.Provider>
  );
}

export function useItinerary() {
  const ctx = useContext(ItineraryContext);
  if (!ctx) throw new Error('useItinerary must be used inside ItineraryProvider');
  return ctx;
}
