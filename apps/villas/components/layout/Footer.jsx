import Link from 'next/link';
import { Mail, MapPin, MessageCircle } from 'lucide-react';
import { CONTACT_EMAIL, CUE_LINK, WHATSAPP_LINK } from '@/lib/constants';

// CUE's footer (components/layout/Footer.jsx there), reused class for class —
// including the light surface. Only the five columns' contents are this site's.
//
// SHAPE: one grid row, five columns on desktop, dropping to two below 900px
// with the brand block spanning the full width. CUE arrived at this after
// building and measuring three layouts; what makes it compact is that nothing
// gets a full-width band of its own. There is exactly ONE hairline in the whole
// footer — the bar above the copyright.
//
// COLUMN MAPPING (CUE -> here):
//   brand + contact        -> brand + contact
//   Explore                -> Stay
//   Company                -> Services
//   Featured On + Follow   -> Company + Follow   (no press logos here, so the
//                             slot carries the second heading pair instead)
//   We Accept              -> (dropped: no payment chips on this site)
//
// The brand is a TEXT wordmark, as CUE's is, not the logo image — at footer
// size the mark stops being legible and the name has to be readable.
//
// leading-[normal] on the <footer>: CUE's body sets no line-height and this
// site's base layer sets 1.6, so without this every row here rendered ~5px
// taller than CUE's (col item 20.5px vs 15px, bottom bar 41.5px vs 36px).
// Scoped to this subtree so body copy elsewhere keeps its 1.6.
//
// Icon sizes are deliberately small (CUE: social circles 22px). The footer is
// the last thing anyone reads, not somewhere to pull attention.
const CONTACT_ITEM = 'flex items-center gap-[0.55rem] text-[0.8rem] text-green opacity-90 no-underline';
const CONTACT_LINK = `${CONTACT_ITEM} hover:opacity-100 hover:text-gold`;
const CONTACT_SVG = 'w-4 h-4 shrink-0 text-gold';
const SOCIAL_A =
  'flex items-center justify-center w-[22px] h-[22px] rounded-[50%] text-green bg-[rgba(0,0,0,0.06)] hover:text-white hover:bg-gold';
const COL_A = 'no-underline text-green hover:text-gold';
const COL_H = 'mb-[0.9rem] font-body text-h3 font-semibold tracking-normal text-gold';
const COL_LI = 'mb-[0.55rem] text-[0.8rem] opacity-[0.85]';

// Airbnb, Instagram and Facebook are HAND-DRAWN. Lucide dropped brand icons in
// v1 (6329 icons, zero brand marks), which is the same carve-out CUE already
// makes for its payment logos and currency flags. Drawn as single-colour
// outlines so they inherit currentColor and sit in the 22px circles like CUE's.
function BrandIcon({ name }) {
  return (
    <svg className="block w-[13px] h-[13px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {name === 'Airbnb' ? (
        // The Bélo: a loop that rises to a point and tucks back under itself.
        <path d="M12 3c1 0 1.7.7 2.3 1.9 1.4 2.8 3.4 7 4.4 9.4.7 1.8.1 3.6-1.5 4.3-1.5.6-3.2 0-4.2-1.4L12 15.6l-1 1.6c-1 1.4-2.7 2-4.2 1.4-1.6-.7-2.2-2.5-1.5-4.3 1-2.4 3-6.6 4.4-9.4C10.3 3.7 11 3 12 3Z" />
      ) : name === 'Instagram' ? (
        <>
          <rect x="3" y="3" width="18" height="18" rx="5" />
          <circle cx="12" cy="12" r="4" />
          <circle cx="17.2" cy="6.8" r="1" fill="currentColor" stroke="none" />
        </>
      ) : (
        <path d="M14 9h2V6h-2c-1.7 0-3 1.3-3 3v2H9v3h2v6h3v-6h2.2l.8-3H14V9.6c0-.3.3-.6.6-.6H16" />
      )}
    </svg>
  );
}

// ONE PLACE TO PUT THE REAL LINKS IN. Every one of these is an account that
// exists in life but has no URL on file yet, so each carries aria-disabled
// instead of a bare href="#": a link that goes nowhere should say so to a
// screen reader rather than silently jumping to the top of the page. Fill in
// `href` here and delete the `href: null` and the attribute follows.
const SOCIAL = [
  { name: 'Airbnb', href: null },     // TODO: the two villas' Airbnb listing or host page
  { name: 'Instagram', href: null },  // TODO
  { name: 'Facebook', href: null },   // TODO
];

/* ── CONTENT ─────────────────────────────────────────────────────────────── */

