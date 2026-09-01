'use client';

import { PROMO } from '@/content/shared/promo';

function TagIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M20.6 13.4 12 22l-9-9V4h9l8.6 8.6a2 2 0 0 1 0 2.8z" />
      <circle cx="7.5" cy="7.5" r="1.5" />
    </svg>
  );
}

export default function TripBar({ mode = 'promo' }) {
  if (mode !== 'promo') return null;
  if (!PROMO.active || !PROMO.text) return null;

  const inner = (
    <>
      <TagIcon />
      <span className="tripbar__text">{PROMO.text}</span>
      {PROMO.cta && PROMO.href && <span className="tripbar__cta">{PROMO.cta}</span>}
    </>
  );

  return (
    <div className="tripbar tripbar--promo">
      {PROMO.href ? (
        <a className="tripbar__inner" href={PROMO.href}>{inner}</a>
      ) : (
        <div className="tripbar__inner">{inner}</div>
      )}
    </div>
  );
}
