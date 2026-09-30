'use client';

import { ChevronDown } from 'lucide-react';
import { cn } from '../lib/cn.js';
import useDisclosure from '../lib/useDisclosure.js';
import PopPanel from './PopPanel.jsx';
import {
  NAV_CHEVRON,
  NAV_DESK,
  NAV_POP_LIST,
  NAV_POP_WRAP,
  navDeskLink,
  navPopLink,
} from './navbarClasses.js';

// One bar dropdown: a disclosure that opens on hover and on click.
function NavDropdown({ label, items = [], isActive, linkAs: Link, pop = null }) {
  const { open, setOpen, boxRef, triggerRef, panelId } = useDisclosure();
  const active = items.some((item) => isActive(item.href));

  return (
    <li
      className="relative"
      ref={boxRef}
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <button
        type="button"
        ref={triggerRef}
        aria-expanded={open}
        aria-controls={panelId}
        className={navDeskLink(active)}
        onClick={() => setOpen((wasOpen) => !wasOpen)}
      >
        {label}
        <ChevronDown className={cn(NAV_CHEVRON, open && 'rotate-180')} strokeWidth={1.8} aria-hidden="true" />
      </button>
      <PopPanel pop={pop} open={open} className={NAV_POP_WRAP}>
        <ul id={panelId} className={NAV_POP_LIST}>
          {items.map((item) => (
            <li key={item.href}>
              {/* Client-side links keep the navbar mounted, so a pick closes the panel itself. */}
              <Link href={item.href} className={navPopLink(isActive(item.href))} onClick={() => setOpen(false)}>
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </PopPanel>
    </li>
  );
}

// Desktop page links in the bar (>=993); takes the same `links` as the drawer.
export default function NavDesktop({ links = [], isActive = () => false, linkAs = 'a', pop = null }) {
  const Link = linkAs;
  return (
    <ul className={NAV_DESK} data-desktop-nav>
      {links.map((link) => (link.items
        ? <NavDropdown key={link.label} label={link.label} items={link.items} isActive={isActive} linkAs={Link} pop={pop} />
        : (
          <li key={link.href}>
            <Link href={link.href} className={navDeskLink(isActive(link.href))}>{link.label}</Link>
          </li>
        )))}
    </ul>
  );
}
