'use client';

import { createContext, useContext, useEffect, useState } from 'react';

// One site-wide guest count, saved per browser; before this, three separate counts silently disagreed.
const KEY = 'upv_trip_v1';
const DEFAULT_GUESTS = 2;

const TripPrefsContext = createContext(null);

export function TripPrefsProvider({ children }) {
  const [guests, setGuestsState] = useState(DEFAULT_GUESTS);

  // Read in an effect, never in initial state: the static export's first paint must match the HTML.
  useEffect(() => {
    try {
      const saved = Number(window.localStorage.getItem(KEY));
      if (saved >= 1 && saved <= 12) setGuestsState(saved);
    } catch (e) {
      // localStorage unavailable - the default stands.
    }
  }, []);

  function setGuests(value) {
    const nextGuests = Number(value) || DEFAULT_GUESTS;
    setGuestsState(nextGuests);
    try {
      window.localStorage.setItem(KEY, String(nextGuests));
    } catch (e) {
      // ignore
    }
  }

  return <TripPrefsContext.Provider value={{ guests, setGuests }}>{children}</TripPrefsContext.Provider>;
}

export function useTripPrefs() {
  const ctx = useContext(TripPrefsContext);
  if (!ctx) throw new Error('useTripPrefs must be used within TripPrefsProvider');
  return ctx;
}
