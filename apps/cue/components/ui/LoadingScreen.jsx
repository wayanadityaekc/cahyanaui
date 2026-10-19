'use client';

import { useEffect, useRef, useState } from 'react';
import clsx from 'clsx';

export default function LoadingScreen() {
  const [out, setOut] = useState(false);
  const safety = useRef(null);
  const elRef = useRef(null);

  useEffect(() => {
    function hide() {
      return setOut(true);
    }
    let cap;
    if (document.readyState === 'complete') {
      cap = setTimeout(hide, 350);
    } else {
      window.addEventListener('load', hide);
      cap = setTimeout(hide, 1400);
    }
    return () => {
      window.removeEventListener('load', hide);
      clearTimeout(cap);
    };
  }, []);

  useEffect(() => {
    function onClick(e) {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const a = e.target.closest && e.target.closest('a[href]');
      if (!a) return;
      if (a.target === '_blank' || a.hasAttribute('download')) return;
      const href = a.getAttribute('href');
      if (!href || href.startsWith('#') || /^(mailto:|tel:|javascript:|https?:\/\/wa\.me)/i.test(href)) return;
      let url;
      try {
        url = new URL(a.href);
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
      setOut(false);
      clearTimeout(safety.current);
      safety.current = setTimeout(() => setOut(true), 3000);
    }
    document.addEventListener('click', onClick, true);
    function onShow() {
      return setOut(true);
    }
    window.addEventListener('pageshow', onShow);
    return () => {
      document.removeEventListener('click', onClick, true);
      window.removeEventListener('pageshow', onShow);
      clearTimeout(safety.current);
    };
  }, []);

  const BASE =
    'fixed inset-0 z-[9999] flex flex-col items-center justify-center gap-[1.2rem] bg-cream [transition:opacity_0.45s_var(--ease),visibility_0.45s_var(--ease)]';
  const OUT = 'opacity-0 invisible pointer-events-none';
  return (
    <div ref={elRef} className={clsx(BASE, out && OUT)} aria-hidden="true">
      <img className="w-[min(200px,45vw)] h-auto" src="/assets/images/logo.webp" alt="" width="1005" height="324" />
      <span className="w-[26px] h-[26px] rounded-[50%] border-[3px] border-solid border-line border-t-gold animate-[spin_0.7s_linear_infinite]" />
    </div>
  );
}
