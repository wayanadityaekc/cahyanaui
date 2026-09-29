'use client';
import { BTN_SM } from '@/components/ui/btnClasses';

import { useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';
import { normalizePath } from '@/lib/pathname';
import {
  Building2, Compass, BookOpen, House, MessageCircle, ShoppingBag, Star, X,
} from 'lucide-react';
import { useItinerary } from '@/state/ItineraryProvider';
import ChatLauncher from '@/components/chat/ChatLauncher';
import { APP_HIDE } from '@/components/ui/pwaClasses';
import { WHATSAPP_NUMBER } from '@/lib/constants';
import { Collapse } from '@/components/ui/Reveal';
import { MENU_ROW_BOX } from '@/components/ui/railClasses';
import TripBar from './TripBar';
import FlagDefs from './FlagDefs';
import useBodyLock from '@/components/ui/useBodyLock';
import AuthModal from '@/components/account/AuthModal';
import AccountMenu from './AccountMenu';
import TripPrefsFields from './TripPrefsFields';
import DesktopNav from './DesktopNav';

// Site header: trip bar, nav row, phone drawer and account slot.

// Burger bar; the X offset (6px) is bar height 2 + gap 4, so change them together.
const BURGER_BAR =
  'w-full h-[2px] bg-gold max-[992px]:w-[20px] ' +
  '[transition:translate_var(--dur)_var(--ease),rotate_var(--dur)_var(--ease),opacity_var(--dur-fast)_var(--ease)] ' +
  'motion-reduce:transition-none';


// Drawer nav row: shared pill geometry (MENU_ROW_BOX), the drawer's own colours.
function navLink(active) {
  return `${MENU_ROW_BOX} text-strong no-underline ` +
    (active
      ? 'font-semibold bg-cream text-green max-[992px]:text-gold-d'
      : 'font-medium text-gold hover:bg-cream hover:text-green max-[992px]:hover:text-gold-d');
}

// Pulls each row out 12px so the pill's padding doesn't shift the labels right.
const NAV_LI = '-mx-3';

const BADGE_BASE =
  'inline-flex items-center justify-center min-w-[18px] h-[18px] px-[5px] rounded-sm text-white text-label font-semibold leading-none [&[hidden]]:hidden';

export default function Navbar() {
  const { count } = useItinerary();

  const [menuOpen, setMenuOpen] = useState(false);
  const [dropOpen, setDropOpen] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const navRef = useRef(null);
  const burgerRef = useRef(null);
  const headerRef = useRef(null);
  const barRef = useRef(null);
  const pathname = normalizePath(usePathname());

  // Header heights on :root (nav row, nav + trip bar, trip bar); set on resize only, never on scroll.
  useEffect(() => {
    const header = headerRef.current;
    if (!header) return undefined;
    const root = document.documentElement;
    let max = 0;
    function set() {
      const h = header.offsetHeight;
      const bar = barRef.current ? barRef.current.offsetHeight : 0;
      root.style.setProperty('--header-h', `${h - bar}px`);
      root.style.setProperty('--tripbar-h', `${bar}px`);
      if (h > max) {
        max = h;
        root.style.setProperty('--header-h-max', `${h}px`);
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

  // Trip bar slides away past 80px and back under 8px (two thresholds stop flicker); the header stays sticky.
  const [slid, setSlid] = useState(false);
  useEffect(() => {
    function onScroll() { return setSlid((was) => (was ? window.scrollY > 8 : window.scrollY > 80)); }
    onScroll(); // a page opened at an anchor starts already scrolled
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  function isActive(href) {
    // '/index.html' counts as home, matching the prerendered '/' (avoids a hydration mismatch).
    if (href === '/') return pathname === '/' || pathname === '/index.html';
    return pathname === href.replace(/\.html$/, '') || pathname === href;
  }

  // Tapping outside, or Escape, closes the single drawer.
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
      // If a Select popup is open, let it handle Escape (close itself) — don't close the drawer.
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

  return (
    <header
      className={`fixed left-0 right-0 z-[100] w-full bg-white animate-[navbarIn_0.4s_ease-out] motion-reduce:animate-none [transition:top_var(--dur)_var(--ease)] motion-reduce:transition-none ${slid ? 'top-[calc(-1_*_var(--tripbar-h,0px))]' : 'top-0'}`}
      ref={headerRef}
    >
      {/* Trip bar above the nav row, so sliding the header up hides only the bar. */}
      <div ref={barRef}><TripBar /></div>
      <div className="flex justify-between items-center max-w-[1200px] mx-auto py-[0.55rem] px-[var(--container-x)] min-[993px]:px-5">
        {/* Burger left of the logo, phones only; the open drawer covers it, so the x inside closes it. */}
        <button
          className="min-[993px]:hidden relative flex flex-col gap-[4px] w-6 bg-transparent border-none cursor-pointer max-[992px]:h-[2.2rem] max-[992px]:mr-2 max-[992px]:items-center max-[992px]:justify-center"
          id="hamburger"
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          ref={burgerRef}
          onClick={() => setMenuOpen((v) => !v)}
        >
          <span className={`${BURGER_BAR} ${menuOpen ? 'translate-y-[6px] rotate-45' : ''}`} />
          <span className={`${BURGER_BAR} ${menuOpen ? 'opacity-0' : 'opacity-100'}`} />
          <span className={`${BURGER_BAR} ${menuOpen ? '-translate-y-[6px] -rotate-45' : ''}`} />
        </button>

        <a href="/" className="max-[992px]:mr-auto">
          <img className="h-10 w-auto block mr-4 ml-[0.1rem] max-[992px]:h-[34px] max-[992px]:ml-0" src="/assets/images/logo.webp" alt="The Cahyana Logo" width="1005" height="324" />
        </a>

        <DesktopNav isActive={isActive} />

        {/* Chat launcher: opens the support panel, same shape as the cart icon beside it. */}
        <ChatLauncher className={`${APP_HIDE} inline-flex items-center text-gold mr-[1.3rem] bg-transparent border-none p-0 cursor-pointer [transition:color_var(--dur)_ease,scale_var(--dur-fast)_var(--ease)] hover:text-gold-d max-[992px]:mr-[0.85rem]`} />

        <a href="/my-trips.html" className={`${APP_HIDE} relative inline-flex items-center text-gold mr-[1.3rem] transition-[color] duration-200 ease-[ease] hover:text-gold-d max-[992px]:mr-[0.85rem]`} aria-label="My Trips">
          <ShoppingBag className="w-5 h-5" strokeWidth={1.6} aria-hidden="true" />
          <span className={`absolute top-[-7px] right-[-9px] bg-gold ${BADGE_BASE}`} hidden={!count}>{count}</span>
        </a>


        <FlagDefs />

        <nav ref={navRef}>
          <ul
            className={`fixed top-0 left-0 bottom-0 right-auto w-4/5 max-w-[340px] max-[992px]:max-w-[360px] h-[100dvh] bg-white px-[22px] pb-[30px] overflow-y-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden overscroll-contain transition-[translate] duration-300 ease-[var(--ease)] motion-reduce:transition-none z-[120] flex flex-col items-stretch text-left gap-0 list-none ${menuOpen ? 'translate-x-0 pointer-events-auto' : '-translate-x-full pointer-events-none'}`}
            id="nav-menu"
          >
            {/* Drawer header: the x is the only visible close control while the drawer covers the burger. */}
            <li className="flex items-center gap-[10px] bg-white border-b border-line mx-[-22px] pt-[0.8rem] px-[22px] pb-[0.8rem] min-h-[65px]">
              <b className="text-strong font-semibold text-gold">Menu</b>
              <button
                type="button"
                className="ml-auto flex-none grid place-items-center w-[34px] h-[34px] rounded-[var(--r-md)] [border:1px_solid_var(--line)] bg-white text-gold cursor-pointer [&>svg]:w-4 [&>svg]:h-4 [transition:background-color_var(--dur)_var(--ease),scale_var(--dur-fast)_var(--ease)] hover:bg-cream"
                aria-label="Close menu"
                onClick={() => setMenuOpen(false)}
              >
                <X strokeWidth={2} aria-hidden="true" />
              </button>
            </li>

            <li className="pt-[0.9rem] pb-4"><TripPrefsFields idPrefix="acct" /></li>

            {/* Nav rows: one divider only (under the header); spacing comes from MENU_ROW_BOX. */}
            <li className={NAV_LI}><a href="/" className={navLink(isActive('/'))}><House strokeWidth={1.7} aria-hidden="true" />Home</a></li>
            <li className={`relative ${NAV_LI}`}>
              <button
                type="button"
                className={`${MENU_ROW_BOX} text-strong font-body font-medium border-none bg-transparent text-gold cursor-pointer hover:bg-cream hover:text-green`}
                aria-expanded={dropOpen}
                onClick={() => setDropOpen((v) => !v)}
              >
                {/* ml-auto keeps the chevron at the row's right edge, like the rail's. */}
                <Compass strokeWidth={1.7} aria-hidden="true" />Program<span className={`ml-auto inline-block transition-[rotate] duration-200 ease-[ease] ${dropOpen ? 'rotate-90' : ''}`}>&rsaquo;</span>
              </button>
              <Collapse open={dropOpen}>
              {/* pl includes NAV_LI's 0.75rem pull-out; change NAV_LI and this together. */}
              <ul className="list-none mt-[0.1rem] mb-[0.2rem] pt-[0.2rem] pb-[0.5rem] pl-[1.65rem] block">
                <li className="py-[0.4rem]"><a className="block text-small font-medium no-underline text-gold hover:text-green max-[992px]:hover:text-gold-d" href="/tour.html">Tours</a></li>
                <li className="py-[0.4rem]"><a className="block text-small font-medium no-underline text-gold hover:text-green max-[992px]:hover:text-gold-d" href="/destinations.html">Destinations</a></li>
                <li className="py-[0.4rem]"><a className="block text-small font-medium no-underline text-gold hover:text-green max-[992px]:hover:text-gold-d" href="/activities.html">Experiences</a></li>
                <li className="py-[0.4rem]"><a className="block text-small font-medium no-underline text-gold hover:text-green max-[992px]:hover:text-gold-d" href="/transfer.html">Transfer</a></li>
                <li className="py-[0.4rem]"><a className="block text-small font-medium no-underline text-gold hover:text-green max-[992px]:hover:text-gold-d" href="/charter.html">Charter</a></li>
              </ul>
              </Collapse>
            </li>
            <li className={NAV_LI}><a href="/bali-guide.html" className={navLink(isActive('/bali-guide.html'))}><BookOpen strokeWidth={1.7} aria-hidden="true" />Guide</a></li>
            <li className={NAV_LI}><a href="/all-reviews.html" className={navLink(isActive('/all-reviews.html'))}><Star strokeWidth={1.7} aria-hidden="true" />Reviews</a></li>
            {/* Building2 = ikon yang sama dipakai rail Our Company buat "About Us". */}
            <li className={NAV_LI}><a href="/our-company.html" className={navLink(isActive('/our-company.html'))}><Building2 strokeWidth={1.7} aria-hidden="true" />Our Company</a></li>
            {/* Footer: Chat WA - mt-auto nge-pin ke bawah drawer. */}
            <li className="mt-auto pt-4">
              {/* flex centres icon + text; white text on the green button. */}
              <a href={`https://wa.me/${WHATSAPP_NUMBER}`} target="_blank" rel="noopener" className={`flex w-full gap-2 ${BTN_SM} border-0 bg-cta no-underline text-white transition-[background,scale] duration-200 ease-[var(--ease)] hover:bg-cta-d`}>
                <MessageCircle className="w-[18px] h-[18px] flex-none" strokeWidth={1.7} aria-hidden="true" />
                WhatsApp
              </a>
            </li>
          </ul>
        </nav>

        {/* Account slot, far right. */}
        <AccountMenu onLogin={() => setAuthOpen(true)} />
      </div>

      <div className={`fixed inset-0 bg-[rgba(26,26,26,0.45)] z-[95] transition-[opacity,visibility] duration-300 ease-[var(--ease)] ${menuOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}`} onClick={() => setMenuOpen(false)} />
      <AuthModal open={authOpen} onClose={() => setAuthOpen(false)} />
    </header>
  );
}
