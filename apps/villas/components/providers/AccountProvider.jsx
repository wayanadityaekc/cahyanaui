'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { API_BASE, API_SITE, TOKEN_KEY } from '@/lib/constants';

// THE GUEST'S ACCOUNT - the same account as on cahyanaubudexperience.com,
// because it is one family and one guest record. This is the villa site's own
// copy of CUE's AccountProvider, cut down to what this site can honestly do:
// no trips list and no reviews, since villa bookings do not reach the API yet.
//
// PASSWORDLESS, and that is the whole design: creating an account signs you in
// on the spot, and signing in again mails a link that carries the token. There
// is no password to store, lose or leak.
//
// READ IN AN EFFECT, never in initial state - this is a static export, so the
// first paint has to match the pre-rendered HTML. Same rule as currency and
// trip prefs.
const AccountContext = createContext(null);

const read = () => {
  try { return window.localStorage.getItem(TOKEN_KEY) || ''; } catch { return ''; }
};
const write = (v) => {
  try { window.localStorage.setItem(TOKEN_KEY, v); } catch { /* ignore */ }
};
const drop = () => {
  try { window.localStorage.removeItem(TOKEN_KEY); } catch { /* ignore */ }
};

export function AccountProvider({ children }) {
  const [account, setAccount] = useState(null);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    let cancelled = false;

    // The sign-in email lands the guest back here with ?token=... . Take it,
    // store it, and STRIP IT FROM THE URL: a token left in the address bar is
    // a token that gets shared, bookmarked and put in someone's history.
    const params = new URLSearchParams(window.location.search);
    const magic = params.get('token');
    if (magic) {
      write(magic);
      params.delete('token');
      const qs = params.toString();
      window.history.replaceState({}, '', window.location.pathname + (qs ? `?${qs}` : ''));
    }

    const token = read();
    if (!token) { setHydrated(true); return undefined; }

    fetch(`${API_BASE}/account/session`, { headers: { Authorization: `Bearer ${token}` } })
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        if (cancelled) return;
        if (d && d.account) setAccount(d.account);
        // A token the server does not recognise any more is worse than no
        // token: it makes every later call fail silently.
        else drop();
      })
      .catch(() => {})
      .finally(() => { if (!cancelled) setHydrated(true); });

    return () => { cancelled = true; };
  }, []);

  // Ask for a sign-in link. The server never says whether the address is
  // registered - answering that question is how you let a stranger find out who
  // has an account - so any completed request counts as sent.
  const requestLogin = async (email) => {
    try {
      const r = await fetch(`${API_BASE}/account/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, site: API_SITE }),
      });
      return r.ok;
    } catch {
      return false;
    }
  };

  const createAccount = async ({ name, email, phone }) => {
    try {
      const r = await fetch(`${API_BASE}/account`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, phone, site: API_SITE }),
      });
      const d = await r.json().catch(() => ({}));
      if (r.ok && d.token) {
        write(d.token);
        setAccount(d.account || null);
        return { ok: true };
      }
      return { ok: false, error: (d && d.detail) || (d && d.error) || '' };
    } catch {
      return { ok: false };
    }
  };

  const logout = () => { drop(); setAccount(null); };

  return (
    <AccountContext.Provider value={{ account, hydrated, requestLogin, createAccount, logout }}>
      {children}
    </AccountContext.Provider>
  );
}

export function useAccount() {
  const ctx = useContext(AccountContext);
  if (!ctx) throw new Error('useAccount must be used within AccountProvider');
  return ctx;
}
