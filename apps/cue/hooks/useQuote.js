'use client';

import { useEffect, useState } from 'react';
import { quote } from '@/lib/api';

export default function useQuote({ lines, currency, stay, referral = '', enabled = true }) {
  const [priced, setPriced] = useState(null);

  useEffect(() => {
    if (!enabled || !lines || !lines.length) {
      setPriced(null);
      return;
    }
    let cancelled = false;
    async function load() {
      try {
        const d = await quote({ lines, currency, stay, referral: referral || '' });
        if (!cancelled && d && d.lines) setPriced(d);
      } catch (e) {}
    }
    load();
    return () => {
      cancelled = true;
    };
  }, [lines, currency, stay, referral, enabled]);

  return priced;
}
