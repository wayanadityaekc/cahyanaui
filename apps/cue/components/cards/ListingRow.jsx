'use client';

import Price from '@/components/Price';

function StarIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 2l2.9 6 6.6.6-5 4.3 1.5 6.5L12 16.9 5.9 20l1.5-6.5-5-4.3 6.6-.6z" />
    </svg>
  );
}
function CheckIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M20 6L9 17l-5-5" />
    </svg>
  );
}
function PinIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M12 21s-7-6.2-7-11a7 7 0 0 1 14 0c0 4.8-7 11-7 11z" /><circle cx="12" cy="10" r="2.5" />
    </svg>
  );
}
function ClockIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" />
    </svg>
  );
}
function UserIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="8" r="4" /><path d="M4 20c0-4 4-6 8-6s8 2 8 6" />
    </svg>
  );
}

// Listing card (mobile-first): horizontal row - photo on the left with a thin
// white inset border and a small star rating on it, then the title (up to two
// lines), a stacked meta list (stops / duration / private driver, each with its
// own icon), a Free cancellation badge, and the price anchored bottom-right.
// rating shows "New" until there are real reviews.
export default function ListingRow({
  href, name, img, alt, meta, metaIcon = 'clock',
  priceName, priceFallback, priceMode = 'standard', zone, stops, priv, rating,
  dim = false, onReset, anchorId,
}) {
  const photo = img ? { backgroundImage: `url(/assets/images/${img})` } : undefined;
  // A dimmed card (filtered out by the zone tab) taps back to "All" instead of
  // opening the tour.
  const handleClick = dim && onReset ? (e) => { e.preventDefault(); onReset(); } : undefined;
  return (
    <a id={anchorId} className={`lrow${dim ? ' lrow--dim' : ''}`} href={href} data-zone={zone} onClick={handleClick}>
      <div className="lrow__img" style={photo} role="img" aria-label={alt || name}>
        <span className="lrow__rate"><StarIcon />{rating || 'New'}</span>
      </div>
      <div className="lrow__body">
        <h3 className="lrow__t">{name}</h3>
        <ul className="lrow__meta">
          {stops != null && (
            <li><PinIcon />{stops} {stops === 1 ? 'stop' : 'stops'}</li>
          )}
          {meta && metaIcon === 'pin' && stops == null && (
            <li><PinIcon />{meta}</li>
          )}
          {meta && metaIcon !== 'pin' && (
            <li><ClockIcon />{meta}</li>
          )}
          {priv && (
            <li><UserIcon />Private driver</li>
          )}
        </ul>
        {priceName && (
          <span className="lrow__cancel"><CheckIcon />Free cancellation</span>
        )}
        {priceName && (
          <span className="lrow__price">
            <small>from</small>
            <Price name={priceName} mode={priceMode} fallback={priceFallback} />
          </span>
        )}
      </div>
    </a>
  );
}
