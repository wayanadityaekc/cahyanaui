'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { readLocal, writeLocal, removeLocal } from '@/lib/storage';
import { KEY, API_BASE } from '@/lib/constants';

const AccountContext = createContext(null);

function fmtDay(ds) {
  if (!ds) return 'date TBD';
  const [y, m, d] = ds.split('-').map(Number);
  return new Date(y, m - 1, d).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
}

export function AccountProvider({ children }) {
  const [account, setAccount] = useState(null);
  const [trips, setTrips] = useState(null);
  // The guest's own reviews (Settings page, WO3). Unlike trips, this is
  // never needed outside Settings - lazy-fetched by refreshMyReviews rather
  // than on every page load for every signed-in guest.
  const [myReviews, setMyReviews] = useState(null);
  const [hydrated, setHydrated] = useState(false);
  // True when THIS page load arrived through a sign-in link (?token=). The booking
  // gate uses it to send a guest back to the page they were booking from - the
  // email link always lands on the homepage.
  const [justSignedIn, setJustSignedIn] = useState(false);

  // Re-read My Trips. Called on mount, and again after a review is sent: the
  // list of what can still be reviewed comes from the server, and without a
  // re-read a trip reviewed a moment ago stays offered until the page reloads -
  // tick it again and the gate answers "you've already submitted a review".
  const refreshTrips = useCallback(() => {
    const token = readLocal(KEY.token, '');
    if (!token) return Promise.resolve();
    return fetch(`${API_BASE}/bookings/mine`, { headers: { Authorization: `Bearer ${token}` } })
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => { if (d && Array.isArray(d.upcoming)) setTrips(d); })
      .catch(() => {});
  }, []);

  useEffect(() => {
    let cancelled = false;

    const params = new URLSearchParams(window.location.search);
    const magic = params.get('token');
    if (magic) {
      writeLocal(KEY.token, magic);
      setJustSignedIn(true);
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

    refreshTrips();

    return () => {
      cancelled = true;
    };
  }, [refreshTrips]);

  const hasUpcoming = !!(trips && Array.isArray(trips.upcoming) && trips.upcoming.length > 0);

  // Every still-reviewable tour across ALL past bookings (not just one trip) - feeds
  // any "Leave a Review" trigger site-wide (My Trips button + ReviewGate on bookable
  // pages), so it's computed once here instead of re-fetched per consumer.
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

  // Settings page only - the guest's own reviews, all statuses (their private
  // view, not the public feed). Same shape as refreshTrips.
  const refreshMyReviews = useCallback(() => {
    const token = readLocal(KEY.token, '');
    if (!token) { setMyReviews([]); return Promise.resolve(); }
    return fetch(`${API_BASE}/reviews/mine`, { headers: { Authorization: `Bearer ${token}` } })
      .then((r) => (r.ok ? r.json() : []))
      .then((d) => setMyReviews(Array.isArray(d) ? d : []))
      .catch(() => setMyReviews([]));
  }, []);

  function logout() {
    removeLocal(KEY.token);
    setAccount(null);
    setTrips(null);
    setMyReviews(null);
  }

  // Delete the account (Settings page, WO3). Bookings and reviews survive on
  // the server - this only clears what THIS browser is holding, same as
  // logout, once the server confirms the account is actually gone.
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
    } catch {
      return { ok: false, error: '' };
    }
  }

  // Ask the backend to email a 6-digit sign-in code (28 Sep 2026 - was a link;
  // Wayan: a code works wherever the guest reads the email, same device or not,
  // which a link never could). Backend never reveals whether the email exists,
  // so any completed request counts as success.
  async function requestLogin(email) {
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
  }

  // Check that code. The session is issued server-side only on a match - unlike
  // the old link, nothing here is already valid before this call succeeds.
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
    } catch {
      return { ok: false, error: '' };
    }
  }

  // Create an account (no password) - on success the backend returns a token we
  // store, logging the guest straight in.
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
      // The email already has an account. The server does not hand this browser
      // its login - it emails a sign-in link to that inbox instead.
      if (r.ok && d.signin_sent) return { ok: false, signin: true, email: d.email || email };
      return { ok: false, error: (d && d.error) || '' };
    } catch {
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
