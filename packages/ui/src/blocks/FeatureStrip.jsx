import { cn } from '../lib/cn.js';

const DEFAULT_COLUMN_COUNT = 6;

const COLUMNS = {
  3: 'min-[993px]:grid-cols-3',
  4: 'min-[993px]:grid-cols-4',
  5: 'min-[993px]:grid-cols-5',
  6: 'min-[993px]:grid-cols-6',
};

export default function FeatureStrip({ items = [], columns = DEFAULT_COLUMN_COUNT, className }) {
  if (!items.length) return null;
  return (
    <ul
      className={cn(
        'grid grid-cols-2 gap-y-6 list-none p-0 m-0 min-[560px]:grid-cols-3',
        COLUMNS[columns] || COLUMNS[6],
        className,
      )}
    >
      {items.map(({ icon = null, title, text }) => (
        <li
          key={title}
          className="flex flex-col items-center gap-2 px-3 text-center min-[993px]:[&:not(:first-child)]:[border-left:1px_solid_var(--line)]"
        >
          {icon ? (
            <span className="flex items-center justify-center w-10 h-10 text-gold [&>svg]:w-[var(--icon-lg)] [&>svg]:h-[var(--icon-lg)]">
              {icon}
            </span>
          ) : null}
          <span className="text-small font-medium text-gold">{title}</span>
          {text ? <span className="text-label text-muted leading-[1.4]">{text}</span> : null}
        </li>
      ))}
    </ul>
  );
}
