import { cn } from '../lib/cn.js';
import { CARD_TONES } from './cardClasses.js';
import { REVIEW_CARD as C, starText } from './reviewClasses.js';

export default function ReviewCard({ name, country, rating, message, service, logo = null, mark = null, placeholder = false, onClick, className = '' }) {
  const { n, stars } = starText(rating);
  const markNode = mark ? <span className="absolute right-[1.3rem] bottom-[1.1rem] inline-flex">{mark}</span> : null;

  if (placeholder) {
    return (
      <div className={cn(C.frame, CARD_TONES.white, C.card, '!cursor-default', className)} data-review-placeholder="">
        <div className={C.head}><span className={C.name}>{name}</span></div>
        {service && <div className={C.meta}>{service}</div>}
        <div className={cn(C.stars, 'opacity-30')} aria-hidden="true">{'\u2605'.repeat(5)}</div>
        <p className={cn(C.text, '!text-muted')}>{message}</p>
        {logo && <img className={C.logo} src={logo.src} alt={logo.alt || ''} loading="lazy" />}
        {markNode}
      </div>
    );
  }

  return (
    <button type="button" className={cn(C.frame, CARD_TONES.white, C.card, className)} onClick={onClick}>
      <div className={C.head}>
        <span className={C.name}>{name}</span>
        {country && <span className={C.meta}>&middot; {country}</span>}
      </div>
      {service && <div className={C.meta}>{service}</div>}
      <div className={C.stars} aria-label={`${n} out of 5`}>{stars}</div>
      <p className={C.text}>{message}</p>
      <span className={C.more}>Read more &rsaquo;</span>
      {logo && <img className={C.logo} src={logo.src} alt={logo.alt || ''} loading="lazy" />}
      {markNode}
    </button>
  );
}
