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

// Listing card (mobile-first): horizontal row - square-ish photo on the left
// with a thin white inset border and a star rating on it, then title, a short
// description, duration + Private, a Free cancellation badge, and the price
// anchored bottom-right. rating shows "New" until there are real reviews.
export default function ListingRow({
  href, name, img, alt, meta, metaIcon = 'clock',
  priceName, priceFallback, priceMode = 'standard', zone, desc, rating,
}) {
  const photo = img ? { backgroundImage: `url(/assets/images/${img})` } : undefined;
  return (
    <a className="lrow" href={href} data-zone={zone}>
      <div className="lrow__img" style={photo} role="img" aria-label={alt || name}>
        <span className="lrow__rate"><StarIcon />{rating || 'New'}</span>
      </div>
      <div className="lrow__body">
        <h3 className="lrow__t">{name}</h3>
        {desc && <p className="lrow__desc">{desc}</p>}
        <span className="lrow__meta">{meta}{metaIcon !== 'pin' ? ' · Private' : ''}</span>
        <span className="lrow__cancel"><CheckIcon />Free cancellation</span>
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
