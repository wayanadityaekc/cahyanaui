'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { BASELINE_FX, formatMoney } from '@cahyana/ui';
import { API_BASE } from '@/lib/constants';
import { CURRENCIES, CURRENCY_STORAGE_KEY, DEFAULT_CURRENCY, displayBreakdown, formatCurrency } from '@/lib/currency';

// Display currency (saved in localStorage) plus the live rates; the build bakes in that day's rates, the page refreshes them.
const CurrencyContext = createContext(null);

async function fetchRates() {
  try {
    const response = await fetch(`${API_BASE}/pricing/catalog?currency=USD`);
    if (!response.ok) return null;
    const catalog = await response.json();
    return catalog?.fx?.perUsd && catalog.fx.idrPerUsd ? catalog.fx : null;
  } catch (e) {
    return null;
  }
}

export function CurrencyProvider({ initialFx = null, children }) {
  const [currency, setCurrency] = useState(DEFAULT_CURRENCY);
  const [fx, setFx] = useState(initialFx || BASELINE_FX);

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(CURRENCY_STORAGE_KEY);
      if (saved && CURRENCIES.includes(saved)) setCurrency(saved);
    } catch (e) {
      // localStorage unavailable: keep the default.
    }
    let alive = true;
    async function refresh() {
      const live = await fetchRates();
      if (alive && live) setFx(live);
    }
    refresh();
    return () => { alive = false; };
  }, []);

  function changeCurrency(code) {
    setCurrency(code);
    try {
      window.localStorage.setItem(CURRENCY_STORAGE_KEY, code);
    } catch (e) {
      // Not saved; the choice still applies on this page.
    }
  }

  const value = {
    currency,
    fx,
    setCurrency: changeCurrency,
    format: (idr) => formatCurrency(idr, currency, fx),
    formatAmount: (amount) => formatMoney(amount, currency),
    breakdown: (priced) => displayBreakdown(priced, currency, fx),
  };

  return <CurrencyContext.Provider value={value}>{children}</CurrencyContext.Provider>;
}

export function useCurrency() {
  const context = useContext(CurrencyContext);
  if (!context) throw new Error('useCurrency must be used within CurrencyProvider');
  return context;
}
