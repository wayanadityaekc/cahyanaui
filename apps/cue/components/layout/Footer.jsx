import { WHATSAPP_NUMBER } from '@/lib/constants';
import { REGISTRATION as R } from '@/content/shared/registration';

const EXPLORE = [
  ['/tour.html', 'Tours'],
  ['/activities.html', 'Experiences'],
  ['/transfer.html', 'Transfer'],
  ['/charter.html', 'Charter'],
  ['/my-trips.html', 'My Trips'],
];

const COMPANY = [
  ['/contact.html', 'Contact Us'],
  ['/about-us.html', 'About Us'],
  ['/faq.html', 'FAQ'],
  ['/terms-conditions.html', 'Terms & Conditions'],
  ['/privacy-policy.html', 'Privacy Policy'],
  ['/cancellation-policy.html', 'Cancellation Policy'],
];

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer__top">
        <div className="footer__brand">
          <a href="/" className="footer__logo">
            <span className="footer__wordmark">Cahyana Ubud Experience</span>
          </a>
          <div className="footer__contact">
            <a href={`https://wa.me/${WHATSAPP_NUMBER}`} target="_blank" rel="noopener" className="footer__contact-item">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 11.5a8.38 8.38 0 0 1-8.5 8.5 8.5 8.5 0 0 1-4-1L3 20l1-5.5a8.5 8.5 0 1 1 17-3z" />
              </svg>
              Message us on WhatsApp
            </a>
            <a href="mailto:cahyanabaliexperience@gmail.com" className="footer__contact-item">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="5" width="18" height="14" rx="2" />
                <path d="M3 7l9 6 9-6" />
              </svg>
              cahyanabaliexperience@gmail.com
            </a>
            <span className="footer__contact-item">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 21s-7-6.2-7-11a7 7 0 0 1 14 0c0 4.8-7 11-7 11z" />
                <circle cx="12" cy="10" r="2.5" />
              </svg>
              Based in Ubud, Bali
            </span>
          </div>
          <p className="footer__tagline">
            Plan your whole Ubud trip in one place - tours, experiences, transfers, and villas, every price upfront.
          </p>
          <div className="footer__featured">
            <p className="footer__featured-label">Featured On</p>
            <div className="footer__logos">
              <img src="/assets/images/viator.webp" alt="Viator" width="245" height="256" loading="lazy" />
              <img src="/assets/images/tripadvisor.webp" alt="Tripadvisor" width="280" height="176" loading="lazy" />
              <div className="footer__socials">
                <a href="#" aria-label="Instagram"><img src="/assets/images/instagram-transparent.webp" alt="Instagram" width="256" height="256" loading="lazy" /></a>
                <a href="#" aria-label="WhatsApp"><img src="/assets/images/whatsapp.webp" alt="WhatsApp" width="256" height="256" loading="lazy" /></a>
                <a href="#" aria-label="Facebook"><img src="/assets/images/facebook.webp" alt="Facebook" width="256" height="256" loading="lazy" /></a>
              </div>
            </div>
          </div>
        </div>
        <div className="footer__col">
          <h4 className="footer__heading">Explore</h4>
          <ul>{EXPLORE.map(([h, t]) => <li key={h}><a href={h}>{t}</a></li>)}</ul>
        </div>
        <div className="footer__col">
          <h4 className="footer__heading">Company</h4>
          <ul>{COMPANY.map(([h, t]) => <li key={h}><a href={h}>{t}</a></li>)}</ul>
        </div>
      </div>
      <p className="footer__reg">
        <span className="footer__reg-item"><b>{R.name}</b></span>
        <span className="footer__reg-sep" aria-hidden="true">·</span>
        <span className="footer__reg-item">Ministry of Law <a href={R.verifyUrl} target="_blank" rel="noopener">{R.decreeShort}</a></span>
        <span className="footer__reg-sep" aria-hidden="true">·</span>
        <span className="footer__reg-item">Business License (NIB) {R.nib}</span>
      </p>
      <div className="footer__payments">
        <p className="footer__featured-label">We Accept</p>
        <div className="footer__pay-logos">
          <span className="footer__pay-chip">
            <svg className="footer__pay-svg" viewBox="0 0 48 16" role="img" aria-label="Visa">
              <text x="24" y="13" textAnchor="middle" fontFamily="Arial, Helvetica, sans-serif" fontSize="15" fontWeight="700" fontStyle="italic" letterSpacing="0.5" fill="#1434CB">VISA</text>
            </svg>
          </span>
          <span className="footer__pay-chip">
            <svg className="footer__pay-svg" viewBox="0 0 40 24" role="img" aria-label="Mastercard">
              <circle cx="15" cy="12" r="9" fill="#EB001B" />
              <circle cx="25" cy="12" r="9" fill="#F79E1B" />
              <path d="M20 4.52 A9 9 0 0 0 20 19.48 A9 9 0 0 0 20 4.52 Z" fill="#FF5F00" />
            </svg>
          </span>
          <span className="footer__pay-chip">
            <svg className="footer__pay-svg" viewBox="0 0 48 16" role="img" aria-label="JCB">
              <rect x="0" y="1" width="14.5" height="14" rx="2" fill="#0B4EA2" />
              <rect x="16.75" y="1" width="14.5" height="14" rx="2" fill="#E4002B" />
              <rect x="33.5" y="1" width="14.5" height="14" rx="2" fill="#009944" />
              <text x="7.25" y="11.5" textAnchor="middle" fontFamily="Arial, Helvetica, sans-serif" fontSize="10" fontWeight="700" fill="#fff">J</text>
              <text x="24" y="11.5" textAnchor="middle" fontFamily="Arial, Helvetica, sans-serif" fontSize="10" fontWeight="700" fill="#fff">C</text>
              <text x="40.75" y="11.5" textAnchor="middle" fontFamily="Arial, Helvetica, sans-serif" fontSize="10" fontWeight="700" fill="#fff">B</text>
            </svg>
          </span>
          <span className="footer__pay-chip">
            <svg className="footer__pay-svg" viewBox="0 0 48 16" role="img" aria-label="American Express">
              <rect x="0" y="1" width="48" height="14" rx="2" fill="#006FCF" />
              <text x="24" y="11.5" textAnchor="middle" fontFamily="Arial, Helvetica, sans-serif" fontSize="9" fontWeight="700" letterSpacing="0.5" fill="#fff">AMEX</text>
            </svg>
          </span>
          <span className="footer__pay-chip">
            <svg className="footer__pay-svg" viewBox="0 0 50 16" role="img" aria-label="QRIS">
              <text x="1" y="13" fontFamily="Arial, Helvetica, sans-serif" fontSize="14" fontWeight="800" fontStyle="italic">
                <tspan fill="#13326B">QR</tspan>
                <tspan fill="#E8262A">IS</tspan>
              </text>
            </svg>
          </span>
          <span className="footer__pay-chip">
            <svg className="footer__pay-svg" viewBox="0 0 62 16" role="img" aria-label="PayPal">
              <text x="0" y="13" fontFamily="Arial, Helvetica, sans-serif" fontSize="15" fontWeight="700" fontStyle="italic">
                <tspan fill="#003087">Pay</tspan>
                <tspan fill="#009CDE">Pal</tspan>
              </text>
            </svg>
          </span>
        </div>
      </div>
      <div className="footer__bottom">
        <p>&copy; 2026 Cahyana Ubud Experience. All rights reserved.</p>
      </div>
    </footer>
  );
}
