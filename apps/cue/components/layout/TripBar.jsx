'use client';

import { useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';
import { Tag, ShieldCheck, CalendarDays, Info, Car } from 'lucide-react';
import { promoFor } from '@/content/shared/promo';

// Promo strip under the navbar, on every page (Wayan, Sep 2026 - dibalikin ke
// semua halaman; sebelumnya sempat homepage-only). Isinya PER HALAMAN, lihat
// content/shared/promo.js. Teksnya sengaja kecil & tipis: ini pengumuman, bukan
// headline - jangan dibikin setebal nav.
const BAR = 'flex items-center justify-center gap-2 w-full py-[0.5rem] px-5 [border-top:1px_solid_#ececec] bg-cream text-[0.72rem] font-normal leading-[1.3] text-muted no-underline [@media(max-width:560px)]:gap-[0.35rem] [@media(max-width:560px)]:px-[0.9rem]';
const CTA = 'ml-2 text-gold underline [@media(max-width:560px)]:ml-[0.3rem]';
// The fade only carries the text swap on a rotating bar; a single-message page
// never triggers it. motion-reduce kills the fade, the swap itself still happens
// (it is content, not decoration).
const FADE = 'flex items-center gap-2 [transition:opacity_var(--dur)_var(--ease)] motion-reduce:transition-none [@media(max-width:560px)]:gap-[0.35rem]';

// Lucide needs an explicit size or it renders at 24px.
const ICON = 'w-[var(--icon-sm)] h-[var(--icon-sm)] shrink-0 text-gold';
const ICONS = { tag: Tag, shield: ShieldCheck, calendar: CalendarDays, info: Info, car: Car };

const ROTATE_MS = 7000;
const FADE_MS = 200;

export default function TripBar() {
  const pathname = usePathname();
  const messages = promoFor(pathname);

  // Retracts on the way down, comes back on the way up. The collapse animates
  // grid-template-rows (0fr <-> 1fr) so no height has to be measured, and the
  // header genuinely shrinks - Navbar's ResizeObserver sees it and the sticky
  // tab strips that sit at --header-h follow it up instead of leaving a gap.
  // (Page top padding reads --header-h-max instead, which never shrinks, so
  // nothing jumps under the reader while this is animating.)
  const [hidden, setHidden] = useState(false);
  const [idx, setIdx] = useState(0);
  const [dim, setDim] = useState(false);
  const timers = useRef([]);

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

  const count = messages.length;
  useEffect(() => {
    setIdx(0);
    if (count < 2) return undefined;
    // Fade out, swap while invisible, then fade the new text back in on the
    // NEXT frame - setting idx and clearing `dim` in the same tick would paint
    // the new line at full opacity and the swap would pop instead of fade.
    const tick = setInterval(() => {
      setDim(true);
      const t = setTimeout(() => {
        setIdx((i) => (i + 1) % count);
        requestAnimationFrame(() => setDim(false));
      }, FADE_MS);
      timers.current.push(t);
    }, ROTATE_MS);
    return () => {
      clearInterval(tick);
      timers.current.forEach(clearTimeout);
      timers.current = [];
    };
  }, [count, pathname]);

  if (!count) return null;

  const msg = messages[Math.min(idx, count - 1)];
  const Icon = ICONS[msg.icon] || Tag;
  const inner = (
    <span className={`${FADE} ${dim ? 'opacity-0' : 'opacity-100'}`}>
      <Icon className={ICON} strokeWidth={1.7} aria-hidden="true" />
      <span>{msg.text}</span>
      {msg.cta && <span className={CTA}>{msg.cta}</span>}
    </span>
  );

  return (
    <div
      className={`grid [transition:grid-template-rows_var(--dur)_var(--ease)] motion-reduce:transition-none ${hidden ? 'grid-rows-[0fr]' : 'grid-rows-[1fr]'}`}
      aria-hidden={hidden || undefined}
    >
      <div className="overflow-hidden">
        {msg.href ? (
          <a className={`${BAR} cursor-pointer`} id="tripbar" href={msg.href}>{inner}</a>
        ) : (
          <div className={`${BAR} cursor-default`} id="tripbar">{inner}</div>
        )}
      </div>
    </div>
  );
}
