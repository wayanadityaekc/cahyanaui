import Price from '@/components/Price';

// Listing card (mobile-first): horizontal row - square photo on the left, then
// title, short description, and a bottom line with duration + Private Tour on
// the left and the price on the right. No category label, no chip, no rating.
export default function ListingRow({
  href, name, img, alt, meta, metaIcon = 'clock',
  priceName, priceFallback, priceMode = 'standard', zone, desc,
}) {
  const photo = img ? { backgroundImage: `url(/assets/images/${img})` } : undefined;
  return (
    <a className="lrow" href={href} data-zone={zone}>
      <div className="lrow__img" style={photo} role="img" aria-label={alt || name} />
      <div className="lrow__body">
        <h3 className="lrow__t">{name}</h3>
        {desc && <p className="lrow__desc">{desc}</p>}
        <div className="lrow__foot">
          <span className="lrow__meta">{meta}{metaIcon !== 'pin' ? ' · Private Tour' : ''}</span>
          {priceName && (
            <span className="lrow__price">
              <small>from</small>
              <Price name={priceName} mode={priceMode} fallback={priceFallback} />
            </span>
          )}
        </div>
      </div>
    </a>
  );
}
