'use client';

import { useEffect } from 'react';

// Shared scroll-lock hook (global UX pass, Sep 2026 - Wayan: every popup/modal must
// lock the background AND close on an outside click). Adds hs-locked while `active`
// is true - CSS just sets overflow:hidden (see style.css), no position:fixed/
// reposition (that's what makes the page "jump"). Used by every modal/sheet/panel
// that renders its own backdrop instead of going through <Modal>/<Overlay> (which
// call this hook internally too - nothing duplicates the classList logic anymore).
//
// Fix (Sep 2026, Wayan: Add Program popup didn't lock the background on iPhone) -
// locks BOTH <html> AND <body>, not just <body>. Chrome/desktop treat <body> as the
// page's scroll root, so `body.hs-locked{overflow:hidden}` alone was enough there -
// but iOS Safari very often scrolls via <html> (documentElement) instead, so locking
// only body left the page scrollable under every popup on iPhone. Locking both
// covers whichever element the browser actually uses, with zero risk of the
// position:fixed "jump" (still no repositioning at all).
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
