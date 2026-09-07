'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { CURRENCY_STORAGE_KEY, DEFAULT_CURRENCY, convertFromUSD, formatCurrency } from '@/lib/currency';

// Site-wide display currency, shared by the navbar picker, villa cards,
// villa detail pages and the booking flow. Persisted per-browser only
// (localStorage) — this never talks to a real FX rate service, see
// lib/currency.js for the approximate, hardcoded rates.
const CurrencyContext = createContext(null);

export function CurrencyProvider({ children }) {
  const [currency, setCurrency] = useState(DEFAULT_CURRENCY);

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(CURRENCY_STORAGE_KEY);
      if (saved) setCurrency(saved);
    } catch {
      // localStorage unavailable — fall back to the default silently.
    }
  }, []);

  const changeCurrency = (code) => {
    setCurrency(code);
    try {
      window.localStorage.setItem(CURRENCY_STORAGE_KEY, code);
    } catch {
      // ignore
    }
  };

  const value = {
    currency,
    setCurrency: changeCurrency,
    convert: (usd) => convertFromUSD(usd, currency),
    format: (usd) => formatCurrency(usd, currency),
  };

  return <CurrencyContext.Provider value={value}>{children}</CurrencyContext.Provider>;
}

export function useCurrency() {
  const ctx = useContext(CurrencyContext);
  if (!ctx) throw new Error('useCurrency must be used within CurrencyProvider');
  return ctx;
}
