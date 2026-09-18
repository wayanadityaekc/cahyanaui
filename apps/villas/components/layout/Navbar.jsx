'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { MessageCircle } from 'lucide-react';
import Logo from '@/components/ui/Logo';
import CurrencyPicker from '@/components/ui/CurrencyPicker';
import useBodyLock from '@/components/ui/useBodyLock';
import { Collapse } from '@/components/ui/Reveal';
import { useBooking } from '@/components/providers/BookingProvider';
import { WHATSAPP_LINK } from '@/lib/constants';

// Navbar — CUE's own navbar shell (components/layout/Navbar.jsx there), with
// this site's content in it. One hamburger opening one right-hand drawer at
// EVERY width, which is the decision CUE settled on in Sep 2026; there is no
// separate inline desktop nav row on either site.
//
// What came across from CUE, and why each piece is the way it is:
//
// - The bar itself: logo left with mr-auto, then a right-hand cluster of icon
//   links, then the hamburger. Icon spacing is CUE's measured pair —
//   mr-[1.3rem] on desktop, mr-[0.85rem] below 992px — not a guess.
//
// - The hamburger MORPHS INTO AN X while the drawer is open (top and bottom
//   bars meet in the middle and rotate 45 degrees, middle bar fades), and the
//   aria-label follows. Three lines that never react to the tap read as broken.
//   The transition names `translate`, `rotate` and `opacity` as SEPARATE
//   properties — in Tailwind v4 `translate-y-*` and `rotate-*` compile to the
//   standalone properties, not into `transform`, so a transition naming only
//   `transform` animates nothing at all and the bars would jump. That mistake
//   hit CUE in five places and is now held down there by a CI gate.
//
// - The button is 1.65rem x 2.2rem below 992px. That is a real tap target;
//   before this port it was a bare 24x15px stack of lines, well under the 44px
//   both Apple and Google ask for, and it was the single worst thing to hit on
//   a phone on this site.
//
// - The drawer is w-4/5 capped at 340px (360px below 992px), full dvh, and
//   animates on `translate` — not on `transform`, for the reason above.
//
// - The CURRENCY PICKER MOVED INTO THE DRAWER, which is where CUE keeps it
//   (inside the account panel, never loose in the bar). On a 390px screen the
//   bar is the most contested space on the site, and a currency switcher is
//   not something a guest reaches for on the way somewhere else.
const BURGER_BAR =
  'w-full h-[2px] bg-gold max-[992px]:w-[22px] shrink-0 ' +
  '[transition:translate_var(--dur)_var(--ease),rotate_var(--dur)_var(--ease),opacity_var(--dur-fast)_var(--ease)] ' +
  'motion-reduce:transition-none';

// CUE's `navLink`: the drawer's own rule makes every link a full-width block
// with its own vertical padding, so the spacing between links comes from the
// links themselves rather than from borders. Exactly one hairline in the whole
// drawer (under the header row) — CUE dropped per-link borders because the
// stack read as too many lines.
const navLink = (active) =>
  'block w-full py-3 text-left text-strong font-medium no-underline ' +
  (active ? 'text-cta' : 'text-gold hover:text-cta');

const SUB_LINK =
  'block text-small font-medium no-underline text-gold hover:text-cta';

const MAIN_LINKS = [
  { href: '/', label: 'Home' },
  { href: '/villas', label: 'Villas' },
  { href: '/experiences', label: 'Experiences' },
];

const SERVICE_LINKS = [
  { href: '/services/breakfast', label: 'Breakfast' },
  { href: '/services/spa', label: 'Spa & Massage' },
  { href: '/services/live-dinner', label: 'Live Dinner' },
  { href: '/services/scooter-rental', label: 'Scooter Rental' },
];

