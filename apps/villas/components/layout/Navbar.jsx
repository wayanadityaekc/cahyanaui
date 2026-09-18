'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Logo from '@/components/ui/Logo';
import CurrencyPicker from '@/components/ui/CurrencyPicker';
import { useBooking } from '@/components/providers/BookingProvider';
import useBodyLock from '@/components/ui/useBodyLock';

const NAV_LINKS = [
  { href: '/villas', label: 'Villas' },
  { href: '/experiences', label: 'Experiences' },
  { href: '/about', label: 'About' },
  // Judgement call: no dedicated Contact page was specced with real content,
  // so "Contact" routes to About's existing Get in Touch section rather
  // than a thin new stand-alone page — see report for reasoning.
  { href: '/about#contact', label: 'Contact' },
];

const SERVICE_LINKS = [
  { href: '/services/breakfast', label: 'Breakfast' },
  { href: '/services/spa', label: 'Spa & Massage' },
  { href: '/services/live-dinner', label: 'Live Dinner' },
  { href: '/services/scooter-rental', label: 'Scooter Rental' },
];

// Menu system matches CUE's own (Sep 2026 decision, same for both sister
// sites): a hamburger opens one right-hand drawer at EVERY width, not just
// mobile — no separate inline desktop nav row. Also uses the drawer to
// surface the Services pages (Breakfast/Spa/Live Dinner/Scooter Rental),
// which had no navbar entry point before this (footer/villa-detail only).
export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const pathname = usePathname();
  const { openBooking } = useBooking();
  const navRef = useRef(null);
  const burgerRef = useRef(null);

  const isActive = (href) => href !== '/' && pathname?.startsWith(href.split('#')[0]);

  // Click outside or Escape closes the drawer, same as CUE's.
  useEffect(() => {
    if (!menuOpen) return undefined;
    const onDoc = (e) => {
      const inNav = navRef.current && navRef.current.contains(e.target);
      const onBurger = burgerRef.current && burgerRef.current.contains(e.target);
      if (!inNav && !onBurger) setMenuOpen(false);
    };
    const onKey = (e) => {
      if (e.key === 'Escape') setMenuOpen(false);
    };
    document.addEventListener('click', onDoc);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('click', onDoc);
      document.removeEventListener('keydown', onKey);
    };
  }, [menuOpen]);

  // Shared scroll lock (components/ui/useBodyLock.js), replacing a body-only
  // `overflow-hidden` toggle. It locks <html> AND <body>: Chrome and desktop
  // browsers scroll the page through <body>, but iOS Safari very often scrolls
  // <html> instead, so locking only body left the page scrollable behind this
  // drawer on iPhone. Still overflow-only, so the page does not jump to the top.
  useBodyLock(menuOpen);

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-line">
      <div className="wrap flex items-center justify-between gap-4 py-3.5">
        <Link href="/" aria-label="Ubud Private Villas home">
          <Logo />
        </Link>

        <div className="flex items-center gap-4">
          <CurrencyPicker />
          <button
            type="button"
            aria-label="Open menu"
            aria-expanded={menuOpen}
            ref={burgerRef}
            onClick={() => setMenuOpen((v) => !v)}
            className="flex flex-col gap-[5px] cursor-pointer"
          >
            <span className="w-6 h-[1.5px] bg-gold" />
            <span className="w-6 h-[1.5px] bg-gold" />
            <span className="w-6 h-[1.5px] bg-gold" />
          </button>
        </div>
      </div>

      <nav ref={navRef}>
        <ul
          className={`fixed top-0 right-0 bottom-0 w-4/5 max-w-[340px] h-[100dvh] bg-white shadow-[-14px_0_40px_rgba(26,26,26,0.15)] px-5 pb-7 pt-[4.5rem] overflow-y-auto flex flex-col list-none transition-transform duration-300 ease-in-out z-[120] ${
            menuOpen ? 'translate-x-0' : 'translate-x-full pointer-events-none'
          }`}
        >
          <li className="pb-4 border-b border-line">
            <button
              type="button"
              onClick={() => {
                setMenuOpen(false);
                openBooking();
              }}
              className="btn btn-cta btn-full"
            >
              Check availability
            </button>
          </li>

          {NAV_LINKS.map((link) => (
            <li key={link.href} className="border-b border-line">
              <Link
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className={`block py-3.5 text-small font-semibold ${isActive(link.href) ? 'text-cta' : 'text-gold'}`}
              >
                {link.label}
              </Link>
            </li>
          ))}

          <li className="border-b border-line">
            <button
              type="button"
              aria-expanded={servicesOpen}
              onClick={() => setServicesOpen((v) => !v)}
              className="flex items-center justify-between w-full py-3.5 text-small font-semibold text-gold cursor-pointer"
            >
              Services
              <span className={`transition-transform duration-200 ${servicesOpen ? 'rotate-90' : ''}`}>›</span>
            </button>
            {servicesOpen && (
              <ul className="list-none pl-3 pb-2">
                {SERVICE_LINKS.map((s) => (
                  <li key={s.href} className="py-2">
                    <Link
                      href={s.href}
                      onClick={() => setMenuOpen(false)}
                      className="block text-small text-muted hover:text-gold"
                    >
                      {s.label}
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </li>
        </ul>
      </nav>

      <div
        className={`fixed inset-0 bg-black/45 z-[115] transition-opacity duration-200 ${
          menuOpen ? 'opacity-100 visible' : 'opacity-0 invisible pointer-events-none'
        }`}
        onClick={() => setMenuOpen(false)}
      />
    </header>
  );
}
