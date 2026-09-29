'use client';

import { useEffect } from 'react';

// Adds maximum-scale=1 on iOS only (stops focus zoom; Android would lose pinch); in an effect, not head script.
export default function IosZoomFix() {
  useEffect(() => {
    try {
      const userAgent = navigator.userAgent;
      // iPadOS reports a Mac UA, so it is caught by the touch-point count instead.
      const ios = /iP(hone|od|ad)/.test(userAgent) || (/Mac/.test(userAgent) && navigator.maxTouchPoints > 1);
      if (!ios) return;
      const m = document.querySelector('meta[name=viewport]');
      if (!m || m.content.includes('maximum-scale')) return;
      m.content = `${m.content},maximum-scale=1`;
    } catch (e) {
      /* a zoom nicety is never worth throwing over */
    }
  }, []);
  return null;
}
