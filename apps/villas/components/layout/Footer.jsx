import Link from 'next/link';
import { Mail, MapPin, MessageCircle } from 'lucide-react';
import {
  FooterShell,
  FOOT_CONTACT_ITEM,
  FOOT_CONTACT_LINK,
  FOOT_CONTACT_SVG,
  FOOT_BOTTOM_TEXT,
  FOOT_COL_A,
  FOOT_REG,
} from '@cahyana/ui';
import { CONTACT_EMAIL, CUE_LINK, WHATSAPP_LINK } from '@/lib/constants';
import { REGISTRATION } from '@/content/registration';

// Footer contents only; the five-column shell lives in @cahyana/ui FooterShell and is shared with CUE.

const BRAND = 'Ubud Private Villas';

const COLUMNS = [
  {
    heading: 'Stay',
    items: [
      { href: '/villas/cahyana-house', label: 'Cahyana House' },
      { href: '/villas/cahyana-tibuah', label: 'Cahyana Tibuah' },
      { href: '/guide', label: 'Ubud guide' },
    ],
  },
  {
    heading: 'Services',
    items: [
      { href: '/services/breakfast', label: 'Breakfast' },
      { href: '/services/spa', label: 'Spa & Massage' },
      { href: '/services/live-dinner', label: 'Live Dinner' },
      { href: '/services/scooter-rental', label: 'Scooter Rental' },
    ],
  },
  {
    // No standalone /about page: its copy lives in Our Company, so two URLs do not compete in search.
    heading: 'Company',
    id: 'contact',
    items: [
      { href: '/our-company#about', label: 'About Us' },
      { href: '/our-company#contact', label: 'Contact' },
      { href: '/our-company#faq', label: 'FAQ' },
      { href: '/our-company#privacy', label: 'Privacy Policy' },
      { href: CUE_LINK, label: 'Tours & Drivers', external: true },
    ],
  },
];

// CEK WAYAN: Instagram stays hidden until there is a real account URL (CUE's is still "#"); no Facebook.
const SOCIAL = {
  heading: 'Follow',
  links: [{ name: 'WhatsApp', href: WHATSAPP_LINK }],
};

// Text wordmarks: no partner logo files or listing URLs yet.
const FEATURED = { heading: 'Featured On', names: ['Airbnb', 'Booking.com'] };

export default function Footer() {
  return (
    <FooterShell
      linkAs={Link}
      columns={COLUMNS}
      social={SOCIAL}
      featured={FEATURED}
      brand={(
        <>
          <Link href="/" className="inline-block no-underline text-green">
            <span className="font-body text-[1.1rem] font-semibold text-green leading-[1.2]">{BRAND}</span>
          </Link>
          <div className="mt-[0.9rem] flex flex-col gap-[0.55rem]">
            <a href={WHATSAPP_LINK} target="_blank" rel="noopener" className={FOOT_CONTACT_LINK}>
              <MessageCircle className={FOOT_CONTACT_SVG} strokeWidth={1.8} aria-hidden="true" />
              Message us on WhatsApp
            </a>
            <a href={`mailto:${CONTACT_EMAIL}`} className={FOOT_CONTACT_LINK}>
              <Mail className={FOOT_CONTACT_SVG} strokeWidth={1.8} aria-hidden="true" />
              {CONTACT_EMAIL}
            </a>
            <span className={FOOT_CONTACT_ITEM}>
              <MapPin className={FOOT_CONTACT_SVG} strokeWidth={1.8} aria-hidden="true" />
              North Ubud, Bali
            </span>
          </div>
        </>
      )}
      bottom={(
        <>
          <p className={FOOT_BOTTOM_TEXT}>&copy; 2026 {BRAND}. All rights reserved.</p>
          <p className={FOOT_REG}>
            <span className="whitespace-nowrap">{REGISTRATION.name}</span>
            <span aria-hidden="true">·</span>
            <span className="whitespace-nowrap">Ministry of Law <a href={REGISTRATION.verifyUrl} target="_blank" rel="noopener" className="text-inherit underline">{REGISTRATION.decreeShort}</a></span>
            <span aria-hidden="true">·</span>
            <span className="whitespace-nowrap">NIB {REGISTRATION.nib}</span>
          </p>
          <a href={CUE_LINK} target="_blank" rel="noopener" className={`${FOOT_BOTTOM_TEXT} ${FOOT_COL_A}`}>
            Part of Cahyana Ubud Experience
          </a>
        </>
      )}
    />
  );
}
