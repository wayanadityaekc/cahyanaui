'use client';

import { useEffect, useRef, useState } from 'react';
import { cn } from '../lib/cn.js';

/**
 * The branded splash between pages - cream, the logo, a spinner.
 *
 * TWO MODES, because the two sites navigate differently and the splash has to
 * end at the right moment in each:
 *
 *   document mode  (no `routeKey`)  CUE. Navigation is full document loads, so
 *                  the overlay is in the static HTML, paints before the page
 *                  content, and fades once `load` fires. A click re-shows it,
 *                  covering the wait before the next document paints.
 *
 *   router mode    (`routeKey` given, e.g. usePathname()) the villa site. The
 *                  next page is rendered client-side, so nothing fires `load`.
 *                  The splash hides when the route key CHANGES - that is the
 *                  moment the new page exists.
 *
 * WHY `minVisible` EXISTS, and it is not a style preference. A client-side
 * route change here takes 87-91ms on a desktop and 198-236ms on a mid phone
 * (measured). Hiding the splash the instant the route commits would put it on
 * screen for under a tenth of a second on desktop: that reads as a flash, or
 * as the screen glitching, not as a page loading. So it stays up for at least
 * `minVisible` and then fades. On a phone the transition already outlasts that
 * and nothing is added; on a desktop it costs the difference.
 *
 * THAT COST IS THE POINT OF THE FEATURE. A site that routes client-side has
 * nothing to cover. Putting the splash back is a deliberate choice to make
 * every page change feel like the sister site, and it makes navigation slower
 * than it is. `minVisible` is the dial.
 *
 * The element NEVER UNMOUNTS - it is toggled through opacity/visibility - so it
 * can be shown again on the way out. Unmounting it would leave nothing to fade.
 */
const BASE =
  'fixed inset-0 z-[9999] flex flex-col items-center justify-center gap-[1.2rem] bg-cream ' +
  // The transition lives in the CLASS, not in an inline style, and the
  // duration arrives as a custom property. The click handler below has to
  // switch the transition off for one frame; if the real value were inline it
  // would have to put it back by hand, and clearing it instead - which is what
  // this did first - left the splash with NO fade from the second navigation
  // onward. Measured: the overlay went 1 -> 0 in a single frame. CUE gets away
  // with the same code because its document unloads and the element dies.
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

  // Hide it once the arrival is done.
  useEffect(() => {
    const hide = () => setOut(true);
    let cap;
    if (document.readyState === 'complete') {
      cap = setTimeout(hide, 350);
    } else {
      window.addEventListener('load', hide);
      cap = setTimeout(hide, 1400); // safety cap - do not wait on slow images
    }
    return () => {
      window.removeEventListener('load', hide);
      clearTimeout(cap);
    };
  }, []);

  // Router mode: the route has changed, so the next page exists. Hide, but not
  // before it has been on screen long enough to read as a load.
  useEffect(() => {
    if (routeKey === undefined) return undefined;
    if (firstRoute.current) { firstRoute.current = false; return undefined; }
    const waited = Date.now() - shownAt.current;
    const t = setTimeout(() => setOut(true), Math.max(0, minVisible - waited));
    return () => clearTimeout(t);
  }, [routeKey, minVisible]);

  // Re-show the moment a real navigation starts.
  useEffect(() => {
    const onClick = (e) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const a = e.target.closest && e.target.closest('a[href]');
      if (!a) return;
      if (a.target === '_blank' || a.hasAttribute('download')) return;
      const href = a.getAttribute('href');
      if (!href || href.startsWith('#') || /^(mailto:|tel:|javascript:)/i.test(href)) return;
      let url;
      try { url = new URL(a.href); } catch { return; }
      if (url.origin !== window.location.origin) return;   // external - a new context
      // A hash jump on the page you are already on is not a page change.
      if (url.pathname === window.location.pathname && url.hash) return;
      // ...and neither is a link to the page you are already on.
      if (url.pathname === window.location.pathname) return;

      // Show it NOW, in this same click tick - not through React's async
      // render, and with the transition off so it snaps up. Otherwise there is
      // a frame or two where the old page still shows with no overlay, which is
      // exactly the gap that reads as "slow". React state is synced straight
      // after so its model matches the DOM just touched.
      const el = elRef.current;
      if (el) {
        el.style.transition = 'none';
        el.classList.remove('opacity-0', 'invisible', 'pointer-events-none');
        // Force a reflow so the "transition: none" frame is committed before
        // the class's transition comes back; without it the browser coalesces
        // both changes and animates the snap it was told not to.
        void el.offsetHeight;
        el.style.removeProperty('transition');
      }
      shownAt.current = Date.now();
      setOut(false);

      // If the click turns out NOT to navigate - a link another handler
      // cancels, a blocked request - nothing ever unloads, so hide it again
      // rather than leaving the guest staring at a splash.
      clearTimeout(safety.current);
      safety.current = setTimeout(() => setOut(true), 3000);
    };
    document.addEventListener('click', onClick, true);
    // Back/forward cache restores the page with the overlay still up.
    const onShow = () => setOut(true);
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
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img className="w-[min(200px,45vw)] h-auto" src={logo} alt={alt} width={width} height={height} />
      <span className="w-[26px] h-[26px] rounded-[50%] [border:3px_solid_var(--line)] [border-top-color:var(--color-gold)] [animation:cahyana-spin_0.7s_linear_infinite]" />
    </div>
  );
}
