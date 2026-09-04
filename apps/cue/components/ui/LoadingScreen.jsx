'use client';

import { useEffect, useState } from 'react';

/**
 * LoadingScreen - branded splash shown while the first page of a session
 * loads, then fades out. An inline <head> script (see app/layout.jsx) stamps
 * `splash-seen` on <html> for repeat page loads so CSS hides it instantly with
 * no flash; this component only drives the fade-out on the first load.
 */
export default function LoadingScreen() {
  const [out, setOut] = useState(false);
  const [gone, setGone] = useState(false);

  useEffect(() => {
    const hide = () => setOut(true);
    let fallback;
    if (document.readyState === 'complete') {
      fallback = setTimeout(hide, 350);
    } else {
      window.addEventListener('load', hide);
      fallback = setTimeout(hide, 2500); // safety cap
    }
    return () => {
      window.removeEventListener('load', hide);
      clearTimeout(fallback);
    };
  }, []);

  useEffect(() => {
    if (!out) return undefined;
    const t = setTimeout(() => setGone(true), 500); // unmount after fade
    return () => clearTimeout(t);
  }, [out]);

  if (gone) return null;

  return (
    <div className={`loadscreen${out ? ' loadscreen--out' : ''}`} aria-hidden="true">
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
