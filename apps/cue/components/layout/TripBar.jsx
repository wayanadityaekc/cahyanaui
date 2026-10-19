'use client';

import { useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';
import { normalizePath } from '@/lib/pathname';
import { Tag, ShieldCheck, CalendarDays, Info, Car } from 'lucide-react';
import { findPromosForPath } from '@/content/shared/promo';

const ICON_STROKE_WIDTH_REGULAR = 1.7;

const BAR =
  'flex items-center justify-center gap-2 w-full py-[0.5rem] px-5 [border-bottom:1px_solid_var(--line)] bg-cream text-[0.72rem] font-normal leading-[1.3] text-muted no-underline whitespace-nowrap [@media(max-width:560px)]:gap-[0.35rem] [@media(max-width:560px)]:px-[0.9rem]';
const CTA = 'ml-2 shrink-0 text-gold underline [@media(max-width:560px)]:ml-[0.3rem]';
const FADE =
  'flex items-center min-w-0 max-w-full gap-2 [transition:opacity_var(--dur)_var(--ease)] motion-reduce:transition-none [@media(max-width:560px)]:gap-[0.35rem]';

const ICON = 'w-[var(--icon-sm)] h-[var(--icon-sm)] shrink-0 text-gold';
const ICONS = { tag: Tag, shield: ShieldCheck, calendar: CalendarDays, info: Info, car: Car };

const ROTATE_MS = 7000;
const FADE_MS = 200;

export default function TripBar() {
  const pathname = normalizePath(usePathname());
  const messages = findPromosForPath(pathname);
  const [index, setIndex] = useState(0);
  const [isDimmed, setIsDimmed] = useState(false);
  const timers = useRef([]);

  const count = messages.length;
  useEffect(() => {
    setIndex(0);
    if (count < 2) return undefined;
    const tick = setInterval(() => {
      setIsDimmed(true);
      const fadeTimer = setTimeout(() => {
        setIndex((previousIndex) => (previousIndex + 1) % count);
        requestAnimationFrame(() => setIsDimmed(false));
      }, FADE_MS);
      timers.current.push(fadeTimer);
    }, ROTATE_MS);
    return () => {
      clearInterval(tick);
      timers.current.forEach(clearTimeout);
      timers.current = [];
    };
  }, [count, pathname]);

  if (!count) return null;

  const message = messages[Math.min(index, count - 1)];
  const Icon = ICONS[message.icon] || Tag;
  const inner = (
    <span className={`${FADE} ${isDimmed ? 'opacity-0' : 'opacity-100'}`}>
      <Icon className={ICON} strokeWidth={ICON_STROKE_WIDTH_REGULAR} aria-hidden="true" />
      <span className="truncate">{message.text}</span>
      {message.cta && <span className={CTA}>{message.cta}</span>}
    </span>
  );

  return message.href ? (
    <a className={`${BAR} cursor-pointer`} id="tripbar" href={message.href}>
      {inner}
    </a>
  ) : (
    <div className={`${BAR} cursor-default`} id="tripbar">
      {inner}
    </div>
  );
}
