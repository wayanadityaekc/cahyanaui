'use client';

import { createContext, useCallback, useContext, useState } from 'react';

const BookingContext = createContext(null);

export function BookingProvider({ children }) {
  const [ctx, setCtx] = useState(null);

  const openBooking = useCallback((opts) => setCtx(opts || null), []);
  const closeBooking = useCallback(() => setCtx(null), []);

  return (
    <BookingContext.Provider value={{ ctx, openBooking, closeBooking }}>
      {children}
    </BookingContext.Provider>
  );
}

export function useBooking() {
  const c = useContext(BookingContext);
  if (!c) throw new Error('useBooking must be used inside BookingProvider');
  return c;
}
