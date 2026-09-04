'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { readLocal, writeLocal, removeLocal } from '@/lib/storage';
import { KEY, API_BASE } from '@/lib/constants';

const AccountContext = createContext(null);

export function AccountProvider({ children }) {
  const [account, setAccount] = useState(null);
  const [hasUpcoming, setHasUpcoming] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    let cancelled = false;

    const params = new URLSearchParams(window.location.search);
    const magic = params.get('token');
    if (magic) {
      writeLocal(KEY.token, magic);
      params.delete('token');
      const qs = params.toString();
      window.history.replaceState({}, '', window.location.pathname + (qs ? '?' + qs : ''));
    }

    const token = readLocal(KEY.token, '');
    if (!token) {
      setHydrated(true);
      return;
    }

    fetch(`${API_BASE}/account/session`, { headers: { Authorization: `Bearer ${token}` } })
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        if (cancelled) return;
        if (d && d.account) setAccount(d.account);
        else removeLocal(KEY.token);
      })
      .catch(() => {})
      .finally(() => {
        if (!cancelled) setHydrated(true);
      });

    fetch(`${API_BASE}/bookings/mine`, { headers: { Authorization: `Bearer ${token}` } })
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        if (!cancelled && d && Array.isArray(d.upcoming)) setHasUpcoming(d.upcoming.length > 0);
      })
      .catch(() => {});

    return () => {
      cancelled = true;
    };
  }, []);

  const logout = () => {
    removeLocal(KEY.token);
    setAccount(null);
    setHasUpcoming(false);
  };

  return (
    <AccountContext.Provider value={{ account, setAccount, hasUpcoming, logout, hydrated }}>
      {children}
    </AccountContext.Provider>
  );
}

export function useAccount() {
  const ctx = useContext(AccountContext);
  if (!ctx) throw new Error('useAccount must be used inside AccountProvider');
  return ctx;
}
