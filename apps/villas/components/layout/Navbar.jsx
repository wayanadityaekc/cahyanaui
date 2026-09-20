'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { BedDouble, MessageCircle } from 'lucide-react';
import { Collapse } from '@/components/ui/Reveal';
import useBodyLock from '@/components/ui/useBodyLock';
import CurrencyPicker from '@/components/ui/CurrencyPicker';
import FlagDefs from '@/components/layout/FlagDefs';
import { useBooking } from '@/components/providers/BookingProvider';
import { WHATSAPP_LINK } from '@/lib/constants';

// CUE's navbar (components/layout/Navbar.jsx there), reused class for class.
// Everything below the CONTENT block is CUE's shell verbatim; everything in it
// is this site's. The slots map one to one:
//
//   CUE                              here
//   ───────────────────────────────  ─────────────────────────────────────
//   logo + chat + cart               logo + chat  (no cart — no cart here)
//   drawer "Welcome, <account>" row  site name + tagline row
//   Guests / Pickup area selects     (omitted — no site-wide trip prefs)
//   "Sign in / Sign up" button       "Check availability"
//   Home / Program▾ / Guide / …      Home / Villas / Experiences / Services▾ / …
//   "Chat on WhatsApp" pinned        same
//
// Pieces worth knowing about before editing:
//
// - The header is FIXED, as CUE's is, which is why <main> in app/layout.jsx
//   reserves --header-h-max. Two height variables, because they answer two
//   different questions: --header-h is how tall the bar is right now (anything
//   that has to sit directly under it reads this), --header-h-max is how tall
//   it ever gets (page padding reads this, so the document cannot jump under
//   the reader if the bar's contents ever shrink mid-scroll).
//
// - The drawer animates on `translate`. In Tailwind v4 `translate-x-*` compiles
//   to the standalone `translate:` property, NOT into `transform:`, so a
//   transition naming `transform` animates nothing and the drawer teleports.
//
// - The hamburger MORPHS INTO AN X while open and its aria-label follows.
//
// - leading-[normal] on the <header>: CUE's body sets no line-height, so its
//   whole navbar inherits `normal`, while this site's base layer sets 1.6 on
//   <body>. Left inherited, every row in here came out 5px taller than CUE's
//   (nav link 46.4px vs 41px, currency button 38.5px vs 33px) — measured. This
//   pins the subtree to what CUE actually renders without touching body copy
//   anywhere else on the site. text-green is the same story: CUE's body colour
//   is --color-green, this site's is --color-ink.
//
// - The currency picker lives in the drawer's header row, which is where CUE
//   keeps it (inside its account panel, never loose in the bar).

const BURGER_BAR =
  'w-full h-[2px] bg-gold max-[992px]:w-[22px] ' +
  '[transition:translate_var(--dur)_var(--ease),rotate_var(--dur)_var(--ease),opacity_var(--dur-fast)_var(--ease)] ' +
  'motion-reduce:transition-none';

// CUE's drawer rule makes each link a full-width block with its own vertical
// padding, so the spacing between links comes from the links, not from borders.
// Active/hover colour: green on desktop, gold-d below 992px — CUE's pair.
const navLink = (active) =>
  active
    ? 'block w-full py-3 text-left text-strong font-medium no-underline text-green max-[992px]:text-gold-d'
    : 'block w-full py-3 text-left text-strong font-medium no-underline text-gold hover:text-green max-[992px]:hover:text-gold-d';

const SUB_LINK =
  'block text-small font-medium no-underline text-gold hover:text-green max-[992px]:hover:text-gold-d';

/* ── CONTENT ─────────────────────────────────────────────────────────────── */

// The drawer's top row is CUE's ACCOUNT row. There are no accounts here, so it
// carries a heading instead — and it has to be SHORT. The row is
// [avatar][text][currency] and at 390px that leaves the text column ~118px;
// "Ubud Private Villas" measures ~130px at 14px/600, so it wrapped and made the
// row 12px taller than CUE's (76.6px vs 64.6px, measured). It would also just
// repeat the logo sitting a centimetre above it. The subtitle is nowrap +
// ellipsis, exactly as CUE's email line is.
const BRAND = { title: 'Plan your stay', sub: 'Two private pool villas in Ubud' };

