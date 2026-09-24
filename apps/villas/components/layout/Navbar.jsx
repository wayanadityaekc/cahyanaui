'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { BedDouble, MessageCircle, ShoppingBag } from 'lucide-react';
import { FlagDefs, NavbarShell, NAV_BADGE, NAV_ICON } from '@cahyana/ui';
import CurrencyPicker from '@/components/ui/CurrencyPicker';
import { useBooking } from '@/components/providers/BookingProvider';
import { useCart } from '@/components/providers/CartProvider';
import { WHATSAPP_LINK } from '@/lib/constants';

// The site header. The SHELL - the drawer, the hamburger that morphs into an X,
// the two header-height variables, the one hairline, the spacing pair on the
// icons - lives in @cahyana/ui (blocks/NavbarShell.jsx) and is shared with CUE.
// This file is only what goes in the slots.
//
// The slot mapping, for anyone comparing the two sites:
//
//   CUE                              here
//   ───────────────────────────────  ─────────────────────────────────────
//   logo + chat + cart               logo + chat + My Booking
//   drawer "Welcome, <account>" row  site name + tagline row
//   Guests / Pickup area selects     (omitted - no site-wide trip prefs)
//   "Sign in / Sign up" button       "Check availability"
//   Home / Program▾ / Guide / …      Home / Villas / Experiences / Services▾ / …
//   "Chat on WhatsApp" pinned        same

// The drawer's top row is CUE's ACCOUNT row. There are no accounts here, so it
// carries a heading instead - and it has to be SHORT. The row is
// [icon][text][currency] and at 390px that leaves the text column ~118px;
// "Ubud Private Villas" measures ~130px at 14px/600, so it wrapped and made the
// row 12px taller than CUE's (76.6px vs 64.6px, measured). It would also just
// repeat the logo sitting a centimetre above it.
const BRAND = { title: 'Plan your stay', sub: 'Two private pool villas in Ubud' };

const LINKS = [
  { href: '/', label: 'Home' },
  { href: '/villas', label: 'Villas' },
  { href: '/experiences', label: 'Experiences' },
  { href: '/guide', label: 'Guide' },
  {
    label: 'Services',
    items: [
      { href: '/services/breakfast', label: 'Breakfast' },
      { href: '/services/spa', label: 'Spa & Massage' },
      { href: '/services/live-dinner', label: 'Live Dinner' },
      { href: '/services/scooter-rental', label: 'Scooter Rental' },
    ],
  },
  { href: '/our-company', label: 'Our Company' },
  { href: '/our-company#contact', label: 'Contact' },
];

export default function Navbar() {
  const pathname = usePathname();
  const { openBooking } = useBooking();
  const { count } = useCart();

  const isActive = (href) => {
    const base = href.split('#')[0];
    if (base === '/') return pathname === '/';
    return pathname?.startsWith(base);
  };

  return (
    <NavbarShell
      linkAs={Link}
      isActive={isActive}
      logo={(
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
      )}
      actions={(
        <>
          {/* Chat lives in the navbar, CUE's arrangement since Sep 2026: visible
              on every page at every width without taking a slot at the bottom of
              the screen. The green button inside the drawer stays - that one is
              for a guest who already opened the menu. */}
          <a
            href={WHATSAPP_LINK}
            target="_blank"
            rel="noopener"
            className={NAV_ICON}
            aria-label="Chat on WhatsApp"
          >
            <MessageCircle className="w-5 h-5" strokeWidth={1.6} aria-hidden="true" />
          </a>

          {/* My Booking, CUE's cart slot: same icon size, same spacing pair,
              same badge. The number only shows once there is something in the
              booking - an empty badge is noise. */}
          <Link href="/my-booking" className={`relative ${NAV_ICON}`} aria-label="My Booking">
            <ShoppingBag className="w-5 h-5" strokeWidth={1.6} aria-hidden="true" />
            <span className={NAV_BADGE} hidden={!count}>{count}</span>
          </Link>
        </>
      )}
      extras={<FlagDefs />}
      drawerHead={{
        icon: <BedDouble className="w-5 h-5" strokeWidth={1.6} />,
        title: BRAND.title,
        sub: BRAND.sub,
        aside: <CurrencyPicker variant="navbar" />,
      }}
      cta={(close) => (
        <button
          type="button"
          className="flex items-center justify-center gap-2 w-full h-[2.6rem] border-0 rounded-pill bg-cta text-white font-body font-semibold text-strong cursor-pointer transition-[background,scale] duration-200 ease-[var(--ease)] hover:bg-cta-d"
          onClick={() => { close(); openBooking(); }}
        >
          Check availability
        </button>
      )}
      links={LINKS}
      drawerFoot={(
        <a
          href={WHATSAPP_LINK}
          target="_blank"
          rel="noopener"
          className="flex items-center justify-center gap-2 w-full h-[2.5rem] border-0 bg-cta rounded-pill text-strong font-medium no-underline text-white transition-[background,scale] duration-200 ease-[var(--ease)] hover:bg-cta-d"
        >
          <MessageCircle className="w-[18px] h-[18px] flex-none" strokeWidth={1.7} aria-hidden="true" />
          Chat on WhatsApp
        </a>
      )}
    />
  );
}
