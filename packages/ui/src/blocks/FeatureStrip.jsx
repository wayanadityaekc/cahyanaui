import { cn } from '../lib/cn.js';

// Full class strings, because Tailwind only generates classes it can read in the source.
const COLUMNS = {
  3: 'min-[993px]:grid-cols-3',
  4: 'min-[993px]:grid-cols-4',
  5: 'min-[993px]:grid-cols-5',
  6: 'min-[993px]:grid-cols-6',
};

/**
 * A single row of short facts, each with an icon: the "villa highlights" and
 * "why stay with us" strips of a hotel homepage. Two columns on a phone, one
 * row from 993px. Nothing scrolls sideways.
 *
 *   items    [{ icon, title, text }]   icon is a rendered node
 *   columns  3 | 4 | 5 | 6 on desktop
 */
export default function FeatureStrip({ items = [], columns = 6, className }) {
  if (!items.length) return null;
  return (
    <ul className={cn('grid grid-cols-2 gap-y-6 list-none p-0 m-0 min-[560px]:grid-cols-3', COLUMNS[columns] || COLUMNS[6], className)}>
      {items.map(({ icon = null, title, text }) => (
        <li key={title} className="flex flex-col items-center gap-2 px-3 text-center min-[993px]:[&:not(:first-child)]:[border-left:1px_solid_var(--line)]">
          {icon ? <span className="flex items-center justify-center w-10 h-10 text-gold [&>svg]:w-[var(--icon-lg)] [&>svg]:h-[var(--icon-lg)]">{icon}</span> : null}
          <span className="text-small font-medium text-gold">{title}</span>
          {text ? <span className="text-label text-muted leading-[1.4]">{text}</span> : null}
        </li>
      ))}
    </ul>
  );
}
