'use client';

import { useEffect } from 'react';

export default function IosZoomFix() {
  useEffect(() => {
    try {
      const { userAgent } = navigator;
      const isIos = /iP(hone|od|ad)/.test(userAgent) || (/Mac/.test(userAgent) && navigator.maxTouchPoints > 1);
      if (!isIos) return;
      const viewport = document.querySelector('meta[name=viewport]');
      if (!viewport || viewport.content.includes('maximum-scale')) return;
      viewport.content = `${viewport.content},maximum-scale=1`;
    } catch (e) {}
  }, []);
  return null;
}
