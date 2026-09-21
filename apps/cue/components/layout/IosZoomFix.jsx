'use client';

import { useEffect } from 'react';

/**
 * Stops iOS from zooming the page when a form field takes focus, WITHOUT making
 * any field bigger (Wayan, Sep 2026: "benerin zoom tapi jangan gedein font bisa?").
 *
 * There is no element-level way to have both: iOS zooms when the FOCUSED control
 * computes under 16px, and ours are 12.8px (--fs-field) on purpose. The threshold
 * is the control's own font-size, so the only lever left is the viewport, and
 * `maximum-scale=1` is what suppresses the automatic focus zoom.
 *
 * WHY iOS ONLY, and not just put it in the static meta:
 * Android Chrome OBEYS maximum-scale, so shipping it in the HTML would take
 * pinch-zoom away from every Android guest - on a site full of photos, and with the
 * override buried in Chrome's accessibility settings. iOS Safari has deliberately
 * ignored zoom restrictions for a USER pinch since iOS 10, so an iPhone keeps pinch
 * either way. Applying it only on iOS costs nobody anything.
 * `user-scalable=no` is never used: that one really does take zoom away.
 *
 * WHY AN EFFECT AND NOT AN INLINE <head> SCRIPT:
 * tried that first, and the harness caught it - the viewport meta belongs to Next's
 * metadata, so mutating it before hydration either got reverted or left TWO viewport
 * tags in the head. After mount Next has settled and the edit sticks. Timing is fine:
 * the clamp only matters when a guest focuses a field, which is long after hydration.
 *
 * NOT VERIFIABLE IN CI: headless Chromium does not implement Safari's focus zoom, and
 * there is no iOS device in the sandbox. verify-zoom.mjs proves WHO gets the clamp
 * (iPhone + iPadOS yes, Android/desktop no, exactly one meta tag, width=device-width
 * kept, never user-scalable=no) - whether the zoom itself stops has to be checked on
 * a real iPhone. If it turns out iOS ignores it, the only robust fix left is 16px
 * fields, which is the thing Wayan asked to avoid.
 */
export default function IosZoomFix() {
  useEffect(() => {
    try {
      const ua = navigator.userAgent;
      // iPadOS reports a Mac UA, so it is caught by the touch-point count instead.
      const ios = /iP(hone|od|ad)/.test(ua) || (/Mac/.test(ua) && navigator.maxTouchPoints > 1);
      if (!ios) return;
      const m = document.querySelector('meta[name=viewport]');
      if (!m || m.content.includes('maximum-scale')) return;
      m.content = `${m.content},maximum-scale=1`;
    } catch {
      /* a zoom nicety is never worth throwing over */
    }
  }, []);
  return null;
}
