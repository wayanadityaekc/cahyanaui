import { Mail, MapPin, MessageCircle } from 'lucide-react';
import { WHATSAPP_NUMBER } from '@/lib/constants';
import { REGISTRATION as R } from '@/content/shared/registration';

// Tailwind-native (migrasi Fase 2): footer (semua halaman). Dulu keluarga
// .footer* di style.css - sekarang utilities 1:1. Token dipertahankan lewat
// text-h3/text-small/text-label + rounded-sm/shadow-sm + w-4 (var(--icon-sm)).
// Footer punya ukuran teks sendiri (0.8rem body, bukan --fs-body) - dipetakan
// eksplisit ke text-[0.8rem]. Breakpoint responsive = max-768 (grid 3->2 kol +
// brand span penuh + Featured/logos center) & max-560 (reg baris ke kolom).

const CONTACT_ITEM = 'flex items-center gap-[0.55rem] text-[0.8rem] text-green opacity-90 no-underline';
const CONTACT_LINK = `${CONTACT_ITEM} hover:opacity-100 hover:text-gold`;
const CONTACT_SVG = 'w-4 h-4 shrink-0 text-gold';
const SOCIAL_A =
  'flex items-center justify-center w-7 h-7 rounded-[50%] text-green bg-[rgba(0,0,0,0.06)] hover:text-white hover:bg-gold';
const PAY_CHIP =
  'inline-flex items-center justify-center h-[27px] min-w-[42px] px-2 bg-white rounded-sm shadow-sm ' +
  'transition-[transform] duration-[var(--dur)] ease-[var(--ease-out)] hover:[transform:translateY(-2px)]';
const COL_A = 'no-underline text-green hover:text-gold';

const EXPLORE = [
  ['/tour.html', 'Tours'],
  ['/activities.html', 'Experiences'],
  ['/transfer.html', 'Transfer'],
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
  ['/our-company.html#cancellation', 'Cancellation Policy'],
];

