import Img from '@/components/ui/Img';
import Price from '@/components/Price';

function ClockIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </svg>
  );
}

function PinIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 21s-7-6.2-7-11a7 7 0 0 1 14 0c0 4.8-7 11-7 11z" />
      <circle cx="12" cy="10" r="2.5" />
    </svg>
  );
}

export default function ExperienceCard({
  href,
  name,
  img,
  alt,
  meta,
  metaIcon = 'clock',
  priceName,
  priceFallback,
  zone,
  badge,
  children,
}) {
  return (
    <a className="experience__card" href={href} data-zone={zone}>
      <div className="experience__image">
        <Img src={`/assets/images/${img}`} alt={alt || name} width={600} height={600} />
        {badge && <span className="chdur__badge">{badge}</span>}
      </div>
      <div className="experience__body">
        <h3 className="experience__name">{name}</h3>
        {meta && (
          <div className="experience__meta">
            {metaIcon === 'pin' ? <PinIcon /> : <ClockIcon />}
            <span>{meta}</span>
          </div>
        )}
        {priceName && (
          <div className="experience__footer">
            <div className="experience__price">
              <span className="price-from">from</span>{' '}
              <Price name={priceName} fallback={priceFallback} />
            </div>
          </div>
        )}
        {children}
      </div>
    </a>
  );
}
