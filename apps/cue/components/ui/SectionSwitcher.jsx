'use client';

import { useEffect, useState } from 'react';

function Chevron({ dir }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {dir === 'left' ? <path d="M15 6l-6 6 6 6" /> : <path d="M9 6l6 6-6 6" />}
    </svg>
  );
}

// Floating category switcher (bottom-center): shows the section currently in
// view and steps to the previous / next section with the arrows. Replaces the
// inline tab strip on the listing pages.
export default function SectionSwitcher({ zones = [] }) {
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    if (!zones.length) return;
    const probe = () => {
      const y = window.scrollY + 160;
      let cur = 0;
      zones.forEach((z, i) => {
        const el = document.getElementById(z.id);
        if (!el) return;
        if (el.getBoundingClientRect().top + window.scrollY <= y) cur = i;
      });
      setIdx(cur);
    };
    probe();
    window.addEventListener('scroll', probe, { passive: true });
    window.addEventListener('resize', probe);
    return () => {
      window.removeEventListener('scroll', probe);
      window.removeEventListener('resize', probe);
    };
  }, [zones]);

  if (!zones.length) return null;

  const go = (delta) => {
    const n = Math.min(zones.length - 1, Math.max(0, idx + delta));
    const el = document.getElementById(zones[n].id);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div className="ssw" role="navigation" aria-label="Jump to category">
      <button type="button" className="ssw__arrow" onClick={() => go(-1)} disabled={idx === 0} aria-label="Previous category">
        <Chevron dir="left" />
      </button>
      <span className="ssw__label">{zones[idx].label}</span>
      <button type="button" className="ssw__arrow" onClick={() => go(1)} disabled={idx === zones.length - 1} aria-label="Next category">
        <Chevron dir="right" />
      </button>
    </div>
  );
}
