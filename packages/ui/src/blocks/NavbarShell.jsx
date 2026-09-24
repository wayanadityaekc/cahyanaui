'use client';

import { useEffect, useRef, useState } from 'react';
import { cn } from '../lib/cn.js';
import useBodyLock from '../lib/useBodyLock.js';
import Collapse from './Collapse.jsx';
import {
  NAV_BURGER_BAR,
  NAV_CLOSE,
  NAV_LI,
  NAV_ROW_END,
  NAV_SUBLIST,
  NAV_SUBTRIGGER,
  NAV_DRAWER,
  NAV_DRAWER_HEAD,
  NAV_HEADER,
  NAV_ICON,
  NAV_ROW,
  NAV_SCRIM,
  NAV_SUBLINK,
  navLink,
} from './navbarClasses.js';

/**
 * The site header, as a shell. It owns the behaviour and the shape; a site
 * passes in what goes in the slots.
 *
 *   logo          node - the brand link at the left
 *   actions       node - the icon cluster (chat, cart). Use NAV_ICON on each.
 *   drawerHead    { icon, title, sub, aside } - the drawer's top row. `aside`
 *                 is anything that must sit at its right-hand end BESIDE the
 *                 close button.
 *   fields        node - a row of controls under the head (CUE puts Guests,
 *                 Pickup area and Currency here). Currency belongs in this row
 *                 rather than in the head: measured on CUE, four things in the
 *                 head row at 390px wrapped the name onto a second line.
 *                 CUE puts an account there and a currency picker in `aside`;
 *                 the villa site puts a heading. Same row, same measurements.
 *   cta           node, or (close) => node - the drawer's one primary button.
 *                 Use the function form when the action must also shut the
 *                 drawer: opening a booking sheet while the drawer still sits
 *                 over it is a state nobody asked for, and the shell owns
 *                 `close`, so it has to hand it out.
 *   links         [{ href, label, icon, end }] | [{ label, icon, items: [...] }]
 *                 `icon` is a node - an icon per row, sized by MENU_ROW_BOX.
 *                 `end` rides the right-hand end of the row (a count badge).
 *   drawerFoot    node - pinned to the bottom of the drawer
 *   isActive      (href) => boolean - the app owns routing, so it owns this
 *   linkAs        the link component (pass next/link's Link); defaults to 'a'
 *
 * WHY A SHELL AND NOT TWO NAVBARS. What has to match between the sister sites
 * is not the wording - it is the drawer's width, its one hairline, the
 * hamburger that becomes an X, the spacing pair on the icons, and the two
 * height variables. Those live here once. Two copies of a navbar diverge by a
 * few pixels per edit until they stop looking like one brand, which is exactly
 * what happened before this existed.
 *
 * NO next/link IMPORT. A UI library that imports the framework can only be used
 * by that framework, and a plain <a> is the correct default for a shell.
 */