export default function Footer() {
  return (
    <footer className="px-6 pt-12 pb-6 text-green bg-[#ebe8e2]">
      <div className="grid grid-cols-[2fr_1fr_1fr] max-[768px]:grid-cols-2 gap-10 max-w-[1100px] mx-auto">
        <div className="max-[768px]:col-span-full">
          <a href="/" className="inline-block no-underline text-green">
            <span className="font-body text-[1.2rem] font-semibold text-green leading-[1.2]">Cahyana Ubud Experience</span>
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
          <p className="mt-3 max-w-[320px] text-[0.8rem] leading-[1.6] opacity-[0.85]">
            Plan your whole Ubud trip in one place - tours, experiences, transfers, and villas, every price upfront.
          </p>
          <div className="mt-6 text-left max-[768px]:text-center">
            <p className="mb-3 text-label tracking-[0.14em] uppercase opacity-70">Featured On</p>
            <div className="flex flex-wrap items-center gap-5 max-[768px]:justify-center">
              <img className="h-6 w-auto opacity-[0.85]" src="/assets/images/viator.webp" alt="Viator" width="245" height="256" loading="lazy" />
              <img className="h-6 w-auto opacity-[0.85]" src="/assets/images/tripadvisor.webp" alt="Tripadvisor" width="280" height="176" loading="lazy" />
              <div className="flex gap-5">
                <a href="#" aria-label="Instagram" className={SOCIAL_A}><img className="w-full h-full rounded-[50%] object-cover" src="/assets/images/instagram-transparent.webp" alt="Instagram" width="256" height="256" loading="lazy" /></a>
                <a href="#" aria-label="WhatsApp" className={SOCIAL_A}><img className="w-full h-full rounded-[50%] object-cover" src="/assets/images/whatsapp.webp" alt="WhatsApp" width="256" height="256" loading="lazy" /></a>
                <a href="#" aria-label="Facebook" className={SOCIAL_A}><img className="w-full h-full rounded-[50%] object-cover" src="/assets/images/facebook.webp" alt="Facebook" width="256" height="256" loading="lazy" /></a>
              </div>
            </div>
          </div>
        </div>
        <div>
          <h4 className="mb-4 font-body text-h3 font-semibold tracking-normal text-gold">Explore</h4>
          <ul className="list-none">{EXPLORE.map(([h, t]) => <li key={h} className="mb-[0.6rem] text-[0.8rem] opacity-[0.85]"><a href={h} className={COL_A}>{t}</a></li>)}</ul>
        </div>
        <div>
          <h4 className="mb-4 font-body text-h3 font-semibold tracking-normal text-gold">Company</h4>
          <ul className="list-none">{COMPANY.map(([h, t]) => <li key={h} className="mb-[0.6rem] text-[0.8rem] opacity-[0.85]"><a href={h} className={COL_A}>{t}</a></li>)}</ul>
        </div>
      </div>
      <div className="max-w-[1100px] mx-auto mt-8 pt-6 border-t border-[rgba(0,0,0,0.1)] text-center">
        <p className="mb-3 text-label tracking-[0.14em] uppercase opacity-70">We Accept</p>
        <div className="flex flex-wrap items-center justify-center gap-3">
          <span className={PAY_CHIP}>
            <svg className="block h-4 w-auto" viewBox="0 0 48 16" role="img" aria-label="Visa">
              <text x="24" y="13" textAnchor="middle" fontFamily="Arial, Helvetica, sans-serif" fontSize="15" fontWeight="700" fontStyle="italic" letterSpacing="0.5" fill="#1434CB">VISA</text>
            </svg>
          </span>
          <span className={PAY_CHIP}>
            <svg className="block h-4 w-auto" viewBox="0 0 40 24" role="img" aria-label="Mastercard">
              <circle cx="15" cy="12" r="9" fill="#EB001B" />
              <circle cx="25" cy="12" r="9" fill="#F79E1B" />
              <path d="M20 4.52 A9 9 0 0 0 20 19.48 A9 9 0 0 0 20 4.52 Z" fill="#FF5F00" />
            </svg>
          </span>
          <span className={PAY_CHIP}>
            <svg className="block h-4 w-auto" viewBox="0 0 48 16" role="img" aria-label="JCB">
              <rect x="0" y="1" width="14.5" height="14" rx="2" fill="#0B4EA2" />
              <rect x="16.75" y="1" width="14.5" height="14" rx="2" fill="#E4002B" />
              <rect x="33.5" y="1" width="14.5" height="14" rx="2" fill="#009944" />
              <text x="7.25" y="11.5" textAnchor="middle" fontFamily="Arial, Helvetica, sans-serif" fontSize="10" fontWeight="700" fill="#fff">J</text>
              <text x="24" y="11.5" textAnchor="middle" fontFamily="Arial, Helvetica, sans-serif" fontSize="10" fontWeight="700" fill="#fff">C</text>
              <text x="40.75" y="11.5" textAnchor="middle" fontFamily="Arial, Helvetica, sans-serif" fontSize="10" fontWeight="700" fill="#fff">B</text>
            </svg>
          </span>
          <span className={PAY_CHIP}>
            <svg className="block h-4 w-auto" viewBox="0 0 48 16" role="img" aria-label="American Express">
              <rect x="0" y="1" width="48" height="14" rx="2" fill="#006FCF" />
              <text x="24" y="11.5" textAnchor="middle" fontFamily="Arial, Helvetica, sans-serif" fontSize="9" fontWeight="700" letterSpacing="0.5" fill="#fff">AMEX</text>
            </svg>
          </span>
          <span className={PAY_CHIP}>
            <svg className="block h-4 w-auto" viewBox="0 0 50 16" role="img" aria-label="QRIS">
              <text x="1" y="13" fontFamily="Arial, Helvetica, sans-serif" fontSize="14" fontWeight="800" fontStyle="italic">
                <tspan fill="#13326B">QR</tspan>
                <tspan fill="#E8262A">IS</tspan>
              </text>
            </svg>
          </span>
          <span className={PAY_CHIP}>
            <svg className="block h-4 w-auto" viewBox="0 0 62 16" role="img" aria-label="PayPal">
              <text x="0" y="13" fontFamily="Arial, Helvetica, sans-serif" fontSize="15" fontWeight="700" fontStyle="italic">
                <tspan fill="#003087">Pay</tspan>
                <tspan fill="#009CDE">Pal</tspan>
              </text>
            </svg>
          </span>
          <span className={PAY_CHIP}>
            <svg className="block h-4 w-auto" viewBox="0 0 62 24" role="img" aria-label="Google Pay">
              <path fill="#4285F4" d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.5c-.3 1.5-1.1 2.7-2.4 3.6v3h3.9c2.3-2.1 3.5-5.2 3.5-8.8z" />
              <path fill="#34A853" d="M12 24c3.2 0 5.9-1.1 7.9-2.9l-3.9-3c-1.1.7-2.5 1.2-4 1.2-3.1 0-5.7-2.1-6.6-4.9H1.4v3.1C3.4 21.4 7.4 24 12 24z" />
              <path fill="#FBBC05" d="M5.4 14.3c-.2-.7-.4-1.5-.4-2.3s.1-1.6.4-2.3V6.6H1.4C.5 8.2 0 10 0 12s.5 3.8 1.4 5.4l4-3.1z" />
              <path fill="#EA4335" d="M12 4.8c1.8 0 3.3.6 4.6 1.8l3.4-3.4C17.9 1.2 15.2 0 12 0 7.4 0 3.4 2.6 1.4 6.6l4 3.1C6.3 6.9 8.9 4.8 12 4.8z" />
              <text x="27" y="17" fontFamily="Arial, Helvetica, sans-serif" fontSize="15" fontWeight="500" fill="#5F6368">Pay</text>
            </svg>
          </span>
        </div>
        <p className="flex flex-wrap items-center justify-center gap-x-[7px] gap-y-1 max-[560px]:flex-col max-[560px]:gap-[2px] mt-3 text-[length:0.58rem] font-normal text-muted opacity-30">
          <span className="whitespace-nowrap">{R.name}</span>
          <span className="max-[560px]:hidden" aria-hidden="true">·</span>
          <span className="whitespace-nowrap">Ministry of Law <a href={R.verifyUrl} target="_blank" rel="noopener" className="text-inherit underline">{R.decreeShort}</a></span>
          <span className="max-[560px]:hidden" aria-hidden="true">·</span>
          <span className="whitespace-nowrap">Business License (NIB) {R.nib}</span>
        </p>
      </div>
      <div className="max-w-[1100px] mx-auto mt-10 pt-6 border-t border-[rgba(0,0,0,0.12)] text-small text-center opacity-70">
        <p>&copy; 2026 Cahyana Ubud Experience. All rights reserved.</p>
      </div>
    </footer>
  );
}
