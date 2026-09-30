'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { API_BASE, API_SITE, TOKEN_KEY } from '@/lib/constants';

// Passwordless account shared with CUE; read in an effect, never initial state, so first paint matches the static HTML.
const AccountContext = createContext(null);

function read() {
  try { return window.localStorage.getItem(TOKEN_KEY) || ''; } catch (e) { return ''; }
}
function write(token) {
  try { window.localStorage.setItem(TOKEN_KEY, token); } catch (e) { /* ignore */ }
}
function drop() {
  try { window.localStorage.removeItem(TOKEN_KEY); } catch (e) { /* ignore */ }
}

export function AccountProvider({ children }) {
  const [account, setAccount] = useState(null);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    let cancelled = false;

    // Take the ?token= from the sign-in email and strip it from the URL, or it gets shared, bookmarked and kept in history.
    const params = new URLSearchParams(window.location.search);
    const magic = params.get('token');
    if (magic) {
      write(magic);
      params.delete('token');
      const remainingQuery = params.toString();
      window.history.replaceState({}, '', window.location.pathname + (remainingQuery ? `?${remainingQuery}` : ''));
    }

    const token = read();
    if (!token) { setHydrated(true); return undefined; }

    async function load() {
      try {
        const response = await fetch(`${API_BASE}/account/session`, { headers: { Authorization: `Bearer ${token}` } });
        const data = response.ok ? await response.json() : null;
        if (cancelled) return;
        if (data && data.account) setAccount(data.account);
        // A token the server no longer knows makes every later call fail silently, so drop it.
        else drop();
      } catch (e) {
        // Offline or API down: keep the token and try again next visit.
      } finally {
        if (!cancelled) setHydrated(true);
      }
    }
    load();

    return () => { cancelled = true; };
  }, []);

  // The server never says if an address is registered (that would leak who has an account), so any completed request counts as sent.
  async function requestLogin(email) {
    try {
      const response = await fetch(`${API_BASE}/account/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, site: API_SITE }),
      });
      return response.ok;
    } catch (e) {
      return false;
    }
  }

  // Check the emailed code; the session token is issued only on a match.
  async function verifyCode(email, code) {
    try {
      const response = await fetch(`${API_BASE}/account/verify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, code }),
      });
      const data = await response.json().catch(() => ({}));
      if (response.ok && data.status === 'ok' && data.token) {
        write(data.token);
        setAccount(data.account || null);
        return { ok: true };
      }
      return { ok: false, error: (data && data.detail) || '' };
    } catch (e) {
      return { ok: false, error: '' };
    }
  }

  async function createAccount({ name, email, phone }) {
    try {
      const response = await fetch(`${API_BASE}/account`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, phone, site: API_SITE }),
      });
      const data = await response.json().catch(() => ({}));
      if (response.ok && data.token) {
        write(data.token);
        setAccount(data.account || null);
        return { ok: true };
      }
      // Email already has an account: the server emailed that inbox a code instead of handing over a login.
      if (response.ok && data.signin_sent) return { ok: false, signin: true, email: data.email || email };
      return { ok: false, error: (data && data.detail) || (data && data.error) || '' };
    } catch (e) {
      return { ok: false };
    }
  }

  // Email is left out on purpose: the server refuses an email change without a code sent to the new inbox.
  async function updateAccount({ name, phone }) {
    try {
      const response = await fetch(`${API_BASE}/account`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${read()}` },
        body: JSON.stringify({ name, phone }),
      });
      const data = await response.json().catch(() => ({}));
      if (response.ok && data.account) {
        setAccount(data.account);
        return { ok: true };
      }
      return { ok: false, error: (data && data.detail) || '' };
    } catch (e) {
      return { ok: false, error: '' };
    }
  }

  async function deleteAccount() {
    try {
      const response = await fetch(`${API_BASE}/account`, { method: 'DELETE', headers: { Authorization: `Bearer ${read()}` } });
      const data = await response.json().catch(() => ({}));
      if (response.ok && data.status === 'ok') {
        drop();
        setAccount(null);
        return { ok: true };
      }
      return { ok: false, error: (data && data.detail) || '' };
    } catch (e) {
      return { ok: false, error: '' };
    }
  }

  function logout() { drop(); setAccount(null); }

  return (
    <AccountContext.Provider value={{ account, hydrated, requestLogin, verifyCode, createAccount, updateAccount, deleteAccount, logout }}>
      {children}
    </AccountContext.Provider>
  );
}

export function useAccount() {
  const ctx = useContext(AccountContext);
  if (!ctx) throw new Error('useAccount must be used within AccountProvider');
  return ctx;
}