export default function NavbarShell({
  logo,
  actions = null,
  extras = null,
  drawerHead,
  fields = null,
  cta = null,
  links = [],
  drawerFoot = null,
  isActive = () => false,
  linkAs: Link = 'a',
  closeIcon = null,
  drawerId = 'nav-menu',
  className,
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [openSub, setOpenSub] = useState(null);
  const navRef = useRef(null);
  const burgerRef = useRef(null);
  const headerRef = useRef(null);

  // Publish the bar's height so the page below can reserve room for it.
  useEffect(() => {
    const el = headerRef.current;
    if (!el) return undefined;
    const root = document.documentElement;
    let max = 0;
    const set = () => {
      const h = el.offsetHeight;
      root.style.setProperty('--header-h', `${h}px`);
      if (h > max) {
        max = h;
        root.style.setProperty('--header-h-max', `${h}px`);
      }
    };
    // A viewport change gives a different natural height, and rotating a phone
    // must not keep a desktop maximum, so the ceiling is re-measured there.
    const onResize = () => { max = 0; set(); };
    set();
    const ro = new ResizeObserver(set);
    ro.observe(el);
    window.addEventListener('resize', onResize);
    return () => {
      ro.disconnect();
      window.removeEventListener('resize', onResize);
    };
  }, []);

  // Tapping outside, or Escape, closes the drawer.
  useEffect(() => {
    if (!menuOpen) return undefined;
    const onDoc = (e) => {
      const inNav = navRef.current && navRef.current.contains(e.target);
      const onBurger = burgerRef.current && burgerRef.current.contains(e.target);
      if (!inNav && !onBurger) setMenuOpen(false);
    };
    const onKey = (e) => { if (e.key === 'Escape') setMenuOpen(false); };
    document.addEventListener('click', onDoc);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('click', onDoc);
      document.removeEventListener('keydown', onKey);
    };
  }, [menuOpen]);

  useBodyLock(menuOpen);

  const close = () => setMenuOpen(false);
  // A slot may be a node, or a render function that wants `close`.
  const slot = (v) => (typeof v === 'function' ? v(close) : v);

  return (
    <header ref={headerRef} className={cn(NAV_HEADER, className)}>
      <div className={NAV_ROW}>
        {logo}
        {actions}
        {extras}

        <nav ref={navRef}>
          <ul
            id={drawerId}
            className={cn(
              NAV_DRAWER,
              menuOpen ? 'translate-x-0 pointer-events-auto' : 'translate-x-full pointer-events-none',
            )}
          >
            {drawerHead ? (
              <li className={NAV_DRAWER_HEAD}>
                {drawerHead.icon ? (
                  <span
                    className="w-[38px] h-[38px] rounded-[50%] bg-cream [border:1px_solid_var(--line)] grid place-items-center text-gold flex-none"
                    aria-hidden="true"
                  >
                    {drawerHead.icon}
                  </span>
                ) : null}
                <span className="flex flex-col min-w-0">
                  <b className="text-strong font-semibold text-gold leading-[1.25]">{drawerHead.title}</b>
                  {/* nowrap + ellipsis: this line is a subtitle, and a second
                      line here makes the whole row taller than CUE's. */}
                  <span className="text-small text-muted overflow-hidden text-ellipsis whitespace-nowrap">
                    {drawerHead.sub}
                  </span>
                </span>
                {drawerHead.aside}
                <button type="button" className={NAV_CLOSE} aria-label="Close menu" onClick={close}>
                  {closeIcon}
                </button>
              </li>
            ) : null}

            {fields ? <li className="grid grid-cols-2 gap-[10px] pt-[0.9rem] pb-[0.4rem]">{fields}</li> : null}

            {cta ? <li className={fields ? 'pb-4' : 'pt-[0.9rem] pb-4'}>{slot(cta)}</li> : null}

            {links.map((l) => {
              if (l.items) {
                const open = openSub === l.label;
                return (
                  <li key={l.label} className={cn('relative', NAV_LI)}>
                    <button
                      type="button"
                      data-submenu
                      className={NAV_SUBTRIGGER}
                      aria-expanded={open}
                      onClick={() => setOpenSub(open ? null : l.label)}
                    >
                      {l.icon}
                      {l.label}
                      <span className={cn(NAV_ROW_END, 'inline-block transition-[rotate] duration-200 ease-[ease]', open && 'rotate-90')}>
                        &rsaquo;
                      </span>
                    </button>
                    <Collapse open={open}>
                      <ul className={NAV_SUBLIST}>
                        {l.items.map((s) => (
                          <li key={s.href} className="py-[0.4rem]">
                            <Link href={s.href} onClick={close} className={NAV_SUBLINK}>{s.label}</Link>
                          </li>
                        ))}
                      </ul>
                    </Collapse>
                  </li>
                );
              }
              return (
                <li key={l.href} className={NAV_LI}>
                  <Link href={l.href} onClick={close} className={navLink(isActive(l.href))}>
                    {l.icon}
                    {l.label}
                    {l.end}
                  </Link>
                </li>
              );
            })}

            {drawerFoot ? <li className="mt-auto pt-4">{slot(drawerFoot)}</li> : null}
          </ul>
        </nav>

        <button
          type="button"
          id="hamburger"
          ref={burgerRef}
          className="relative flex flex-col gap-[5px] w-7 bg-transparent border-none cursor-pointer max-[992px]:w-[1.65rem] max-[992px]:h-[2.2rem] max-[992px]:ml-1 max-[992px]:items-center max-[992px]:justify-center"
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={menuOpen}
          aria-controls={drawerId}
          onClick={() => setMenuOpen((v) => !v)}
        >
          <span className={cn(NAV_BURGER_BAR, menuOpen && 'translate-y-[7px] rotate-45')} />
          <span className={cn(NAV_BURGER_BAR, menuOpen ? 'opacity-0' : 'opacity-100')} />
          <span className={cn(NAV_BURGER_BAR, menuOpen && '-translate-y-[7px] -rotate-45')} />
        </button>
      </div>

      <div className={cn(NAV_SCRIM, menuOpen ? 'opacity-100 visible' : 'opacity-0 invisible')} onClick={close} />
    </header>
  );
}
