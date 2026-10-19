'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { readLocalJSON, writeLocal } from '@/lib/storage';
import { KEY, LEGACY_ITEM_NAMES } from '@/lib/constants';

const ItineraryContext = createContext(null);

const EMPTY = { days: [], transfers: [], charters: [] };

function resolveCurrentName(name) {
  return LEGACY_ITEM_NAMES[name] || name;
}

function normalizeState(state) {
  if (!state || typeof state !== 'object') return { ...EMPTY };
  return {
    days: Array.isArray(state.days)
      ? state.days.map((day) => (Array.isArray(day.items) ? { ...day, items: day.items.map(resolveCurrentName) } : day))
      : [],
    transfers: Array.isArray(state.transfers) ? state.transfers : [],
    charters: Array.isArray(state.charters) ? state.charters : [],
  };
}

export function ItineraryProvider({ children }) {
  const [state, setState] = useState(EMPTY);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setState(normalizeState(readLocalJSON(KEY.itinerary, EMPTY)));
    setIsHydrated(true);
  }, []);

  function save(next) {
    const clean = normalizeState(next);
    setState(clean);
    writeLocal(KEY.itinerary, clean);
  }

  const count =
    state.days.reduce((total, day) => total + ((day.items && day.items.length) || 0), 0) +
    state.transfers.length +
    state.charters.length;

  return (
    <ItineraryContext.Provider value={{ state, save, count, hydrated: isHydrated }}>
      {children}
    </ItineraryContext.Provider>
  );
}

export function useItinerary() {
  const itineraryContext = useContext(ItineraryContext);
  if (!itineraryContext) throw new Error('useItinerary must be used inside ItineraryProvider');
  return itineraryContext;
}
