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

// What the OTHER side becomes when this one is set to v. Module scope on purpose:
// it depends on nothing but v, so the setters below can keep an empty dep list.
// An empty v only reaches it from the picker's swap(), which is setting both
// sides in the same tick - so leave the other side alone rather than forcing Ubud.
const facing = (v) => (other) => (!v ? other : v === UBUD ? (other === UBUD ? '' : other) : UBUD);

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

  // ONE SIDE IS ALWAYS UBUD (Sep 2026, Wayan: "kalo kita milih area dari kolom
  // input belum bisa jalan dan di book"). Every route we price is "X - Ubud", so
  // a pair with no Ubud in it can never have a price. The form used to let the
  // guest build exactly that, and worse: To started at Ubud and From at the empty
  // placeholder, so picking an area in TO alone left From empty - the priced
  // route needs both sides, so the price stayed "Pick a route to see the price"
  // and Book stayed dead with nothing on screen saying why. Measured before the
  // fix: picking To = Canggu Area left from:"" and Book disabled.
  //
  // So choosing an area on one side puts Ubud on the other. Choosing Ubud on a
  // side that already faces Ubud clears the opposite one back to its placeholder,
  // so the form asks for the area instead of sitting on "Ubud -> Ubud" (which
  // used to render the em dash and the "no fixed price for this pair" line, as if
  // the route were the problem).
  const pickFrom = useCallback((v) => { setFrom(v); setTo(facing(v)); }, []);
  const pickTo = useCallback((v) => { setTo(v); setFrom(facing(v)); }, []);

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

  // setFrom/setTo are NOT exported: the picker has to go through pickFrom/pickTo
  // or the invariant above can be broken from the outside again.
  const value = useMemo(
    () => ({ from, to, pickFrom, pickTo, selectRoute, pickerRef, UBUD }),
    [from, to, pickFrom, pickTo, selectRoute]
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}
