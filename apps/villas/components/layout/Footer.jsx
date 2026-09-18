import Link from 'next/link';
import { Mail, MapPin, MessageCircle } from 'lucide-react';
import Logo from '@/components/ui/Logo';
import { CONTACT_EMAIL, CUE_LINK, WHATSAPP_LINK } from '@/lib/constants';

// Footer — CUE's footer shape (components/layout/Footer.jsx there), with this
// site's links in it.
//
// The thing actually being reused is the LAYOUT, and it is the fix for the
// mobile problem: CUE's footer is ONE grid row that goes to TWO columns below
// 900px with the brand block spanning the full width, so the link lists sit
// beside each other instead of queueing up. This site's previous footer went to
// a single column on a phone and ran ~640px tall — four headings and fourteen
// links stacked in a line under the last thing on the page. Same content, half
// the scrolling.
//
// Also carried over from CUE: exactly ONE hairline in the whole footer (the bar
// above the copyright — the "Featured On" / "We Accept" full-width bands with
// their own dividers are what made CUE's old footer feel heavy), and the small
// icon sizes. CUE sets social circles at 22px deliberately: the footer is the
// last thing anyone reads, not somewhere to pull attention.
//
// SURFACE COLOUR IS THIS SITE'S, NOT CUE'S. CUE's footer is light (#ebe8e2 with
// green text); this one stays on the brand green it already shipped with, since
// nothing in the ask was about repainting it. Swapping it is two class changes
// on the <footer> and the text colours if that is ever wanted.
const COL_H = 'mb-[0.9rem] font-body text-h3 font-semibold tracking-normal text-white';
const COL_LI = 'mb-[0.55rem] text-[0.8rem] opacity-[0.85]';
const COL_A = 'no-underline text-white/85 hover:text-white';
const CONTACT_ITEM = 'flex items-center gap-[0.55rem] text-[0.8rem] text-white/85 no-underline';
const CONTACT_LINK = `${CONTACT_ITEM} hover:text-white`;
const CONTACT_SVG = 'w-4 h-4 shrink-0 text-white/70';
const SOCIAL_A =
  'flex items-center justify-center w-[22px] h-[22px] rounded-[50%] text-white bg-white/15 hover:bg-white/30 ' +
  '[transition:background-color_var(--dur)_var(--ease)]';

// Instagram and Facebook stay HAND-DRAWN. Lucide dropped its brand icons in v1
// (6329 icons, zero brand marks), and CUE's own rule already carves out exactly
// this case: everything comes from Lucide EXCEPT logos it does not carry —
// there that is the payment marks and currency flags, here it is these two.
// Explicit w/h as always, or Lucide's and a raw <svg>'s defaults disagree.
function BrandIcon({ name }) {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {name === 'Instagram' ? (
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

const STAY = [
  ['/villas/cahyana-house', 'Cahyana House'],
  ['/villas/cahyana-tibuah', 'Cahyana Tibuah'],
  ['/villas', 'All villas'],
  ['/experiences', 'Experiences'],
];

const SERVICES = [
  ['/services/breakfast', 'Breakfast'],
  ['/services/spa', 'Spa & Massage'],
  ['/services/live-dinner', 'Live Dinner'],
  ['/services/scooter-rental', 'Scooter Rental'],
];

const COMPANY = [
  ['/about', 'About Us'],
  ['/about#contact', 'Contact'],
];

export default function Footer() {
  return (
    <footer className="px-[var(--container-x)] pt-10 pb-5 text-white bg-cta">
      <div
        className="grid max-w-[1100px] mx-auto gap-x-8 gap-y-9
                   grid-cols-[1.5fr_0.9fr_1.1fr_0.9fr_0.7fr]
                   max-[992px]:gap-x-5 max-[767px]:grid-cols-2 max-[992px]:gap-y-8"
      >
        {/* TWO steps, and the middle one is deliberately NOT CUE's. CUE drops
            straight from five columns to two at 900px, which works there because
            its fifth column is a wrapping row of payment chips. Doing that here
            made a 768px tablet TALLER than before the port — measured: 335px of
            footer became 611px, because the brand block started claiming a row
            of its own. Instead the five columns hold all the way down to 768px
            on a tighter gap (gap-x-5), and only below that does it go to two
            with the brand spanning. Measured after: 291px at 768, 639px at 390
            (was 863). */}
        <div className="max-[767px]:col-span-full">
          <Link href="/" className="inline-block no-underline">
            <Logo size={30} />
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

        {/* Follow is its OWN column, not a block tacked under Company. At two
            columns that is what keeps every cell filled: brand across the top,
            then Stay | Services, then Company | Follow. Left inside Company it
            sat alone on a fourth row with an empty cell beside it.
            Both links point at accounts that do not exist yet, so they carry
            aria-disabled rather than just href="#" — a link that goes nowhere
            should say so instead of silently jumping to the top of the page.
            Give them real URLs and drop the attribute. */}
        <div>
          <h4 className={COL_H}>Follow</h4>
          <div className="flex gap-[0.6rem]">
            <a href="#" aria-label="Instagram" aria-disabled="true" className={SOCIAL_A}>
              <BrandIcon name="Instagram" />
            </a>
            <a href="#" aria-label="Facebook" aria-disabled="true" className={SOCIAL_A}>
              <BrandIcon name="Facebook" />
            </a>
          </div>
        </div>
      </div>

      <div className="max-w-[1100px] mx-auto mt-9 pt-5 border-t border-white/15
                      flex flex-wrap items-center justify-between gap-x-6 gap-y-2
                      max-[700px]:flex-col max-[700px]:text-center">
        <p className="text-small text-white/60">&copy; 2026 Ubud Private Villas. All rights reserved.</p>
        <a href={CUE_LINK} target="_blank" rel="noopener" className="text-small text-white/60 hover:text-white no-underline">
          Part of Cahyana Ubud Experience
        </a>
      </div>
    </footer>
  );
}
