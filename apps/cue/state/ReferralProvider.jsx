'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { readLocalJSON, writeLocal, removeLocal } from '@/lib/storage';
import { KEY, API_BASE } from '@/lib/constants';

const ReferralContext = createContext(null);

export function ReferralProvider({ children }) {
  const [referral, setReferral] = useState(null);

  useEffect(() => {
    setReferral(readLocalJSON(KEY.referral, null));
  }, []);

  const apply = async (code) => {
    const clean = String(code || '').trim().toUpperCase();
    if (!clean) return 0;
    try {
      const d = await fetch(`${API_BASE}/referral/validate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: clean }),
      }).then((r) => r.json());
      if (d && d.valid) {
        const entry = { code: clean, pct: d.pct };
        setReferral(entry);
        writeLocal(KEY.referral, entry);
        return d.pct;
      }
    } catch (e) {}
    return 0;
  };

  const clear = () => {
    setReferral(null);
    removeLocal(KEY.referral);
  };

  return (
    <ReferralContext.Provider value={{ referral, pct: (referral && referral.pct) || 0, apply, clear }}>
      {children}
    </ReferralContext.Provider>
  );
}

export function useReferral() {
  const ctx = useContext(ReferralContext);
  if (!ctx) throw new Error('useReferral must be used inside ReferralProvider');
  return ctx;
}
