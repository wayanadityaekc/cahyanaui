'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import AirbnbButton from '@/components/ui/AirbnbButton';
import { WHATSAPP_LINK } from '@/lib/airbnb';

const GUEST_OPTIONS = [2, 3, 4, 5, 6];

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();

  const isActive = (paths) => paths.includes(pathname);
  const linkClass = (paths) => `${isActive(paths) ? 'active' : ''}`.trim() || undefined;

  return (
    <>
      <div className="topbar">
        <div className="container">
          <p>Direct guests get first pick of dates — message us before you book</p>
        </div>
      </div>

      <header className="site-header">
        <div className="container nav-wrap">
          <Link href="/" className="brand">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/images/logo.webp" alt="Cahyana Ubud-Bali" className="brand-logo" width="1005" height="324" />
            <span className="brand-text">
              <span className="brand-tag">Ubud Private Villas</span>
            </span>
          </Link>

          <nav className={`site-nav ${menuOpen ? 'open' : ''}`.trim()}>
            <ul className="nav-list">
              <li>
                <Link href="/" className={linkClass(['/'])}>Home</Link>
              </li>
              <li className="has-dropdown">
                <Link href="/villas" className={linkClass(['/villas', '/villas/cahyana-house', '/villas/cahyana-tibuah'])}>
                  Villas <span className="caret">›</span>
                </Link>
                <ul className="dropdown">
                  <li><Link href="/villas/cahyana-house">Cahyana House · 3BR</Link></li>
                  <li><Link href="/villas/cahyana-tibuah">Cahyana Tibuah · 2BR</Link></li>
                  <li><Link href="/villas">All villas</Link></li>
                </ul>
              </li>
              <li className="has-dropdown">
                <a
                  href="#"
                  className={linkClass(['/services/breakfast', '/services/spa', '/services/live-dinner'])}
                  onClick={(e) => e.preventDefault()}
                >
                  Services <span className="caret">›</span>
                </a>
                <ul className="dropdown">
                  <li><Link href="/services/breakfast">Breakfast</Link></li>
                  <li><Link href="/services/spa">Spa &amp; Massage</Link></li>
                  <li><Link href="/services/live-dinner">Live Dinner</Link></li>
                </ul>
              </li>
              <li>
                <Link href="/about" className={linkClass(['/about'])}>About Us</Link>
              </li>
              <li className="nav-mobile-only">
                <a href={WHATSAPP_LINK} target="_blank" rel="noopener">Chat on WhatsApp</a>
              </li>
            </ul>
          </nav>

          <div className="nav-actions">
            <div className="nav-select">
              <label htmlFor="navGuests">Guests</label>
              <select id="navGuests" defaultValue={2}>
                {GUEST_OPTIONS.map((n) => (
                  <option key={n} value={n}>{n} guests</option>
                ))}
              </select>
            </div>
            <AirbnbButton className="btn btn-gold btn-sm">Book Now</AirbnbButton>
            <button
              className="nav-toggle"
              aria-label="Open menu"
              aria-expanded={menuOpen}
              onClick={() => setMenuOpen((v) => !v)}
            >
              <span></span><span></span><span></span>
            </button>
          </div>
        </div>
      </header>
    </>
  );
}
