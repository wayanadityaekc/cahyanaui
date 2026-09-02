'use client';

import { useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';
import { useTripPrefs } from '@/state/TripPrefsProvider';
import { useItinerary } from '@/state/ItineraryProvider';
import { useAccount } from '@/state/AccountProvider';
import CurrencyPicker from './CurrencyPicker';
import TripBar from './TripBar';
import FlagDefs from './FlagDefs';

const GUEST_OPTIONS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

export default function Navbar() {
  const { guests, setGuests, resetGuests, stay, setStay } = useTripPrefs();
  const { count } = useItinerary();
  const { account, hasUpcoming } = useAccount();

  const [acctOpen, setAcctOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropOpen, setDropOpen] = useState(false);
  const acctRef = useRef(null);
  const navRef = useRef(null);
  const burgerRef = useRef(null);
  const pathname = usePathname();

  const isActive = (href) => {
    if (href === '/') return pathname === '/';
    return pathname === href.replace(/\.html$/, '') || pathname === href;
  };
  const navClass = (href) => (isActive(href) ? 'active' : undefined);

  const closeAll = () => {
    setAcctOpen(false);
    setMenuOpen(false);
    setDropOpen(false);
  };

  // Tapping outside, or Escape, closes the account panel and the mobile menu -
  // the drawer behaviour closeNavDrawers() had.
  useEffect(() => {
    if (!acctOpen && !menuOpen) return;
    const onDoc = (e) => {
      const inAcct = acctRef.current && acctRef.current.contains(e.target);
      const inNav = navRef.current && navRef.current.contains(e.target);
      const onBurger = burgerRef.current && burgerRef.current.contains(e.target);
      if (!inAcct && !inNav && !onBurger) closeAll();
    };
    const onKey = (e) => e.key === 'Escape' && closeAll();
    document.addEventListener('click', onDoc);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('click', onDoc);
      document.removeEventListener('keydown', onKey);
    };
  }, [acctOpen, menuOpen]);

  useEffect(() => {
    const drawer = acctOpen || menuOpen;
    document.body.classList.toggle('hs-locked', drawer);
    return () => document.body.classList.remove('hs-locked');
  }, [acctOpen, menuOpen]);

  return (
    <header className="navbar">
      <div className="navbar__container">
        <a href="/" className="navbar__logo">
          <img src="/assets/images/logo.webp" alt="The Cahyana Logo" width="1005" height="324" />
        </a>

        <div className="acct" data-acct ref={acctRef}>
          <button
            type="button"
            className="acct__btn"
            aria-label="Account & trip"
            aria-expanded={acctOpen}
            onClick={() => { setAcctOpen((v) => !v); setMenuOpen(false); }}
          >
            <svg className="acct__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <circle cx="12" cy="8" r="4" />
              <path d="M4 20c0-4 4-6.2 8-6.2s8 2.2 8 6.2" />
            </svg>
            <span className="acct__dot" hidden={!hasUpcoming} />
          </button>

          <div className={`acct__panel${acctOpen ? ' is-open' : ''}`} data-acct-panel>
            <div className="acct__head">
              <p className="acct__greeting">
                <span>Welcome,</span> <span className="acct__name">{account ? account.name || 'Guest' : 'Guest'}</span>
              </p>
              <p className="acct__email">{account ? account.email : ''}</p>
            </div>

            <p className="acct__title">Your trip</p>

            <label className="acct__label" htmlFor="acct-guests">Guests</label>
            <select
              id="acct-guests"
              data-guest-select
              aria-label="Number of guests"
              value={guests || ''}
              onChange={(e) => (e.target.value === 'reset' ? resetGuests() : setGuests(e.target.value))}
            >
              {!guests && <option value="">Guests</option>}
              {GUEST_OPTIONS.map((n) => (
                <option key={n} value={n}>{n}</option>
              ))}
              <option value="reset">↺ Reset</option>
            </select>

            <label className="acct__label" htmlFor="acct-stay">Stay area</label>
            <select
              id="acct-stay"
              data-stay-select
              aria-label="Stay area"
              value={stay || 'ubud'}
              onChange={(e) => setStay(e.target.value)}
            >
              <option value="ubud">Ubud &amp; nearby</option>
            </select>

            <FlagDefs />

            <label className="acct__label" htmlFor="acct-cur">Currency</label>
            <CurrencyPicker />

            <div className="acct__actions">
              <a href="/settings.html" className="acct__link">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
                  <circle cx="12" cy="12" r="3" />
                  <path d="M12 3v3M12 18v3M3 12h3M18 12h3M5.6 5.6l2 2M16.4 16.4l2 2M5.6 18.4l2-2M16.4 7.6l2-2" />
                </svg>
                Settings
              </a>
              <button type="button" className="acct__link acct__link--auth">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
                  <circle cx="12" cy="8" r="4" />
                  <path d="M4 20c0-4 4-6.2 8-6.2s8 2.2 8 6.2" />
                  <path d="M19 7v4M21 9h-4" />
                </svg>
                <span>{account ? 'Sign out' : 'Sign in / Sign up'}</span>
              </button>
            </div>
          </div>
        </div>

        <a href="/my-trips.html" className="navbar__cart" aria-label="My Trips">
          <svg className="navbar__cart-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
            <path d="M3 6h18" />
            <path d="M16 10a4 4 0 0 1-8 0" />
          </svg>
          <span className="itn-badge navbar__cart-badge" hidden={!count}>{count}</span>
        </a>

        <nav ref={navRef}>
          <ul className={`navbar__menu${menuOpen ? ' active' : ''}`} id="nav-menu">
            <li><a href="/" className={navClass('/')}>Home</a></li>
            <li className={`navbar__has-drop${dropOpen ? ' active' : ''}`}>
              <button
                type="button"
                className="navbar__droptoggle"
                aria-expanded={dropOpen}
                onClick={() => setDropOpen((v) => !v)}
              >
                Program<span className="navbar__caret">&rsaquo;</span>
              </button>
              <ul className="navbar__drop">
                <li><a href="/tour.html">Tours</a></li>
                <li><a href="/destinations.html">Destinations</a></li>
                <li><a href="/activities.html">Experiences</a></li>
                <li><a href="/transfer.html">Transfer</a></li>
                <li><a href="/charter.html">Charter</a></li>
              </ul>
            </li>
            <li><a href="/bali-guide.html" className={navClass('/bali-guide.html')}>Guide</a></li>
            <li><a href="/about-us.html" className={navClass('/about-us.html')}>About</a></li>
            <li><a href="/contact.html" className={navClass('/contact.html')}>Contact Us</a></li>
          </ul>
        </nav>

        <button
          className="navbar__toggle"
          id="hamburger"
          aria-label="Open menu"
          ref={burgerRef}
          onClick={() => { setMenuOpen((v) => !v); setAcctOpen(false); }}
        >
          <span /><span /><span />
          <span className="acct__dot acct__dot--ham" hidden={!hasUpcoming} />
        </button>
      </div>

      <div className={`navbar__scrim${acctOpen || menuOpen ? ' open' : ''}`} onClick={closeAll} />
      <TripBar />
    </header>
  );
}
