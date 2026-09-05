import CardImage from '@/components/cards/CardImage';
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

function StarIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 2l2.9 6 6.6.6-5 4.3 1.5 6.5L12 16.9 5.9 20l1.5-6.5-5-4.3 6.6-.6z" />
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
  priceMode = 'standard',
  zone,
  badge,
  desc,
  program,
  variant = 'link',
  inclText,
  width = 600,
  height = 600,
  children,
  hybrid = false,
  cat,
  rating = 0,
}) {
  // Hybrid card experiment (Wayan): photo on top with a category badge + star
  // rating over it, then a white panel with title, meta, description, price.
  if (hybrid) {
    return (
      <a className="experience__card experience__card--hy" href={href} data-zone={zone}>
        <CardImage img={img} alt={alt || name} width={width} height={height}>
          {cat && <span className="hy__badge">{cat}</span>}
          <span className="hy__rate"><StarIcon />{rating}</span>
          {priceName && (
            <>
              <span className="hy__scrim" />
              <span className="hy__price">
                <small>from</small>
                <Price name={priceName} mode={priceMode} fallback={priceFallback} />
              </span>
            </>
          )}
        </CardImage>
        <div className="hy__body">
          <h3 className="hy__title">{name}</h3>
          <div className="hy__meta">
            <span>{metaIcon === 'pin' ? <PinIcon /> : <ClockIcon />}{meta}</span>
            {metaIcon !== 'pin' && (
              <>
                <span className="hy__sep" />
                <span>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7"><circle cx="12" cy="8" r="4" /><path d="M4 20c0-4 4-6 8-6s8 2 8 6" /></svg>
                  Private Tour
                </span>
              </>
            )}
          </div>
          {desc && <p className="hy__desc">{desc}</p>}
        </div>
      </a>
    );
  }

  const incl = variant === 'incl';
  const body = (
    <>
      <CardImage img={img} alt={alt || name} width={width} height={height}>
        {badge && <span className="chcard__badge">{badge}</span>}
      </CardImage>
      <div className="experience__body">
        <h3 className="experience__name">{name}</h3>
        {meta && (
          <div className="experience__meta">
            {metaIcon === 'pin' ? <PinIcon /> : <ClockIcon />}
            <span>{meta}</span>
          </div>
        )}
        {desc && <p className="experience__desc">{desc}</p>}
        {incl && inclText && (
          <div className="experience__incl">
            {inclText.split('|')[0]}
            <strong>{inclText.split('|')[1]}</strong>
            {inclText.split('|')[2]}
          </div>
        )}
        {(priceName || variant === 'article') && (
          <div className="experience__footer">
            {priceName && (
              <div className="experience__price">
                <span className="price-from">from</span>{' '}
                <Price name={priceName} mode={priceMode} fallback={priceFallback} />
              </div>
            )}
            {variant === 'article' && href && (
              <a href={href} className="experience__arrow" aria-label={`View ${name}`}>
                &rarr;
              </a>
            )}
          </div>
        )}
        {children}
      </div>
    </>
  );

  if (variant === 'article') {
    return (
      <article className="experience__card" data-program={program} data-zone={zone}>
        {body}
      </article>
    );
  }

  return (
    <a className={`experience__card${incl ? ' experience__card--incl' : ''}`} href={href} data-zone={zone}>
      {body}
    </a>
  );
}
