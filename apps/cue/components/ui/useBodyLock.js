'use client';

import { useEffect } from 'react';

// Scroll lock while active: hs-locked on both html and body (iOS scrolls html); overflow only, no position:fixed jump.
export default function useBodyLock(active) {
  useEffect(() => {
    if (!active) return;
    document.documentElement.classList.add('hs-locked');
    document.body.classList.add('hs-locked');
    return () => {
      document.documentElement.classList.remove('hs-locked');
      document.body.classList.remove('hs-locked');
    };
  }, [active]);
}
