'use client';

import { useEffect } from 'react';

// Shared scroll-lock hook (global UX pass, Sep 2026 - Wayan: every popup/modal must
// lock the background AND close on an outside click). Adds body.hs-locked while
// `active` is true - CSS just sets overflow:hidden (see style.css), no
// position:fixed/reposition (that's what makes the page "jump"). Used by every
// modal/sheet/panel that renders its own backdrop instead of going through
// <Modal>/<Overlay> (which already call this internally).
export default function useBodyLock(active) {
  useEffect(() => {
    if (!active) return;
    document.body.classList.add('hs-locked');
    return () => document.body.classList.remove('hs-locked');
  }, [active]);
}
