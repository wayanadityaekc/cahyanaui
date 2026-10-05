import { cn } from '../lib/cn.js';

/**
 * A "Find us on" row of round icon links (listing sites and social accounts).
 * Entries without an href are skipped, so a channel with no real address yet
 * never shows as a dead icon.
 *
 *   label   the small line before the icons
 *   links   [{ name, href, icon }]  icon is a rendered node; name is the aria-label
 */
export default function FindUsOn({ label = '', links = [], className }) {
  const live = links.filter((link) => link.href);
  if (!live.length) return null;
  return (
    <div className={cn('flex flex-wrap items-center gap-x-4 gap-y-3', className)}>
      {label ? <span className="text-small font-medium text-green">{label}</span> : null}
      <ul className="flex flex-wrap items-center gap-2 list-none p-0 m-0">
        {live.map(({ name, href, icon }) => (
          <li key={name}>
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={name}
              title={name}
              className="flex items-center justify-center w-10 h-10 rounded-pill text-gold [border:1px_solid_var(--line)] bg-surface-raised transition-colors duration-200 hover:bg-cream [&>svg]:w-5 [&>svg]:h-5"
            >
              {icon}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
