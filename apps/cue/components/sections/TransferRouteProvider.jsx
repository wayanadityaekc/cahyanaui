'use client';

import { createContext, useCallback, useContext, useMemo, useRef, useState } from 'react';

const UBUD = 'Ubud';

function pickFacingRoute(value) {
  return (other) => (!value ? other : value === UBUD ? (other === UBUD ? '' : other) : UBUD);
}

const Ctx = createContext(null);

export function useTransferRoute() {
  const routeContext = useContext(Ctx);
  if (!routeContext) throw new Error('useTransferRoute must be used inside <TransferRouteProvider>');
  return routeContext;
}

export default function TransferRouteProvider({ children }) {
  const [from, setFrom] = useState('');
  const [to, setTo] = useState(UBUD);
  const pickerRef = useRef(null);

  const pickFrom = useCallback((fromRoute) => {
    setFrom(fromRoute);
    setTo(pickFacingRoute(fromRoute));
  }, []);
  const pickTo = useCallback((toRoute) => {
    setTo(toRoute);
    setFrom(pickFacingRoute(toRoute));
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
