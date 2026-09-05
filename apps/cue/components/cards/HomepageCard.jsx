import CardImage from '@/components/cards/CardImage';
import Price from '@/components/Price';

function ClockIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" />
    </svg>
  );
}
function PinIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 21s-7-6.2-7-11a7 7 0 0 1 14 0c0 4.8-7 11-7 11z" /><circle cx="12" cy="10" r="2.5" />
    </svg>
  );
}
function UserIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7"><circle cx="12" cy="8" r="4" /><path d="M4 20c0-4 4-6 8-6s8 2 8 6" /></svg>
  );
}

// Homepage / "You might also like" card: square photo with the price on it
// (bottom-left over a thin gradient), then a white panel with title, meta, and
// a short description. No category label, no rating.
export default function HomepageCard({
  href, name, img, alt, meta, metaIcon = 'clock',
  priceName, priceFallback, priceMode = 'standard', zone, desc, width = 600, height = 600,
}) {
  return (
    <a className="experience__card hcard" href={href} data-zone={zone}>
      <CardImage img={img} alt={alt || name} width={width} height={height}>
        <span className="hcard__scrim" />
        {priceName && (
          <span className="hcard__price">
            <small>from</small>
            <Price name={priceName} mode={priceMode} fallback={priceFallback} />
          </span>
        )}
      </CardImage>
      <div className="hcard__body">
        <h3 className="hcard__t">{name}</h3>
        <div className="hcard__meta">
          <span>{metaIcon === 'pin' ? <PinIcon /> : <ClockIcon />}{meta}</span>
          {metaIcon !== 'pin' && (
            <>
              <span className="hcard__sep" />
              <span><UserIcon />Private Tour</span>
            </>
          )}
        </div>
        {desc && <p className="hcard__desc">{desc}</p>}
      </div>
    </a>
  );
}
