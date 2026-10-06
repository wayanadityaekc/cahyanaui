import { cn } from '../lib/cn.js';

/**
 * One featured item on a dark card beside a plain list of the others. Built for
 * add-ons, but it holds anything with an icon, a name, a line and an action.
 *
 *   featured   { icon, label, title, text, action }  the dark card; action is a rendered node
 *   items      [{ icon, title, text, meta, action }]  the list rows
 */
export default function FeaturedList({ featured, items = [], className }) {
  return (
    <div className={cn('grid gap-6 min-[993px]:grid-cols-2 min-[993px]:gap-10', className)}>
      {featured ? (
        <div className="flex flex-col justify-between gap-10 rounded-sm bg-gold p-6 text-white min-[993px]:min-h-[24rem] min-[993px]:p-9">
          <span className="flex items-center justify-center w-11 h-11 rounded-sm bg-white/12 [&>svg]:w-[22px] [&>svg]:h-[22px]">{featured.icon}</span>
          <div>
            {featured.label ? <p className="m-0 mb-1.5 text-label text-white/80">{featured.label}</p> : null}
            <h3 className="m-0 text-h2 font-semibold text-white tracking-[-0.015em] leading-[var(--lh-heading)]">{featured.title}</h3>
            <p className="mt-3 mb-6 max-w-[40ch] text-strong leading-[1.55] text-white/85">{featured.text}</p>
            {featured.action}
          </div>
        </div>
      ) : null}
      <ul className="m-0 p-0 list-none [border-top:1px_solid_var(--line)]">
        {items.map(({ icon, title, text, meta, action }) => (
          <li key={title} className="flex items-center gap-4 py-4 [border-bottom:1px_solid_var(--line)]">
            <span className="flex items-center justify-center shrink-0 w-11 h-11 rounded-sm bg-cream text-gold [&>svg]:w-[22px] [&>svg]:h-[22px]">{icon}</span>
            <div className="flex-1 min-w-0">
              <b className="block text-strong font-semibold text-gold">{title}</b>
              <span className="block mt-0.5 text-small leading-[1.5] text-muted">{text}</span>
              {meta ? <span className="block mt-0.5 text-label text-muted">{meta}</span> : null}
            </div>
            <div className="shrink-0">{action}</div>
          </li>
        ))}
      </ul>
    </div>
  );
}
