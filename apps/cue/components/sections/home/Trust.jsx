'use client';

import { useEffect, useState } from 'react';
import { API_BASE } from '@/lib/constants';

export default function Trust() {
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
      <p className="trust__stat" hidden={!count}>
        <strong>{count}</strong> travelers have joined Cahyana
      </p>
      <div className="trust__group">
        <p className="trust__label">Featured On</p>
        <div className="trust__logos">
          <img src="/assets/images/viator.webp" alt="Viator" width="245" height="256" loading="lazy" />
          <img src="/assets/images/tripadvisor.webp" alt="Tripadvisor" width="280" height="176" loading="lazy" />
        </div>
      </div>
    </section>
  );
}
