'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { EMPTY, countItems, readCart, writeCart } from '@/lib/bookingCart';
import { extraId } from '@/lib/extras';

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [cart, setCart] = useState(EMPTY);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setCart(readCart());
    setReady(true);
  }, []);

  useEffect(() => {
    if (ready) writeCart(cart);
  }, [cart, ready]);

  useEffect(() => {
    function onStorage(e) {
      if (e.key === null || e.key === 'upv_booking_v1') setCart(readCart());
    }
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  const setStay = useCallback((stay) => setCart((prev) => ({ ...prev, stay })), []);
  const clearStay = useCallback(() => setCart((prev) => ({ ...prev, stay: null })), []);
  const addService = useCallback(
    (id) => setCart((prev) => (prev.services.includes(id) ? prev : { ...prev, services: [...prev.services, id] })),
    [],
  );
  const removeService = useCallback(
    (id) => setCart((prev) => ({ ...prev, services: prev.services.filter((serviceId) => serviceId !== id) })),
    [],
  );
  const toggleService = useCallback(
    (id) =>
      setCart((prev) =>
        prev.services.includes(id)
          ? { ...prev, services: prev.services.filter((serviceId) => serviceId !== id) }
          : { ...prev, services: [...prev.services, id] },
      ),
    [],
  );
  const addExtra = useCallback(
    (extra) =>
      setCart((prev) =>
        prev.extras.some((line) => extraId(line) === extraId(extra))
          ? prev
          : { ...prev, extras: [...prev.extras, extra] },
      ),
    [],
  );
  const removeExtra = useCallback(
    (id) => setCart((prev) => ({ ...prev, extras: prev.extras.filter((line) => extraId(line) !== id) })),
    [],
  );
  const updateExtra = useCallback(
    (id, patch) =>
      setCart((prev) => ({
        ...prev,
        extras: prev.extras.map((line) => (extraId(line) === id ? { ...line, ...patch } : line)),
      })),
    [],
  );
  const clear = useCallback(() => setCart(EMPTY), []);

  const value = useMemo(
    () => ({
      cart,
      ready,
      count: countItems(cart),
      setStay,
      clearStay,
      addService,
      removeService,
      toggleService,
      addExtra,
      removeExtra,
      updateExtra,
      clear,
    }),
    [
      cart,
      ready,
      setStay,
      clearStay,
      addService,
      removeService,
      toggleService,
      addExtra,
      removeExtra,
      updateExtra,
      clear,
    ],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used inside CartProvider');
  return ctx;
}
