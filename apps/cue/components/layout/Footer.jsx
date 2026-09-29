'use client';

import { Mail, MapPin, MessageCircle } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { WHATSAPP_NUMBER } from '@/lib/constants';
import { REGISTRATION as R } from '@/content/shared/registration';
import FooterPayChips from './FooterPayChips';

// Pages that get the compact fixed footer instead of the full one.
const COMPACT_PATHS = ['/settings.html', '/my-trips.html', '/our-company.html'];

// Match both '/x' and '/x.html' so server and client renders agree (avoids hydration error #418).
function isCompactPath(pathname) { return COMPACT_PATHS.some((p) => pathname === p || pathname === p.replace(/\.html$/, '')); }

// Full footer: one 5-column grid (2 columns under 900px); Featured On and Follow stay separate columns.

const CONTACT_ITEM = 'flex items-center gap-[0.55rem] text-[0.8rem] text-green opacity-90 no-underline';
const CONTACT_LINK = `${CONTACT_ITEM} hover:opacity-100 hover:text-gold`;
const CONTACT_SVG = 'w-4 h-4 shrink-0 text-gold';
const SOCIAL_A =
  'flex items-center justify-center w-[22px] h-[22px] rounded-[50%] text-green bg-[rgba(0,0,0,0.06)] hover:text-white hover:bg-gold';
const PAY_CHIP =
  'inline-flex items-center justify-center h-5 min-w-[34px] px-[0.3rem] bg-white rounded-sm ' +
  'transition-[transform] duration-[var(--dur)] ease-[var(--ease-out)] hover:[transform:translateY(-2px)]';
const COL_A = 'no-underline text-green hover:text-gold';
const COL_H = 'mb-[0.9rem] font-body text-h3 font-semibold tracking-normal text-gold';
const COL_LI = 'mb-[0.55rem] text-[0.8rem] opacity-[0.85]';

// 'Airport Transfer' is the site-wide link to /airport-transfer; keep the full phrase, it is the SEO anchor text.
const EXPLORE = [
  ['/tour.html', 'Tours'],
  ['/activities.html', 'Experiences'],
  ['/transfer.html', 'Transfer'],
  ['/airport-transfer.html', 'Airport Transfer'],
  ['/charter.html', 'Charter'],
  ['/my-trips.html', 'My Trips'],
];

// Company links land on Our Company sections by hash (OurCompany.jsx reads it).
const COMPANY = [
  ['/our-company.html#contact', 'Contact Us'],
  ['/our-company.html#about', 'About Us'],
  ['/our-company.html#faq', 'FAQ'],
  ['/our-company.html#terms', 'Terms & Conditions'],
  ['/our-company.html#privacy', 'Privacy Policy'],
  ['/our-company.html#cancellation', 'Cancellation & Refund'],
];

const SOCIAL = [
  ['Instagram', 'instagram-transparent.webp'],
  ['WhatsApp', 'whatsapp.webp'],
  ['Facebook', 'facebook.webp'],
];

// Compact footer, fixed to the bottom; .footerbar is what body padding and AppBottomNav key off. Icons only under 561px.
function CompactFooter() {
  return (
    <footer className="footerbar fixed inset-x-0 bottom-0 z-[90] px-4 min-[561px]:px-6 py-[1rem] min-[561px]:pt-5 min-[561px]:pb-[max(1.25rem,env(safe-area-inset-bottom))] pb-[max(1rem,env(safe-area-inset-bottom))] text-green bg-[#ebe8e2] [border-top:1px_solid_rgba(0,0,0,0.08)]">
      <div className="max-w-[1100px] mx-auto flex items-center justify-between gap-x-4">
        <a href="/" className="no-underline text-green font-body text-[0.8rem] min-[561px]:text-[0.95rem] font-semibold shrink-0 truncate">
          Cahyana Ubud Experience
        </a>
        <div className="flex items-center gap-x-4 min-[561px]:gap-x-5 shrink-0">
          <a href={`https://wa.me/${WHATSAPP_NUMBER}`} target="_blank" rel="noopener" aria-label="WhatsApp" className={CONTACT_LINK}>
            <MessageCircle className={CONTACT_SVG} strokeWidth={1.8} />
            <span className="max-[560px]:hidden">WhatsApp</span>
          </a>
          <a href="mailto:cahyanabaliexperience@gmail.com" aria-label="Email" className={CONTACT_LINK}>
            <Mail className={CONTACT_SVG} strokeWidth={1.8} />
            <span className="max-[560px]:hidden">Email</span>
          </a>
        </div>
        <p className="max-[560px]:hidden text-small opacity-70 m-0 shrink-0">&copy; 2026 Cahyana Ubud Experience.</p>
      </div>
    </footer>
  );
}

