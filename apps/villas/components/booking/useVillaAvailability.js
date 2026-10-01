'use client';

import { useEffect, useState } from 'react';
import { fetchAvailability } from '@/lib/availability';

// { status: 'loading' | 'ready' | 'unknown', busy } for one villa, refetched when the villa changes.
export default function useVillaAvailability(villaSlug) {
  const [state, setState] = useState({ status: 'loading', busy: [] });

  useEffect(() => {
    if (!villaSlug) return undefined;
    let alive = true;
    setState({ status: 'loading', busy: [] });
    async function load() {
      const result = await fetchAvailability(villaSlug);
      if (alive) setState({ status: result.known ? 'ready' : 'unknown', busy: result.busy });
    }
    load();
    return () => { alive = false; };
  }, [villaSlug]);

  return state;
}
