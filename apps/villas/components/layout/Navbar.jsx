'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { BedDouble, BookOpen, Building2, Compass, House, Mail, MessageCircle, ShoppingBag, Sparkles, X } from 'lucide-react';
import { Button, FlagDefs, NavbarShell, NAV_BADGE, NAV_BADGE_BASE, NAV_ICON, NAV_ROW_END } from '@cahyana/ui';
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

// One icon per row, CUE's arrangement. Every icon is Lucide and every one is
// the icon that already means that thing elsewhere on the site: BedDouble is
// the villa mark in the drawer head, ShoppingBag is the navbar's own cart,
// Building2 is what CUE's Our Company rail uses for "About Us".
const ICON = { strokeWidth: 1.7, 'aria-hidden': 'true' };

const LINKS = [
  { href: '/', label: 'Home', icon: <House {...ICON} /> },
  { href: '/villas', label: 'Villas', icon: <BedDouble {...ICON} /> },
  { href: '/experiences', label: 'Experiences', icon: <Compass {...ICON} /> },
  { href: '/guide', label: 'Guide', icon: <BookOpen {...ICON} /> },
  {
    label: 'Services',
    icon: <Sparkles {...ICON} />,
    items: [
      { href: '/services/breakfast', label: 'Breakfast' },
      { href: '/services/spa', label: 'Spa & Massage' },
      { href: '/services/live-dinner', label: 'Live Dinner' },
      { href: '/services/scooter-rental', label: 'Scooter Rental' },
    ],
  },
  { href: '/my-booking', label: 'My Booking', icon: <ShoppingBag {...ICON} /> },
  { href: '/our-company', label: 'Our Company', icon: <Building2 {...ICON} /> },
  { href: '/our-company#contact', label: 'Contact', icon: <Mail {...ICON} /> },
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
      }}
      closeIcon={<X strokeWidth={2} aria-hidden="true" />}
      /* Currency sits in the field row, not in the head. It is a trip
         preference like guests and dates, and the head row cannot carry a
         fourth thing: CUE measured the name wrapping onto a second line at
         390px once the close button joined it. This site has only the one
         preference, so the row holds one field. */
      fields={(
        <div className="flex flex-col gap-1 min-w-0 col-span-2">
          <label className="text-label font-medium tracking-[0.14em] uppercase text-muted" htmlFor="nav-cur">Currency</label>
          <CurrencyPicker />
        </div>
      )}
      cta={(close) => (
        <Button full onClick={() => { close(); openBooking(); }}>
          Check availability
        </Button>
      )}
      links={LINKS.map((l) => (l.href === '/my-booking'
        ? { ...l, end: <span className={`${NAV_ROW_END} bg-gold ${NAV_BADGE_BASE}`} hidden={!count}>{count}</span> }
        : l))}
      drawerFoot={(
        <Button as="a" full href={WHATSAPP_LINK} target="_blank" rel="noopener">
          <MessageCircle className="w-4 h-4 flex-none" strokeWidth={1.8} aria-hidden="true" />
          Chat on WhatsApp
        </Button>
      )}
    />
  );
}
