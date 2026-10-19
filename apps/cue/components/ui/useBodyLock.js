'use client';

import { useEffect } from 'react';

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
