'use client';

import { useEffect, useState } from 'react';
import { Tag } from 'lucide-react';
import { PROMO } from '@/content/shared/promo';

// Promo strip under the navbar, on every page (Wayan, Sep 2026 - dibalikin ke
// semua halaman; sebelumnya sempat homepage-only). Teksnya sengaja kecil & tipis:
// ini pengumuman, bukan headline - jangan dibikin setebal nav.
const BAR = 'flex items-center justify-center gap-2 w-full py-[0.5rem] px-5 [border-top:1px_solid_#ececec] bg-cream text-[0.72rem] font-normal leading-[1.3] text-muted no-underline [@media(max-width:560px)]:gap-[0.35rem] [@media(max-width:560px)]:px-[0.9rem]';
const EDIT = 'ml-2 text-gold underline [@media(max-width:560px)]:ml-[0.3rem]';

const TAG_ICON = <Tag className="w-[var(--icon-sm)] h-[var(--icon-sm)] shrink-0 text-gold" strokeWidth={1.7} />;

export default function TripBar({ mode = 'promo' }) {
  // Retracts on the way down, comes back on the way up. The collapse animates
  // grid-template-rows (0fr <-> 1fr) so no height has to be measured, and the
  // header genuinely shrinks - Navbar's ResizeObserver sees it and the sticky
  // tab strips that sit at --header-h follow it up instead of leaving a gap.
  // (Page top padding reads --header-h-max instead, which never shrinks, so
  // nothing jumps under the reader while this is animating.)
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    let last = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      // Ignore jitter, and never hide while still near the top of the page.
      if (Math.abs(y - last) < 6) return;
      setHidden(y > last && y > 80);
      last = y;
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  if (mode !== 'promo') return null;
  if (!PROMO.active || !PROMO.text) return null;

  const asLink = !!PROMO.href;
  const inner = (
    <>
      {TAG_ICON}
      <span>{PROMO.text}</span>
      {PROMO.cta && <span className={EDIT}>{PROMO.cta}</span>}
    </>
  );

  return (
    <div
      className={`grid [transition:grid-template-rows_var(--dur)_var(--ease)] motion-reduce:transition-none ${hidden ? 'grid-rows-[0fr]' : 'grid-rows-[1fr]'}`}
      aria-hidden={hidden || undefined}
    >
      <div className="overflow-hidden">
        {asLink ? (
          <a className={`${BAR} cursor-pointer`} id="tripbar" href={PROMO.href}>{inner}</a>
        ) : (
          <div className={`${BAR} cursor-default`} id="tripbar">{inner}</div>
        )}
      </div>
    </div>
  );
}
