'use client';

import { useEffect } from 'react';

// Registers the service worker and marks app mode for the browsers that cannot
// report it in CSS. Renders nothing.
export default function PwaRegister() {
  useEffect(() => {
    // iOS before 16.4 has no `display-mode` media query, only this flag. Without
    // the attribute those phones would install the app and still get the browser
    // layout - the bottom bar would never appear and the navbar would never hand
    // its icons over. Newer iOS and Android match the media query as well, so the
    // attribute is simply redundant there rather than a second source of truth.
    const app = window.navigator.standalone === true
      || window.matchMedia('(display-mode: standalone)').matches;
    if (app) document.documentElement.dataset.standalone = '1';

    // Registered after load, not during it: the worker is worth nothing on a
    // first visit (its caches are empty) and fetching it early competes with the
    // page's own requests.
    if (!('serviceWorker' in navigator)) return undefined;
    function go() { navigator.serviceWorker.register('/sw.js').catch(() => {}); }
    if (document.readyState === 'complete') go();
    else window.addEventListener('load', go, { once: true });
    return () => window.removeEventListener('load', go);
  }, []);

  return null;
}
