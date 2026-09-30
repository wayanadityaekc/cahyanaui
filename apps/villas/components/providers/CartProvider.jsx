'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { EMPTY, countItems, readCart, writeCart } from '@/lib/bookingCart';

const CartContext = createContext(null);

export function CartProvider({ children }) {
  // Starts empty and fills in an effect: the static export's first paint must match the prerendered HTML.
  const [cart, setCart] = useState(EMPTY);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setCart(readCart());
    setReady(true);
  }, []);

  // Save only after the first read, or the empty start state overwrites a booking saved last visit.
  useEffect(() => {
    if (ready) writeCart(cart);
  }, [cart, ready]);

  // Another tab is the same guest with the same booking, so keep them level.
  useEffect(() => {
    function onStorage(e) {
      if (e.key === null || e.key === 'upv_booking_v1') setCart(readCart());
    }
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  // Callbacks must not depend on cart: they sit in effect deps (BookingSheet), and a new identity would loop forever.
  const setStay = useCallback((stay) => setCart((prev) => ({ ...prev, stay })), []);
  const clearStay = useCallback(() => setCart((prev) => ({ ...prev, stay: null })), []);
  const addService = useCallback((id) => setCart((prev) => (prev.services.includes(id) ? prev : { ...prev, services: [...prev.services, id] })), []);
  const removeService = useCallback((id) => setCart((prev) => ({ ...prev, services: prev.services.filter((serviceId) => serviceId !== id) })), []);
  const toggleService = useCallback((id) => setCart((prev) => (
    prev.services.includes(id)
      ? { ...prev, services: prev.services.filter((serviceId) => serviceId !== id) }
      : { ...prev, services: [...prev.services, id] }
  )), []);
  const clear = useCallback(() => setCart(EMPTY), []);

  const value = useMemo(() => ({
    cart,
    ready,
    count: countItems(cart),
    setStay,
    clearStay,
    addService,
    removeService,
    toggleService,
    clear,
  }), [cart, ready, setStay, clearStay, addService, removeService, toggleService, clear]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used inside CartProvider');
  return ctx;
}
