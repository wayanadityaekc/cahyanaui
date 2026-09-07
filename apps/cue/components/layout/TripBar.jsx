'use client';

import { usePathname } from 'next/navigation';
import { PROMO } from '@/content/shared/promo';

const TAG_ICON = (
  <svg className="tripbar__ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
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
      {PROMO.cta && <span className="tripbar__edit">{PROMO.cta}</span>}
    </>
  );

  return asLink ? (
    <a className="tripbar tripbar--promo" id="tripbar" href={PROMO.href}>{inner}</a>
  ) : (
    <div className="tripbar tripbar--promo" id="tripbar">{inner}</div>
  );
}
