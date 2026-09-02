'use client';

import Price from '@/components/Price';

export default function CharterHourCard({ hours, label, popular, priceName, priceFallback, note }) {
  return (
    <div className={`chcard${popular ? ' chcard--pop' : ''}`}>
      {popular && <span className="chcard__badge">Popular</span>}
      <p className="chcard__hours">{hours}</p>
      <p className="chcard__label">{label}</p>
      <div className="chcard__price">
        <Price name={priceName} fallback={priceFallback} />
      </div>
      {note && <p className="chcard__note">{note}</p>}
    </div>
  );
}
