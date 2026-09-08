'use client';

import { useEffect, useState } from 'react';

// Branded cream splash (logo + spinner) shown on arrival, fading out once
// the page has loaded - matches CUE's sister-brand LoadingScreen look
// exactly (same layout/CSS, ported token-for-token). CUE's version also
// re-shows itself on link clicks, because CUE still navigates via full
// document reloads there. This site routes client-side with next/link,
// which (confirmed by testing) repaints the next page before any effect
// here could even react to the route change, so there's no real gap left
// to cover on in-app navigation - only the true arrival case applies.
export default function LoadingScreen() {
  const [out, setOut] = useState(false);

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

  return (
    <div className={`loadscreen${out ? ' loadscreen--out' : ''}`} aria-hidden="true">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img className="loadscreen__logo" src="/images/logo.webp" alt="" width="1005" height="324" />
      <span className="loadscreen__spin" />
    </div>
  );
}
