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

  // Ask the backend to email a magic sign-in link. Backend never reveals whether
  // the email exists, so any completed request counts as success.
  const requestLogin = async (email) => {
    try {
      const r = await fetch(`${API_BASE}/account/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      return r.ok;
    } catch {
      return false;
    }
  };

  // Create an account (no password) - on success the backend returns a token we
  // store, logging the guest straight in.
  const createAccount = async ({ name, email, phone }) => {
    try {
      const r = await fetch(`${API_BASE}/account`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          email,
          phone,
          guest_count_pref: readLocal(KEY.guests, '') || '',
          stay_area_pref: readLocal(KEY.stay, '') || '',
        }),
      });
      const d = await r.json().catch(() => ({}));
      if (r.ok && d.token) {
        writeLocal(KEY.token, d.token);
        setAccount(d.account || null);
        return { ok: true };
      }
      return { ok: false, error: (d && d.error) || '' };
    } catch {
      return { ok: false };
    }
  };

  return (
    <AccountContext.Provider value={{ account, setAccount, hasUpcoming, logout, requestLogin, createAccount, hydrated }}>
      {children}
    </AccountContext.Provider>
  );
}

export function useAccount() {
  const ctx = useContext(AccountContext);
  if (!ctx) throw new Error('useAccount must be used inside AccountProvider');
  return ctx;
}
