'use client';

import { useEffect, useRef, useState } from 'react';

/**
 * LoadingScreen - branded cream splash (logo + spinner) shown on EVERY page.
 * Navigation on this site is full document loads (plain <a href>), so each
 * click means a fresh page. Two moments would otherwise show a blank/half-drawn
 * screen, and this covers both:
 *   1. Arrival  - the overlay is in the static HTML, so it paints before the
 *      page content and fades out once the page has loaded.
 *   2. Leaving  - a click on a same-origin link re-shows the overlay right
 *      away, so the wait between click and the next page painting is covered
 *      instead of the old page just sitting there.
 * The element stays mounted and is toggled via `--out` (it never unmounts), so
 * it can be shown again on the way out.
 */
export default function LoadingScreen() {
  const [out, setOut] = useState(false);
  const safety = useRef(null);
  const elRef = useRef(null);

  // Fade the arrival splash once the page has loaded.
  useEffect(() => {
    const hide = () => setOut(true);
    let cap;
    if (document.readyState === 'complete') {
      cap = setTimeout(hide, 350);
    } else {
      window.addEventListener('load', hide);
      cap = setTimeout(hide, 1400); // safety cap - don't wait on slow images
    }
    return () => {
      window.removeEventListener('load', hide);
      clearTimeout(cap);
    };
  }, []);

  // Re-show the splash the moment a real navigation starts, so the gap before
  // the next page paints is never blank.
  useEffect(() => {
    const onClick = (e) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const a = e.target.closest && e.target.closest('a[href]');
      if (!a) return;
      if (a.target === '_blank' || a.hasAttribute('download')) return;
      const href = a.getAttribute('href');
      if (!href || href.startsWith('#') || /^(mailto:|tel:|javascript:|https?:\/\/wa\.me)/i.test(href)) return;
      let url;
      try { url = new URL(a.href); } catch { return; }
      if (url.origin !== window.location.origin) return; // external -> new context, let it be
      // Same-page hash jump is not a page change.
      if (url.pathname === window.location.pathname && url.hash) return;
      // Show it NOW, in this same click tick - not via React's async render,
      // and with the fade-in transition disabled so it snaps up instantly.
      // Otherwise there is a frame or two where the old page still shows with
      // no overlay, which is exactly the gap that reads as "slow". React state
      // is synced right after so its model matches the DOM we just touched.
      const el = elRef.current;
      if (el) {
        el.style.transition = 'none';
        el.classList.remove('loadscreen--out');
      }
      setOut(false);
      // Safety net: if the click turns out NOT to navigate (a link some other
      // handler cancels later, or a failed/blocked request), the real page
      // never unloads - so hide the overlay again instead of leaving it stuck.
      clearTimeout(safety.current);
      safety.current = setTimeout(() => setOut(true), 3000);
    };
    document.addEventListener('click', onClick, true);
    // Coming back via the browser's back/forward cache restores this page with
    // the overlay still up - hide it so the restored page isn't stuck behind it.
    const onShow = () => setOut(true);
    window.addEventListener('pageshow', onShow);
    return () => {
      document.removeEventListener('click', onClick, true);
      window.removeEventListener('pageshow', onShow);
      clearTimeout(safety.current);
    };
  }, []);

  return (
    <div ref={elRef} className={`loadscreen${out ? ' loadscreen--out' : ''}`} aria-hidden="true">
      <img
        className="loadscreen__logo"
        src="/assets/images/logo.webp"
        alt=""
        width="1005"
        height="324"
      />
      <span className="loadscreen__spin" />
    </div>
  );
}
