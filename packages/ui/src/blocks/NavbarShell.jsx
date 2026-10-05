'use client';

import { useEffect, useRef, useState } from 'react';
import { X } from 'lucide-react';
import { cn } from '../lib/cn.js';
import useBodyLock from '../lib/useBodyLock.js';
import Collapse from './Collapse.jsx';
import NavDesktop from './NavDesktop.jsx';
import {
  NAV_BURGER,
  NAV_BURGER_BAR,
  NAV_CLOSE,
  NAV_DRAWER,
  NAV_DRAWER_HEAD,
  NAV_HEADER,
  NAV_LI,
  NAV_ROW,
  NAV_ROW_END,
  NAV_SCRIM,
  NAV_SUBLINK,
  NAV_SUBLIST,
  NAV_SUBTRIGGER,
  navLink,
} from './navbarClasses.js';

// The site header as a shell (CUE's WO1 navbar): burger + drawer on phones, links in the bar on desktop, account slot last.
// Slots: logo, actions (chat/cart), extras, account, topBar (promo strip), fields, links, drawerFoot; no next/link import, pass linkAs.
export default function NavbarShell({
  logo,
  actions = null,
  extras = null,
  account = null,
  topBar = null,
  fields = null,
  links = [],
  drawerFoot = null,
  drawerTitle = 'Menu',
  isActive = () => false,
  linkAs = 'a',
  pop = null,
  drawerId = 'nav-menu',
  overlay = false,
  className,
}) {
  const Link = linkAs;
  const [menuOpen, setMenuOpen] = useState(false);
  const [openSub, setOpenSub] = useState(null);
  const navRef = useRef(null);
  const burgerRef = useRef(null);
  const headerRef = useRef(null);
  const barRef = useRef(null);
  // `overlay`: the bar floats clear over the hero at the top of the page and turns solid after a short scroll.
  const [atTop, setAtTop] = useState(true);

  // Header heights on :root (nav row, nav + top bar, top bar); set on resize only, never on scroll.
  useEffect(() => {
    const header = headerRef.current;
    if (!header) return undefined;
    const root = document.documentElement;
    let max = 0;
    function set() {
      const height = header.offsetHeight;
      const bar = barRef.current ? barRef.current.offsetHeight : 0;
      root.style.setProperty('--header-h', `${height - bar}px`);
      root.style.setProperty('--tripbar-h', `${bar}px`);
      if (height > max) {
        max = height;
        root.style.setProperty('--header-h-max', `${height}px`);
      }
    }
    // A viewport change resets the max so a rotated phone re-measures.
    function onResize() { max = 0; set(); }
    set();
    const resizeObserver = new ResizeObserver(set);
    resizeObserver.observe(header);
    window.addEventListener('resize', onResize);
    return () => {
      resizeObserver.disconnect();
      window.removeEventListener('resize', onResize);
    };
  }, []);

  useEffect(() => {
    if (!overlay) return undefined;
    function onScroll() { setAtTop(window.scrollY < 40); }
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [overlay]);

  // Tapping outside, or Escape, closes the drawer.
  useEffect(() => {
    if (!menuOpen) return undefined;
    function onDoc(e) {
      const inNav = navRef.current && navRef.current.contains(e.target);
      const onBurger = burgerRef.current && burgerRef.current.contains(e.target);
      // Clicks inside a portaled Select popup close only the popup, not the drawer.
      const inPopup = e.target.closest && e.target.closest('[data-portal]');
      if (!inNav && !onBurger && !inPopup) setMenuOpen(false);
    }
    function onKey(e) {
      if (e.key !== 'Escape') return;
      // An open Select popup takes this Escape to close itself first.
      if (document.querySelector('[data-portal="select"][data-open]')) return;
      setMenuOpen(false);
    }
    document.addEventListener('click', onDoc);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('click', onDoc);
      document.removeEventListener('keydown', onKey);
    };
  }, [menuOpen]);

  useBodyLock(menuOpen);

  function close() { setMenuOpen(false); }

  return (
    <header ref={headerRef} className={cn(NAV_HEADER, className)} data-overlay={overlay || undefined} data-clear={overlay && atTop && !menuOpen ? '' : undefined}>
      {topBar ? <div ref={barRef}>{topBar}</div> : null}
      <div className={NAV_ROW}>
        <button
          type="button"
          id="hamburger"
          ref={burgerRef}
          className={NAV_BURGER}
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={menuOpen}
          aria-controls={drawerId}
          onClick={() => setMenuOpen((wasOpen) => !wasOpen)}
        >
          <span className={cn(NAV_BURGER_BAR, menuOpen && 'translate-y-[6px] rotate-45')} />
          <span className={cn(NAV_BURGER_BAR, menuOpen ? 'opacity-0' : 'opacity-100')} />
          <span className={cn(NAV_BURGER_BAR, menuOpen && '-translate-y-[6px] -rotate-45')} />
        </button>

        {logo}
        <NavDesktop links={links} isActive={isActive} linkAs={Link} pop={pop} />
        {actions}
        {extras}

        <nav ref={navRef}>
          <ul
            id={drawerId}
            className={cn(NAV_DRAWER, menuOpen ? 'translate-x-0 pointer-events-auto' : '-translate-x-full pointer-events-none')}
          >
            {/* The x is the only visible close control while the drawer covers the burger. */}
            <li className={NAV_DRAWER_HEAD}>
              <b className="text-strong font-semibold text-gold">{drawerTitle}</b>
              <button type="button" className={NAV_CLOSE} aria-label="Close menu" onClick={close}>
                <X strokeWidth={2} aria-hidden="true" />
              </button>
            </li>

            {fields ? <li className="pt-[0.9rem] pb-4">{fields}</li> : null}

            {links.map((link) => {
              if (link.items) {
                const open = openSub === link.label;
                return (
                  <li key={link.label} className={cn('relative', NAV_LI)}>
                    <button
                      type="button"
                      data-submenu
                      className={NAV_SUBTRIGGER}
                      aria-expanded={open}
                      onClick={() => setOpenSub(open ? null : link.label)}
                    >
                      {link.icon}
                      {link.label}
                      <span className={cn(NAV_ROW_END, 'inline-block transition-[rotate] duration-200 ease-[ease]', open && 'rotate-90')}>
                        &rsaquo;
                      </span>
                    </button>
                    <Collapse open={open}>
                      <ul className={NAV_SUBLIST}>
                        {link.items.map((item) => (
                          <li key={item.href} className="py-[0.4rem]">
                            <Link href={item.href} onClick={close} className={NAV_SUBLINK}>{item.label}</Link>
                          </li>
                        ))}
                      </ul>
                    </Collapse>
                  </li>
                );
              }
              return (
                <li key={link.href} className={NAV_LI}>
                  <Link href={link.href} onClick={close} className={navLink(isActive(link.href))}>
                    {link.icon}
                    {link.label}
                    {link.end}
                  </Link>
                </li>
              );
            })}

            {drawerFoot ? <li className="mt-auto pt-4">{typeof drawerFoot === 'function' ? drawerFoot(close) : drawerFoot}</li> : null}
          </ul>
        </nav>

        {account}
      </div>

      <div className={cn(NAV_SCRIM, menuOpen ? 'opacity-100 visible' : 'opacity-0 invisible')} onClick={close} />
    </header>
  );
}