const BRAND = 'Ubud Private Villas';

const STAY = [
  ['/villas/cahyana-house', 'Cahyana House'],
  ['/villas/cahyana-tibuah', 'Cahyana Tibuah'],
  ['/villas', 'All villas'],
  ['/experiences', 'Experiences'],
  ['/guide', 'Ubud guide'],
];

const SERVICES = [
  ['/services/breakfast', 'Breakfast'],
  ['/services/spa', 'Spa & Massage'],
  ['/services/live-dinner', 'Live Dinner'],
  ['/services/scooter-rental', 'Scooter Rental'],
];

// The standalone /about page is gone: its copy now lives in the Our Company
// page's About tab, and running both would have been the same words on two
// URLs competing with each other in search. CUE retired its standalone
// About/Contact/FAQ pages into Our Company for the same reason.
const COMPANY = [
  ['/our-company#about', 'About Us'],
  ['/our-company#contact', 'Contact'],
  ['/our-company#faq', 'FAQ'],
  ['/our-company#privacy', 'Privacy Policy'],
];

/* ────────────────────────────────────────────────────────────────────────── */

export default function Footer() {
  return (
    <footer className="px-6 pt-10 pb-5 leading-[normal] text-green bg-[#ebe8e2]">
      <div
        className="grid max-w-[1100px] mx-auto gap-x-8 gap-y-9
                   grid-cols-[1.5fr_0.9fr_1.2fr_0.9fr_1fr]
                   max-[900px]:grid-cols-2 max-[900px]:gap-y-8"
      >
        <div className="max-[900px]:col-span-full">
          <Link href="/" className="inline-block no-underline text-green">
            <span className="font-body text-[1.1rem] font-semibold text-green leading-[1.2]">{BRAND}</span>
          </Link>
          <div className="mt-[0.9rem] flex flex-col gap-[0.55rem]">
            <a href={WHATSAPP_LINK} target="_blank" rel="noopener" className={CONTACT_LINK}>
              <MessageCircle className={CONTACT_SVG} strokeWidth={1.8} aria-hidden="true" />
              Message us on WhatsApp
            </a>
            <a href={`mailto:${CONTACT_EMAIL}`} className={CONTACT_LINK}>
              <Mail className={CONTACT_SVG} strokeWidth={1.8} aria-hidden="true" />
              {CONTACT_EMAIL}
            </a>
            <span className={CONTACT_ITEM}>
              <MapPin className={CONTACT_SVG} strokeWidth={1.8} aria-hidden="true" />
              North Ubud, Bali
            </span>
          </div>
        </div>

        <div>
          <h4 className={COL_H}>Stay</h4>
          <ul className="list-none">
            {STAY.map(([h, t]) => <li key={h} className={COL_LI}><Link href={h} className={COL_A}>{t}</Link></li>)}
          </ul>
        </div>

        <div>
          <h4 className={COL_H}>Services</h4>
          <ul className="list-none">
            {SERVICES.map(([h, t]) => <li key={h} className={COL_LI}><Link href={h} className={COL_A}>{t}</Link></li>)}
          </ul>
        </div>

        <div id="contact">
          <h4 className={COL_H}>Company</h4>
          <ul className="list-none">
            {COMPANY.map(([h, t]) => <li key={h} className={COL_LI}><Link href={h} className={COL_A}>{t}</Link></li>)}
            <li className={COL_LI}>
              <a href={CUE_LINK} target="_blank" rel="noopener" className={COL_A}>Tours &amp; Drivers</a>
            </li>
          </ul>
        </div>

        <div>
          <h4 className={COL_H}>Follow</h4>
          <div className="flex gap-[0.6rem]">
            {SOCIAL.map((s) => (
              <a
                key={s.name}
                href={s.href || '#'}
                aria-label={s.name}
                aria-disabled={s.href ? undefined : 'true'}
                {...(s.href ? { target: '_blank', rel: 'noopener' } : {})}
                className={SOCIAL_A}
              >
                <BrandIcon name={s.name} />
              </a>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-[1100px] mx-auto mt-9 pt-5 border-t border-[rgba(0,0,0,0.12)]
                      flex flex-wrap items-center justify-between gap-x-6 gap-y-2
                      max-[700px]:flex-col max-[700px]:text-center">
        <p className="text-small opacity-70">&copy; 2026 {BRAND}. All rights reserved.</p>
        <a href={CUE_LINK} target="_blank" rel="noopener" className="text-small opacity-70 no-underline text-green hover:text-gold">
          Part of Cahyana Ubud Experience
        </a>
      </div>
    </footer>
  );
}
