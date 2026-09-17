'use client';

import { useEffect, useState } from 'react';
import clsx from 'clsx';
import { API_BASE } from '@/lib/constants';

// Tailwind-native (migrasi): .trust* -> utilities 1:1 dari style.css.
// - Divider emas otomatis dimatiin lewat before:content-none (dulu .trust::before).
// - Padding vertikal = --section-gap (2.25rem=py-9) dari grup padding global lama.
// - bg cream cuma di homepage (.home .trust) -> jadi prop `cream`, bukan di-bake.
// - Margin homepage tetep di-drive parent .home>section (tag-based, masih jalan).
const CLS = {
  base:
    "max-w-[1100px] mx-auto mt-0 mb-6 py-9 px-[var(--container-x)] text-center flex flex-wrap items-center justify-center " +
    'gap-y-8 gap-x-[4.5rem] before:content-none',
  stat: 'basis-full grow-0 shrink-0 m-0 text-[1rem] text-green',
  statStrong: 'text-gold text-h2 font-semibold',
  group: 'flex-[0_1_auto]',
  label: 'mb-6 text-label tracking-[0.14em] uppercase text-muted',
  logos: 'flex flex-wrap items-center justify-center gap-y-6 gap-x-[2.75rem] max-w-[900px] mx-auto',
  logoImg: 'h-[30px] w-auto transition-[translate] duration-200 ease-[var(--ease-out)] hover:-translate-y-[2px]',
  socials: 'flex items-center justify-center gap-6',
  socialImg: 'h-[30px] w-auto transition-[transform] duration-200 ease-[var(--ease-out)]',
  socialLink: '[&:hover>img]:-translate-y-[2px]',
};

export default function Trust({ showStat = true, showSocials = false, cream = false }) {
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
    <section className={clsx(CLS.base, cream && 'bg-cream')}>
      {showStat && (
        <p className={CLS.stat} hidden={!count}>
          <strong className={CLS.statStrong}>{count}</strong> travelers have joined Cahyana
        </p>
      )}
      <div className={CLS.group}>
        <p className={CLS.label}>Featured On</p>
        <div className={CLS.logos}>
          <img className={CLS.logoImg} src="/assets/images/viator.webp" alt="Viator" width="245" height="256" loading="lazy" />
          <img className={CLS.logoImg} src="/assets/images/tripadvisor.webp" alt="Tripadvisor" width="280" height="176" loading="lazy" />
        </div>
      </div>
      {showSocials && (
        <div className={CLS.group}>
          <p className={CLS.label}>Follow Us</p>
          <div className={CLS.socials}>
            <a className={CLS.socialLink} href="#" aria-label="Instagram"><img className={CLS.socialImg} src="/assets/images/instagram-transparent.webp" alt="Instagram" width="256" height="256" loading="lazy" /></a>
            <a className={CLS.socialLink} href="#" aria-label="WhatsApp"><img className={CLS.socialImg} src="/assets/images/whatsapp.webp" alt="WhatsApp" width="256" height="256" loading="lazy" /></a>
            <a className={CLS.socialLink} href="#" aria-label="Facebook"><img className={CLS.socialImg} src="/assets/images/facebook.webp" alt="Facebook" width="256" height="256" loading="lazy" /></a>
          </div>
        </div>
      )}
    </section>
  );
}
