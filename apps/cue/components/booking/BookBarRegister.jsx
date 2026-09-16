'use client';

import { useEffect } from 'react';
import { useBookBarItem } from '@/state/BookBarProvider';

// Renders nothing - registers this page's bookable item into BookBarProvider
// so the globally-mounted <BookBar /> (app/layout.jsx) can show price+Book now
// for it, and clears it again on unmount (leaving a bookable page falls back
// to the generic BookBar content).
export default function BookBarRegister({ item }) {
  const { setItem } = useBookBarItem();

  useEffect(() => {
    setItem(item || null);
    return () => setItem(null);
  }, [item, setItem]);

  return null;
}
