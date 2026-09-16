'use client';

import { createContext, useContext, useState } from 'react';

const BookBarContext = createContext(null);

// The global sticky BookBar (rendered once in app/layout.jsx, shows on every
// page) needs to know whether the CURRENT page has a bookable tour/attraction
// item, to switch between price+Book-now content and the generic fallback CTA.
// Detail pages register their item via <BookBarRegister item={...} />.
export function BookBarProvider({ children }) {
  const [item, setItem] = useState(null);

  return <BookBarContext.Provider value={{ item, setItem }}>{children}</BookBarContext.Provider>;
}

export function useBookBarItem() {
  const c = useContext(BookBarContext);
  if (!c) throw new Error('useBookBarItem must be used inside BookBarProvider');
  return c;
}
