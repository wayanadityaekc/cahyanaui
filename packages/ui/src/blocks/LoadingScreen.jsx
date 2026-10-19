'use client';

import { useEffect, useRef, useState } from 'react';
import { cn } from '../lib/cn.js';

const LOGO_WIDTH_PX = 1005;
const LOGO_HEIGHT_PX = 324;
const MIN_VISIBLE_MS = 260;
const FADE_DURATION_MS = 450;
const FAST_HIDE_DELAY_MS = 350;
const HIDE_DELAY_MS = 1400;
const SAFETY_FADE_DELAY_MS = 3000;

const BASE =
  'fixed inset-0 z-[9999] flex flex-col items-center justify-center gap-[1.2rem] bg-cream ' +
  '[transition:opacity_var(--splash-fade)_var(--ease),visibility_var(--splash-fade)_var(--ease)]';
const OUT = 'opacity-0 invisible pointer-events-none';

export default function LoadingScreen({
  logo,
  alt = '',
  width = LOGO_WIDTH_PX,
  height = LOGO_HEIGHT_PX,
  routeKey,
  minVisible = MIN_VISIBLE_MS,
  fadeMs = FADE_DURATION_MS,
}) {
  const [isFadingOut, setIsFadingOut] = useState(false);
  const elRef = useRef(null);
  const safety = useRef(null);
  const shownAt = useRef(0);
  const firstRoute = useRef(true);

  useEffect(() => {
    function hide() {
      return setIsFadingOut(true);
    }
    let cap;
    if (document.readyState === 'complete') {
      cap = setTimeout(hide, FAST_HIDE_DELAY_MS);
    } else {
      window.addEventListener('load', hide);
      cap = setTimeout(hide, HIDE_DELAY_MS);
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
    const hideTimer = setTimeout(() => setIsFadingOut(true), Math.max(0, minVisible - waited));
    return () => clearTimeout(hideTimer);
  }, [routeKey, minVisible]);

  useEffect(() => {
    function handleLinkClick(event) {
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
      setIsFadingOut(false);

      clearTimeout(safety.current);
      safety.current = setTimeout(() => setIsFadingOut(true), SAFETY_FADE_DELAY_MS);
    }
    document.addEventListener('click', handleLinkClick, true);
    function handlePageShow() {
      return setIsFadingOut(true);
    }
    window.addEventListener('pageshow', handlePageShow);
    return () => {
      document.removeEventListener('click', handleLinkClick, true);
      window.removeEventListener('pageshow', handlePageShow);
      clearTimeout(safety.current);
    };
  }, []);

  return (
    <div
      ref={elRef}
      className={cn(BASE, isFadingOut && OUT)}
      style={{ '--splash-fade': `${fadeMs}ms` }}
      aria-hidden="true"
      data-loadscreen={isFadingOut ? 'out' : 'in'}
    >
      <img className="w-[min(200px,45vw)] h-auto" src={logo} alt={alt} width={width} height={height} />
      <span className="w-[26px] h-[26px] rounded-[50%] [border:3px_solid_var(--line)] [border-top-color:var(--color-gold)] [animation:cahyana-spin_0.7s_linear_infinite]" />
    </div>
  );
}
