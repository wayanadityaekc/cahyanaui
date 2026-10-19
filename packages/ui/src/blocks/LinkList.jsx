import { cn } from '../lib/cn.js';

export default function LinkList({ items = [], linkAs: Link = 'a', className }) {
  return (
    <ul className={cn('flex flex-col list-none', className)}>
      {items.map((it) => {
        const inner = (
          <>
            <span className="min-w-0">
              <span className="block">{it.label}</span>
              {it.blurb ? <span className="block mt-0.5 text-label text-muted">{it.blurb}</span> : null}
            </span>
            <span aria-hidden="true" className="flex-none pl-3 text-muted">&rsaquo;</span>
          </>
        );
        const cls = 'flex items-start justify-between gap-2 py-2.5 text-small text-gold no-underline';
        return (
          <li key={it.id || it.href} className="[border-bottom:1px_solid_var(--line)] last:[border-bottom:none]">
            {it.external ? (
              <a href={it.href} target="_blank" rel="noopener" className={cls}>{inner}</a>
            ) : (
              <Link href={it.href} className={cls}>{inner}</Link>
            )}
          </li>
        );
      })}
    </ul>
  );
}
