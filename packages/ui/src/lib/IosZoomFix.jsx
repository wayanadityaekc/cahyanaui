'use client';

import { useEffect } from 'react';

// CUE's fix: adds maximum-scale=1 on iOS only (stops focus zoom on 12.8px fields; Android would lose pinch-zoom).
export default function IosZoomFix() {
  useEffect(() => {
    try {
      const { userAgent } = navigator;
      // iPadOS reports a Mac user agent, so it is caught by the touch-point count instead.
      const ios = /iP(hone|od|ad)/.test(userAgent) || (/Mac/.test(userAgent) && navigator.maxTouchPoints > 1);
      if (!ios) return;
      const viewport = document.querySelector('meta[name=viewport]');
      if (!viewport || viewport.content.includes('maximum-scale')) return;
      viewport.content = `${viewport.content},maximum-scale=1`;
    } catch (e) {
      // A zoom nicety is never worth throwing over.
    }
  }, []);
  return null;
}
