'use client';

import { useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';
import { useTripPrefs } from '@/state/TripPrefsProvider';
import { useItinerary } from '@/state/ItineraryProvider';
import { useAccount } from '@/state/AccountProvider';
import CurrencyPicker from './CurrencyPicker';
import TripBar from './TripBar';
import FlagDefs from './FlagDefs';
import Select from '@/components/ui/Select';
import AuthModal from '@/components/account/AuthModal';

const GUEST_OPTIONS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

export default function Navbar() {
  const { guests, setGuests, resetGuests, stay, setStay } = useTripPrefs();
  const { count } = useItinerary();
  const { account, hasUpcoming, logout } = useAccount();

  const [menuOpen, setMenuOpen] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const navRef = useRef(null);
  const burgerRef = useRef(null);
  const headerRef = useRef(null);
  const pathname = usePathname();

  // Publish the real fixed-header height (navbar row + trip bar) as --header-h
  // so sticky tab strips can sit flush right below it at any width / promo state.
  useEffect(() => {
    const el = headerRef.current;
    if (!el) return undefined;
    const set = () => document.documentElement.style.setProperty('--header-h', `${el.offsetHeight}px`);
    set();
    const ro = new ResizeObserver(set);
    ro.observe(el);
    window.addEventListener('resize', set);
    return () => {
      ro.disconnect();
      window.removeEventListener('resize', set);
    };
  }, []);

  const isActive = (href) => {
    if (href === '/') return pathname === '/';
    return pathname === href.replace(/\.html$/, '') || pathname === href;
  };
  const navClass = (href) => (isActive(href) ? 'active' : undefined);

  // Tapping outside, or Escape, closes the single drawer.
  useEffect(() => {
    if (!menuOpen) return undefined;
    const onDoc = (e) => {
      const inNav = navRef.current && navRef.current.contains(e.target);
      const onBurger = burgerRef.current && burgerRef.current.contains(e.target);
      if (!inNav && !onBurger) setMenuOpen(false);
    };
    const onKey = (e) => e.key === 'Escape' && setMenuOpen(false);
    document.addEventListener('click', onDoc);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('click', onDoc);
      document.removeEventListener('keydown', onKey);
    };
  }, [menuOpen]);

  useEffect(() => {
    document.body.classList.toggle('hs-locked', menuOpen);
    return () => document.body.classList.remove('hs-locked');
  }, [menuOpen]);

  return (
    <header className="navbar" ref={headerRef}>
      <div className="navbar__container">
        <a href="/" className="navbar__logo">
          <img src="/assets/images/logo.webp" alt="The Cahyana Logo" width="1005" height="324" />
        </a>

        <a href="/my-trips.html" className="navbar__cart" aria-label="My Trips">
          <svg className="navbar__cart-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
            <path d="M3 6h18" />
            <path d="M16 10a4 4 0 0 1-8 0" />
          </svg>
          <span className="itn-badge navbar__cart-badge" hidden={!count}>{count}</span>
        </a>

        <FlagDefs />

        <nav ref={navRef}>
          <ul className={`navbar__menu${menuOpen ? ' active' : ''}`} id="nav-menu">
            {/* Account header: identity + currency + sign in (merged into the drawer) */}
            <li className="navbar__acct">
              <div className="navbar__acctrow">
                <span className="navbar__ava" aria-hidden="true">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="8" r="4" />
                    <path d="M4 20c0-4 4-6.2 8-6.2s8 2.2 8 6.2" />
                  </svg>
                </span>
                <span className="navbar__acctid">
                  <b><span>Welcome,</span> {account ? account.name || 'Guest' : 'Guest'}</b>
                  <span className="navbar__acctemail">{account ? account.email : 'Plan your Bali trip'}</span>
                </span>
                <CurrencyPicker />
              </div>
              <button
                type="button"
                className="navbar__signin"
                onClick={() => {
                  if (account) logout();
                  else setAuthOpen(true);
                  setMenuOpen(false);
                }}
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <circle cx="12" cy="8" r="4" />
                  <path d="M4 20c0-4 4-6.2 8-6.2s8 2.2 8 6.2" />
                  <path d="M19 7v4M21 9h-4" />
                </svg>
                <span>{account ? 'Sign out' : 'Sign in / Sign up'}</span>
              </button>
            </li>

            {/* Explore */}
            <li className="navbar__grouplabel">Explore</li>
            <li><a href="/" className={navClass('/')}>Home</a></li>
            <li><a href="/tour.html">Tours</a></li>
            <li><a href="/destinations.html">Destinations</a></li>
            <li><a href="/activities.html">Experiences</a></li>
            <li><a href="/transfer.html">Transfer</a></li>
            <li><a href="/charter.html">Charter</a></li>

            {/* Plan your trip */}
            <li className="navbar__grouplabel">Plan your trip</li>
            <li className="navbar__trip">
              <label className="navbar__triplabel" htmlFor="acct-guests">Guests</label>
              <Select
                id="acct-guests"
                label="Guests"
                value={guests || ''}
                onChange={(v) => (v === 'reset' ? resetGuests() : setGuests(v))}
                options={[
                  ...GUEST_OPTIONS.map((n) => ({ value: String(n), label: String(n) })),
                  { value: 'reset', label: '↺ Reset' },
                ]}
                placeholder="Guests"
              />
            </li>
            <li className="navbar__trip">
              <label className="navbar__triplabel" htmlFor="acct-stay">Stay area</label>
              <Select
                id="acct-stay"
                label="Stay area"
                value={stay || 'ubud'}
                onChange={setStay}
                options={[{ value: 'ubud', label: 'Ubud & nearby' }]}
              />
            </li>
            <li>
              <a href="/my-trips.html" className="navbar__menucart">
                My Trips<span className="itn-badge navbar__menucart-badge" hidden={!count}>{count}</span>
              </a>
            </li>

            {/* Company */}
            <li className="navbar__grouplabel">Company</li>
            <li><a href="/bali-guide.html" className={navClass('/bali-guide.html')}>Guide</a></li>
            <li><a href="/our-company.html" className={navClass('/our-company.html')}>Our Company</a></li>

            {/* Footer */}
            <li className="navbar__menufoot">
              <a href="/settings.html" className="navbar__footlink">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
                  <circle cx="12" cy="12" r="3" />
                  <path d="M12 3v3M12 18v3M3 12h3M18 12h3M5.6 5.6l2 2M16.4 16.4l2 2M5.6 18.4l2-2M16.4 7.6l2-2" />
                </svg>
                Settings
              </a>
            </li>
          </ul>
        </nav>

        <button
          className="navbar__toggle"
          id="hamburger"
          aria-label="Open menu"
          ref={burgerRef}
          onClick={() => setMenuOpen((v) => !v)}
        >
          <span /><span /><span />
          <span className="acct__dot acct__dot--ham" hidden={!hasUpcoming} />
        </button>
      </div>

      <div className={`navbar__scrim${menuOpen ? ' open' : ''}`} onClick={() => setMenuOpen(false)} />
      {pathname !== '/our-company' && <TripBar />}
      <AuthModal open={authOpen} onClose={() => setAuthOpen(false)} />
    </header>
  );
}
