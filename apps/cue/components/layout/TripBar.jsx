'use client';

import { useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';
import { normalizePath } from '@/lib/pathname';
import { Tag, ShieldCheck, CalendarDays, Info, Car } from 'lucide-react';
import { promoFor } from '@/content/shared/promo';

// Promo strip above the navbar, text per page from promo.js; one line only (nowrap + truncate, needs min-w-0).
const BAR = 'flex items-center justify-center gap-2 w-full py-[0.5rem] px-5 [border-bottom:1px_solid_var(--line)] bg-cream text-[0.72rem] font-normal leading-[1.3] text-muted no-underline whitespace-nowrap [@media(max-width:560px)]:gap-[0.35rem] [@media(max-width:560px)]:px-[0.9rem]';
const CTA = 'ml-2 shrink-0 text-gold underline [@media(max-width:560px)]:ml-[0.3rem]';
// Fade for rotating messages only; motion-reduce drops the fade but the text still swaps.
const FADE = 'flex items-center min-w-0 max-w-full gap-2 [transition:opacity_var(--dur)_var(--ease)] motion-reduce:transition-none [@media(max-width:560px)]:gap-[0.35rem]';

// Lucide needs an explicit size or it renders at 24px.
const ICON = 'w-[var(--icon-sm)] h-[var(--icon-sm)] shrink-0 text-gold';
const ICONS = { tag: Tag, shield: ShieldCheck, calendar: CalendarDays, info: Info, car: Car };

const ROTATE_MS = 7000;
const FADE_MS = 200;

export default function TripBar() {
  const pathname = normalizePath(usePathname());
  const messages = promoFor(pathname);
  const [idx, setIdx] = useState(0);
  const [dim, setDim] = useState(false);
  const timers = useRef([]);

  const count = messages.length;
  useEffect(() => {
    setIdx(0);
    if (count < 2) return undefined;
    // Fade out, swap, then fade in on the next frame; setting idx and dim in one tick pops instead of fading.
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
      <span className="truncate">{msg.text}</span>
      {msg.cta && <span className={CTA}>{msg.cta}</span>}
    </span>
  );

  return msg.href ? (
    <a className={`${BAR} cursor-pointer`} id="tripbar" href={msg.href}>{inner}</a>
  ) : (
    <div className={`${BAR} cursor-default`} id="tripbar">{inner}</div>
  );
}
