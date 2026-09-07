import Link from 'next/link';
import Logo from '@/components/ui/Logo';
import { CONTACT_EMAIL, CUE_LINK, WHATSAPP_LINK } from '@/lib/constants';

const SOCIALS = [
  {
    label: 'Instagram',
    href: '#',
    icon: (
      <>
        <rect x="3" y="3" width="18" height="18" rx="5" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="17.2" cy="6.8" r="1" fill="currentColor" stroke="none" />
      </>
    ),
  },
  {
    label: 'Facebook',
    href: '#',
    icon: <path d="M14 9h2V6h-2c-1.7 0-3 1.3-3 3v2H9v3h2v6h3v-6h2.2l.8-3H14V9.6c0-.3.3-.6.6-.6H16" />,
  },
];

export default function Footer() {
  return (
    <footer style={{ background: 'var(--color-cta)' }} className="text-white">
      <div className="container py-12 grid grid-cols-1 md:grid-cols-[1.6fr_1fr_1fr_1fr] gap-10">
        <div>
          <Logo light />
          <p className="mt-4 max-w-xs text-small text-white/75">
            Two private pool villas in Ubud, hosted by the family who lives here. Book direct, stay longer, pay less.
          </p>
          <div className="flex items-center gap-3 mt-5">
            {SOCIALS.map((s) => (
              <a
                key={s.label}
                href={s.href}
                aria-label={s.label}
                className="flex items-center justify-center w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  {s.icon}
                </svg>
              </a>
            ))}
            <a
              href={WHATSAPP_LINK}
              target="_blank"
              rel="noopener"
              className="btn btn-sm"
              style={{ background: 'rgba(255,255,255,0.14)', color: '#fff' }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 11.5a8.38 8.38 0 0 1-8.5 8.5 8.5 8.5 0 0 1-4-1L3 20l1-5.5a8.5 8.5 0 1 1 17-3z" />
              </svg>
              Book via WhatsApp
            </a>
          </div>
        </div>

        <div>
          <p className="text-label font-semibold uppercase tracking-wide text-white/60 mb-3">Stay</p>
          <ul className="flex flex-col gap-2.5 text-small">
            <li><Link href="/villas/cahyana-house" className="text-white/85 hover:text-white">Cahyana House</Link></li>
            <li><Link href="/villas/cahyana-tibuah" className="text-white/85 hover:text-white">Cahyana Tibuah</Link></li>
            <li><Link href="/villas" className="text-white/85 hover:text-white">All villas</Link></li>
            <li><Link href="/experiences" className="text-white/85 hover:text-white">Experiences</Link></li>
          </ul>
        </div>

        <div>
          <p className="text-label font-semibold uppercase tracking-wide text-white/60 mb-3">Services</p>
          <ul className="flex flex-col gap-2.5 text-small">
            <li><Link href="/services/breakfast" className="text-white/85 hover:text-white">Breakfast</Link></li>
            <li><Link href="/services/spa" className="text-white/85 hover:text-white">Spa &amp; Massage</Link></li>
            <li><Link href="/services/live-dinner" className="text-white/85 hover:text-white">Live Dinner</Link></li>
            <li><Link href="/services/scooter-rental" className="text-white/85 hover:text-white">Scooter Rental</Link></li>
          </ul>
        </div>

        <div id="contact">
          <p className="text-label font-semibold uppercase tracking-wide text-white/60 mb-3">Company</p>
          <ul className="flex flex-col gap-2.5 text-small">
            <li><Link href="/about" className="text-white/85 hover:text-white">About Us</Link></li>
            <li><Link href="/about#contact" className="text-white/85 hover:text-white">Contact</Link></li>
            <li><a href={`mailto:${CONTACT_EMAIL}`} className="text-white/85 hover:text-white">{CONTACT_EMAIL}</a></li>
            <li><a href={CUE_LINK} target="_blank" rel="noopener" className="text-white/85 hover:text-white">Tours &amp; Drivers</a></li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/15">
        <div className="container py-5 flex flex-col sm:flex-row items-center justify-between gap-2 text-label text-white/60">
          <p>© 2026 Ubud Private Villas. All rights reserved.</p>
          <a href={CUE_LINK} target="_blank" rel="noopener" className="hover:text-white">
            Part of Cahyana Ubud Experience
          </a>
        </div>
      </div>
    </footer>
  );
}
