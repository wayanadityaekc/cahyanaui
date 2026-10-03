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

/**
 * The footer, as a shell: one grid row, five columns, one hairline.
 *
 *   brand     node - the wordmark and whatever sits under it (contact lines)
 *   columns   [{ heading, items: [{ href, label, external }] }]
 *   social    { heading, links: [{ name, href }] }
 *   featured  { heading, names: [string] } - text wordmarks above Follow, CUE's order
 *   bottom    node - overrides the default copyright row
 *   surface   the band's background. The villa site runs a LIGHT footer
 *             (#ebe8e2); CUE's is darker. Passed in rather than themed, because
 *             this is the one place the two brands genuinely differ.
 *   gridClass the grid row; pass FOOT_GRID_SIX when a sixth column arrives as `children`
 *   linkAs    the link component (pass next/link's Link); defaults to 'a'
 *
 * THE BRAND IS A TEXT WORDMARK, not the logo image. At footer size the mark
 * stops being legible and the name has to be readable - same call CUE made.
 *
 * A social link with `href: null` renders with aria-disabled instead of a bare
 * href="#". An account that exists but has no URL on file yet should say so to
 * a screen reader rather than silently jumping to the top of the page. Fill the
 * href in and the attribute goes away on its own.
 */
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
        {/* The brand block spans both columns once the grid drops to two: it is
            a paragraph of contact lines, not a list of links. */}
        <div className="max-[900px]:col-span-full">{brand}</div>

        {columns.map((col) => (
          <div key={col.heading} id={col.id}>
            <h4 className={FOOT_COL_H}>{col.heading}</h4>
            <ul className="list-none">
              {col.items.map((it) => (
                <li key={it.href + it.label} className={FOOT_COL_LI}>
                  {it.external ? (
                    <a href={it.href} target="_blank" rel="noopener" className={FOOT_COL_A}>{it.label}</a>
                  ) : (
                    <Link href={it.href} className={FOOT_COL_A}>{it.label}</Link>
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
                  {featured.names.map((name) => <li key={name} className={FOOT_FEATURED}>{name}</li>)}
                </ul>
              </>
            ) : null}
            {social ? (
              <>
                <h4 className={cn(FOOT_COL_H, featured && 'mt-6')}>{social.heading || 'Follow'}</h4>
                <div className="flex gap-[0.6rem]">
                  {social.links.map((s) => {
                    const brand = s.name === 'Airbnb';
                    return (
                      <a
                        key={s.name}
                        href={s.href || '#'}
                        aria-label={s.name}
                        aria-disabled={s.href ? undefined : 'true'}
                        {...(s.href ? { target: '_blank', rel: 'noopener' } : {})}
                        className={brand ? FOOT_SOCIAL_A_AIRBNB : FOOT_SOCIAL_A}
                      >
                        <BrandIcon name={s.name} className={brand ? FOOT_SOCIAL_ICON_AIRBNB : undefined} />
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

