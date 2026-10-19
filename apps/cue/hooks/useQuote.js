'use client';

import { useEffect, useState } from 'react';
import { quote } from '@/lib/api';

export default function useQuote({ lines, currency, stay, referral = '', enabled = true }) {
  const [priced, setPriced] = useState(null);

  useEffect(() => {
    const isQuoteBlocked = !enabled || !lines || !lines.length;
    if (isQuoteBlocked) {
      setPriced(null);
      return;
    }
    let cancelled = false;
    async function load() {
      try {
        const quoteResult = await quote({ lines, currency, stay, referral: referral || '' });
        const hasQuoteLines = !cancelled && quoteResult && quoteResult.lines;
        if (hasQuoteLines) setPriced(quoteResult);
      } catch (e) {}
    }
    load();
    return () => {
      cancelled = true;
    };
  }, [lines, currency, stay, referral, enabled]);

  return priced;
}
