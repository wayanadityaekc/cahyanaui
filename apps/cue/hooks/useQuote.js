'use client';

import { useEffect, useState } from 'react';
import { quote } from '@/lib/api';

/**
 * useQuote - fetch a live server price for a set of cart lines. Handles the
 * request lifecycle (debounced by deps, cancel on unmount) so components just
 * read the priced result. Returns null until a quote is available.
 */
export default function useQuote({ lines, currency, stay, referral = '', enabled = true }) {
  const [priced, setPriced] = useState(null);

  useEffect(() => {
    if (!enabled || !lines || !lines.length) {
      setPriced(null);
      return;
    }
    let cancelled = false;
    quote({ lines, currency, stay, referral: referral || '' })
      .then((d) => {
        if (!cancelled && d && d.lines) setPriced(d);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [lines, currency, stay, referral, enabled]);

  return priced;
}