export default function Footer() {
  const pathname = usePathname();
  if (isCompactPath(pathname)) return <CompactFooter />;

  return (
    <footer className="px-6 pt-10 pb-5 text-green bg-[#ebe8e2]">
      <div
        className="grid max-w-[1100px] mx-auto gap-x-8 gap-y-9
                   grid-cols-[1.5fr_0.9fr_1.2fr_0.9fr_1fr]
                   max-[900px]:grid-cols-2 max-[900px]:gap-y-8"
      >
        <div className="max-[900px]:col-span-full">
          <a href="/" className="inline-block no-underline text-green">
            <span className="font-body text-[1.1rem] font-semibold text-green leading-[1.2]">Cahyana Ubud Experience</span>
          </a>
          <div className="mt-[0.9rem] flex flex-col gap-[0.55rem]">
            <a href={`https://wa.me/${WHATSAPP_NUMBER}`} target="_blank" rel="noopener" className={CONTACT_LINK}>
              <MessageCircle className={CONTACT_SVG} strokeWidth={1.8} />
              Message us on WhatsApp
            </a>
            <a href="mailto:cahyanabaliexperience@gmail.com" className={CONTACT_LINK}>
              <Mail className={CONTACT_SVG} strokeWidth={1.8} />
              cahyanabaliexperience@gmail.com
            </a>
            <span className={CONTACT_ITEM}>
              <MapPin className={CONTACT_SVG} strokeWidth={1.8} />
              Based in Ubud, Bali
            </span>
          </div>
        </div>

        <div>
          <h4 className={COL_H}>Explore</h4>
          <ul className="list-none">
            {EXPLORE.map(([h, t]) => <li key={h} className={COL_LI}><a href={h} className={COL_A}>{t}</a></li>)}
          </ul>
        </div>

        <div>
          <h4 className={COL_H}>Company</h4>
          <ul className="list-none">
            {COMPANY.map(([h, t]) => <li key={h} className={COL_LI}><a href={h} className={COL_A}>{t}</a></li>)}
          </ul>
        </div>

        <div>
          <h4 className={COL_H}>Featured On</h4>
          <div className="flex flex-wrap items-center gap-4">
            <img className="h-[18px] w-auto opacity-[0.85]" src="/assets/images/viator.webp" alt="Viator" width="245" height="256" loading="lazy" />
            <img className="h-[18px] w-auto opacity-[0.85]" src="/assets/images/tripadvisor.webp" alt="Tripadvisor" width="280" height="176" loading="lazy" />
          </div>
          <h4 className={`${COL_H} mt-6`}>Follow</h4>
          <div className="flex gap-[0.6rem]">
            {SOCIAL.map(([alt, img]) => (
              <a key={alt} href="#" aria-label={alt} className={SOCIAL_A}>
                <img className="w-full h-full rounded-[50%] object-cover" src={`/assets/images/${img}`} alt={alt} width="256" height="256" loading="lazy" />
              </a>
            ))}
          </div>
        </div>

        <div>
          <h4 className={COL_H}>We Accept</h4>
          <div className="flex flex-wrap items-center gap-[0.4rem]">
            <FooterPayChips chipClass={PAY_CHIP} />
          </div>
        </div>
      </div>

      <div className="max-w-[1100px] mx-auto mt-9 pt-5 border-t border-[rgba(0,0,0,0.12)]
                      flex flex-wrap items-center justify-between gap-x-6 gap-y-2
                      max-[700px]:flex-col max-[700px]:text-center">
        <p className="text-small opacity-70">&copy; 2026 Cahyana Ubud Experience. All rights reserved.</p>
        <p className="flex flex-wrap items-center gap-x-[7px] gap-y-1 max-[700px]:justify-center text-[length:0.58rem] font-normal text-muted opacity-40">
          <span className="whitespace-nowrap">{R.name}</span>
          <span aria-hidden="true">·</span>
          <span className="whitespace-nowrap">Ministry of Law <a href={R.verifyUrl} target="_blank" rel="noopener" className="text-inherit underline">{R.decreeShort}</a></span>
          <span aria-hidden="true">·</span>
          <span className="whitespace-nowrap">NIB {R.nib}</span>
        </p>
      </div>
    </footer>
  );
}
