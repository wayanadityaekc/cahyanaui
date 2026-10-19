'use client';

import { useEffect, useRef, useState } from 'react';
import clsx from 'clsx';

const LOADING_CAP_FAST_MS = 350;
const LOADING_CAP_SLOW_MS = 1400;
const LOADING_SAFETY_TIMEOUT_MS = 3000;

export default function LoadingScreen() {
  const [isFadingOut, setIsFadingOut] = useState(false);
  const safety = useRef(null);
  const elRef = useRef(null);

  useEffect(() => {
    function hide() {
      return setIsFadingOut(true);
    }
    let cap;
    if (document.readyState === 'complete') {
      cap = setTimeout(hide, LOADING_CAP_FAST_MS);
    } else {
      window.addEventListener('load', hide);
      cap = setTimeout(hide, LOADING_CAP_SLOW_MS);
    }
    return () => {
      window.removeEventListener('load', hide);
      clearTimeout(cap);
    };
  }, []);

  useEffect(() => {
    function handleLinkClick(event) {
      const isModifiedOrNonPrimaryClick =
        event.defaultPrevented ||
        event.button !== 0 ||
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey;
      if (isModifiedOrNonPrimaryClick) return;
      const anchor = event.target.closest && event.target.closest('a[href]');
      if (!anchor) return;
      if (anchor.target === '_blank' || anchor.hasAttribute('download')) return;
      const href = anchor.getAttribute('href');
      const isNonNavigationLink =
        !href || href.startsWith('#') || /^(mailto:|tel:|javascript:|https?:\/\/wa\.me)/i.test(href);
      if (isNonNavigationLink) return;
      let url;
      try {
        url = new URL(anchor.href);
      } catch (e) {
        return;
      }
      if (url.origin !== window.location.origin) return;
      if (url.pathname === window.location.pathname && url.hash) return;
      const overlay = elRef.current;
      if (overlay) {
        overlay.style.transition = 'none';
        overlay.classList.remove('opacity-0', 'invisible', 'pointer-events-none');
      }
      setIsFadingOut(false);
      clearTimeout(safety.current);
      safety.current = setTimeout(() => setIsFadingOut(true), LOADING_SAFETY_TIMEOUT_MS);
    }
    document.addEventListener('click', handleLinkClick, true);
    function handleShow() {
      return setIsFadingOut(true);
    }
    window.addEventListener('pageshow', handleShow);
    return () => {
      document.removeEventListener('click', handleLinkClick, true);
      window.removeEventListener('pageshow', handleShow);
      clearTimeout(safety.current);
    };
  }, []);

  const BASE =
    'fixed inset-0 z-[9999] flex flex-col items-center justify-center gap-[1.2rem] bg-cream [transition:opacity_0.45s_var(--ease),visibility_0.45s_var(--ease)]';
  const OUT = 'opacity-0 invisible pointer-events-none';
  return (
    <div ref={elRef} className={clsx(BASE, isFadingOut && OUT)} aria-hidden="true">
      <img className="w-[min(200px,45vw)] h-auto" src="/assets/images/logo.webp" alt="" width="1005" height="324" />
      <span className="w-[26px] h-[26px] rounded-[50%] border-[3px] border-solid border-line border-t-gold animate-[spin_0.7s_linear_infinite]" />
    </div>
  );
}
