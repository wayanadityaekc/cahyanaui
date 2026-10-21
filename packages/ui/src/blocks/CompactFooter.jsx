import { cn } from '../lib/cn.js';
import { FOOT_COMPACT, FOOT_CONTACT_LINK, FOOT_CONTACT_SVG } from './footerClasses.js';

const ICON_STROKE_WIDTH_BOLD = 1.8;
const ACTION_RESET = 'p-0 border-0 bg-transparent cursor-pointer font-body';

export default function CompactFooter({
  brand,
  links = [],
  note = '',
  action = null,
  surface = 'bg-[#ebe8e2]',
  linkAs: Link = 'a',
  className,
}) {
  return (
    <footer className={cn(FOOT_COMPACT, surface, className)}>
      <div className="max-w-[1100px] mx-auto flex items-center justify-between gap-x-4">
        <Link
          href={brand.href}
          className="no-underline text-green font-body text-[0.8rem] min-[561px]:text-[0.95rem] font-semibold shrink-0 truncate"
        >
          {brand.label}
        </Link>
        <div className="flex items-center gap-x-4 min-[561px]:gap-x-5 shrink-0">
          {links.map(({ label, href, Icon, external }) => (
            <a
              key={label}
              href={href}
              aria-label={label}
              className={FOOT_CONTACT_LINK}
              {...(external ? { target: '_blank', rel: 'noopener' } : {})}
            >
              {Icon && <Icon className={FOOT_CONTACT_SVG} strokeWidth={ICON_STROKE_WIDTH_BOLD} aria-hidden="true" />}
              <span className="max-[560px]:hidden">{label}</span>
            </a>
          ))}
          {action && (
            <button
              type="button"
              aria-label={action.label}
              onClick={action.onClick}
              className={cn(FOOT_CONTACT_LINK, ACTION_RESET)}
              data-footer-action
            >
              {action.Icon && (
                <action.Icon className={FOOT_CONTACT_SVG} strokeWidth={ICON_STROKE_WIDTH_BOLD} aria-hidden="true" />
              )}
              <span className="max-[560px]:hidden">{action.label}</span>
            </button>
          )}
        </div>
        <p className="max-[560px]:hidden text-small opacity-70 m-0 shrink-0">{note}</p>
      </div>
    </footer>
  );
}
