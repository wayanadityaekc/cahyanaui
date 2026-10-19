'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { EMPTY, countItems, readCart, writeCart } from '@/lib/bookingCart';
import { buildExtraId } from '@/lib/extras';

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [cart, setCart] = useState(EMPTY);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    setCart(readCart());
    setIsReady(true);
  }, []);

  useEffect(() => {
    if (isReady) writeCart(cart);
  }, [cart, isReady]);

  useEffect(() => {
    function handleStorageChange(event) {
      if (event.key === null || event.key === 'upv_booking_v1') setCart(readCart());
    }
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
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
        prev.extras.some((line) => buildExtraId(line) === buildExtraId(extra))
          ? prev
          : { ...prev, extras: [...prev.extras, extra] },
      ),
    [],
  );
  const removeExtra = useCallback(
    (id) => setCart((prev) => ({ ...prev, extras: prev.extras.filter((line) => buildExtraId(line) !== id) })),
    [],
  );
  const updateExtra = useCallback(
    (id, patch) =>
      setCart((prev) => ({
        ...prev,
        extras: prev.extras.map((line) => (buildExtraId(line) === id ? { ...line, ...patch } : line)),
      })),
    [],
  );
  const clear = useCallback(() => setCart(EMPTY), []);

  const value = useMemo(
    () => ({
      cart,
      ready: isReady,
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
      isReady,
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
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used inside CartProvider');
  return context;
}