const TAIL_LINKS = [
  { href: '/about', label: 'About' },
  // No stand-alone Contact page was ever specced with real content, so this
  // lands on the About page's Get in Touch section rather than a thin new page.
  { href: '/about#contact', label: 'Contact' },
];

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const pathname = usePathname();
  const { openBooking } = useBooking();
  const navRef = useRef(null);
  const burgerRef = useRef(null);
  const headerRef = useRef(null);

  const isActive = (href) => {
    const base = href.split('#')[0];
    if (base === '/') return pathname === '/';
    return pathname?.startsWith(base);
  };

  // Publishes the live header height as --header-h, the way CUE does, so
  // anything that has to sit directly under the bar (a sticky sub-strip, a
  // scroll-margin on an anchor) can read it instead of hard-coding a number
  // that goes stale the moment the bar's contents change.
  useEffect(() => {
    const el = headerRef.current;
    if (!el) return undefined;
    const set = () => document.documentElement.style.setProperty('--header-h', `${el.offsetHeight}px`);
    set();
    const ro = new ResizeObserver(set);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // Tap outside or Escape closes the drawer.
  useEffect(() => {
    if (!menuOpen) return undefined;
    const onDoc = (e) => {
      const inNav = navRef.current && navRef.current.contains(e.target);
      const onBurger = burgerRef.current && burgerRef.current.contains(e.target);
      if (!inNav && !onBurger) setMenuOpen(false);
    };
    const onKey = (e) => {
      if (e.key === 'Escape') setMenuOpen(false);
    };
    document.addEventListener('click', onDoc);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('click', onDoc);
      document.removeEventListener('keydown', onKey);
    };
  }, [menuOpen]);

  useBodyLock(menuOpen);

  const close = () => setMenuOpen(false);

  return (
    <header
      ref={headerRef}
      className="sticky top-0 z-[100] w-full bg-white [box-shadow:0_2px_12px_rgba(31,61,43,0.07)]"
    >
      <div className="flex justify-between items-center max-w-[var(--container)] mx-auto py-[0.55rem] px-[var(--container-x)]">
        <Link href="/" className="mr-auto" aria-label="Ubud Private Villas home">
          <Logo size={34} />
        </Link>

        {/* Chat lives in the navbar, CUE's arrangement since Sep 2026: visible on
            every page at every width without taking a slot at the bottom of the
            screen. The green "Chat on WhatsApp" button inside the drawer stays —
            that one is for a guest who already opened the menu. */}
        <a
          href={WHATSAPP_LINK}
          target="_blank"
          rel="noopener"
          aria-label="Chat on WhatsApp"
          className="inline-flex items-center text-gold py-2 -my-2 mr-[1.3rem] max-[992px]:mr-[0.85rem] [transition:color_var(--dur)_var(--ease)] hover:text-cta"
        >
          <MessageCircle className="w-5 h-5" strokeWidth={1.6} aria-hidden="true" />
        </a>

        <nav ref={navRef}>
          <ul
            id="nav-menu"
            className={`fixed top-0 right-0 bottom-0 left-auto w-4/5 max-w-[340px] max-[992px]:max-w-[360px] h-[100dvh] bg-white [box-shadow:-14px_0_40px_rgba(26,26,26,0.2)] px-[22px] pb-[30px] overflow-y-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden overscroll-contain [transition:translate_var(--dur-slow)_var(--ease)] motion-reduce:transition-none z-[120] flex flex-col items-stretch text-left gap-0 list-none ${
              menuOpen ? 'translate-x-0 pointer-events-auto' : 'translate-x-full pointer-events-none'
            }`}
          >
            {/* Header row — CUE's drawer opens with a row at the same height as the
                navbar itself, because the drawer is a panel covering the bar, not
                content starting underneath it. The negative side margins let its
                hairline run the full width of the drawer. This is the ONLY border
                in here. */}
            <li className="flex items-center gap-[10px] bg-white border-b border-line mx-[-22px] pt-[0.8rem] px-[22px] pb-[0.8rem]">
              <span className="flex flex-col min-w-0 mr-auto">
                <b className="text-strong font-semibold text-gold leading-[1.25]">Ubud Private Villas</b>
                <span className="text-small text-muted overflow-hidden text-ellipsis whitespace-nowrap">
                  Two private pool villas in Ubud
                </span>
              </span>
              <CurrencyPicker />
            </li>

            <li className="pt-[0.9rem] pb-4">
              <button
                type="button"
                onClick={() => {
                  close();
                  openBooking();
                }}
                className="flex items-center justify-center gap-2 w-full h-[2.6rem] border-0 rounded-pill bg-cta text-white font-body font-semibold text-strong cursor-pointer [transition:background-color_var(--dur)_var(--ease),scale_var(--dur-fast)_var(--ease)] hover:bg-cta-d active:scale-[0.99]"
              >
                Check availability
              </button>
            </li>

            {MAIN_LINKS.map((l) => (
              <li key={l.href}>
                <Link href={l.href} onClick={close} className={navLink(isActive(l.href))}>{l.label}</Link>
              </li>
            ))}

            {/* Services submenu. Collapse (Framer Motion) rather than a bare
                `{open && ...}`: toggling with mount/unmount or with `display`
                cannot be animated at all, which is what made this snap open and
                shut. It animates height, so it pushes the links below it down —
                correct for an inline submenu, and the reason Collapse must never
                be used on an absolutely-positioned dropdown (it would clip it). */}
            <li>
              <button
                type="button"
                data-submenu="services"
                aria-expanded={servicesOpen}
                onClick={() => setServicesOpen((v) => !v)}
                className="flex items-center justify-between w-full py-3 text-left text-strong font-body font-medium border-none bg-transparent text-gold cursor-pointer hover:text-cta"
              >
                Services
                <span className={`inline-block [transition:rotate_var(--dur)_var(--ease)] ${servicesOpen ? 'rotate-90' : ''}`}>&rsaquo;</span>
              </button>
              <Collapse open={servicesOpen}>
                <ul className="list-none mt-[0.1rem] mb-[0.2rem] pt-[0.2rem] pb-[0.5rem] pl-[0.9rem] block">
                  {SERVICE_LINKS.map((s) => (
                    <li key={s.href} className="py-[0.4rem]">
                      <Link href={s.href} onClick={close} className={SUB_LINK}>{s.label}</Link>
                    </li>
                  ))}
                </ul>
              </Collapse>
            </li>

            {TAIL_LINKS.map((l) => (
              <li key={l.href}>
                <Link href={l.href} onClick={close} className={navLink(isActive(l.href))}>{l.label}</Link>
              </li>
            ))}

            {/* mt-auto pins WhatsApp to the bottom of the drawer, CUE's layout.
                flex (not block) so the icon and label actually centre together,
                and text-white so both read against the green. */}
            <li className="mt-auto pt-4">
              <a
                href={WHATSAPP_LINK}
                target="_blank"
                rel="noopener"
                className="flex items-center justify-center gap-2 w-full h-[2.5rem] border-0 bg-cta rounded-pill text-strong font-medium no-underline text-white [transition:background-color_var(--dur)_var(--ease),scale_var(--dur-fast)_var(--ease)] hover:bg-cta-d active:scale-[0.99]"
              >
                <MessageCircle className="w-[18px] h-[18px] flex-none" strokeWidth={1.7} aria-hidden="true" />
                Chat on WhatsApp
              </a>
            </li>
          </ul>
        </nav>

        <button
          type="button"
          id="hamburger"
          ref={burgerRef}
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={menuOpen}
          aria-controls="nav-menu"
          onClick={() => setMenuOpen((v) => !v)}
          className="relative flex flex-col items-center justify-center gap-[5px] w-7 h-[2.2rem] bg-transparent border-none cursor-pointer max-[992px]:w-[1.65rem] max-[992px]:ml-1"
        >
          <span className={`${BURGER_BAR} ${menuOpen ? 'translate-y-[7px] rotate-45' : ''}`} />
          <span className={`${BURGER_BAR} ${menuOpen ? 'opacity-0' : 'opacity-100'}`} />
          <span className={`${BURGER_BAR} ${menuOpen ? '-translate-y-[7px] -rotate-45' : ''}`} />
        </button>
      </div>

      <div
        className={`fixed inset-0 bg-[rgba(26,26,26,0.45)] z-[115] [transition:opacity_var(--dur-slow)_var(--ease),visibility_var(--dur-slow)_var(--ease)] ${
          menuOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
        }`}
        onClick={close}
      />
    </header>
  );
}
