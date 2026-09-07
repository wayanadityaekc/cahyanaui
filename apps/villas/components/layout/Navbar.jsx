'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Logo from '@/components/ui/Logo';
import CurrencyPicker from '@/components/ui/CurrencyPicker';
import { useBooking } from '@/components/providers/BookingProvider';

const NAV_LINKS = [
  { href: '/villas', label: 'Villas' },
  { href: '/experiences', label: 'Experiences' },
  { href: '/about', label: 'About' },
  // Judgement call: no dedicated Contact page was specced with real content,
  // so "Contact" routes to About's existing Get in Touch section rather
  // than a thin new stand-alone page — see report for reasoning.
  { href: '/about#contact', label: 'Contact' },
];

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();
  const { openBooking } = useBooking();

  const isActive = (href) => href !== '/' && pathname?.startsWith(href.split('#')[0]);

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-line">
      <div className="wrap flex items-center justify-between gap-4 py-3.5">
        <Link href="/" aria-label="Ubud Private Villas home">
          <Logo />
        </Link>

        <nav className="hidden md:block">
          <ul className="flex items-center gap-7">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="block py-1 text-small font-semibold border-b"
                  style={{
                    color: isActive(link.href) ? 'var(--color-cta)' : 'var(--color-gold)',
                    borderColor: isActive(link.href) ? 'var(--color-cta)' : 'transparent',
                  }}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-4">
          <CurrencyPicker />
          <button
            type="button"
            className="hidden md:inline-flex btn btn-cta btn-sm"
            onClick={() => openBooking()}
          >
            Check availability
          </button>
          <button
            type="button"
            aria-label="Toggle menu"
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((v) => !v)}
            className="md:hidden flex flex-col gap-[5px] cursor-pointer"
          >
            <span className="w-5 h-[1.5px]" style={{ background: 'var(--color-gold)' }} />
            <span className="w-5 h-[1.5px]" style={{ background: 'var(--color-gold)' }} />
            <span className="w-5 h-[1.5px]" style={{ background: 'var(--color-gold)' }} />
          </button>
        </div>
      </div>

      {menuOpen && (
        <div className="md:hidden border-t border-line bg-white shadow-lg">
          <div className="wrap py-3">
            <ul className="flex flex-col">
              {NAV_LINKS.map((link) => (
                <li key={link.href} className="border-b border-line last:border-b-0">
                  <Link
                    href={link.href}
                    onClick={() => setMenuOpen(false)}
                    className="block py-3.5 text-small font-semibold"
                    style={{ color: isActive(link.href) ? 'var(--color-cta)' : 'var(--color-gold)' }}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
            <button
              type="button"
              className="btn btn-cta btn-full mt-4"
              onClick={() => {
                setMenuOpen(false);
                openBooking();
              }}
            >
              Check availability
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
