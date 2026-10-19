'use client';

import { useEffect } from 'react';

export default function PwaRegister() {
  useEffect(() => {
    const app = window.navigator.standalone === true || window.matchMedia('(display-mode: standalone)').matches;
    if (app) document.documentElement.dataset.standalone = '1';

    if (!('serviceWorker' in navigator)) return undefined;
    function register() {
      navigator.serviceWorker.register('/sw.js').catch(() => {});
    }
    if (document.readyState === 'complete') register();
    else window.addEventListener('load', register, { once: true });
    return () => window.removeEventListener('load', register);
  }, []);

  return null;
}
