import { cn } from '../lib/cn.js';
import { CARD_TONES } from './cardClasses.js';
import { REVIEW_CARD as C, starText } from './reviewClasses.js';

/**
 * One review as a fixed-size card; clicking it opens the full text.
 * `service` is the trip line ("Ubud Tour", or "Ubud Tour + 2 more" from
 * groupReviews). `logo` ({ src, alt }) marks where the review came from and is
 * optional, because each site passes its own mark.
 * Same edge as CARD_FRAMED (hairline, square corners) minus its overflow-hidden:
 * line-clamp already stops the message cleanly, and clipping the card would cut
 * a long trip line in half.
 */
export default function ReviewCard({ name, country, rating, message, service, logo = null, onClick, className = '' }) {
  const { n, stars } = starText(rating);
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
    </button>
  );
}
