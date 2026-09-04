'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { readLocal, writeLocal, removeLocal } from '@/lib/storage';
import { KEY, CURRENCIES, DISPLAY_GUESTS } from '@/lib/constants';

const TripPrefsContext = createContext(null);

export function TripPrefsProvider({ children }) {
  const [currency, setCurrencyState] = useState('USD');
  const [guests, setGuestsState] = useState(0);
  const [stay, setStayState] = useState('');
  const [dateFrom, setDateFromState] = useState('');
  const [dateTo, setDateToState] = useState('');
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const cur = readLocal(KEY.currency, 'USD');
    setCurrencyState(CURRENCIES.includes(cur) ? cur : 'USD');
    setGuestsState(parseInt(readLocal(KEY.guests, '0'), 10) || 0);
    setStayState(readLocal(KEY.stay, '') || '');
    setDateFromState(readLocal(KEY.dateFrom, '') || '');
    setDateToState(readLocal(KEY.dateTo, '') || '');
    setHydrated(true);
  }, []);

  const setCurrency = (cur) => {
    if (!CURRENCIES.includes(cur)) return;
    setCurrencyState(cur);
    writeLocal(KEY.currency, cur);
  };

  const setGuests = (n) => {
    const v = parseInt(n, 10) || 0;
    setGuestsState(v);
    if (v) writeLocal(KEY.guests, String(v));
    else removeLocal(KEY.guests);
  };

  const resetGuests = () => {
    setGuestsState(0);
    removeLocal(KEY.guests);
  };

  const setStay = (pk) => {
    const v = pk && pk !== 'ubud' ? pk : '';
    setStayState(v);
    if (v) writeLocal(KEY.stay, v);
    else removeLocal(KEY.stay);
  };

  const setDateRange = (from, to) => {
    setDateFromState(from || '');
    setDateToState(to || '');
    if (from) writeLocal(KEY.dateFrom, from); else removeLocal(KEY.dateFrom);
    if (to) writeLocal(KEY.dateTo, to); else removeLocal(KEY.dateTo);
  };

  return (
    <TripPrefsContext.Provider
      value={{
        currency, setCurrency,
        guests, setGuests, resetGuests,
        displayGuests: guests || DISPLAY_GUESTS,
        stay, setStay,
        dateFrom, dateTo, setDateRange,
        hydrated,
      }}
    >
      {children}
    </TripPrefsContext.Provider>
  );
}

export function useTripPrefs() {
  const ctx = useContext(TripPrefsContext);
  if (!ctx) throw new Error('useTripPrefs must be used inside TripPrefsProvider');
  return ctx;
}
