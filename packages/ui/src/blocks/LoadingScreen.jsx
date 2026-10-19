'use client';

import { useEffect, useRef, useState } from 'react';
import { cn } from '../lib/cn.js';

const BASE =
  'fixed inset-0 z-[9999] flex flex-col items-center justify-center gap-[1.2rem] bg-cream ' +
  '[transition:opacity_var(--splash-fade)_var(--ease),visibility_var(--splash-fade)_var(--ease)]';
const OUT = 'opacity-0 invisible pointer-events-none';

export default function LoadingScreen({
  logo,
  alt = '',
  width = 1005,
  height = 324,
  routeKey,
  minVisible = 260,
  fadeMs = 450,
}) {
  const [out, setOut] = useState(false);
  const elRef = useRef(null);
  const safety = useRef(null);
  const shownAt = useRef(0);
  const firstRoute = useRef(true);

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
    if (routeKey === undefined) return undefined;
    if (firstRoute.current) {
      firstRoute.current = false;
      return undefined;
    }
    const waited = Date.now() - shownAt.current;
    const hideTimer = setTimeout(() => setOut(true), Math.max(0, minVisible - waited));
    return () => clearTimeout(hideTimer);
  }, [routeKey, minVisible]);

  useEffect(() => {
    function onClick(event) {
      if (
        event.defaultPrevented ||
        event.button !== 0 ||
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey
      )
        return;
      const anchor = event.target.closest && event.target.closest('a[href]');
      if (!anchor) return;
      if (anchor.target === '_blank' || anchor.hasAttribute('download')) return;
      const href = anchor.getAttribute('href');
      if (!href || href.startsWith('#') || /^(mailto:|tel:|javascript:)/i.test(href)) return;
      let url;
      try {
        url = new URL(anchor.href);
      } catch {
        return;
      }
      if (url.origin !== window.location.origin) return;
      if (url.pathname === window.location.pathname && url.hash) return;
      if (url.pathname === window.location.pathname) return;

      const element = elRef.current;
      if (element) {
        element.style.transition = 'none';
        element.classList.remove('opacity-0', 'invisible', 'pointer-events-none');
        void element.offsetHeight;
        element.style.removeProperty('transition');
      }
      shownAt.current = Date.now();
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

  return (
    <div
      ref={elRef}
      className={cn(BASE, out && OUT)}
      style={{ '--splash-fade': `${fadeMs}ms` }}
      aria-hidden="true"
      data-loadscreen={out ? 'out' : 'in'}
    >
      <img className="w-[min(200px,45vw)] h-auto" src={logo} alt={alt} width={width} height={height} />
      <span className="w-[26px] h-[26px] rounded-[50%] [border:3px_solid_var(--line)] [border-top-color:var(--color-gold)] [animation:cahyana-spin_0.7s_linear_infinite]" />
    </div>
  );
}
