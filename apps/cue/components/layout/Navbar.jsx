'use client';

import { useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';
import { MessageCircle, ShoppingBag, UserRound, UserRoundPlus } from 'lucide-react';
import { useTripPrefs } from '@/state/TripPrefsProvider';
import { useItinerary } from '@/state/ItineraryProvider';
import { useAccount } from '@/state/AccountProvider';
import { WHATSAPP_NUMBER } from '@/lib/constants';
import { Collapse } from '@/components/ui/Reveal';
import CurrencyPicker from './CurrencyPicker';
import TripBar from './TripBar';
import FlagDefs from './FlagDefs';
import useBodyLock from '@/components/ui/useBodyLock';
import Select from '@/components/ui/Select';
import PickupAreaSelect from '@/components/ui/PickupAreaSelect';
import AuthModal from '@/components/account/AuthModal';

// Tailwind-native (migrasi Fase 2): navbar (semua halaman). Dulu keluarga
// .navbar*/.acct__dot/.itn-badge di style.css - sekarang utilities 1:1.
// Navbar = drawer geser dari kanan di SEMUA lebar (keputusan Wayan Sep 2026),
// dibuka via hamburger. Struktur DOM sengaja dijaga identik supaya diff
// computed-style old vs new bisa per-elemen. .navbar* CSS DIBIARIN di style.css
// karena partial legacy (partials/nav*.html) masih pakai. Beberapa aturan
// numpuk di 1 elemen (mis. `.navbar__menu > li > a` menang atas display flex
// tiap link) - hasil flatten-nya diverifikasi lewat computed-style diff.

// Hamburger bars. They morph into an X while the drawer is open so the button
// itself reacts to the tap, instead of three lines sitting there unchanged.
const BURGER_BAR =
  'w-full h-[2px] bg-gold max-[992px]:w-[22px] ' +
  '[transition:translate_var(--dur)_var(--ease),rotate_var(--dur)_var(--ease),opacity_var(--dur-fast)_var(--ease)] ' +
  'motion-reduce:transition-none';

const GUEST_OPTIONS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

// Link nav utama (Home/Guide/Our Company/My Trip). `.navbar__menu > li > a`
// maksa display:block + w-full + py-3 (menang atas display link sendiri).
// Warna aktif/hover: desktop hijau, HP (<=992px) gold-d.
const navLink = (active) =>
  active
    ? 'block w-full py-3 text-left text-strong font-medium no-underline text-green max-[992px]:text-gold-d'
    : 'block w-full py-3 text-left text-strong font-medium no-underline text-gold hover:text-green max-[992px]:hover:text-gold-d';

const BADGE_BASE =
  'inline-flex items-center justify-center min-w-[18px] h-[18px] px-[5px] rounded-pill text-white text-label font-semibold leading-none [&[hidden]]:hidden';

export default function Navbar() {
  const { guests, setGuests } = useTripPrefs();
  const { count } = useItinerary();
  const { account, hasUpcoming, logout } = useAccount();

  const [menuOpen, setMenuOpen] = useState(false);
  const [dropOpen, setDropOpen] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const navRef = useRef(null);
  const burgerRef = useRef(null);
  const headerRef = useRef(null);
  const pathname = usePathname();

  // Two heights, because they answer two different questions:
  //   --header-h     = how tall the header is RIGHT NOW. Sticky tab strips sit at
  //                    this, so they follow the trip bar up as it retracts.
  //   --header-h-max = how tall it gets with the trip bar open. Page top padding
  //                    uses this, so the document does not jump 39px under the
  //                    reader the moment the bar collapses mid-scroll.
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
    // shouldn't keep the desktop maximum), so the ceiling is re-measured there.
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
    if (href === '/') return pathname === '/';
    return pathname === href.replace(/\.html$/, '') || pathname === href;
  };

  // Tapping outside, or Escape, closes the single drawer.
  useEffect(() => {
    if (!menuOpen) return undefined;
    const onDoc = (e) => {
      const inNav = navRef.current && navRef.current.contains(e.target);
      const onBurger = burgerRef.current && burgerRef.current.contains(e.target);
      // Select popups + their overlay are portaled to <body> (outside navRef). Clicking
      // inside one (an option, the × close, or the dim overlay) must close only the
      // popup, never the drawer underneath it. Both carry data-portal (Select/Overlay
      // emit it as their own contract — no leftover .hs-* class after the Tailwind migrasi).
      const inPopup = e.target.closest && e.target.closest('[data-portal]');
      if (!inNav && !onBurger && !inPopup) setMenuOpen(false);
    };
    const onKey = (e) => {
      if (e.key !== 'Escape') return;
      // If a Select popup is open, let it handle Escape (close itself) — don't close the drawer.
      if (document.querySelector('[data-portal="select"][data-open]')) return;
      setMenuOpen(false);
    };
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
      className="fixed top-0 left-0 right-0 z-[100] w-full bg-white shadow-[0_2px_12px_rgba(31,61,43,0.07)] animate-[navbarIn_0.4s_ease-out] motion-reduce:animate-none"
      ref={headerRef}
    >
      <div className="flex justify-between items-center max-w-[1200px] mx-auto py-[0.55rem] px-6">
        <a href="/" className="mr-auto">
          <img className="h-10 w-auto block mr-4 ml-[0.1rem] max-[992px]:h-[34px] max-[992px]:ml-[-0.25rem]" src="/assets/images/logo.webp" alt="The Cahyana Logo" width="1005" height="324" />
        </a>

        {/* Chat pindah ke sini (Sep 2026, Wayan) - dulu nempel di sticky bar bawah
            + tombol ngambang. Di navbar dia keliatan di semua halaman & semua lebar
            tanpa makan ruang di bawah layar. Yang di dalam drawer (tombol hijau
            "Chat on WhatsApp") tetep ada - itu buat yang udah buka menu. */}
        <a
          href={`https://wa.me/${WHATSAPP_NUMBER}`}
          target="_blank"
          rel="noopener"
          className="inline-flex items-center text-gold mr-[1.3rem] transition-[color] duration-200 ease-[ease] hover:text-gold-d max-[992px]:mr-[0.85rem]"
          aria-label="Chat on WhatsApp"
        >
          <MessageCircle className="w-5 h-5" strokeWidth={1.6} aria-hidden="true" />
        </a>

        <a href="/my-trips.html" className="relative inline-flex items-center text-gold mr-[1.3rem] transition-[color] duration-200 ease-[ease] hover:text-gold-d max-[992px]:mr-[0.85rem]" aria-label="My Trips">
          <ShoppingBag className="w-5 h-5" strokeWidth={1.6} aria-hidden="true" />
          <span className={`absolute top-[-7px] right-[-9px] bg-gold ${BADGE_BASE}`} hidden={!count}>{count}</span>
        </a>

        <FlagDefs />

        <nav ref={navRef}>
          <ul
            className={`fixed top-0 right-0 bottom-0 left-auto w-4/5 max-w-[340px] max-[992px]:max-w-[360px] h-[100dvh] bg-white shadow-[-14px_0_40px_rgba(26,26,26,0.2)] px-[22px] pb-[30px] overflow-y-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden overscroll-contain transition-[translate] duration-300 ease-[var(--ease)] motion-reduce:transition-none z-[120] flex flex-col items-stretch text-left gap-0 list-none ${menuOpen ? 'translate-x-0 pointer-events-auto' : 'translate-x-full pointer-events-none'}`}
            id="nav-menu"
          >
            {/* Welcome header — NO top offset on the drawer <ul> above (revert dari
                pt-[var(--header-h)]): konsepnya drawer BUKAN konten yang mulai DI
                BAWAH navbar+tripbar, tapi panel yang nutup di level YANG SAMA (drawer
                ini `fixed inset` full-height z-120, di ATAS header z-100) - Welcome
                jadi baris paling atas drawer, pas di ketinggian navbar, gak digeser
                turun. Sekarang scroll SATU BLOK sama link di bawahnya (NOT sticky -
                dulu sticky top-0 bikin menu jalan DI BAWAH-nya pas di-scroll, kesan
                kepisah). border-b di sini = SATU-SATUNYA garis pembatas di drawer
                (lihat komentar di bawah). */}
            <li className="flex items-center gap-[10px] bg-white border-b border-line mx-[-22px] pt-[0.8rem] px-[22px] pb-[0.8rem]">
              <span className="w-[38px] h-[38px] rounded-[50%] bg-cream border border-line grid place-items-center text-gold flex-none" aria-hidden="true">
                <UserRound className="w-5 h-5" strokeWidth={1.6} />
              </span>
              <span className="flex flex-col min-w-0">
                <b className="text-strong font-semibold text-gold leading-[1.25]"><span>Welcome,</span> {account ? account.name || 'Guest' : 'Guest'}</b>
                <span className="text-small text-muted overflow-hidden text-ellipsis whitespace-nowrap">{account ? account.email : 'Plan your Bali trip'}</span>
              </span>
              <CurrencyPicker variant="navbar" />
            </li>

            {/* Guests + Pickup area = 2 kolom (dropdown sama kayak search form), di atas Sign in */}
            <li className="grid grid-cols-2 gap-[10px] pt-[0.9rem] pb-[0.4rem]">
              <div className="flex flex-col gap-1 min-w-0">
                <label className="text-small text-muted" htmlFor="acct-guests">Guests</label>
                <Select
                  id="acct-guests"
                  label="Guests"
                  value={guests || 2}
                  onChange={setGuests}
                  options={GUEST_OPTIONS.map((n) => ({ value: String(n), label: `${n} ${n === 1 ? 'guest' : 'guests'}` }))}
                  popup
                />
              </div>
              <div className="flex flex-col gap-1 min-w-0">
                <label className="text-small text-muted" htmlFor="acct-stay">Pickup area</label>
                <PickupAreaSelect id="acct-stay" />
              </div>
            </li>

            {/* Sign in */}
            <li className="pb-4">
              <button
                type="button"
                className="flex items-center justify-center gap-2 w-full h-[2.6rem] border-0 rounded-pill bg-cta text-white font-body font-semibold text-strong cursor-pointer transition-[background,scale] duration-200 ease-[var(--ease)] hover:bg-cta-d"
                onClick={() => {
                  if (account) logout();
                  else setAuthOpen(true);
                  setMenuOpen(false);
                }}
              >
                <UserRoundPlus className="w-[17px] h-[17px]" strokeWidth={1.8} aria-hidden="true" />
                <span>{account ? 'Sign out' : 'Sign in / Sign up'}</span>
              </button>
            </li>

            {/* Nav — WAJIB cuma satu garis di drawer (di bawah Welcome, di atas); antar
                link nggak dikasih border lagi, kerasa kebanyakan garis (Wayan). Spacing
                antar-link murni dari py-3 tiap link. */}
            <li><a href="/" className={navLink(isActive('/'))}>Home</a></li>
            <li className="relative">
              <button
                type="button"
                className="block w-full py-3 text-left text-strong font-body font-medium border-none bg-transparent text-gold cursor-pointer gap-1 items-center hover:text-green"
                aria-expanded={dropOpen}
                onClick={() => setDropOpen((v) => !v)}
              >
                Program<span className={`inline-block transition-[rotate] duration-200 ease-[ease] ${dropOpen ? 'rotate-90' : ''}`}>&rsaquo;</span>
              </button>
              <Collapse open={dropOpen}>
              <ul className="list-none mt-[0.1rem] mb-[0.2rem] pt-[0.2rem] pb-[0.5rem] pl-[0.9rem] block">
                <li className="py-[0.4rem]"><a className="block text-small font-medium no-underline text-gold hover:text-green max-[992px]:hover:text-gold-d" href="/tour.html">Tours</a></li>
                <li className="py-[0.4rem]"><a className="block text-small font-medium no-underline text-gold hover:text-green max-[992px]:hover:text-gold-d" href="/destinations.html">Destinations</a></li>
                <li className="py-[0.4rem]"><a className="block text-small font-medium no-underline text-gold hover:text-green max-[992px]:hover:text-gold-d" href="/activities.html">Experiences</a></li>
                <li className="py-[0.4rem]"><a className="block text-small font-medium no-underline text-gold hover:text-green max-[992px]:hover:text-gold-d" href="/transfer.html">Transfer</a></li>
                <li className="py-[0.4rem]"><a className="block text-small font-medium no-underline text-gold hover:text-green max-[992px]:hover:text-gold-d" href="/charter.html">Charter</a></li>
              </ul>
              </Collapse>
            </li>
            <li><a href="/bali-guide.html" className={navLink(isActive('/bali-guide.html'))}>Guide</a></li>
            <li><a href="/my-trips.html" className="block w-full py-3 text-left text-strong font-medium no-underline text-gold items-center hover:text-green max-[992px]:hover:text-gold-d">My Trip<span className={`ml-[5px] bg-ok ${BADGE_BASE}`} hidden={!count}>{count}</span></a></li>
            <li><a href="/our-company.html" className={navLink(isActive('/our-company.html'))}>Our Company</a></li>
            {/* Settings - dipindah ke sini (Wayan): dulu di footer drawer bareng WA,
                sekarang jadi nav link biasa (plain, no icon) persis di bawah Our
                Company. Label "Settings" -> "Account Settings". */}
            <li><a href="/settings.html" className={navLink(isActive('/settings.html'))}>Account Settings</a></li>

            {/* Footer: Chat WA - mt-auto nge-pin ke bawah drawer. */}
            <li className="mt-auto pt-4">
              {/* Bug lama: `block` + `items-center justify-center` itu no-op tanpa
                  `flex` (icon+text numpuk kiri, gak center) + `text-gold` di atas bg
                  hijau (nyaris gak kebaca). Fix: flex biar align beneran + text-white
                  (icon currentColor ikut putih, samain gaya sama tombol Sign in). */}
              <a href={`https://wa.me/${WHATSAPP_NUMBER}`} target="_blank" rel="noopener" className="flex items-center justify-center gap-2 w-full h-[2.5rem] border-0 bg-cta rounded-pill text-strong font-medium no-underline text-white transition-[background,scale] duration-200 ease-[var(--ease)] hover:bg-cta-d">
                <MessageCircle className="w-[18px] h-[18px] flex-none" strokeWidth={1.7} aria-hidden="true" />
                Chat on WhatsApp
              </a>
            </li>
          </ul>
        </nav>

        <button
          className="relative flex flex-col gap-[5px] w-7 bg-transparent border-none cursor-pointer max-[992px]:w-[1.65rem] max-[992px]:h-[2.2rem] max-[992px]:ml-1 max-[992px]:items-center max-[992px]:justify-center"
          id="hamburger"
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          ref={burgerRef}
          onClick={() => setMenuOpen((v) => !v)}
        >
          <span className={`${BURGER_BAR} ${menuOpen ? 'translate-y-[7px] rotate-45' : ''}`} />
          <span className={`${BURGER_BAR} ${menuOpen ? 'opacity-0' : 'opacity-100'}`} />
          <span className={`${BURGER_BAR} ${menuOpen ? '-translate-y-[7px] -rotate-45' : ''}`} />
          {/* Titik hijau "ada booking mendatang" - titik bulat 8px sesuai maksud
              .acct__dot lama. (Di CSS lama sempet ke-override `.navbar__toggle
              span:not(.itn-badge)` jadi bar emas tipis - bug; Wayan minta dibenerin
              jadi titik hijau pas migrasi Tailwind ini.) */}
          <span className="absolute top-[-2px] right-[-2px] w-2 h-2 bg-[#3fae5a] rounded-[50%] border-2 border-white [&[hidden]]:hidden" hidden={!hasUpcoming} />
        </button>
      </div>

      <div className={`fixed inset-0 bg-[rgba(26,26,26,0.45)] z-[95] transition-[opacity,visibility] duration-300 ease-[var(--ease)] ${menuOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}`} onClick={() => setMenuOpen(false)} />
      <TripBar />
      <AuthModal open={authOpen} onClose={() => setAuthOpen(false)} />
    </header>
  );
}
