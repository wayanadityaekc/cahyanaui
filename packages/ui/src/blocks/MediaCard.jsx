import { cn } from '../lib/cn.js';
import Card from './Card.jsx';
import { CARD_IMG, CARD_MEDIA, CARD_SCRIM } from './cardClasses.js';

/**
 * Photo on top, content below, optional footer pinned to the bottom. This is
 * the shape of nearly every card on both sites - villa, service, tour,
 * destination, guide article - so it is one block with slots rather than five
 * near-copies that drift.
 *
 *   image    { src, alt, width, height, ratio }
 *   badges   nodes laid over the photo; `overlay` picks the corner
 *   footer   pinned to the bottom, so cards in a row line their prices up even
 *            when one has a longer description than the next
 *   zoom     photo scales slightly on hover (only when the card is a link)
 *
 * WIDTH AND HEIGHT ON THE <img> ARE NOT OPTIONAL. Without them the browser
 * cannot reserve the box before the file arrives and everything under the card
 * jumps when it does. `ratio` is a Tailwind aspect class, so the reserved box
 * is right even before the attributes are read.
 */
export default function MediaCard({
  as,
  href,
  image,
  badges = null,
  scrim = false,
  zoom = false,
  footer = null,
  className,
  bodyClassName,
  children,
  ...rest
}) {
  const ratio = image?.ratio || 'aspect-[4/3]';
  return (
    <Card
      as={as}
      href={href}
      shape="framed"
      hover="sm"
      className={cn('flex flex-col overflow-hidden group', className)}
      {...rest}
    >
      {image ? (
        <div className={cn(CARD_MEDIA, ratio, scrim && CARD_SCRIM)}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={image.src}
            alt={image.alt}
            width={image.width}
            height={image.height}
            loading={image.eager ? undefined : 'lazy'}
            className={cn(
              CARD_IMG,
              zoom && 'transition-transform duration-500 group-hover:scale-105',
            )}
          />
          {badges}
        </div>
      ) : null}

      <div className={cn('p-5 flex flex-col gap-3 flex-1', bodyClassName)}>
        {children}
        {footer ? (
          <div className="mt-auto pt-3 flex items-end justify-between [border-top:1px_solid_var(--line)]">
            {footer}
          </div>
        ) : null}
      </div>
    </Card>
  );
}
