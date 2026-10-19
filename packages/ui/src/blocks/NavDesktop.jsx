'use client';

import { ChevronDown } from 'lucide-react';
import { cn } from '../lib/cn.js';
import useDisclosure from '../lib/useDisclosure.js';
import PopPanel from './PopPanel.jsx';
import { NAV_CHEVRON, NAV_DESK, NAV_POP_LIST, NAV_POP_WRAP, navDeskLink, navPopLink } from './navbarClasses.js';

const ICON_STROKE_WIDTH_BOLD = 1.8;

function NavDropdown({ label, href = '', items = [], isActive, linkAs: Link, pop = null }) {
  const { open, setOpen, boxRef, triggerRef, panelId } = useDisclosure();
  const active = (href && isActive(href)) || items.some((item) => isActive(item.href));

  return (
    <li className="relative" ref={boxRef} onMouseEnter={() => setOpen(true)} onMouseLeave={() => setOpen(false)}>
      {href ? (
        <span className={cn(navDeskLink(active), 'pr-1')}>
          <Link href={href} className="no-underline text-inherit">
            {label}
          </Link>
          <button
            type="button"
            ref={triggerRef}
            aria-expanded={open}
            aria-controls={panelId}
            aria-label={`${label} list`}
            className="grid place-items-center w-6 h-6 p-0 border-0 bg-transparent text-inherit cursor-pointer"
            onClick={() => setOpen((wasOpen) => !wasOpen)}
          >
            <ChevronDown
              className={cn(NAV_CHEVRON, open && 'rotate-180')}
              strokeWidth={ICON_STROKE_WIDTH_BOLD}
              aria-hidden="true"
            />
          </button>
        </span>
      ) : (
        <button
          type="button"
          ref={triggerRef}
          aria-expanded={open}
          aria-controls={panelId}
          className={navDeskLink(active)}
          onClick={() => setOpen((wasOpen) => !wasOpen)}
        >
          {label}
          <ChevronDown
            className={cn(NAV_CHEVRON, open && 'rotate-180')}
            strokeWidth={ICON_STROKE_WIDTH_BOLD}
            aria-hidden="true"
          />
        </button>
      )}
      <PopPanel pop={pop} open={open} className={NAV_POP_WRAP}>
        <ul id={panelId} className={NAV_POP_LIST}>
          {items.map((item) => (
            <li key={item.href}>
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

export default function NavDesktop({ links = [], isActive = () => false, linkAs = 'a', pop = null }) {
  const Link = linkAs;
  return (
    <ul className={NAV_DESK} data-desktop-nav>
      {links.map((link) =>
        link.items ? (
          <NavDropdown
            key={link.label}
            label={link.label}
            href={link.href}
            items={link.items}
            isActive={isActive}
            linkAs={Link}
            pop={pop}
          />
        ) : (
          <li key={link.href}>
            <Link href={link.href} className={navDeskLink(isActive(link.href))}>
              {link.label}
            </Link>
          </li>
        ),
      )}
    </ul>
  );
}
