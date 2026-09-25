'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { BedDouble, BookOpen, Building2, House, Mail, MessageCircle, ShoppingBag, Sparkles, X } from 'lucide-react';
import { Button, FlagDefs, NavbarShell, NAV_BADGE, NAV_BADGE_BASE, NAV_ICON, NAV_ROW_END } from '@cahyana/ui';
import CurrencyPicker from '@/components/ui/CurrencyPicker';
import Select from '@/components/ui/Select';
import { useTripPrefs } from '@/components/providers/TripPrefsProvider';
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
//   Home / Program▾ / Guide / …      Home / Villas▾ / Guide / Services▾ / …
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

// Six is the largest villa (Cahyana House sleeps 6) - offering more would be
// offering something neither villa has.
const GUEST_OPTIONS = [1, 2, 3, 4, 5, 6];

// The site's own field label, the one the hero search card uses (SEARCH_LABEL).
// CUE's drawer labels are its own FIELD_LABEL; each site keeps the label it
// already had, since what travels between the two is the ROW, not the type.
const NAV_FIELD_LABEL = 'block mb-1 text-label font-medium tracking-[0.14em] uppercase text-muted';
// max-[361px], not max-[360px]: Tailwind compiles max-[N] to
// `@media not all and (min-width:N)`, which does NOT match at exactly N - so a
// 360px-wide phone would fall through to the two-column layout with zero slack
// left in the guests control. Stacking through 360 and splitting from 361 has
// no such hole. (CUE documents the same trap on its 992/993 pairs.)
const FIELD_CELL = 'flex flex-col gap-1 min-w-0 max-[361px]:col-span-2';

const LINKS = [
  { href: '/', label: 'Home', icon: <House {...ICON} /> },
  // VILLAS IS A DROPDOWN, NOT A PAGE (Wayan: "di menu gaada page villa yang isi
  // nya 2, ubah menjadi cuma ada satu dropdown villa bukan page, dan kalo di klik
  // keluar nya page cahyana house dan cahyana tibuah terpisah"). With two villas a
  // listing page is a stop on the way to the thing the guest actually wants, so
  // the menu hands them the two villas directly. /villas is gone.
  {
    label: 'Villas',
    icon: <BedDouble {...ICON} />,
    items: [
      { href: '/villas/cahyana-house', label: 'Cahyana House' },
      { href: '/villas/cahyana-tibuah', label: 'Cahyana Tibuah' },
    ],
  },
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
  const { guests, setGuests } = useTripPrefs();
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
      /* THE FIELD ROW, CUE'S (Wayan: "lihat menu login cue, ikutin itu, pakai
         jumlah guest dan currency juga"). Two trip preferences side by side,
         the same pair and the same two-column grid CUE's account drawer uses -
         minus its Pickup area, which is a tour thing and means nothing at a
         villa you are staying in.

         GUESTS IS NOT DECORATION HERE. It is the site-wide count from
         TripPrefsProvider, so setting it in the drawer sets it in the hero
         search card and in Book Your Stay - before this the site carried three
         separate counts that never spoke to each other.

         Both live in the field row rather than the head: CUE measured the head
         wrapping the name onto a second line at 390px once a fourth thing
         joined it. */
      fields={(
        <>
          {/* THEY STACK BELOW 361px. Measured at 320: two columns leave the
              guests control 99px, and "2 guests" needs 52px of text inside a
              44px box - the value renders as "2 gu...", which is the one thing
              a count must never do. Full width below the step, CUE side by side
              above it. */}
          <div className={FIELD_CELL}>
            <label className={NAV_FIELD_LABEL} htmlFor="nav-guests">Guests</label>
            <Select
              id="nav-guests"
              label="Guests"
              value={String(guests)}
              onChange={(v) => setGuests(Number(v))}
              options={GUEST_OPTIONS.map((n) => ({ value: String(n), label: `${n} guest${n > 1 ? 's' : ''}` }))}
            />
          </div>
          <div className={FIELD_CELL}>
            <label className={NAV_FIELD_LABEL} htmlFor="nav-cur">Currency</label>
            <CurrencyPicker />
          </div>
        </>
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
