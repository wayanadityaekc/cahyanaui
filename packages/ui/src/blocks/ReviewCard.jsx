import { cn } from '../lib/cn.js';
import { CARD_TONES } from './cardClasses.js';
import { REVIEW_CARD as REVIEW_CARD_CLASSES, starText } from './reviewClasses.js';

export default function ReviewCard({
  name,
  country,
  rating,
  message,
  service,
  logo = null,
  mark = null,
  placeholder = false,
  onClick,
  className = '',
}) {
  const { n: starCount, stars } = starText(rating);
  const markNode = mark ? <span className="absolute right-[1.3rem] bottom-[1.1rem] inline-flex">{mark}</span> : null;

  if (placeholder) {
    return (
      <div
        className={cn(
          REVIEW_CARD_CLASSES.frame,
          CARD_TONES.white,
          REVIEW_CARD_CLASSES.card,
          '!cursor-default',
          className,
        )}
        data-review-placeholder=""
      >
        <div className={REVIEW_CARD_CLASSES.head}>
          <span className={REVIEW_CARD_CLASSES.name}>{name}</span>
        </div>
        {service && <div className={REVIEW_CARD_CLASSES.meta}>{service}</div>}
        <div className={cn(REVIEW_CARD_CLASSES.stars, 'opacity-30')} aria-hidden="true">
          {'\u2605'.repeat(5)}
        </div>
        <p className={cn(REVIEW_CARD_CLASSES.text, '!text-muted')}>{message}</p>
        {logo && <img className={REVIEW_CARD_CLASSES.logo} src={logo.src} alt={logo.alt || ''} loading="lazy" />}
        {markNode}
      </div>
    );
  }

  return (
    <button
      type="button"
      className={cn(REVIEW_CARD_CLASSES.frame, CARD_TONES.white, REVIEW_CARD_CLASSES.card, className)}
      onClick={onClick}
    >
      <div className={REVIEW_CARD_CLASSES.head}>
        <span className={REVIEW_CARD_CLASSES.name}>{name}</span>
        {country && <span className={REVIEW_CARD_CLASSES.meta}>&middot; {country}</span>}
      </div>
      {service && <div className={REVIEW_CARD_CLASSES.meta}>{service}</div>}
      <div className={REVIEW_CARD_CLASSES.stars} aria-label={`${starCount} out of 5`}>
        {stars}
      </div>
      <p className={REVIEW_CARD_CLASSES.text}>{message}</p>
      <span className={REVIEW_CARD_CLASSES.more}>Read more &rsaquo;</span>
      {logo && <img className={REVIEW_CARD_CLASSES.logo} src={logo.src} alt={logo.alt || ''} loading="lazy" />}
      {markNode}
    </button>
  );
}
