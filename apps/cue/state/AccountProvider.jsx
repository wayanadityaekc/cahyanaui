'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { readLocal, writeLocal, removeLocal } from '@/lib/storage';
import { KEY, API_BASE } from '@/lib/constants';

const AccountContext = createContext(null);

function fmtDay(dateStr) {
  if (!dateStr) return 'date TBD';
  const [y, m, d] = dateStr.split('-').map(Number);
  return new Date(y, m - 1, d).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
}

export function AccountProvider({ children }) {
  const [account, setAccount] = useState(null);
  const [trips, setTrips] = useState(null);
  const [myReviews, setMyReviews] = useState(null);
  const [hydrated, setHydrated] = useState(false);
  const [justSignedIn, setJustSignedIn] = useState(false);

  const refreshTrips = useCallback(async () => {
    const token = readLocal(KEY.token, '');
    if (!token) return;
    try {
      const r = await fetch(`${API_BASE}/bookings/mine`, { headers: { Authorization: `Bearer ${token}` } });
      const d = r.ok ? await r.json() : null;
      if (d && Array.isArray(d.upcoming)) setTrips(d);
    } catch (e) {}
  }, []);

  useEffect(() => {
    let cancelled = false;

    const params = new URLSearchParams(window.location.search);
    const magic = params.get('token');
    if (magic) {
      writeLocal(KEY.token, magic);
      setJustSignedIn(true);
      params.delete('token');
      const query = params.toString();
      window.history.replaceState({}, '', `${window.location.pathname}${query ? `?${query}` : ''}`);
    }

    const token = readLocal(KEY.token, '');
    if (!token) {
      setHydrated(true);
      return;
    }

    async function load() {
      try {
        const r = await fetch(`${API_BASE}/account/session`, { headers: { Authorization: `Bearer ${token}` } });
        const d = r.ok ? await r.json() : null;
        if (cancelled) return;
        if (d && d.account) setAccount(d.account);
        else removeLocal(KEY.token);
      } catch (e) {
      } finally {
        if (!cancelled) setHydrated(true);
      }
    }
    load();

    refreshTrips();

    return () => {
      cancelled = true;
    };
  }, [refreshTrips]);

  const hasUpcoming = !!(trips && Array.isArray(trips.upcoming) && trips.upcoming.length > 0);

  const reviewableItems = useMemo(() => {
    if (!trips || !trips.history) return [];
    const out = [];
    trips.history.forEach((t) => {
      (t.review_items || []).forEach((s) => out.push({
        ref: t.ref,
        service: s,
        tripName: t.name,
        date: t.start_date ? fmtDay(t.start_date) : '',
      }));
    });
    return out;
  }, [trips]);

  const refreshMyReviews = useCallback(async () => {
    const token = readLocal(KEY.token, '');
    if (!token) { setMyReviews([]); return; }
    try {
      const r = await fetch(`${API_BASE}/reviews/mine`, { headers: { Authorization: `Bearer ${token}` } });
      const d = r.ok ? await r.json() : [];
      setMyReviews(Array.isArray(d) ? d : []);
    } catch (e) {
      setMyReviews([]);
    }
  }, []);

  function logout() {
    removeLocal(KEY.token);
    setAccount(null);
    setTrips(null);
    setMyReviews(null);
  }

  async function deleteAccount() {
    try {
      const token = readLocal(KEY.token, '');
      const r = await fetch(`${API_BASE}/account`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      const d = await r.json().catch(() => ({}));
      if (r.ok && d.status === 'ok') {
        removeLocal(KEY.token);
        setAccount(null);
        setTrips(null);
        setMyReviews(null);
        return { ok: true };
      }
      return { ok: false, error: (d && d.detail) || '' };
    } catch (e) {
      return { ok: false, error: '' };
    }
  }

  async function requestLogin(email) {
    try {
      const r = await fetch(`${API_BASE}/account/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      return r.ok;
    } catch (e) {
      return false;
    }
  }

  async function verifyCode(email, code) {
    try {
      const r = await fetch(`${API_BASE}/account/verify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, code }),
      });
      const d = await r.json().catch(() => ({}));
      if (r.ok && d.status === 'ok' && d.token) {
        writeLocal(KEY.token, d.token);
        setAccount(d.account || null);
        refreshTrips();
        return { ok: true };
      }
      return { ok: false, error: (d && d.detail) || '' };
    } catch (e) {
      return { ok: false, error: '' };
    }
  }

  async function createAccount({ name, email, phone }) {
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
      if (r.ok && d.signin_sent) return { ok: false, signin: true, email: d.email || email };
      return { ok: false, error: (d && d.error) || '' };
    } catch (e) {
      return { ok: false };
    }
  }

  return (
    <AccountContext.Provider value={{ account, setAccount, hasUpcoming, trips, reviewableItems, refreshTrips, myReviews, refreshMyReviews, deleteAccount, logout, requestLogin, verifyCode, createAccount, hydrated, justSignedIn }}>
      {children}
    </AccountContext.Provider>
  );
}

export function useAccount() {
  const ctx = useContext(AccountContext);
  if (!ctx) throw new Error('useAccount must be used inside AccountProvider');
  return ctx;
}
