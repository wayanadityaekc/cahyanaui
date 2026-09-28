'use client';

import { ChevronDown } from 'lucide-react';
import { cn } from '../lib/cn.js';
import usePopover, { POP_PANEL, popState } from './usePopover.js';

/**
 * The page links IN the bar on wide screens (ported from CUE, WO1, approved 28 Sep
 * 2026). Phones keep the drawer; this list is `max-[992px]:hidden`. The breakpoint
 * pairs with NavbarShell's `min-[993px]:hidden` on the burger.
 *
 *   links     [{ href, label }] | [{ label, items: [{ href, label }] }]
 *             same shape as NavbarShell's `links`, so a site passes one array to both.
 *             An `items` entry becomes a dropdown that opens on hover AND click.
 *   isActive  (href) => boolean - the app owns routing
 *   linkAs    the link component; defaults to 'a'
 */
const LINK = (active) =>
  'inline-flex items-center gap-1 h-[var(--btn-h)] px-3 rounded-[var(--r-md)] text-small no-underline font-body ' +
  'bg-transparent border-none cursor-pointer hover:bg-cream ' +
  '[transition:background-color_var(--dur)_var(--ease),scale_var(--dur-fast)_var(--ease)] ' +
  (active ? 'font-semibold text-green bg-cream' : 'font-medium text-gold');

function Dropdown({ item, isActive, Link }) {
  const { open, setOpen, ref } = usePopover();
  const active = item.items.some((s) => isActive(s.href));
  return (
    <li className="relative" ref={ref} onMouseEnter={() => setOpen(true)} onMouseLeave={() => setOpen(false)}>
      <button type="button" aria-haspopup="menu" aria-expanded={open} className={LINK(active)} onClick={() => setOpen((v) => !v)}>
        {item.label}
        <ChevronDown className={cn('w-[var(--icon-sm)] h-[var(--icon-sm)] transition-[rotate] duration-200', open && 'rotate-180')} strokeWidth={1.8} aria-hidden="true" />
      </button>
      {/* pt, not a gap, so the pointer can travel from trigger to panel without
          leaving the hover area. The wrapper hugs the trigger. */}
      <div className={cn('absolute left-0 top-full pt-[var(--space-1)] z-[130]', !open && 'pointer-events-none')}>
        <ul role="menu" className={cn(POP_PANEL, 'static list-none m-0 w-[12rem]', popState(open))}>
          {item.items.map((s) => (
            <li key={s.href}>
              <Link role="menuitem" href={s.href} className={cn('flex w-full px-3 py-[0.55rem] rounded-[var(--r-md)] text-small no-underline hover:bg-cream', isActive(s.href) ? 'font-semibold text-green bg-cream' : 'font-medium text-gold')}>
                {s.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </li>
  );
}

export default function DesktopNav({ links = [], isActive = () => false, linkAs: Link = 'a', className }) {
  return (
    <ul className={cn('max-[992px]:hidden flex items-center gap-1 list-none m-0 p-0 mr-auto ml-2', className)} data-desktop-nav>
      {links.map((l) =>
        l.items ? (
          <Dropdown key={l.label} item={l} isActive={isActive} Link={Link} />
        ) : (
          <li key={l.href}>
            <Link href={l.href} className={LINK(isActive(l.href))}>{l.label}</Link>
          </li>
        ),
      )}
    </ul>
  );
}
