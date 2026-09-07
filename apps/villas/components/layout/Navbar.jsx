'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import AirbnbButton from '@/components/ui/AirbnbButton';
import { WHATSAPP_LINK } from '@/lib/airbnb';

const GUEST_OPTIONS = [2, 3, 4, 5, 6];

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [openDrop, setOpenDrop] = useState(null); // 'villas' | 'services' | null — mobile-only collapse state
  const pathname = usePathname();

  const isActive = (paths) => paths.includes(pathname);
  const linkClass = (paths) => `${isActive(paths) ? 'active' : ''}`.trim() || undefined;
  const toggleDrop = (key) => (e) => {
    e.preventDefault();
    setOpenDrop((cur) => (cur === key ? null : key));
  };

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
            <img src="/images/logo.webp" alt="Cahyana Ubud-Bali · Ubud Private Villas" className="brand-logo" width="1005" height="324" />
          </Link>

          <nav className={`site-nav ${menuOpen ? 'open' : ''}`.trim()}>
            <ul className="nav-list">
              <li>
                <Link href="/" className={linkClass(['/'])}>Home</Link>
              </li>
              <li className={`has-dropdown ${openDrop === 'villas' ? 'open' : ''}`.trim()}>
                <Link href="/villas" className={linkClass(['/villas', '/villas/cahyana-house', '/villas/cahyana-tibuah'])}>
                  Villas
                </Link>
                <button type="button" className="caret" aria-label="Toggle Villas submenu" aria-expanded={openDrop === 'villas'} onClick={toggleDrop('villas')}>
                  ›
                </button>
                <ul className="dropdown">
                  <li><Link href="/villas/cahyana-house">Cahyana House · 3BR</Link></li>
                  <li><Link href="/villas/cahyana-tibuah">Cahyana Tibuah · 2BR</Link></li>
                  <li><Link href="/villas">All villas</Link></li>
                </ul>
              </li>
              <li className={`has-dropdown ${openDrop === 'services' ? 'open' : ''}`.trim()}>
                <button
                  type="button"
                  className={`nav-drop-trigger ${linkClass(['/services/breakfast', '/services/spa', '/services/live-dinner']) || ''}`.trim()}
                  aria-expanded={openDrop === 'services'}
                  onClick={toggleDrop('services')}
                >
                  Services <span className="caret">›</span>
                </button>
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
