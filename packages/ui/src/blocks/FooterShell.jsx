import { cn } from '../lib/cn.js';
import BrandIcon from './BrandIcon.jsx';
import {
  FOOT_BOTTOM,
  FOOT_COL_A,
  FOOT_COL_H,
  FOOT_COL_LI,
  FOOT_FEATURED,
  FOOT_GRID,
  FOOT_ROOT,
  FOOT_SOCIAL_A,
  FOOT_SOCIAL_A_AIRBNB,
  FOOT_SOCIAL_ICON_AIRBNB,
} from './footerClasses.js';

export default function FooterShell({
  brand,
  columns = [],
  social = null,
  featured = null,
  bottom = null,
  surface = 'bg-[#ebe8e2]',
  gridClass = FOOT_GRID,
  linkAs: Link = 'a',
  className,
  children,
}) {
  return (
    <footer className={cn(FOOT_ROOT, surface, className)}>
      <div className={gridClass}>
        <div className="max-[900px]:col-span-full">{brand}</div>

        {columns.map((col) => (
          <div key={col.heading} id={col.id}>
            <h4 className={FOOT_COL_H}>{col.heading}</h4>
            <ul className="list-none">
              {col.items.map((it) => (
                <li key={it.href + it.label} className={FOOT_COL_LI}>
                  {it.external ? (
                    <a href={it.href} target="_blank" rel="noopener" className={FOOT_COL_A}>
                      {it.label}
                    </a>
                  ) : (
                    <Link href={it.href} className={FOOT_COL_A}>
                      {it.label}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </div>
        ))}

        {social || featured ? (
          <div>
            {featured ? (
              <>
                <h4 className={FOOT_COL_H}>{featured.heading || 'Featured On'}</h4>
                <ul className="list-none flex flex-wrap items-center gap-x-4 gap-y-1">
                  {featured.names.map((name) => (
                    <li key={name} className={FOOT_FEATURED}>
                      {name}
                    </li>
                  ))}
                </ul>
              </>
            ) : null}
            {social ? (
              <>
                <h4 className={cn(FOOT_COL_H, featured && 'mt-6')}>{social.heading || 'Follow'}</h4>
                <div className="flex gap-[0.6rem]">
                  {social.links.map((link) => {
                    const brand = link.name === 'Airbnb';
                    return (
                      <a
                        key={link.name}
                        href={link.href || '#'}
                        aria-label={link.name}
                        aria-disabled={link.href ? undefined : 'true'}
                        {...(link.href ? { target: '_blank', rel: 'noopener' } : {})}
                        className={brand ? FOOT_SOCIAL_A_AIRBNB : FOOT_SOCIAL_A}
                      >
                        <BrandIcon name={link.name} className={brand ? FOOT_SOCIAL_ICON_AIRBNB : undefined} />
                      </a>
                    );
                  })}
                </div>
              </>
            ) : null}
          </div>
        ) : null}

        {children}
      </div>

      <div className={FOOT_BOTTOM}>{bottom}</div>
    </footer>
  );
}
