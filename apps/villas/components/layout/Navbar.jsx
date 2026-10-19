'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { BedDouble, BookOpen, Building2, House, MessageCircle, Settings, ShoppingBag, Sparkles } from 'lucide-react';
import { AccountMenu, Button, FlagDefs, NavbarShell, NAV_BADGE, NAV_ICON } from '@cahyana/ui';
import { useAccount } from '@/components/providers/AccountProvider';
import AuthSheet from '@/components/account/AuthSheet';
import { useCart } from '@/components/providers/CartProvider';
import { WHATSAPP_LINK } from '@/lib/constants';
import ChatLauncher from '@/components/chat/ChatLauncher';
import { PopMenu } from '@/components/ui/Reveal';
import TripPrefsFields from './TripPrefsFields';

const ICON = { strokeWidth: 1.7, 'aria-hidden': 'true' };

const LINKS = [
  { href: '/', label: 'Home', icon: <House {...ICON} /> },
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
  { href: '/our-company', label: 'Our Company', icon: <Building2 {...ICON} /> },
];

const ACCOUNT_ROWS = [{ href: '/settings', label: 'Settings', icon: <Settings {...ICON} /> }];

export default function Navbar() {
  const pathname = usePathname();
  const { account, hydrated, logout } = useAccount();
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const { count } = useCart();

  function isActive(href) {
    const base = href.split('#')[0];
    if (base === '/') return pathname === '/';
    return pathname?.startsWith(base);
  }

  return (
    <>
      <NavbarShell
        pop={PopMenu}
        linkAs={Link}
        isActive={isActive}
        links={LINKS}
        logo={
          <Link href="/" className="max-[992px]:mr-auto" aria-label="Ubud Private Villas home">
            <img
              className="h-10 w-auto block mr-4 ml-[0.1rem] max-[992px]:h-[34px] max-[992px]:ml-0"
              src="/images/logo.webp"
              alt="Cahyana Ubud-Bali · Ubud Private Villas"
              width="1005"
              height="324"
            />
          </Link>
        }
        actions={
          <>
            <ChatLauncher className={NAV_ICON} />

            <Link href="/my-booking" className={`relative ${NAV_ICON}`} aria-label="My Booking">
              <ShoppingBag className="w-5 h-5" strokeWidth={1.6} aria-hidden="true" />
              <span className={NAV_BADGE} hidden={!count}>
                {count}
              </span>
            </Link>
          </>
        }
        extras={<FlagDefs />}
        fields={<TripPrefsFields idPrefix="acct" />}
        drawerFoot={(close) => (
          <Button as="a" full href={WHATSAPP_LINK} target="_blank" rel="noopener" onClick={close}>
            <MessageCircle className="w-4 h-4 flex-none" strokeWidth={1.8} aria-hidden="true" />
            WhatsApp
          </Button>
        )}
        account={
          <AccountMenu
            pop={PopMenu}
            account={account}
            hydrated={hydrated}
            linkAs={Link}
            onLogin={() => setIsAuthOpen(true)}
            onLogout={logout}
            loginTitle="Plan your stay"
            loginNote="Sign in with your email. No password needed."
            prefs={<TripPrefsFields idPrefix="menu" />}
            rows={ACCOUNT_ROWS}
          />
        }
      />
      <AuthSheet open={isAuthOpen} onClose={() => setIsAuthOpen(false)} />
    </>
  );
}
