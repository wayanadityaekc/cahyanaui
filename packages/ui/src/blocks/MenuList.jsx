import { ImageIcon } from 'lucide-react';
import { cn } from '../lib/cn.js';

const GRIDS = {
  4: 'grid grid-cols-2 min-[769px]:grid-cols-4 gap-x-2 gap-y-6 m-0 p-0 list-none',
  3: 'grid grid-cols-2 min-[769px]:grid-cols-3 gap-x-2 gap-y-6 m-0 p-0 list-none',
};

const PHOTO = 'relative aspect-[4/3] overflow-hidden rounded-base bg-cream [&>img]:absolute [&>img]:inset-0 [&>img]:w-full [&>img]:h-full [&>img]:object-cover';

const EMPTY = 'absolute inset-0 rounded-base grid place-content-center justify-items-center gap-1 text-muted border border-dashed border-line';

export default function MenuList({
  groups = [],
  cols = 4,
  placeholderLabel = 'Photo coming soon',
  fallback = 'Sorry, we could not load the menu. Please try again.',
  className,
}) {
  if (!groups.length) return <p className="text-small text-muted">{fallback}</p>;

  return (
    <div className={cn('grid gap-10', className)} data-menu-list>
      {groups.map(({ title, note, items = [] }) => (
        <section key={title || 'menu'} className="grid gap-4">
          {title || note ? (
            <div className="grid gap-1">
              {title ? <h3 className="m-0 text-h3 font-semibold text-gold">{title}</h3> : null}
              {note ? <p className="m-0 text-small text-muted">{note}</p> : null}
            </div>
          ) : null}
          <ul className={GRIDS[cols] || GRIDS[4]}>
            {items.map(({ name, desc, img, alt }) => (
              <li key={name} className="grid gap-2 content-start min-w-0" data-menu-item>
                <div className={PHOTO}>
                  {img ? (
                    <img src={img} alt={alt || name} width={800} height={600} loading="lazy" />
                  ) : (
                    <span className={EMPTY} data-menu-placeholder>
                      <ImageIcon className="w-5 h-5" strokeWidth={1.7} aria-hidden="true" />
                      <span className="text-[0.72rem] font-medium">{placeholderLabel}</span>
                    </span>
                  )}
                </div>
                <div className="grid gap-0.5">
                  <strong className="text-small font-semibold text-gold">{name}</strong>
                  {desc ? <span className="text-small text-muted">{desc}</span> : null}
                </div>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}
