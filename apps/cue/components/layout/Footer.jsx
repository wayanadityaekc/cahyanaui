import { Mail, MapPin, MessageCircle } from 'lucide-react';
import { WHATSAPP_NUMBER } from '@/lib/constants';
import { REGISTRATION as R } from '@/content/shared/registration';
import FooterPayChips from './FooterPayChips';

// Tailwind-native (migrasi Fase 2): footer (semua halaman). Dulu keluarga
// .footer* di style.css - sekarang utilities 1:1. Footer punya ukuran teks
// sendiri (0.8rem body, bukan --fs-body) - dipetakan eksplisit ke text-[0.8rem].
//
// BENTUK (Sep 2026, Wayan minta "lebih ramping", dia pilih opsi C dari 3 yang
// diukur): dua kolom - brand+kontak di kiri, SEMUA sisanya jadi baris berlabel
// di kanan (Explore / Company / Featured On / Follow / We Accept). Link-nya
// NGALIR KE SAMPING, bukan ditumpuk ke bawah - itu kuncinya: kolom "Company"
// yang 6 item dulu yang bikin footer tinggi. Hasil ukur: desktop 535 -> 236px,
// HP 836 -> 541px. Paragraf deskripsi lama dibuang (Wayan), dan copyright +
// baris registrasi digabung jadi SATU bar (dari 2 divider jadi 1).
//
// "Featured On" DIPISAH dari "Follow" - dulu satu label nutupin Viator +
// Tripadvisor (tempat kita di-feature) SEKALIGUS Instagram/WhatsApp/Facebook
// (akun kita sendiri). Dua hal beda, jangan digabung lagi.
//
// Ukuran ikon sengaja kecil (Wayan): logo featured 18px, bulatan sosmed 22px,
// chip bayar 20px. Ini di bawah tangga --icon-sm/md/lg - disengaja, footer itu
// tempat paling akhir yang dibaca orang, bukan tempat narik perhatian.

const CONTACT_ITEM = 'flex items-center gap-[0.5rem] text-[0.8rem] text-green opacity-90 no-underline';
const CONTACT_LINK = `${CONTACT_ITEM} hover:opacity-100 hover:text-gold`;
const CONTACT_SVG = 'w-4 h-4 shrink-0 text-gold';
const SOCIAL_A =
  'flex items-center justify-center w-[22px] h-[22px] rounded-[50%] text-green bg-[rgba(0,0,0,0.06)] hover:text-white hover:bg-gold';
const PAY_CHIP =
  'inline-flex items-center justify-center h-5 min-w-[34px] px-[0.3rem] bg-white rounded-sm shadow-sm ' +
  'transition-[transform] duration-[var(--dur)] ease-[var(--ease-out)] hover:[transform:translateY(-2px)]';
const COL_A = 'no-underline text-green hover:text-gold';
// Label kolom kiri baris kanan. Lebarnya dipatok biar semua baris rata. 96px +
// nowrap = label terpanjang ("Featured On") muat satu baris; di 84px dia kepecah
// dua dan barisnya jadi lebih tinggi dari yang lain.
const ROW_LABEL =
  'shrink-0 w-[96px] whitespace-nowrap text-label tracking-[0.12em] uppercase opacity-60 pt-[0.15rem]';
const INLINE_UL = 'flex flex-wrap gap-x-4 gap-y-[0.4rem] list-none text-[0.8rem] opacity-[0.85]';

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
  ['/our-company.html#terms', 'Terms'],
  ['/our-company.html#privacy', 'Privacy'],
  ['/our-company.html#cancellation', 'Cancellation & Refund'],
];

const SOCIAL = [
  ['Instagram', 'instagram-transparent.webp'],
  ['WhatsApp', 'whatsapp.webp'],
  ['Facebook', 'facebook.webp'],
];

// One labelled row. Below 560px the label sits above its row instead of beside
// it - at that width an 84px gutter eats most of the line.
function Row({ label, children }) {
  return (
    <div className="flex gap-4 max-[560px]:flex-col max-[560px]:gap-[0.35rem]">
      <span className={ROW_LABEL}>{label}</span>
      {children}
    </div>
  );
}

export default function Footer() {
  return (
    <footer className="px-6 pt-9 pb-5 text-green bg-[#ebe8e2]">
      <div className="grid max-w-[1100px] mx-auto gap-x-10 gap-y-7 grid-cols-[minmax(240px,0.8fr)_1.4fr] max-[860px]:grid-cols-1">
        <div>
          <a href="/" className="inline-block no-underline text-green">
            <span className="font-body text-[1.1rem] font-semibold text-green leading-[1.2]">Cahyana Ubud Experience</span>
          </a>
          <div className="mt-[0.8rem] flex flex-col gap-[0.5rem]">
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

        <div className="flex flex-col gap-4">
          <Row label="Explore">
            <ul className={INLINE_UL}>
              {EXPLORE.map(([h, t]) => <li key={h}><a href={h} className={COL_A}>{t}</a></li>)}
            </ul>
          </Row>

          <Row label="Company">
            <ul className={INLINE_UL}>
              {COMPANY.map(([h, t]) => <li key={h}><a href={h} className={COL_A}>{t}</a></li>)}
            </ul>
          </Row>

          <Row label="Featured On">
            <div className="flex flex-wrap items-center gap-4">
              <img className="h-[18px] w-auto opacity-[0.85]" src="/assets/images/viator.webp" alt="Viator" width="245" height="256" loading="lazy" />
              <img className="h-[18px] w-auto opacity-[0.85]" src="/assets/images/tripadvisor.webp" alt="Tripadvisor" width="280" height="176" loading="lazy" />
            </div>
          </Row>

          <Row label="Follow">
            <div className="flex flex-wrap items-center gap-[0.6rem]">
              {SOCIAL.map(([alt, img]) => (
                <a key={alt} href="#" aria-label={alt} className={SOCIAL_A}>
                  <img className="w-full h-full rounded-[50%] object-cover" src={`/assets/images/${img}`} alt={alt} width="256" height="256" loading="lazy" />
                </a>
              ))}
            </div>
          </Row>

          <Row label="We Accept">
            <div className="flex flex-wrap items-center gap-[0.4rem]">
              <FooterPayChips chipClass={PAY_CHIP} />
            </div>
          </Row>
        </div>
      </div>

      <div className="max-w-[1100px] mx-auto mt-7 pt-4 border-t border-[rgba(0,0,0,0.12)]
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
