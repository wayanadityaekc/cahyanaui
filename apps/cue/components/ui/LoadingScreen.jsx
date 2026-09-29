'use client';

import { useEffect, useRef, useState } from 'react';
import clsx from 'clsx';

// Branded splash on every page: covers arrival and re-shows on link clicks; always mounted, toggled by state.
export default function LoadingScreen() {
  const [out, setOut] = useState(false);
  const safety = useRef(null);
  const elRef = useRef(null);

  // Fade the arrival splash once the page has loaded.
  useEffect(() => {
    function hide() { return setOut(true); }
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

  // Re-show the splash as soon as a same-origin navigation starts.
  useEffect(() => {
    function onClick(e) {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const a = e.target.closest && e.target.closest('a[href]');
      if (!a) return;
      if (a.target === '_blank' || a.hasAttribute('download')) return;
      const href = a.getAttribute('href');
      if (!href || href.startsWith('#') || /^(mailto:|tel:|javascript:|https?:\/\/wa\.me)/i.test(href)) return;
      let url;
      try { url = new URL(a.href); } catch (e) { return; }
      if (url.origin !== window.location.origin) return; // external -> new context, let it be
      // Same-page hash jump is not a page change.
      if (url.pathname === window.location.pathname && url.hash) return;
      // Show it synchronously in the click tick with transitions off, so no frame shows the old page uncovered.
      const el = elRef.current;
      if (el) {
        el.style.transition = 'none';
        // Drop the hidden-state utilities directly (snap); setOut(false) then syncs React's className.
        el.classList.remove('opacity-0', 'invisible', 'pointer-events-none');
      }
      setOut(false);
      // Safety net: hide the overlay again after 3s if the click never navigated.
      clearTimeout(safety.current);
      safety.current = setTimeout(() => setOut(true), 3000);
    }
    document.addEventListener('click', onClick, true);
    // Back/forward cache restores the page with the overlay up; hide it on pageshow.
    function onShow() { return setOut(true); }
    window.addEventListener('pageshow', onShow);
    return () => {
      document.removeEventListener('click', onClick, true);
      window.removeEventListener('pageshow', onShow);
      clearTimeout(safety.current);
    };
  }, []);

  // Hidden state = opacity/visibility/pointer-events utilities; the spin keyframe lives in style.css.
  const BASE = 'fixed inset-0 z-[9999] flex flex-col items-center justify-center gap-[1.2rem] bg-cream [transition:opacity_0.45s_var(--ease),visibility_0.45s_var(--ease)]';
  const OUT = 'opacity-0 invisible pointer-events-none';
  return (
    <div ref={elRef} className={clsx(BASE, out && OUT)} aria-hidden="true">
      <img
        className="w-[min(200px,45vw)] h-auto"
        src="/assets/images/logo.webp"
        alt=""
        width="1005"
        height="324"
      />
      <span className="w-[26px] h-[26px] rounded-[50%] border-[3px] border-solid border-line border-t-gold animate-[spin_0.7s_linear_infinite]" />
    </div>
  );
}
