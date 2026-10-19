'use client';

import { createContext, useContext, useEffect, useState } from 'react';

const KEY = 'upv_trip_v1';
const DEFAULT_GUESTS = 2;

const TripPrefsContext = createContext(null);

export function TripPrefsProvider({ children }) {
  const [guests, setGuestsState] = useState(DEFAULT_GUESTS);

  useEffect(() => {
    try {
      const saved = Number(window.localStorage.getItem(KEY));
      if (saved >= 1 && saved <= 12) setGuestsState(saved);
    } catch (e) {}
  }, []);

  function setGuests(value) {
    const nextGuests = Number(value) || DEFAULT_GUESTS;
    setGuestsState(nextGuests);
    try {
      window.localStorage.setItem(KEY, String(nextGuests));
    } catch (e) {}
  }

  return <TripPrefsContext.Provider value={{ guests, setGuests }}>{children}</TripPrefsContext.Provider>;
}

export function useTripPrefs() {
  const ctx = useContext(TripPrefsContext);
  if (!ctx) throw new Error('useTripPrefs must be used within TripPrefsProvider');
  return ctx;
}
