import { cn } from '../lib/cn.js';
import Card from './Card.jsx';
import { CARD_IMG, CARD_MEDIA, CARD_SCRIM, MEDIA_FALLBACK } from './cardClasses.js';

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
        <div className={cn(CARD_MEDIA, ratio, scrim && CARD_SCRIM, !image.src && MEDIA_FALLBACK)}>
          {image.src ? (
            <img
              src={image.src}
              alt={image.alt}
              width={image.width}
              height={image.height}
              loading={image.eager ? undefined : 'lazy'}
              className={cn(CARD_IMG, zoom && 'transition-transform duration-500 group-hover:scale-105')}
            />
          ) : null}
          {badges}
        </div>
      ) : null}

      <div className={cn('p-5 flex flex-col gap-3 flex-1', bodyClassName)}>
        {children}
        {footer ? (
          <div className="mt-auto pt-3 flex items-end justify-between [border-top:1px_solid_var(--line)]">{footer}</div>
        ) : null}
      </div>
    </Card>
  );
}
