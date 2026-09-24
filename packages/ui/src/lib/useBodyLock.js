'use client';

import { useEffect } from 'react';

/**
 * Freeze the page behind an open panel.
 *
 * Locks <html> AND <body>. Chrome and desktop browsers scroll the page through
 * <body>, but iOS Safari very often scrolls <html> instead, so locking one
 * leaves the page scrollable behind the panel on an iPhone.
 *
 * Overflow only - no position:fixed. That is what makes a page jump to the top
 * the moment a modal opens.
 *
 * Needs `.hs-locked { overflow: hidden !important }` in the consuming site;
 * tokens.css deliberately does not ship it, because a library should not
 * reach out and restyle the host document's root elements.
 */
export default function useBodyLock(active) {
  useEffect(() => {
    if (!active) return undefined;
    document.documentElement.classList.add('hs-locked');
    document.body.classList.add('hs-locked');
    return () => {
      document.documentElement.classList.remove('hs-locked');
      document.body.classList.remove('hs-locked');
    };
  }, [active]);
}
