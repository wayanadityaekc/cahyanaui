'use client';

import { createContext, useContext, useState } from 'react';

// Shared Standard/Exclusive selection for a single detail page. Wraps the page so
// the Options cards and the booking form toggle drive the same value (two-way).
// Components outside a provider (e.g. the booking modal) get null and keep their
// own local mode.
const BookModeContext = createContext(null);

export function BookModeProvider({ children }) {
  const [mode, setMode] = useState('standard');
  return <BookModeContext.Provider value={{ mode, setMode }}>{children}</BookModeContext.Provider>;
}

export function useBookMode() {
  return useContext(BookModeContext);
}
