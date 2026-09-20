'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { EMPTY, countItems, readCart, writeCart } from '@/lib/bookingCart';

const CartContext = createContext(null);

export function CartProvider({ children }) {
  // Starts EMPTY and is filled in an effect, never from localStorage directly.
  // This is a static export: reading stored state during the first render makes
  // the client's first paint disagree with the prerendered HTML, and React
  // throws away the mismatch. Hydrating on the next tick is the whole fix.
  const [cart, setCart] = useState(EMPTY);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setCart(readCart());
    setReady(true);
  }, []);

  // Only persist once the initial read has happened, or the empty starting
  // state would immediately overwrite a booking saved on a previous visit.
  useEffect(() => {
    if (ready) writeCart(cart);
  }, [cart, ready]);

  // Another tab is the same guest with the same booking, so keep them level.
  useEffect(() => {
    const onStorage = (e) => {
      if (e.key === null || e.key === 'upv_booking_v1') setCart(readCart());
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  // Every action is a useCallback with NO dependency on `cart` - each one uses
  // the functional form of setCart, so none of them needs to read it. That is
  // not tidiness: these callbacks are consumed inside useEffect dependency
  // arrays (BookingSheet saves the stay from one). If their identity changed
  // whenever the cart changed, the effect would fire, set the cart, get a fresh
  // callback, and fire again - an endless loop.
  const setStay = useCallback((stay) => setCart((c) => ({ ...c, stay })), []);
  const clearStay = useCallback(() => setCart((c) => ({ ...c, stay: null })), []);
  const addService = useCallback((id) => setCart((c) => (c.services.includes(id) ? c : { ...c, services: [...c.services, id] })), []);
  const removeService = useCallback((id) => setCart((c) => ({ ...c, services: c.services.filter((s) => s !== id) })), []);
  const toggleService = useCallback((id) => setCart((c) => (
    c.services.includes(id)
      ? { ...c, services: c.services.filter((s) => s !== id) }
      : { ...c, services: [...c.services, id] }
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
