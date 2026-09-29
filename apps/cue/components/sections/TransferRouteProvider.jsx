'use client';

import { createContext, useCallback, useContext, useMemo, useRef, useState } from 'react';

// Shared From/To state for the transfer picker and route cards; renders no element, so the section stays server-side.

const UBUD = 'Ubud';

// What the other side becomes when one side is set to v; empty v (swap) leaves the other side alone.
function facing(v) { return (other) => (!v ? other : v === UBUD ? (other === UBUD ? '' : other) : UBUD); }

const Ctx = createContext(null);

export function useTransferRoute() {
  const v = useContext(Ctx);
  if (!v) throw new Error('useTransferRoute must be used inside <TransferRouteProvider>');
  return v;
}

export default function TransferRouteProvider({ children }) {
  const [from, setFrom] = useState('');
  const [to, setTo] = useState(UBUD);
  // The picker registers its box here so selectRoute can scroll to it.
  const pickerRef = useRef(null);

  // One side is always Ubud (only 'X - Ubud' routes have prices); picking Ubud twice clears the other side.
  const pickFrom = useCallback((v) => { setFrom(v); setTo(facing(v)); }, []);
  const pickTo = useCallback((v) => { setTo(v); setFrom(facing(v)); }, []);

  // A route card always sets the canonical direction (area -> Ubud), even after a swap.
  const selectRoute = useCallback((area) => {
    setFrom(area);
    setTo(UBUD);
    // The form sits above the route cards, so scroll back to it.
    if (pickerRef.current) pickerRef.current.scrollIntoView({ block: 'center' });
  }, []);

  // setFrom/setTo stay private; callers must use pickFrom/pickTo or the Ubud invariant breaks.
  const value = useMemo(
    () => ({ from, to, pickFrom, pickTo, selectRoute, pickerRef, UBUD }),
    [from, to, pickFrom, pickTo, selectRoute]
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}