const LINKS_BEFORE = [
  { href: '/', label: 'Home' },
  { href: '/villas', label: 'Villas' },
  { href: '/experiences', label: 'Experiences' },
];

const SUBMENU = {
  label: 'Services',
  items: [
    { href: '/services/breakfast', label: 'Breakfast' },
    { href: '/services/spa', label: 'Spa & Massage' },
    { href: '/services/live-dinner', label: 'Live Dinner' },
    { href: '/services/scooter-rental', label: 'Scooter Rental' },
  ],
};

const LINKS_AFTER = [
  { href: '/about', label: 'About' },
  // No stand-alone Contact page was specced with real content, so this lands on
  // the About page's Get in Touch section rather than a thin new page.
  { href: '/about#contact', label: 'Contact' },
];

/* ────────────────────────────────────────────────────────────────────────── */

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropOpen, setDropOpen] = useState(false);
  const navRef = useRef(null);
  const burgerRef = useRef(null);
  const headerRef = useRef(null);
  const pathname = usePathname();
  const { openBooking } = useBooking();

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
    // A viewport change gives a different natural height (and rotating a phone
    // should not keep a desktop maximum), so the ceiling is re-measured there.
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

  const isActive = (href) => {
    const base = href.split('#')[0];
    if (base === '/') return pathname === '/';
    return pathname?.startsWith(base);
  };

  // Tapping outside, or Escape, closes the single drawer.
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
      className="fixed top-0 left-0 right-0 z-[100] w-full leading-[normal] text-green bg-white shadow-[0_2px_12px_rgba(31,61,43,0.07)] animate-[navbarIn_0.4s_ease-out] motion-reduce:animate-none"
    >
      <div className="flex justify-between items-center max-w-[1200px] mx-auto py-[0.55rem] px-6">
        <Link href="/" className="mr-auto" aria-label={`${BRAND.title} home`}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            className="h-10 w-auto block mr-4 ml-[0.1rem] max-[992px]:h-[34px] max-[992px]:ml-[-0.25rem]"
            src="/images/logo.webp"
            alt="Cahyana Ubud-Bali · Ubud Private Villas"
            width="1005"
            height="324"
          />
        </Link>

        {/* Chat lives in the navbar, CUE's arrangement since Sep 2026: visible on
            every page at every width without taking a slot at the bottom of the
            screen. The green button inside the drawer stays — that one is for a
            guest who already opened the menu. */}
        <a
          href={WHATSAPP_LINK}
          target="_blank"
          rel="noopener"
          className="inline-flex items-center text-gold mr-[1.3rem] transition-[color] duration-200 ease-[ease] hover:text-gold-d max-[992px]:mr-[0.85rem]"
          aria-label="Chat on WhatsApp"
        >
          <MessageCircle className="w-5 h-5" strokeWidth={1.6} aria-hidden="true" />
        </a>

        <FlagDefs />

        <nav ref={navRef}>
          <ul
            id="nav-menu"
            className={`fixed top-0 right-0 bottom-0 left-auto w-4/5 max-w-[340px] max-[992px]:max-w-[360px] h-[100dvh] bg-white shadow-[-14px_0_40px_rgba(26,26,26,0.2)] px-[22px] pb-[30px] overflow-y-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden overscroll-contain transition-[translate] duration-300 ease-[var(--ease)] motion-reduce:transition-none z-[120] flex flex-col items-stretch text-left gap-0 list-none ${menuOpen ? 'translate-x-0 pointer-events-auto' : 'translate-x-full pointer-events-none'}`}
          >
            {/* Header row — NO top offset on the <ul>: the drawer is not content
                starting below the bar, it is a panel covering it at the same
                level (fixed, full height, above the header). So this row is the
                drawer's top line, sitting at the bar's own height. It scrolls as
                one block with the links (deliberately NOT sticky — sticky made
                the menu appear to run underneath it). The negative side margins
                let its hairline reach the drawer's full width, and it is the ONLY
                border in here: CUE dropped per-link borders because the stack
                read as too many lines. */}
            <li className="flex items-center gap-[10px] bg-white border-b border-line mx-[-22px] pt-[0.8rem] px-[22px] pb-[0.8rem]">
              <span className="w-[38px] h-[38px] rounded-[50%] bg-cream border border-line grid place-items-center text-gold flex-none" aria-hidden="true">
                <BedDouble className="w-5 h-5" strokeWidth={1.6} />
              </span>
              <span className="flex flex-col min-w-0">
                <b className="text-strong font-semibold text-gold leading-[1.25]">{BRAND.title}</b>
                <span className="text-small text-muted overflow-hidden text-ellipsis whitespace-nowrap">{BRAND.sub}</span>
              </span>
              <CurrencyPicker variant="navbar" />
            </li>

            <li className="pt-[0.9rem] pb-4">
              <button
                type="button"
                className="flex items-center justify-center gap-2 w-full h-[2.6rem] border-0 rounded-pill bg-cta text-white font-body font-semibold text-strong cursor-pointer transition-[background,scale] duration-200 ease-[var(--ease)] hover:bg-cta-d"
                onClick={() => {
                  close();
                  openBooking();
                }}
              >
                Check availability
              </button>
            </li>

            {LINKS_BEFORE.map((l) => (
              <li key={l.href}>
                <Link href={l.href} onClick={close} className={navLink(isActive(l.href))}>{l.label}</Link>
              </li>
            ))}

            <li className="relative">
              <button
                type="button"
                data-submenu
                className="block w-full py-3 text-left text-strong font-body font-medium border-none bg-transparent text-gold cursor-pointer gap-1 items-center hover:text-green"
                aria-expanded={dropOpen}
                onClick={() => setDropOpen((v) => !v)}
              >
                {SUBMENU.label}<span className={`inline-block transition-[rotate] duration-200 ease-[ease] ${dropOpen ? 'rotate-90' : ''}`}>&rsaquo;</span>
              </button>
              {/* Collapse (Framer Motion), not `{open && …}`: mount/unmount and
                  `display` cannot be animated at all, which is what made this
                  snap. It animates height, so it pushes the links below it down —
                  right for an inline submenu, and the reason Collapse must never
                  wrap an absolutely-positioned dropdown (it would clip it to
                  nothing). */}
              <Collapse open={dropOpen}>
                <ul className="list-none mt-[0.1rem] mb-[0.2rem] pt-[0.2rem] pb-[0.5rem] pl-[0.9rem] block">
                  {SUBMENU.items.map((s) => (
                    <li key={s.href} className="py-[0.4rem]">
                      <Link href={s.href} onClick={close} className={SUB_LINK}>{s.label}</Link>
                    </li>
                  ))}
                </ul>
              </Collapse>
            </li>

            {LINKS_AFTER.map((l) => (
              <li key={l.href}>
                <Link href={l.href} onClick={close} className={navLink(isActive(l.href))}>{l.label}</Link>
              </li>
            ))}

            {/* Footer: Chat WA — mt-auto pins it to the bottom of the drawer.
                flex (not block) so the icon and label actually centre together,
                and text-white so both read against the green. */}
            <li className="mt-auto pt-4">
              <a
                href={WHATSAPP_LINK}
                target="_blank"
                rel="noopener"
                className="flex items-center justify-center gap-2 w-full h-[2.5rem] border-0 bg-cta rounded-pill text-strong font-medium no-underline text-white transition-[background,scale] duration-200 ease-[var(--ease)] hover:bg-cta-d"
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
          className="relative flex flex-col gap-[5px] w-7 bg-transparent border-none cursor-pointer max-[992px]:w-[1.65rem] max-[992px]:h-[2.2rem] max-[992px]:ml-1 max-[992px]:items-center max-[992px]:justify-center"
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={menuOpen}
          aria-controls="nav-menu"
          onClick={() => setMenuOpen((v) => !v)}
        >
          <span className={`${BURGER_BAR} ${menuOpen ? 'translate-y-[7px] rotate-45' : ''}`} />
          <span className={`${BURGER_BAR} ${menuOpen ? 'opacity-0' : 'opacity-100'}`} />
          <span className={`${BURGER_BAR} ${menuOpen ? '-translate-y-[7px] -rotate-45' : ''}`} />
        </button>
      </div>

      <div className={`fixed inset-0 bg-[rgba(26,26,26,0.45)] z-[95] transition-[opacity,visibility] duration-300 ease-[var(--ease)] ${menuOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}`} onClick={close} />
    </header>
  );
}
