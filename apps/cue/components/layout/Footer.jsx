'use client';

import { Mail, MapPin, MessageCircle } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { WHATSAPP_NUMBER } from '@/lib/constants';
import { REGISTRATION as R } from '@/content/shared/registration';
import FooterPayChips from './FooterPayChips';

// Compact footer for the account/utility pages (WO5, Sep 2026, Wayan: "guests
// shouldn't scroll past a full footer on Settings, My Trips, or the legal
// pages"). Settings and My Trips are single-purpose pages a signed-in guest
// is already using the site to finish a task on; Terms/Privacy/Cancellation
// are all sections of Our Company (their standalone pages were retired), so
// the whole page gets the compact shell rather than only one hash of it.
const COMPACT_PATHS = ['/settings.html', '/my-trips.html', '/our-company.html'];

// Same trick Navbar's isActive() already uses, not lib/pathname.js's
// normalizePath: static export PRERENDERS these routes at their clean path
// ('/settings'), but a browser sitting on the final '/settings.html' file
// hydrates with the extension - so checking pathname against ONE spelling of
// COMPACT_PATHS disagrees between server and client and throws React #418
// (measured: it did, on all three pages, the first time this shipped without
// this check). Matching either spelling makes the two renders agree no
// matter which one the pathname happens to be.
const isCompactPath = (pathname) =>
  COMPACT_PATHS.some((p) => pathname === p || pathname === p.replace(/\.html$/, ''));

// Tailwind-native (migrasi Fase 2): footer (semua halaman). Dulu keluarga
// .footer* di style.css - sekarang utilities 1:1. Footer punya ukuran teks
// sendiri (0.8rem body, bukan --fs-body) - dipetakan eksplisit ke text-[0.8rem].
//
// BENTUK (Sep 2026, Wayan minta "lebih ramping" terus milih layout ini dari 3
// yang dibangun & diukur): SATU baris grid, lima kolom di desktop -
// brand+kontak / Explore / Company / Featured On + Follow / We Accept. Di
// bawah 900px jadi 2 kolom dan brand-nya makan lebar penuh.
// Hasil ukur: desktop 535 -> 274px, HP 836 -> 636px.
//
// Yang dibuang biar ramping: paragraf deskripsi (Wayan), dan band full-width
// "Featured On" + "We Accept" yang masing-masing punya divider sendiri -
// sekarang dua-duanya jadi kolom biasa, jadi footer cuma punya SATU garis
// (copyright + baris registrasi digabung di bar bawah).
//
// "Featured On" DIPISAH dari "Follow" - dulu satu label nutupin Viator +
// Tripadvisor (tempat kita di-feature) SEKALIGUS Instagram/WhatsApp/Facebook
// (akun kita sendiri). Dua hal beda, jangan digabung lagi.
//
// Ukuran ikon sengaja kecil (Wayan): logo featured 18px, bulatan sosmed 22px,
// chip bayar 20px. Ini di bawah tangga --icon-sm/md/lg - disengaja, footer itu
// bagian paling akhir yang dibaca orang, bukan tempat narik perhatian.

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

// "Airport Transfer" sits here, right under Transfer, as the ONE site-wide link
// to that page (Sep 2026, Wayan: "gas footer aja bro"). /airport-transfer owns
// the "bali airport transfer" query but was reachable from only 5 pages, while
// /transfer had 100 through this footer and the navbar - so the page Google is
// meant to rank had almost no internal support. The label doubles as the anchor
// text, which is why it is the full phrase and not "Airport".
const EXPLORE = [
  ['/tour.html', 'Tours'],
  ['/activities.html', 'Experiences'],
  ['/transfer.html', 'Transfer'],
  ['/airport-transfer.html', 'Airport Transfer'],
  ['/charter.html', 'Charter'],
  ['/my-trips.html', 'My Trips'],
];

// About/Contact/FAQ/Terms/Privacy/Cancellation are all sections of the Our
// Company page now (Sep 2026, Wayan - their standalone pages are retired).
// Each link lands directly on its section (OurCompany.jsx reads the hash).
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

// Single row: brand name, the two contact links (no map pin - that's the one
// fact the full footer's grid had room for and this doesn't), copyright.
// Same brand/contact colors as the full footer, none of its columns.
//
// PINNED to the bottom of the viewport (Wayan, Sep 2026: "the footer needs to
// be sticky at the bottom, only the content scrolled") - `fixed`, not the
// classic sticky-footer-in-flow trick (a flex column + margin-top:auto only
// pins it once the page is shorter than the viewport; here it has to stay on
// screen from the first paint, on a page that can be much taller than the
// viewport, e.g. a long My Trips cart). `.footerbar` is the marker
// AppBottomNav yields to (app.layout.jsx body padding + AppBottomNav.jsx),
// the same "only one thing sticks to the bottom" rule BookBar/SectionSwitcher
// already follow - these three pages never carry a bookbar/stickybar of
// their own, so this is the only bottom bar in play on them.
// pb- uses max() with the safe-area inset, same as BookBar/AppBottomNav: an
// iPhone's home-indicator strip sits right where the CTA would otherwise
// land. Baseline height is unchanged where that inset is 0 (measured before/
// after: 60px >=561px, 107px below it, matched by body's compensating pb-
// in app/layout.jsx so page content never lands underneath it).
function CompactFooter() {
  return (
    <footer className="footerbar fixed inset-x-0 bottom-0 z-[90] px-6 pt-5 pb-[max(1.25rem,env(safe-area-inset-bottom))] text-green bg-[#ebe8e2] [border-top:1px_solid_rgba(0,0,0,0.08)]">
      <div className="max-w-[1100px] mx-auto flex flex-wrap items-center justify-between gap-x-6 gap-y-2
                      max-[560px]:flex-col max-[560px]:text-center">
        <a href="/" className="no-underline text-green font-body text-[0.95rem] font-semibold shrink-0">
          Cahyana Ubud Experience
        </a>
        <div className="flex flex-wrap items-center gap-x-5 gap-y-1">
          <a href={`https://wa.me/${WHATSAPP_NUMBER}`} target="_blank" rel="noopener" className={CONTACT_LINK}>
            <MessageCircle className={CONTACT_SVG} strokeWidth={1.8} />
            WhatsApp
          </a>
          <a href="mailto:cahyanabaliexperience@gmail.com" className={CONTACT_LINK}>
            <Mail className={CONTACT_SVG} strokeWidth={1.8} />
            Email
          </a>
        </div>
        <p className="text-small opacity-70 m-0 shrink-0">&copy; 2026 Cahyana Ubud Experience.</p>
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
