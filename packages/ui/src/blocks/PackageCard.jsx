import { cn } from '../lib/cn.js';
import { UPPER } from '../primitives/Eyebrow.jsx';

/**
 * A stay package: a name, one line, what it includes (each with its own price),
 * then the extras' worth, the package price and the saving.
 *
 *   name, tagline   heading and its one line
 *   badge           optional small label (for example "Popular")
 *   items           [{ label, price }] what the package adds to the villa
 *   worth, price    the extras booked one by one, and the package price for them
 *   labels          { includes, worth, price } wording, passed by the app
 *   save, note      the saving line and a small rule line (for example a minimum stay)
 *   action          the button; the app passes its own so the library never reaches into a cart
 *   The price is soft black, not amber: it sits right above a green button (the CUE exception).
 */
export default function PackageCard({
  name = '',
  tagline = '',
  badge = '',
  items = [],
  worth = '',
  price = '',
  labels = {},
  save = '',
  note = '',
  featured = false,
  action = null,
  className,
}) {
  return (
    <article
      className={cn('relative flex flex-col bg-surface-raised p-6 [border:1px_solid_var(--line)]', featured && '[border-color:var(--color-gold)]', className)}
      data-package-card
    >
      {badge ? <span className={cn(UPPER, 'absolute -top-[9px] left-6 px-2 py-[2px] bg-cta text-white font-medium')}>{badge}</span> : null}
      <h3 className="m-0 text-h3 font-semibold text-gold">{name}</h3>
      {tagline ? <p className="mt-1 mb-0 text-small leading-[1.5] text-muted">{tagline}</p> : null}
      <p className="mt-5 mb-2 text-small font-medium text-gold">{labels.includes}</p>
      <ul className="list-none m-0 p-0">
        {items.map((item) => (
          <li key={item.label} className="flex items-baseline justify-between gap-3 py-2 [border-bottom:1px_solid_var(--line)] last:[border-bottom:0]">
            <span className="text-small text-gold">{item.label}</span>
            <span className="text-small text-muted whitespace-nowrap">{item.price}</span>
          </li>
        ))}
      </ul>
      <div className="mt-auto pt-5">
        <p className="m-0 flex justify-between gap-3 text-small text-muted">
          <span>{labels.worth}</span>
          <s className="whitespace-nowrap">{worth}</s>
        </p>
        <p className="mt-1 mb-0 flex justify-between items-baseline gap-3">
          <span className="text-small font-medium text-gold">{labels.price}</span>
          <b className="text-h3 font-semibold text-gold whitespace-nowrap">{price}</b>
        </p>
        {save ? <p className="mt-1 mb-0 text-label text-gold text-right">{save}</p> : null}
        {note ? <p className="mt-3 mb-0 text-label text-muted">{note}</p> : null}
        {action ? <div className="mt-4">{action}</div> : null}
      </div>
    </article>
  );
}
