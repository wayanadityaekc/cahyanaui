'use client';

import { createContext, useCallback, useContext, useMemo, useRef, useState } from 'react';

const UBUD = 'Ubud';

function facing(v) {
  return (other) => (!v ? other : v === UBUD ? (other === UBUD ? '' : other) : UBUD);
}

const Ctx = createContext(null);

export function useTransferRoute() {
  const v = useContext(Ctx);
  if (!v) throw new Error('useTransferRoute must be used inside <TransferRouteProvider>');
  return v;
}

export default function TransferRouteProvider({ children }) {
  const [from, setFrom] = useState('');
  const [to, setTo] = useState(UBUD);
  const pickerRef = useRef(null);

  const pickFrom = useCallback((v) => {
    setFrom(v);
    setTo(facing(v));
  }, []);
  const pickTo = useCallback((v) => {
    setTo(v);
    setFrom(facing(v));
  }, []);

  const selectRoute = useCallback((area) => {
    setFrom(area);
    setTo(UBUD);
    if (pickerRef.current) pickerRef.current.scrollIntoView({ block: 'center' });
  }, []);

  const value = useMemo(
    () => ({ from, to, pickFrom, pickTo, selectRoute, pickerRef, UBUD }),
    [from, to, pickFrom, pickTo, selectRoute],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}
