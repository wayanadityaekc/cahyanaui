'use client';

import { useEffect, useRef, useState } from 'react';
import { X as CloseIcon } from 'lucide-react';
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
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [openSub, setOpenSub] = useState(null);
  const navRef = useRef(null);
  const burgerRef = useRef(null);
  const headerRef = useRef(null);
  const barRef = useRef(null);
  const [isAtTop, setIsAtTop] = useState(true);

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
    function handleWindowResize() {
      max = 0;
      set();
    }
    set();
    const resizeObserver = new ResizeObserver(set);
    resizeObserver.observe(header);
    window.addEventListener('resize', handleWindowResize);
    return () => {
      resizeObserver.disconnect();
      window.removeEventListener('resize', handleWindowResize);
    };
  }, []);

  useEffect(() => {
    if (!overlay) return undefined;
    function handleWindowScroll() {
      const hero = document.querySelector('main > section');
      const barHeight = headerRef.current ? headerRef.current.offsetHeight : 0;
      setIsAtTop(hero ? hero.getBoundingClientRect().bottom > barHeight : window.scrollY < 40);
    }
    handleWindowScroll();
    window.addEventListener('scroll', handleWindowScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleWindowScroll);
  }, [overlay]);

  useEffect(() => {
    if (!isMenuOpen) return undefined;
    function handleDocumentPointerDown(event) {
      const inNav = navRef.current && navRef.current.contains(event.target);
      const onBurger = burgerRef.current && burgerRef.current.contains(event.target);
      const inPopup = event.target.closest && event.target.closest('[data-portal]');
      if (!inNav && !onBurger && !inPopup) setIsMenuOpen(false);
    }
    function handleEscapeKeyDown(event) {
      if (event.key !== 'Escape') return;
      if (document.querySelector('[data-portal="select"][data-open]')) return;
      setIsMenuOpen(false);
    }
    document.addEventListener('click', handleDocumentPointerDown);
    document.addEventListener('keydown', handleEscapeKeyDown);
    return () => {
      document.removeEventListener('click', handleDocumentPointerDown);
      document.removeEventListener('keydown', handleEscapeKeyDown);
    };
  }, [isMenuOpen]);

  useBodyLock(isMenuOpen);

  function close() {
    setIsMenuOpen(false);
  }

  return (
    <header
      ref={headerRef}
      className={cn(NAV_HEADER, className)}
      data-overlay={overlay || undefined}
      data-clear={overlay && isAtTop && !isMenuOpen ? '' : undefined}
    >
      {topBar ? <div ref={barRef}>{topBar}</div> : null}
      <div className={NAV_ROW}>
        <button
          type="button"
          id="hamburger"
          ref={burgerRef}
          className={NAV_BURGER}
          aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={isMenuOpen}
          aria-controls={drawerId}
          onClick={() => setIsMenuOpen((wasOpen) => !wasOpen)}
        >
          <span className={cn(NAV_BURGER_BAR, isMenuOpen && 'translate-y-[6px] rotate-45')} />
          <span className={cn(NAV_BURGER_BAR, isMenuOpen ? 'opacity-0' : 'opacity-100')} />
          <span className={cn(NAV_BURGER_BAR, isMenuOpen && '-translate-y-[6px] -rotate-45')} />
        </button>

        {logo}
        <NavDesktop links={links} isActive={isActive} linkAs={Link} pop={pop} />
        {actions}
        {extras}

        <nav ref={navRef}>
          <ul
            id={drawerId}
            className={cn(
              NAV_DRAWER,
              isMenuOpen ? 'translate-x-0 pointer-events-auto' : '-translate-x-full pointer-events-none',
            )}
          >
            <li className={NAV_DRAWER_HEAD}>
              <b className="text-strong font-semibold text-gold">{drawerTitle}</b>
              <button type="button" className={NAV_CLOSE} aria-label="Close menu" onClick={close}>
                <CloseIcon strokeWidth={2} aria-hidden="true" />
              </button>
            </li>

            {fields ? <li className="pt-[0.9rem] pb-4">{fields}</li> : null}

            {links.map((link) => {
              if (link.items) {
                const isOpen = openSub === link.label;
                return (
                  <li key={link.label} className={cn('relative', NAV_LI)}>
                    {link.href ? (
                      <div className="flex items-center">
                        <Link href={link.href} onClick={close} className={cn(navLink(isActive(link.href)), 'flex-1')}>
                          {link.icon}
                          {link.label}
                        </Link>
                        <button
                          type="button"
                          data-submenu
                          className="grid place-items-center w-10 h-10 p-0 border-0 bg-transparent text-gold text-strong cursor-pointer"
                          aria-expanded={isOpen}
                          aria-label={`${link.label} list`}
                          onClick={() => setOpenSub(isOpen ? null : link.label)}
                        >
                          <span
                            className={cn(
                              'inline-block transition-[rotate] duration-200 ease-[ease]',
                              isOpen && 'rotate-90',
                            )}
                          >
                            &rsaquo;
                          </span>
                        </button>
                      </div>
                    ) : (
                      <button
                        type="button"
                        data-submenu
                        className={NAV_SUBTRIGGER}
                        aria-expanded={isOpen}
                        onClick={() => setOpenSub(isOpen ? null : link.label)}
                      >
                        {link.icon}
                        {link.label}
                        <span
                          className={cn(
                            NAV_ROW_END,
                            'inline-block transition-[rotate] duration-200 ease-[ease]',
                            isOpen && 'rotate-90',
                          )}
                        >
                          &rsaquo;
                        </span>
                      </button>
                    )}
                    <Collapse open={isOpen}>
                      <ul className={NAV_SUBLIST}>
                        {link.items.map((item) => (
                          <li key={item.href} className="py-[0.4rem]">
                            <Link href={item.href} onClick={close} className={NAV_SUBLINK}>
                              {item.label}
                            </Link>
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

            {drawerFoot ? (
              <li className="mt-auto pt-4">{typeof drawerFoot === 'function' ? drawerFoot(close) : drawerFoot}</li>
            ) : null}
          </ul>
        </nav>

        {account}
      </div>

      <div className={cn(NAV_SCRIM, isMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible')} onClick={close} />
    </header>
  );
}
