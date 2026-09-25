'use client';

import { createContext, useContext, useEffect, useState } from 'react';

// HOW MANY PEOPLE ARE COMING - one number, site-wide.
//
// CUE's navbar drawer carries the same pair (guests + currency) and calls it
// trip prefs, and this is the villa site's copy of that idea. It matters more
// here than it looks: before this there were THREE guest counts on the site
// that never spoke to each other - the hero search card had its own, the
// booking sheet had its own, and the drawer had none at all. A guest who set
// "4 guests" in the search card and then opened Book Your Stay from anywhere
// else was quietly back to 2.
//
// PERSISTED PER BROWSER, nothing more: this is a preference, not a booking.
//
// READ IN useEffect, NEVER IN INITIAL STATE. The site is a static export, so
// the first paint has to match the pre-rendered HTML exactly; a value that
// only exists in the browser makes them differ and React throws the tree away.
// Same rule the currency provider follows.
const KEY = 'upv_trip_v1';
const DEFAULT_GUESTS = 2;

const TripPrefsContext = createContext(null);

export function TripPrefsProvider({ children }) {
  const [guests, setGuestsState] = useState(DEFAULT_GUESTS);

  useEffect(() => {
    try {
      const saved = Number(window.localStorage.getItem(KEY));
      if (saved >= 1 && saved <= 12) setGuestsState(saved);
    } catch {
      // localStorage unavailable - the default stands.
    }
  }, []);

  const setGuests = (n) => {
    const v = Number(n) || DEFAULT_GUESTS;
    setGuestsState(v);
    try {
      window.localStorage.setItem(KEY, String(v));
    } catch {
      // ignore
    }
  };

  return <TripPrefsContext.Provider value={{ guests, setGuests }}>{children}</TripPrefsContext.Provider>;
}

export function useTripPrefs() {
  const ctx = useContext(TripPrefsContext);
  if (!ctx) throw new Error('useTripPrefs must be used within TripPrefsProvider');
  return ctx;
}
