'use client';

import { useEffect } from 'react';

export default function IosZoomFix() {
  useEffect(() => {
    try {
      const userAgent = navigator.userAgent;
      const isIos = /iP(hone|od|ad)/.test(userAgent) || (/Mac/.test(userAgent) && navigator.maxTouchPoints > 1);
      if (!isIos) return;
      const viewportMeta = document.querySelector('meta[name=viewport]');
      if (!viewportMeta || viewportMeta.content.includes('maximum-scale')) return;
      viewportMeta.content = `${viewportMeta.content},maximum-scale=1`;
    } catch (e) {}
  }, []);
  return null;
}
