'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { BedDouble, BookOpen, Building2, House, Mail, MessageCircle, ShoppingBag, Sparkles, UserRound, UserRoundPlus, X } from 'lucide-react';
import { Button, FlagDefs, NavbarShell, NAV_BADGE, NAV_BADGE_BASE, NAV_ICON, NAV_ROW_END } from '@cahyana/ui';
import CurrencyPicker from '@/components/ui/CurrencyPicker';
import Select from '@/components/ui/Select';
import { useTripPrefs } from '@/components/providers/TripPrefsProvider';
import { useAccount } from '@/components/providers/AccountProvider';
import AuthSheet from '@/components/account/AuthSheet';
import { useCart } from '@/components/providers/CartProvider';
import { WHATSAPP_LINK } from '@/lib/constants';

// Short drawer title: "Ubud Private Villas" wrapped at 390px and made the row 12px taller than CUE's.
const BRAND = { title: 'Plan your stay', sub: 'Two private pool villas in Ubud' };

// One Lucide icon per row, each the icon that already means that thing elsewhere on the site.
const ICON = { strokeWidth: 1.7, 'aria-hidden': 'true' };

// Six is the largest villa (Cahyana House sleeps 6): more would offer something neither villa has.
const GUEST_OPTIONS = [1, 2, 3, 4, 5, 6];

// The site's own field label (same as the hero SEARCH_LABEL); what travels from CUE is the row, not the type.
const NAV_FIELD_LABEL = 'block mb-1 text-label font-medium tracking-[0.14em] uppercase text-muted';
// max-[361px], not 360: Tailwind's max-[N] does not match at exactly N, so a 360px phone would get two columns.
const FIELD_CELL = 'flex flex-col gap-1 min-w-0 max-[361px]:col-span-2';

const LINKS = [
  { href: '/', label: 'Home', icon: <House {...ICON} /> },
  // Villas is a dropdown, not a page (Wayan): with two villas a listing page is just a stop on the way.
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
// Header slots only: the drawer, burger, header-height vars and spacing live in @cahyana/ui NavbarShell, shared with CUE.
export default function Navbar() {
  const pathname = usePathname();
  const { guests, setGuests } = useTripPrefs();
  const { account, logout } = useAccount();
  const [authOpen, setAuthOpen] = useState(false);
  const { count } = useCart();

  function isActive(href) {
    const base = href.split('#')[0];
    if (base === '/') return pathname === '/';
    return pathname?.startsWith(base);
  }

  return (
    <>
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
          {/* Chat lives in the navbar like CUE: visible on every page and width without taking the bottom of the screen. */}
          <a
            href={WHATSAPP_LINK}
            target="_blank"
            rel="noopener"
            className={NAV_ICON}
            aria-label="Chat on WhatsApp"
          >
            <MessageCircle className="w-5 h-5" strokeWidth={1.6} aria-hidden="true" />
          </a>

          {/* My Booking in CUE's cart slot; the badge only shows once the booking has something in it. */}
          <Link href="/my-booking" className={`relative ${NAV_ICON}`} aria-label="My Booking">
            <ShoppingBag className="w-5 h-5" strokeWidth={1.6} aria-hidden="true" />
            <span className={NAV_BADGE} hidden={!count}>{count}</span>
          </Link>
        </>
      )}
      extras={<FlagDefs />}
      /* Signed in, the head row greets the guest like CUE; signed out it keeps the brand line, as there is no guest to greet. */
      drawerHead={{
        icon: account
          ? <UserRound className="w-5 h-5" strokeWidth={1.6} />
          : <BedDouble className="w-5 h-5" strokeWidth={1.6} />,
        title: account ? `Welcome, ${(account.name || '').split(' ')[0] || 'friend'}` : BRAND.title,
        sub: account ? (account.email || BRAND.sub) : BRAND.sub,
      }}
      closeIcon={<X strokeWidth={2} aria-hidden="true" />}
      /* CUE's field row minus Pickup: Guests is the site-wide count from TripPrefsProvider, shared with hero search and booking. */
      fields={(
        <>
          {/* Stack below 361px: at 320 two columns cut "2 guests" to "2 gu...", which a count must never do. */}
          <div className={FIELD_CELL}>
            <label className={NAV_FIELD_LABEL} htmlFor="nav-guests">Guests</label>
            <Select
              id="nav-guests"
              label="Guests"
              value={String(guests)}
              onChange={(value) => setGuests(Number(value))}
              options={GUEST_OPTIONS.map((count) => ({ value: String(count), label: `${count} guest${count > 1 ? 's' : ''}` }))}
            />
          </div>
          <div className={FIELD_CELL}>
            <label className={NAV_FIELD_LABEL} htmlFor="nav-cur">Currency</label>
            <CurrencyPicker />
          </div>
        </>
      )}
      /* Sign in sits in CUE's drawer button slot (Wayan); it is the same account as the tour site, one guest record. */
      cta={(close) => (
        <Button full onClick={() => { close(); if (account) logout(); else setAuthOpen(true); }}>
          {account ? <UserRound className="w-4 h-4 flex-none" strokeWidth={1.8} aria-hidden="true" />
                   : <UserRoundPlus className="w-4 h-4 flex-none" strokeWidth={1.8} aria-hidden="true" />}
          {account ? 'Sign out' : 'Sign in'}
        </Button>
      )}
      links={LINKS.map((link) => (link.href === '/my-booking'
        ? { ...link, end: <span className={`${NAV_ROW_END} bg-gold ${NAV_BADGE_BASE}`} hidden={!count}>{count}</span> }
        : link))}
      drawerFoot={(
        <Button as="a" full href={WHATSAPP_LINK} target="_blank" rel="noopener">
          <MessageCircle className="w-4 h-4 flex-none" strokeWidth={1.8} aria-hidden="true" />
          Chat on WhatsApp
        </Button>
      )}
    />
    {/* Outside the drawer: the drawer closes on the way in, and the sign-in sheet has to outlive it. */}
    <AuthSheet open={authOpen} onClose={() => setAuthOpen(false)} />
    </>
  );
}
