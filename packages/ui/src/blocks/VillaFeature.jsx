import { cn } from '../lib/cn.js';

/**
 * One villa as a section of its own: a large photo and two smaller ones in a
 * grid, with the name, facts, price and action in a bar underneath.
 *
 *   photos    [{ src, alt }]  first is the large one, then two small ones
 *   mirrored  put the large photo on the right (the second villa)
 *   facts     [{ icon, label }]
 *   action    rendered node (the app passes its own link or button)
 */
export default function VillaFeature({ id, eyebrow = '', name, text = '', photos = [], facts = [], price = '', priceNote = '', action = null, mirrored = false, className }) {
  const [main, ...rest] = photos;
  const tile = 'relative overflow-hidden rounded-lg bg-cream';
  const img = 'absolute inset-0 w-full h-full object-cover';
  return (
    <div id={id} className={cn('flex flex-col gap-6', className)}>
      <div className={cn('grid gap-3 min-[993px]:grid-cols-[2fr_1fr] min-[993px]:grid-rows-2 min-[993px]:h-[34rem]', mirrored && 'min-[993px]:grid-cols-[1fr_2fr]')}>
        {main ? (
          <div className={cn(tile, 'aspect-[4/3] min-[993px]:aspect-auto min-[993px]:row-span-2', mirrored && 'min-[993px]:col-start-2 min-[993px]:row-start-1')}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={main.src} alt={main.alt} loading="lazy" className={img} />
          </div>
        ) : null}
        <div className="grid grid-cols-2 gap-3 min-[993px]:contents">
          {rest.slice(0, 2).map((photo, index) => (
            <div key={photo.src} className={cn(tile, 'aspect-[4/3] min-[993px]:aspect-auto', mirrored && 'min-[993px]:col-start-1', mirrored && index === 0 && 'min-[993px]:row-start-1', mirrored && index === 1 && 'min-[993px]:row-start-2')}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={photo.src} alt={photo.alt} loading="lazy" className={img} />
            </div>
          ))}
        </div>
      </div>
      <div className="flex flex-col gap-5 min-[993px]:flex-row min-[993px]:items-end min-[993px]:justify-between">
        <div className="max-w-[60ch]">
          {eyebrow ? <p className="text-small font-medium text-cta mb-2">{eyebrow}</p> : null}
          <h3 className="text-[clamp(1.5rem,2.6vw,2rem)] font-semibold tracking-[-0.015em] leading-[var(--lh-heading)] text-gold m-0">{name}</h3>
          {text ? <p className="mt-3 text-strong leading-[1.6] text-green">{text}</p> : null}
          {facts.length ? (
            <ul className="mt-4 flex flex-wrap gap-x-5 gap-y-2 list-none p-0 m-0 text-small text-gold">
              {facts.map(({ icon = null, label }) => (
                <li key={label} className="inline-flex items-center gap-2 [&>svg]:w-[var(--icon-sm)] [&>svg]:h-[var(--icon-sm)]">{icon}{label}</li>
              ))}
            </ul>
          ) : null}
        </div>
        <div className="flex items-center gap-5 shrink-0">
          {price ? (
            <p className="m-0 text-right">
              {priceNote ? <span className="block text-label text-muted">{priceNote}</span> : null}
              <span className="text-[1.5rem] font-semibold text-amber">{price}</span>
            </p>
          ) : null}
          {action}
        </div>
      </div>
    </div>
  );
}
