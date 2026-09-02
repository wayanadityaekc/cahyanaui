'use client';

import { useEffect, useState } from 'react';
import { API_BASE } from '@/lib/constants';

export default function Trust({ showStat = true, showSocials = false }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let cancelled = false;
    fetch(`${API_BASE}/accounts/count`)
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        if (!cancelled && d && typeof d.count === 'number') setCount(d.count);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <section className="trust">
      {showStat && (
        <p className="trust__stat" hidden={!count}>
          <strong>{count}</strong> travelers have joined Cahyana
        </p>
      )}
      <div className="trust__group">
        <p className="trust__label">Featured On</p>
        <div className="trust__logos">
          <img src="/assets/images/viator.webp" alt="Viator" width="245" height="256" loading="lazy" />
          <img src="/assets/images/tripadvisor.webp" alt="Tripadvisor" width="280" height="176" loading="lazy" />
        </div>
      </div>
      {showSocials && (
        <div className="trust__group">
          <p className="trust__label">Follow Us</p>
          <div className="trust__socials">
            <a href="#" aria-label="Instagram"><img src="/assets/images/instagram-transparent.webp" alt="Instagram" width="256" height="256" loading="lazy" /></a>
            <a href="#" aria-label="WhatsApp"><img src="/assets/images/whatsapp.webp" alt="WhatsApp" width="256" height="256" loading="lazy" /></a>
            <a href="#" aria-label="Facebook"><img src="/assets/images/facebook.webp" alt="Facebook" width="256" height="256" loading="lazy" /></a>
          </div>
        </div>
      )}
    </section>
  );
}
