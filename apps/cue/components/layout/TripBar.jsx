'use client';

import { Tag } from 'lucide-react';
import { PROMO } from '@/content/shared/promo';

// Tailwind-native (full-portable): .tripbar* -> utilities.
const BAR = 'flex items-center justify-center gap-2 w-full py-[0.6rem] px-5 [border-top:1px_solid_#ececec] bg-cream text-h3 text-green no-underline [@media(max-width:560px)]:text-small [@media(max-width:560px)]:gap-[0.35rem] [@media(max-width:560px)]:py-[0.55rem] [@media(max-width:560px)]:px-[0.9rem]';
const EDIT = 'ml-2 text-gold font-normal underline [@media(max-width:560px)]:ml-[0.3rem]';

const TAG_ICON = <Tag className="w-[var(--icon-md)] h-[var(--icon-md)] shrink-0 text-gold" strokeWidth={1.8} />;

export default function TripBar({ mode = 'promo' }) {
  // Wayan (Sep 2026): tripbar now only ever mounts on the homepage - Navbar
  // gates the render (`pathname === '/'`), so no per-page exclusion is needed here.
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

  // Link = cursor-pointer, div (no href) = cursor-default (mirror a.tripbar--promo).
  return asLink ? (
    <a className={`${BAR} cursor-pointer`} id="tripbar" href={PROMO.href}>{inner}</a>
  ) : (
    <div className={`${BAR} cursor-default`} id="tripbar">{inner}</div>
  );
}
