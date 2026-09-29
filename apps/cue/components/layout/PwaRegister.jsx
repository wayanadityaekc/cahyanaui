'use client';

import { useEffect } from 'react';

// Registers the service worker and marks app mode for browsers that can't report it in CSS. Renders nothing.
export default function PwaRegister() {
  useEffect(() => {
    // data-standalone on <html> for iOS < 16.4, which lacks the display-mode media query (the standalone: variant reads both).
    const app = window.navigator.standalone === true
      || window.matchMedia('(display-mode: standalone)').matches;
    if (app) document.documentElement.dataset.standalone = '1';

    // Register the worker after load so it doesn't compete with the page's own first requests.
    if (!('serviceWorker' in navigator)) return undefined;
    function register() { navigator.serviceWorker.register('/sw.js').catch(() => {}); }
    if (document.readyState === 'complete') register();
    else window.addEventListener('load', register, { once: true });
    return () => window.removeEventListener('load', register);
  }, []);

  return null;
}
