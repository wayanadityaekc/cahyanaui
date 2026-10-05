import { cn } from '../lib/cn.js';

/**
 * One villa as a homepage section: a headline, one rating line, a short
 * paragraph, and three captioned photos (the villa room by room).
 *
 *   eyebrow, title, text   the small label, the headline and the paragraph
 *   rating                 one rendered line, for example "4.96 across platforms"
 *   rooms                  [{ src, alt, title, text }]  three is the design
 *   price, priceNote       formatted by the app
 *   action                 rendered node (the app passes its own link)
 */
export default function VillaRooms({ id, eyebrow = '', title, text = '', rating = null, rooms = [], price = '', priceNote = '', action = null, className }) {
  return (
    <div id={id} className={cn('flex flex-col', className)}>
      <div className="flex flex-col gap-5 min-[993px]:flex-row min-[993px]:items-end min-[993px]:justify-between min-[993px]:gap-10">
        <div>
          {eyebrow ? <p className="text-small font-medium text-cta mb-2">{eyebrow}</p> : null}
          <h3 className="max-w-[24ch] text-h2 font-semibold tracking-[-0.015em] leading-[var(--lh-heading)] text-gold m-0 text-balance">{title}</h3>
        </div>
        <div className="flex items-center gap-5 shrink-0">
          {price ? (
            <p className="m-0">
              {priceNote ? <span className="block text-label text-muted">{priceNote}</span> : null}
              <span className="text-[1.5rem] font-semibold text-amber">{price}</span>
            </p>
          ) : null}
          {action}
        </div>
      </div>
      {rating ? <div className="mt-5 text-small text-green">{rating}</div> : null}
      {text ? <p className="mt-4 max-w-[68ch] text-strong leading-[1.65] text-green">{text}</p> : null}
      <div className="mt-8 grid gap-6 min-[560px]:grid-cols-3 min-[993px]:gap-5">
        {rooms.map(({ src, alt, title: roomTitle, text: roomText }) => (
          <figure key={src} className="m-0">
            <div className="relative overflow-hidden rounded-lg bg-cream aspect-[4/3] min-[993px]:aspect-[5/4]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={src} alt={alt} loading="lazy" className="absolute inset-0 w-full h-full object-cover" />
            </div>
            <figcaption className="mt-3">
              <b className="block text-strong font-semibold text-gold">{roomTitle}</b>
              <span className="block mt-1 text-small leading-[1.55] text-muted">{roomText}</span>
            </figcaption>
          </figure>
        ))}
      </div>
    </div>
  );
}
