'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { readLocal, writeLocal, removeLocal } from '@/lib/storage';
import { KEY, CURRENCIES, DISPLAY_GUESTS, DEFAULT_CURRENCY } from '@/lib/constants';

const TripPrefsContext = createContext(null);

export function TripPrefsProvider({ children }) {
  const [currency, setCurrencyState] = useState(DEFAULT_CURRENCY);
  const [guests, setGuestsState] = useState(0);
  const [stay, setStayState] = useState('');
  const [dateFrom, setDateFromState] = useState('');
  const [dateTo, setDateToState] = useState('');
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    const current = readLocal(KEY.currency, DEFAULT_CURRENCY);
    setCurrencyState(CURRENCIES.includes(current) ? current : DEFAULT_CURRENCY);
    setGuestsState(parseInt(readLocal(KEY.guests, '0'), 10) || 0);
    setStayState(readLocal(KEY.stay, '') || '');
    setDateFromState(readLocal(KEY.dateFrom, '') || '');
    setDateToState(readLocal(KEY.dateTo, '') || '');
    setIsHydrated(true);
  }, []);

  function setCurrency(current) {
    if (!CURRENCIES.includes(current)) return;
    setCurrencyState(current);
    writeLocal(KEY.currency, current);
  }

  function setGuests(guestCount) {
    const parsedGuests = parseInt(guestCount, 10) || 0;
    setGuestsState(parsedGuests);
    if (parsedGuests) writeLocal(KEY.guests, String(parsedGuests));
    else removeLocal(KEY.guests);
  }

  function resetGuests() {
    setGuestsState(0);
    removeLocal(KEY.guests);
  }

  function setStay(pk) {
    const pickupArea = pk && pk !== 'ubud' ? pk : '';
    setStayState(pickupArea);
    if (pickupArea) writeLocal(KEY.stay, pickupArea);
    else removeLocal(KEY.stay);
  }

  function setDateRange(from, to) {
    setDateFromState(from || '');
    setDateToState(to || '');
    if (from) writeLocal(KEY.dateFrom, from);
    else removeLocal(KEY.dateFrom);
    if (to) writeLocal(KEY.dateTo, to);
    else removeLocal(KEY.dateTo);
  }

  return (
    <TripPrefsContext.Provider
      value={{
        currency,
        setCurrency,
        guests,
        setGuests,
        resetGuests,
        displayGuests: guests || DISPLAY_GUESTS,
        stay,
        setStay,
        dateFrom,
        dateTo,
        setDateRange,
        hydrated: isHydrated,
      }}
    >
      {children}
    </TripPrefsContext.Provider>
  );
}

export function useTripPrefs() {
  const tripPrefsContext = useContext(TripPrefsContext);
  if (!tripPrefsContext) throw new Error('useTripPrefs must be used inside TripPrefsProvider');
  return tripPrefsContext;
}
