import Link from 'next/link';
import { CONTACT_EMAIL, CUE_LINK, WHATSAPP_LINK } from '@/lib/airbnb';

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="container footer-top">
        <div className="footer-brand-col">
          <p className="footer-brand">Cahyana Ubud</p>
          <p className="footer-tag">Ubud Private Villas</p>
          <p className="footer-desc">
            Two private pool villas in Ubud, hosted by the family who lives here. Book direct, stay longer, pay less.
          </p>
          <ul className="footer-contact">
            <li>
              <a href={WHATSAPP_LINK} target="_blank" rel="noopener">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 11.5a8.38 8.38 0 0 1-8.5 8.5 8.5 8.5 0 0 1-4-1L3 20l1-5.5a8.5 8.5 0 1 1 17-3z" />
                </svg>
                Message us on WhatsApp
              </a>
            </li>
            <li>
              <a href={`mailto:${CONTACT_EMAIL}`}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="5" width="18" height="14" rx="2" />
                  <path d="M3 7l9 6 9-6" />
                </svg>
                {CONTACT_EMAIL}
              </a>
            </li>
            <li>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 21s-7-6.2-7-11a7 7 0 0 1 14 0c0 4.8-7 11-7 11z" />
                <circle cx="12" cy="10" r="2.5" />
              </svg>
              Based in Ubud, Bali
            </li>
          </ul>
        </div>

        <div className="footer-col">
          <p className="footer-title">Stay</p>
          <ul>
            <li><Link href="/villas/cahyana-house">Cahyana House</Link></li>
            <li><Link href="/villas/cahyana-tibuah">Cahyana Tibuah</Link></li>
            <li><Link href="/villas">All villas</Link></li>
          </ul>
        </div>

        <div className="footer-col">
          <p className="footer-title">Services</p>
          <ul>
            <li><Link href="/services/breakfast">Breakfast</Link></li>
            <li><Link href="/services/spa">Spa &amp; Massage</Link></li>
            <li><Link href="/services/live-dinner">Live Dinner</Link></li>
          </ul>
        </div>

        <div className="footer-col">
          <p className="footer-title">Company</p>
          <ul>
            <li><Link href="/about">About Us</Link></li>
            <li><Link href="/about">Contact</Link></li>
            <li><a href={CUE_LINK} target="_blank" rel="noopener">Tours &amp; Drivers</a></li>
          </ul>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="container">
          <p><strong>Cahyana Ubud</strong> · Business License (NIB) 2501220013924 · KBLI 55193</p>
          <p>© 2026 Ubud Private Villas by Cahyana Ubud. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
