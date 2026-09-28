'use client';
import { BTN_SM } from '@/components/ui/btnClasses';

import { useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';
import { normalizePath } from '@/lib/pathname';
import {
  Building2, Compass, BookOpen, House, MessageCircle, ShoppingBag, X,
} from 'lucide-react';
import { useItinerary } from '@/state/ItineraryProvider';
import ChatLauncher from '@/components/chat/ChatLauncher';
import { APP_HIDE } from '@/components/ui/pwaClasses';
import { useAccount } from '@/state/AccountProvider';
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
//
// THE X OFFSET IS DERIVED, NOT CHOSEN: the outer bars travel bar-height + gap to meet
// in the middle (2 + 4 = 6px). Change `gap-` or `h-` on the bars and the
// `translate-y-[6px]` below has to move with it, or the X never closes.
// Sizes came down a notch 27 Sep 2026 (Wayan: "humberger bisa size kecilin lagi dikit")
// - 28->24px wide, gap 5->4. The mobile TAP TARGET (h-[2.2rem]) was left alone: that is
// thumb size, not visual size, and shrinking it makes the button harder to hit.
const BURGER_BAR =
  'w-full h-[2px] bg-gold max-[992px]:w-[20px] ' +
  '[transition:translate_var(--dur)_var(--ease),rotate_var(--dur)_var(--ease),opacity_var(--dur-fast)_var(--ease)] ' +
  'motion-reduce:transition-none';


// Link nav utama (Home/Program/Guide/My Trip/Our Company/Account Settings).
//
// BARIS = PILL, bentuknya DIPINJEM dari rail (Sep 2026, Wayan pilih "B" dari
// sheet 3 opsi - dia bilang "gass B, tombol X nya hilangin"). Sebelum ini
// baris drawer itu teks polos yang hover-nya cuma ganti warna, sementara rail
// Our Company & My Trips barisnya udah pill - satu web, dua macem baris menu.
// Sekarang GEOMETRI-nya satu string (`MENU_ROW_BOX`), jadi gak bisa melenceng
// lagi; warna & ukuran teksnya tetep punya drawer sendiri.
//
// Yang dioper dari mock: baris kepilih = pill cream (rail juga gitu di HP),
// hover = pill cream, badge & chevron ke tepi KANAN.
//
// TERUS JADI OPSI A (Wayan ngirim balik screenshot mock A: "gua mau ini") -
// jadi IKON PER BARIS + tombol × ikut masuk, dua-duanya yang tadinya dia minta
// dilepas. Ikonnya bukan selera Flowbite: ukurannya `--icon-sm` lewat
// MENU_ROW_BOX yang sama, dan Our Company pakai `Building2` - ikon yang PERSIS
// dipakai rail Our Company buat section "About Us".
const navLink = (active) =>
  `${MENU_ROW_BOX} text-strong no-underline ` +
  (active
    ? 'font-semibold bg-cream text-green max-[992px]:text-gold-d'
    : 'font-medium text-gold hover:bg-cream hover:text-green max-[992px]:hover:text-gold-d');

// Pill-nya butuh padding 12px (0.75rem) di dalam, dan drawer-nya sendiri udah
// px-[22px]. Tanpa narik <li>-nya keluar 12px, SEMUA label geser 12px ke kanan
// dan gak lurus lagi sama baris Welcome + label Guests di atasnya (diukur:
// tepi kiri teks harus tetep 100px @390). Jadi pill-nya yang mekar keluar,
// bukan teksnya yang masuk.
const NAV_LI = '-mx-3';

const BADGE_BASE =
  'inline-flex items-center justify-center min-w-[18px] h-[18px] px-[5px] rounded-sm text-white text-label font-semibold leading-none [&[hidden]]:hidden';

export default function Navbar() {
  const { count } = useItinerary();
  const { hasUpcoming } = useAccount();

  const [menuOpen, setMenuOpen] = useState(false);
  const [dropOpen, setDropOpen] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const navRef = useRef(null);
  const burgerRef = useRef(null);
  const headerRef = useRef(null);
  const barRef = useRef(null);
  const pathname = normalizePath(usePathname());

  // Three numbers, and NONE of them changes while the guest is scrolling - that is
  // the whole point of this block now:
  //   --header-h     = the NAV ROW only. Sticky tab strips sit at this. It used to be
  //                    the whole header, so it shrank 33px while the trip bar retracted
  //                    and every element in the document had its style invalidated on
  //                    each of the ~12 frames of that animation (measured: 48-139ms of
  //                    style recalc per collapse, against ~1ms on a page with no bar -
  //                    a custom property on :root is inherited, so touching it recalcs
  //                    the whole tree). That was the "scroll tidak mulus".
  //   --header-h-max = nav row + trip bar. Page top padding uses this, so a page
  //                    reserves the space the header takes at rest.
  //   --tripbar-h    = how far the header slides up once the guest starts scrolling.
  useEffect(() => {
    const el = headerRef.current;
    if (!el) return undefined;
    const root = document.documentElement;
    let max = 0;
    const set = () => {
      const h = el.offsetHeight;
      const bar = barRef.current ? barRef.current.offsetHeight : 0;
      root.style.setProperty('--header-h', `${h - bar}px`);
      root.style.setProperty('--tripbar-h', `${bar}px`);
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

  // THE TRIP BAR SITS ABOVE THE NAV AND THE HEADER SLIDES IT AWAY (Sep 2026, Wayan:
  // "coba trip bar di taruh di atas navbar dan hilang saat di scroll"). The header
  // keeps its height; only its `top` moves, from 0 to -(bar height). Nothing is
  // measured, nothing on :root is rewritten, and no element outside this header is
  // touched - so the browser does no style work at all while the bar goes away.
  //
  // TWO THRESHOLDS, kept from the collapse it replaces: close at 80, open at 8. One
  // threshold flips state on every crossing, and a thumb resting near the top made
  // the bar flap (measured: eight 4-6px nudges around 80 toggled it eight times).
  // Once it is gone it stays gone until the guest is genuinely back at the top.
  // HIDE-ON-SCROLL-DOWN WAS BUILT AND REVERTED (27 Sep 2026). Wayan asked for it
  // ("navbar gak sticky ... muncul kalo di scroll berlawanan arah, kayak facebook"),
  // saw it live, and asked for it back: "Sticky navbar biarin sticky". So the header is
  // sticky again and only the trip bar moves, exactly as it was before that change.
  // Do not re-add the direction logic without asking - it is a decision, not a gap.
  const [slid, setSlid] = useState(false);
  useEffect(() => {
    const onScroll = () => setSlid((was) => (was ? window.scrollY > 8 : window.scrollY > 80));
    onScroll(); // a page opened at an anchor starts already scrolled
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const isActive = (href) => {
    // '/index.html' counts as home. Static export PRERENDERS this page at pathname '/',
    // so a browser sitting on /index.html used to compute a DIFFERENT class here than
    // the server wrote - a hydration mismatch (React #418), which makes React throw away
    // the server HTML and re-render that page on the client. Measured: /index.html threw,
    // '/' did not. It also fixes the older symptom that the drawer's Home row simply did
    // not light up there. Nothing links to /index.html, so this only reaches people who
    // type or bookmark it - but it costs one comparison.
    if (href === '/') return pathname === '/' || pathname === '/index.html';
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
      className={`fixed left-0 right-0 z-[100] w-full bg-white animate-[navbarIn_0.4s_ease-out] motion-reduce:animate-none [transition:top_var(--dur)_var(--ease)] motion-reduce:transition-none ${slid ? 'top-[calc(-1_*_var(--tripbar-h,0px))]' : 'top-0'}`}
      ref={headerRef}
    >
      {/* Above the nav row, so sliding the header up takes the bar off the screen
          and leaves the nav flush at the top. */}
      <div ref={barRef}><TripBar /></div>
      <div className="flex justify-between items-center max-w-[1200px] mx-auto py-[0.55rem] px-[var(--container-x)] min-[993px]:px-5">
        <a href="/" className="max-[992px]:mr-auto">
          <img className="h-10 w-auto block mr-4 ml-[0.1rem] max-[992px]:h-[34px] max-[992px]:ml-[-0.25rem]" src="/assets/images/logo.webp" alt="The Cahyana Logo" width="1005" height="324" />
        </a>

        <DesktopNav isActive={isActive} />

        {/* Chat pindah ke sini (Sep 2026, Wayan) - dulu nempel di sticky bar bawah
            + tombol ngambang. Di navbar dia keliatan di semua halaman & semua lebar
            tanpa makan ruang di bawah layar. Yang di dalam drawer (tombol hijau
            "Chat on WhatsApp") tetep ada - itu buat yang udah buka menu.

            Sep 2026: dari link wa.me jadi panel support beneran. Jawabannya dari
            data situs sendiri (katalog harga + 15 FAQ + aturan jam), dan yang gak
            bisa dijawab dioper ke Wayan - jadi gak ada jawaban karangan. Tombolnya
            sengaja TETEP di sini & bentuknya sama persis kayak ikon keranjang di
            sebelahnya; yang berubah cuma apa yang kejadian pas di-tap. */}
        <ChatLauncher className={`${APP_HIDE} inline-flex items-center text-gold mr-[1.3rem] bg-transparent border-none p-0 cursor-pointer [transition:color_var(--dur)_ease,scale_var(--dur-fast)_var(--ease)] hover:text-gold-d max-[992px]:mr-[0.85rem]`} />

        <a href="/my-trips.html" className={`${APP_HIDE} relative inline-flex items-center text-gold mr-[1.3rem] transition-[color] duration-200 ease-[ease] hover:text-gold-d max-[992px]:mr-[0.85rem]`} aria-label="My Trips">
          <ShoppingBag className="w-5 h-5" strokeWidth={1.6} aria-hidden="true" />
          <span className={`absolute top-[-7px] right-[-9px] bg-gold ${BADGE_BASE}`} hidden={!count}>{count}</span>
        </a>

        {/* WO1: account slot, far right at every width (left of the burger on phones). */}
        <div className="flex items-center max-[992px]:mr-[0.85rem]"><AccountMenu onLogin={() => setAuthOpen(true)} /></div>

        <FlagDefs />

        <nav ref={navRef}>
          <ul
            className={`fixed top-0 right-0 bottom-0 left-auto w-4/5 max-w-[340px] max-[992px]:max-w-[360px] h-[100dvh] bg-white px-[22px] pb-[30px] overflow-y-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden overscroll-contain transition-[translate] duration-300 ease-[var(--ease)] motion-reduce:transition-none z-[120] flex flex-col items-stretch text-left gap-0 list-none ${menuOpen ? 'translate-x-0 pointer-events-auto' : 'translate-x-full pointer-events-none'}`}
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
            {/* WO1 (Wayan: "remove dupes"): the Welcome/avatar header, the Sign in button
                and the My Trip + Account Settings rows moved to the account slot in the
                bar. The x stays - the panel covers the burger while it is open, so this is
                the only close affordance a guest can see (see CLAUDE.md). */}
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

            {/* Nav — WAJIB cuma satu garis di drawer (di bawah Welcome, di atas); antar
                link nggak dikasih border lagi, kerasa kebanyakan garis (Wayan). Jarak
                antar-link murni dari padding baris (sekarang lewat MENU_ROW_BOX). */}
            <li className={NAV_LI}><a href="/" className={navLink(isActive('/'))}><House strokeWidth={1.7} aria-hidden="true" />Home</a></li>
            <li className={`relative ${NAV_LI}`}>
              <button
                type="button"
                className={`${MENU_ROW_BOX} text-strong font-body font-medium border-none bg-transparent text-gold cursor-pointer hover:bg-cream hover:text-green`}
                aria-expanded={dropOpen}
                onClick={() => setDropOpen((v) => !v)}
              >
                {/* ml-auto: chevron duduk di tepi kanan baris, sama kayak
                    chevron rail di HP (RAIL_MCHEV) - dulu dia nempel di teksnya. */}
                <Compass strokeWidth={1.7} aria-hidden="true" />Program<span className={`ml-auto inline-block transition-[rotate] duration-200 ease-[ease] ${dropOpen ? 'rotate-90' : ''}`}>&rsaquo;</span>
              </button>
              <Collapse open={dropOpen}>
              {/* pl = 0.9rem indent + 0.75rem yang dipinjem NAV_LI, biar sub-item
                  tetep mendarat di tempat yang sama (diukur: x=114 @390, sebelum
                  & sesudah). Ubah NAV_LI = ubah ini bareng. */}
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
            {/* Building2 = ikon yang sama dipakai rail Our Company buat "About Us". */}
            <li className={NAV_LI}><a href="/our-company.html" className={navLink(isActive('/our-company.html'))}><Building2 strokeWidth={1.7} aria-hidden="true" />Our Company</a></li>
            {/* Footer: Chat WA - mt-auto nge-pin ke bawah drawer. */}
            <li className="mt-auto pt-4">
              {/* Bug lama: `block` + `items-center justify-center` itu no-op tanpa
                  `flex` (icon+text numpuk kiri, gak center) + `text-gold` di atas bg
                  hijau (nyaris gak kebaca). Fix: flex biar align beneran + text-white
                  (icon currentColor ikut putih, samain gaya sama tombol Sign in). */}
              <a href={`https://wa.me/${WHATSAPP_NUMBER}`} target="_blank" rel="noopener" className={`flex w-full gap-2 ${BTN_SM} border-0 bg-cta no-underline text-white transition-[background,scale] duration-200 ease-[var(--ease)] hover:bg-cta-d`}>
                <MessageCircle className="w-[18px] h-[18px] flex-none" strokeWidth={1.7} aria-hidden="true" />
                WhatsApp
              </a>
            </li>
          </ul>
        </nav>

        {/* HAMBURGER BACK ON THE RIGHT, AND THE DRAWER WITH IT (27 Sep 2026, Wayan:
            "pindahin balik navbar humberger menu ke kanan lagi, dan kalo di buka
            menunya keluar di sisi kanan"). Earlier the same day it had moved to the
            left of the logo, and the panel with it; he saw both live and asked for
            the original back. This is the state that holds - do not move it left
            again without asking, it is a decision he has now seen twice.
            Two details travel with the button and are easy to miss:
            - the gap is ml, not mr: it separates the burger from the cart on its
              LEFT. Left of the logo it was mr, separating burger from logo. On phones it
              is NEGATIVE (-2px), and that is not a fudge: what the eye compares is the
              three 20px GLYPHS, and this button is the only one whose glyph does not fill
              its box - the bars are 20px inside a 24px hit area, so the ink sits 2px in on
              each side. Measured, the old ml-1 made the cart-to-burger gap 19.6 against
              13.6 everywhere else; -2px lands all three on 13.6. The box keeps its 24px
              width, so the thumb target is untouched. Desktop needs none of this - there
              the bars fill the button, so the gaps were already equal at 20.8.
            - the logo gets its negative left margin back. That pulls it out to the
              container edge, which is free again now the burger has left it.
            What does NOT come back: the burger's old 28px width and 5px bar gap.
            Wayan shrank those to 24/4 in a separate request he has not reverted.
            The cost of a right-hand drawer is the same as a left-hand one: the panel
            covers the burger while the menu is open, so the x in the Welcome row is
            the only close affordance a guest can see. It is not optional. */}
        <button
          className="min-[993px]:hidden relative flex flex-col gap-[4px] w-6 bg-transparent border-none cursor-pointer max-[992px]:w-6 max-[992px]:h-[2.2rem] max-[992px]:-ml-[2px] max-[992px]:items-center max-[992px]:justify-center"
          id="hamburger"
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          ref={burgerRef}
          onClick={() => setMenuOpen((v) => !v)}
        >
          <span className={`${BURGER_BAR} ${menuOpen ? 'translate-y-[6px] rotate-45' : ''}`} />
          <span className={`${BURGER_BAR} ${menuOpen ? 'opacity-0' : 'opacity-100'}`} />
          <span className={`${BURGER_BAR} ${menuOpen ? '-translate-y-[6px] -rotate-45' : ''}`} />
          {/* Titik hijau "ada booking mendatang" - titik bulat 8px sesuai maksud
              .acct__dot lama. (Di CSS lama sempet ke-override `.navbar__toggle
              span:not(.itn-badge)` jadi bar emas tipis - bug; Wayan minta dibenerin
              jadi titik hijau pas migrasi Tailwind ini.) */}
          <span className="absolute top-[-2px] right-[-2px] w-2 h-2 bg-[#3fae5a] rounded-[50%] border-2 border-white [&[hidden]]:hidden" hidden={!hasUpcoming} />
        </button>
      </div>

      <div className={`fixed inset-0 bg-[rgba(26,26,26,0.45)] z-[95] transition-[opacity,visibility] duration-300 ease-[var(--ease)] ${menuOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}`} onClick={() => setMenuOpen(false)} />
      <AuthModal open={authOpen} onClose={() => setAuthOpen(false)} />
    </header>
  );
}
