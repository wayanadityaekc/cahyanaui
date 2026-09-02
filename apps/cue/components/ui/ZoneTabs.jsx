'use client';

import { useEffect, useState } from 'react';

export default function ZoneTabs({ zones = [] }) {
  const [active, setActive] = useState(null);

  useEffect(() => {
    if (!zones.length) return;
    const probe = () => {
      const y = window.scrollY + 140;
      let cur = null;
      for (const z of zones) {
        const el = document.getElementById(z.id);
        if (!el) continue;
        const top = el.getBoundingClientRect().top + window.scrollY;
        if (top <= y) cur = z.id;
      }
      setActive(cur);
    };
    probe();
    window.addEventListener('scroll', probe, { passive: true });
    window.addEventListener('resize', probe);
    return () => {
      window.removeEventListener('scroll', probe);
      window.removeEventListener('resize', probe);
    };
  }, [zones]);

  return (
    <div className="zone-filter" aria-label="Jump to category">
      {zones.map((z) => (
        <a key={z.id} href={`#${z.id}`} className={`zone-chip${active === z.id ? ' is-active' : ''}`}>
          {z.label}
        </a>
      ))}
    </div>
  );
}
