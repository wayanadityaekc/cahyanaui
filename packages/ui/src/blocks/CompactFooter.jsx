import { cn } from '../lib/cn.js';
import { FOOT_COMPACT, FOOT_CONTACT_LINK, FOOT_CONTACT_SVG } from './footerClasses.js';

/**
 * CUE's compact footer: one fixed bar for pages that fill the screen (Our Company, My Booking, Settings).
 * The `footerbar` class is load-bearing: the site's body padding and the rail frame height key off it.
 * Under 561px the links collapse to icons.
 *
 *   brand    { label, href }
 *   links    [{ label, href, Icon, external }]
 *   note     short copyright text, hidden on phones
 */
export default function CompactFooter({ brand, links = [], note = '', surface = 'bg-[#ebe8e2]', linkAs: Link = 'a', className }) {
  return (
    <footer className={cn(FOOT_COMPACT, surface, className)}>
      <div className="max-w-[1100px] mx-auto flex items-center justify-between gap-x-4">
        <Link href={brand.href} className="no-underline text-green font-body text-[0.8rem] min-[561px]:text-[0.95rem] font-semibold shrink-0 truncate">
          {brand.label}
        </Link>
        <div className="flex items-center gap-x-4 min-[561px]:gap-x-5 shrink-0">
          {links.map(({ label, href, Icon, external }) => (
            <a key={label} href={href} aria-label={label} className={FOOT_CONTACT_LINK} {...(external ? { target: '_blank', rel: 'noopener' } : {})}>
              {Icon && <Icon className={FOOT_CONTACT_SVG} strokeWidth={1.8} aria-hidden="true" />}
              <span className="max-[560px]:hidden">{label}</span>
            </a>
          ))}
        </div>
        <p className="max-[560px]:hidden text-small opacity-70 m-0 shrink-0">{note}</p>
      </div>
    </footer>
  );
}
