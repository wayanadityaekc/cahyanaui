'use client';

import { usePathname } from 'next/navigation';
import { PROMO } from '@/content/shared/promo';

// Tailwind-native (full-portable): .tripbar* -> utilities.
const BAR = 'flex items-center justify-center gap-2 w-full py-[0.6rem] px-5 [border-top:1px_solid_#ececec] bg-cream text-h3 text-green no-underline [@media(max-width:560px)]:text-small [@media(max-width:560px)]:gap-[0.35rem] [@media(max-width:560px)]:py-[0.55rem] [@media(max-width:560px)]:px-[0.9rem]';
const EDIT = 'ml-2 text-gold font-normal underline [@media(max-width:560px)]:ml-[0.3rem]';

const TAG_ICON = (
  <svg className="w-[var(--icon-md)] h-[var(--icon-md)] shrink-0 text-gold" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" />
    <line x1="7" y1="7" x2="7.01" y2="7" />
  </svg>
);

export default function TripBar({ mode = 'promo' }) {
  const pathname = usePathname();
  // Wayan: promo tripbar disembunyiin KHUSUS di halaman Our Company.
  if (pathname === '/our-company' || pathname === '/our-company.html') return null;
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
