'use client';

import { createContext, useContext, useState } from 'react';

// Shared "which villa is the guest currently looking at" state — mirrors the
// original site's single global #bookVilla dropdown, which every "Book Now" /
// "Check availability" control on the page read from (defaulting to the
// house when no dropdown was present, e.g. on interior pages).
const VillaSelectionContext = createContext(null);

export function VillaSelectionProvider({ children }) {
  const [villa, setVilla] = useState('house');
  return (
    <VillaSelectionContext.Provider value={{ villa, setVilla }}>
      {children}
    </VillaSelectionContext.Provider>
  );
}

export function useVillaSelection() {
  const ctx = useContext(VillaSelectionContext);
  if (!ctx) throw new Error('useVillaSelection must be used within VillaSelectionProvider');
  return ctx;
}
