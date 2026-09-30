import Link from 'next/link';
import { Mail, MapPin, MessageCircle } from 'lucide-react';
import {
  FooterShell,
  FOOT_CONTACT_ITEM,
  FOOT_CONTACT_LINK,
  FOOT_CONTACT_SVG,
  FOOT_BOTTOM_TEXT,
  FOOT_COL_A,
} from '@cahyana/ui';
import { CONTACT_EMAIL, CUE_LINK, WHATSAPP_LINK } from '@/lib/constants';

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

// href: null renders aria-disabled instead of a dead "#" link; fill in the real URL and it turns on by itself.
const SOCIAL = {
  heading: 'Follow',
  links: [
    // TODO: the two villas' Airbnb listing or host page
    { name: 'Airbnb', href: null },
    // TODO
    { name: 'Instagram', href: null },
    // TODO
    { name: 'Facebook', href: null },
  ],
};

export default function Footer() {
  return (
    <FooterShell
      linkAs={Link}
      columns={COLUMNS}
      social={SOCIAL}
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
          <a href={CUE_LINK} target="_blank" rel="noopener" className={`${FOOT_BOTTOM_TEXT} ${FOOT_COL_A}`}>
            Part of Cahyana Ubud Experience
          </a>
        </>
      )}
    />
  );
}
