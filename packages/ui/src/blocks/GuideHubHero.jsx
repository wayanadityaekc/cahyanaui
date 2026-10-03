'use client';

import { useState } from 'react';
import { ChevronDown, Menu, Search } from 'lucide-react';
import { cn } from '../lib/cn.js';
import PopPanel from './PopPanel.jsx';

// CUE's guide hub opener: a photo band with crumb, title, intro, and one bordered bar holding the
// category menu and the search field. Left-aligned, content width follows the page container.
const BAND =
  'relative flex items-center min-h-[60vh] px-[var(--container-x)] pb-[var(--space-6)] pt-12 text-left bg-green bg-cover bg-center';
const MENU =
  'absolute right-0 top-[calc(100%_+_6px)] min-w-[220px] bg-surface-raised [border:1px_solid_var(--line)] rounded-md overflow-hidden z-20';
const MENU_ROW =
  'flex items-center gap-[0.6rem] py-[0.7rem] px-4 no-underline text-green font-semibold text-h3 [border-top:1px_solid_var(--line)] ' +
  'first:[border-top:none] hover:bg-[rgba(34,32,28,0.08)] [&_svg]:w-[var(--icon-sm)] [&_svg]:h-[var(--icon-sm)] [&_svg]:text-gold-d [&_svg]:shrink-0';

/**
 *   image       photo url
 *   crumb       node (a <Breadcrumb> with white-on-photo link classes)
 *   categories  [{ id, label, Icon? }]  menu rows, each links to #id
 *   query / onQuery   the search field is controlled by the site
 *   pop         the site's own animation wrapper for the floating menu (PopMenu)
 *   labels      { categories, search, searchAria }
 */
export default function GuideHubHero({
  image, crumb = null, title, text, categories = [], query = '', onQuery = () => {}, pop = null,
  labels = {},
}) {
  const [open, setOpen] = useState(false);
  const t = { categories: 'Categories', search: 'Search', searchAria: 'Search guides', ...labels };
  return (
    <section className={BAND} style={{ backgroundImage: `linear-gradient(rgba(0,0,0,0.4),rgba(0,0,0,0.55)),url(${image})`, backgroundPosition: 'center 60%' }}>
      <div className="relative z-[1] w-full mx-auto max-w-[calc(var(--container)_-_2_*_var(--container-x))]">
        {crumb}
        <h1 className="font-head text-[length:var(--fs-display)] leading-[var(--lh-heading)] text-white font-bold tracking-[-0.01em]">{title}</h1>
        <p className="mt-4 max-w-[var(--container-read)] text-cream font-body text-body leading-[var(--lh-body)]">{text}</p>
        <div className="flex items-stretch max-w-[640px] mt-6 [border:1.5px_solid_var(--color-gold)] rounded-lg bg-surface-raised">
          {categories.length > 0 && (
            <div className="relative flex-[0_0_auto] flex order-2 [border-left:1px_solid_var(--line)]">
              <button
                type="button"
                aria-label={t.categories}
                aria-haspopup="true"
                aria-expanded={open}
                onClick={() => setOpen((value) => !value)}
                className="min-h-[3.15rem] box-border flex items-center gap-[0.35rem] px-[0.95rem] [border:none] [border-radius:0_var(--r-md)_var(--r-md)_0] bg-transparent font-body text-[1rem] font-semibold text-green cursor-pointer whitespace-nowrap [transition:background-color_var(--dur)_ease,scale_var(--dur-fast)_var(--ease)] hover:bg-[rgba(34,32,28,0.08)] [&_span]:hidden"
              >
                <Menu className="w-[var(--icon-md)] h-[var(--icon-md)]" aria-hidden="true" />
                <span>{t.categories}</span>
                <ChevronDown className={cn('w-4 h-4 shrink-0 text-muted [transition:transform_var(--dur)_ease]', open && '[transform:rotate(180deg)]')} aria-hidden="true" />
              </button>
              <PopPanel pop={pop} open={open} className={MENU}>
                {categories.map(({ id, label, Icon }) => (
                  <a className={MENU_ROW} href={`#${id}`} key={id} onClick={() => setOpen(false)}>
                    {Icon && <span><Icon strokeWidth={1.7} aria-hidden="true" /></span>}
                    {label}
                  </a>
                ))}
              </PopPanel>
            </div>
          )}
          <div className="relative flex-1">
            <div className="flex items-center gap-[0.7rem] py-[0.85rem] px-[1.1rem] min-h-[var(--field-h)] box-border">
              <Search className="w-[var(--icon-md)] h-[var(--icon-md)] shrink-0 text-gold-d" aria-hidden="true" />
              <input
                type="text"
                className="flex-1 min-w-0 border-none [outline:none] bg-transparent font-body text-field text-green placeholder:text-muted"
                placeholder={t.search}
                aria-label={t.searchAria}
                autoComplete="off"
                value={query}
                onChange={(event) => onQuery(event.target.value)}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
