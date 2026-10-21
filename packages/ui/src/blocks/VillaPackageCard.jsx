import { cn } from '../lib/cn.js';
import { UPPER } from '../primitives/Eyebrow.jsx';
import Coin from '../primitives/Coin.jsx';

const ICON_STROKE_WIDTH_REGULAR = 1.8;

const CARD =
  'relative flex flex-col h-full overflow-hidden rounded-lg bg-surface-raised [border:1px_solid_var(--line)]';
const PHOTO = 'relative aspect-[4/3] bg-cream overflow-hidden';
const BADGE = 'absolute top-4 left-4 px-2 py-[2px] rounded-sm bg-cta text-white font-medium';
const BODY = 'flex flex-col flex-1 p-6';
const EYEBROW = 'm-0 text-label font-medium text-muted';
const TITLE = 'mt-2 mb-0 text-h3 font-semibold text-gold';
const TAGLINE = 'mt-2 mb-0 text-small leading-[1.5] text-muted';
const LIST = 'list-none mt-4 mb-0 p-0 flex flex-col gap-2';
const ROW = 'flex items-center gap-2 text-small text-gold';
const ROW_ICON = 'w-4 h-4 flex-none text-muted';
const FOOT = 'mt-auto pt-6 flex flex-col gap-2';
const PRICE_ROW = 'm-0 flex items-baseline justify-between gap-4';
const COINS = 'm-0 flex items-center gap-2 text-small font-medium text-gold';

export default function VillaPackageCard({
  image = '',
  imageAlt = '',
  badge = '',
  eyebrow = '',
  title = '',
  tagline = '',
  items = [],
  priceLabel = '',
  price = '',
  coins = '',
  note = '',
  action = null,
  className,
}) {
  return (
    <article className={cn(CARD, className)} data-villa-package-card>
      <div className={PHOTO}>
        {image ? <img className="block w-full h-full object-cover" src={image} alt={imageAlt} loading="lazy" /> : null}
        {badge ? <span className={cn(UPPER, BADGE)}>{badge}</span> : null}
      </div>
      <div className={BODY}>
        {eyebrow ? <p className={EYEBROW}>{eyebrow}</p> : null}
        <h3 className={TITLE}>{title}</h3>
        {tagline ? <p className={TAGLINE}>{tagline}</p> : null}
        <ul className={LIST}>
          {items.map(({ label, Icon }) => (
            <li key={label} className={ROW}>
              {Icon ? <Icon className={ROW_ICON} strokeWidth={ICON_STROKE_WIDTH_REGULAR} aria-hidden="true" /> : null}
              <span>{label}</span>
            </li>
          ))}
        </ul>
        <div className={FOOT}>
          {price ? (
            <p className={PRICE_ROW}>
              <span className="text-small text-muted">{priceLabel}</span>
              <b className="text-h3 font-semibold text-gold whitespace-nowrap" data-package-price>
                {price}
              </b>
            </p>
          ) : null}
          {coins ? (
            <p className={COINS} data-package-coins>
              <Coin size="sm" still />
              <span>{coins}</span>
            </p>
          ) : null}
          {note ? <p className="m-0 text-label text-muted">{note}</p> : null}
          {action ? <div className="mt-2">{action}</div> : null}
        </div>
      </div>
    </article>
  );
}
