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

  async function apply(code) {
    const clean = String(code || '')
      .trim()
      .toUpperCase();
    if (!clean) return 0;
    try {
      const response = await fetch(`${API_BASE}/referral/validate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: clean }),
      });
      const data = await response.json();
      if (data && data.valid) {
        const entry = { code: clean, pct: data.pct };
        setReferral(entry);
        writeLocal(KEY.referral, entry);
        return data.pct;
      }
    } catch (e) {}
    return 0;
  }

  function clear() {
    setReferral(null);
    removeLocal(KEY.referral);
  }

  return (
    <ReferralContext.Provider value={{ referral, pct: (referral && referral.pct) || 0, apply, clear }}>
      {children}
    </ReferralContext.Provider>
  );
}

export function useReferral() {
  const referralContext = useContext(ReferralContext);
  if (!referralContext) throw new Error('useReferral must be used inside ReferralProvider');
  return referralContext;
}
