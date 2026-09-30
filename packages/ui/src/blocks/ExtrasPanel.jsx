'use client';

import { Plus, Trash2 } from 'lucide-react';
import { ROW_RULE } from '../primitives/separatorClasses.js';

const ICON = 'w-[var(--icon-sm)] h-[var(--icon-sm)] shrink-0';
const TOGGLE_ON =
  'inline-flex items-center gap-1.5 shrink-0 rounded-pill px-3 h-8 border-none bg-cta text-white text-small font-semibold cursor-pointer';
const TOGGLE_OFF =
  'inline-flex items-center gap-1.5 shrink-0 rounded-pill px-3 h-8 [border:1px_solid_var(--line)] bg-surface-raised text-gold text-small font-semibold cursor-pointer hover:[border-color:var(--color-cta)]';

function ExtraRow({ id, title = '', href = '', meta = '', price = null, added = false, onToggle = () => {}, fields = null, linkAs = 'a' }) {
  const Link = linkAs;
  return (
    <li className={`py-3 ${ROW_RULE}`} data-extra={id}>
      <div className="flex items-center justify-between gap-4">
        <div className="min-w-0">
          {href
            ? <Link href={href} className="text-body font-medium text-gold hover:text-cta" target={/^https?:/.test(href) ? '_blank' : undefined} rel={/^https?:/.test(href) ? 'noopener' : undefined}>{title}</Link>
            : <span className="text-body font-medium text-gold">{title}</span>}
          {meta ? <p className="m-0 mt-0.5 text-label text-muted">{meta}</p> : null}
        </div>
        <div className="flex items-center gap-3 shrink-0">
          {price !== null ? <span className="text-small font-semibold text-amber" data-extra-price>{price}</span> : null}
          <button type="button" onClick={onToggle} aria-pressed={added} aria-label={`${added ? 'Remove' : 'Add'} ${title}`} className={added ? TOGGLE_ON : TOGGLE_OFF}>
            {added
              ? <><Trash2 className={ICON} strokeWidth={1.8} aria-hidden="true" /> Remove</>
              : <><Plus className={ICON} strokeWidth={1.8} aria-hidden="true" /> Add</>}
          </button>
        </div>
      </div>
      {added && fields ? <div className="grid grid-cols-2 max-[480px]:grid-cols-1 gap-3 mt-3">{fields}</div> : null}
    </li>
  );
}

// "Add to your stay": groups of add-on rows; the site passes prices, the date/time fields and the handlers.
export default function ExtrasPanel({ groups = [], linkAs = 'a' }) {
  if (!groups.length) return <p className="m-0 text-body text-muted">Sorry, we could not load this information. Please try again.</p>;
  return (
    <div className="flex flex-col gap-6" data-extras>
      {groups.map((group) => (
        <section key={group.id} aria-labelledby={`extras-${group.id}`} data-extras-group={group.id}>
          <h3 id={`extras-${group.id}`} className="m-0 text-h3 font-semibold text-gold">{group.title}</h3>
          {group.note ? <p className="m-0 mt-1 text-label text-muted">{group.note}</p> : null}
          <ul className="list-none m-0 p-0 mt-2 flex flex-col">
            {group.rows.map((row) => <ExtraRow key={row.id} linkAs={linkAs} {...row} />)}
          </ul>
        </section>
      ))}
    </div>
  );
}
