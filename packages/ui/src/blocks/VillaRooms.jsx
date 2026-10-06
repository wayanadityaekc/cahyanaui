import { cn } from '../lib/cn.js';

/**
 * One villa as a homepage section: a headline, a short paragraph
 * and three photos (the villa room by room), with no captions under the photos.
 *
 *   eyebrow, title, text   the small label, the headline and the paragraph
 *   rating                 one rendered line, for example "4.96 across platforms"
 *   rooms                  [{ src, alt }]  three is the design; the alt text carries the description
 *   price, priceNote       formatted by the app
 *   action, secondaryAction  rendered nodes (the app passes its own links)
 */
export default function VillaRooms({ id, eyebrow = '', title, text = '', rating = null, rooms = [], price = '', priceNote = '', action = null, secondaryAction = null, className }) {
  return (
    <div id={id} className={cn('flex flex-col', className)}>
      {/* Title takes 70%, the booking card 30% (stacked on a phone). */}
      <div className="grid gap-6 min-[993px]:grid-cols-[7fr_3fr] min-[993px]:gap-12 min-[993px]:items-center">
        <div>
          {eyebrow ? <p className="text-small font-medium text-cta mb-2">{eyebrow}</p> : null}
          <h3 className="max-w-[24ch] text-h2 font-semibold tracking-[-0.015em] leading-[var(--lh-heading)] text-gold m-0 text-balance">{title}</h3>
          {text ? <p className="mt-4 max-w-[60ch] text-strong leading-[1.65] text-green">{text}</p> : null}
        </div>
        <div className="overflow-hidden rounded-lg bg-surface-raised [border:1.5px_solid_var(--color-gold)]">
          <div className="flex items-baseline justify-between gap-3 bg-gold px-5 py-4 text-white">
            <span className="text-label text-white/85">{priceNote}</span>
            <span className="text-[1.75rem] font-semibold leading-none">{price}</span>
          </div>
          <div className="grid gap-2 p-5">
            {action}
            {secondaryAction}
            {rating ? <p className="m-0 mt-1 text-center text-label text-muted">{rating}</p> : null}
          </div>
        </div>
      </div>
      {/* On a phone the three rooms are a swipe slide (snap, next one peeking); from 560px they sit in a row. */}
      <div className="mt-8 flex gap-4 overflow-x-auto snap-x snap-mandatory -mx-[var(--container-x)] px-[var(--container-x)] scroll-pl-[var(--container-x)] min-[560px]:mx-0 min-[560px]:px-0 min-[560px]:grid min-[560px]:grid-cols-3 min-[560px]:overflow-visible min-[993px]:gap-5">
        {rooms.map(({ src, alt }) => (
          <figure key={src} className="m-0 shrink-0 basis-[82%] snap-start min-[560px]:basis-auto">
            <div className="relative overflow-hidden rounded-lg bg-cream aspect-[4/3] min-[993px]:aspect-[5/4]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={src} alt={alt} loading="lazy" className="absolute inset-0 w-full h-full object-cover" />
            </div>
          </figure>
        ))}
      </div>
    </div>
  );
}
