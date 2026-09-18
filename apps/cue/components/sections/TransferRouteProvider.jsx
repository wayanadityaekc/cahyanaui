'use client';

import { createContext, useCallback, useContext, useMemo, useRef, useState } from 'react';

// The transfer page's From/To state, lifted out of TransferPicker.
//
// WHY A PROVIDER AND NOT useState IN THE PICKER: the six "Popular routes"
// buttons sit in the card BELOW the hero, and the note above them has always
// promised "tap a route to pre-fill the search". They cannot be the picker's
// children (different section, different DOM subtree), so the state they both
// need has to live above both. The provider renders no element of its own, so
// TransferSection stays a server component and the details card below the
// routes is still server-rendered - only the picker and the six buttons are
// client code.

const UBUD = 'Ubud';

const Ctx = createContext(null);

export function useTransferRoute() {
  const v = useContext(Ctx);
  if (!v) throw new Error('useTransferRoute must be used inside <TransferRouteProvider>');
  return v;
}

export default function TransferRouteProvider({ children }) {
  const [from, setFrom] = useState('');
  const [to, setTo] = useState(UBUD);
  // The picker registers its own box here so selectRoute can scroll to it
  // without a magic element id.
  const pickerRef = useRef(null);

  // Tapping a route always resets to the canonical direction (area -> Ubud),
  // even if the guest had swapped the form round - a route card names one
  // direction, so half-applying it would leave the form saying something the
  // card does not.
  const selectRoute = useCallback((area) => {
    setFrom(area);
    setTo(UBUD);
    // The form is ABOVE the routes, so without this the guest taps and sees
    // nothing change. html has scroll-behavior:smooth, so this animates.
    if (pickerRef.current) pickerRef.current.scrollIntoView({ block: 'center' });
  }, []);

  const value = useMemo(
    () => ({ from, to, setFrom, setTo, selectRoute, pickerRef, UBUD }),
    [from, to, selectRoute]
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}
