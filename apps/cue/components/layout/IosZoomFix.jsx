'use client';

import { useEffect } from 'react';

export default function IosZoomFix() {
  useEffect(() => {
    try {
      const userAgent = navigator.userAgent;
      const ios = /iP(hone|od|ad)/.test(userAgent) || (/Mac/.test(userAgent) && navigator.maxTouchPoints > 1);
      if (!ios) return;
      const m = document.querySelector('meta[name=viewport]');
      if (!m || m.content.includes('maximum-scale')) return;
      m.content = `${m.content},maximum-scale=1`;
    } catch (e) {
    }
  }, []);
  return null;
}
