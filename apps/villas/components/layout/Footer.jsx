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

// The footer. The SHELL - one grid row of five columns, the one hairline above
// the copyright, the 22px social circles, the line-height pin - lives in
// @cahyana/ui (blocks/FooterShell.jsx) and is shared with CUE. This file is the
// five columns' contents.
//
// COLUMN MAPPING (CUE -> here):
//   brand + contact        -> brand + contact
//   Explore                -> Stay
//   Company                -> Services
//   Featured On + Follow   -> Company + Follow   (no press logos here, so the
//                             slot carries the second heading pair instead)
//   We Accept              -> (dropped: no payment chips on this site)

const BRAND = 'Ubud Private Villas';

const COLUMNS = [
  {
    heading: 'Stay',
    items: [
      { href: '/villas/cahyana-house', label: 'Cahyana House' },
      { href: '/villas/cahyana-tibuah', label: 'Cahyana Tibuah' },
      { href: '/villas', label: 'All villas' },
      { href: '/experiences', label: 'Experiences' },
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
    // The standalone /about page is gone: its copy now lives in the Our Company
    // page's About tab, and running both would have been the same words on two
    // URLs competing with each other in search. CUE retired its standalone
    // About/Contact/FAQ pages into Our Company for the same reason.
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

// ONE PLACE TO PUT THE REAL LINKS IN. Every one of these is an account that
// exists in life but has no URL on file yet. `href: null` makes the shell render
// it aria-disabled rather than as a bare href="#" that silently jumps to the top
// of the page. Fill the href in and the attribute goes away on its own.
const SOCIAL = {
  heading: 'Follow',
  links: [
    { name: 'Airbnb', href: null },     // TODO: the two villas' Airbnb listing or host page
    { name: 'Instagram', href: null },  // TODO
    { name: 'Facebook', href: null },   // TODO
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
