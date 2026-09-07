'use client';

import { useEffect, useRef, useState } from 'react';
import { CURRENCIES } from '@/lib/currency';
import { useCurrency } from '@/components/providers/CurrencyProvider';

// Currency dropdown for the navbar (desktop popover / mobile behaves the
// same, just narrower) — a real display-currency switcher, not decorative.
export default function CurrencyPicker({ light = false }) {
  const { currency, setCurrency } = useCurrency();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    function onClick(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-label="Select currency"
        className="flex items-center gap-1 text-[0.78rem] font-semibold cursor-pointer"
        style={{ color: light ? '#fff' : 'var(--color-gold)' }}
      >
        {currency}
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className={`transition-transform ${open ? 'rotate-180' : ''}`}>
          <path d="M2.5 4.5 6 8l3.5-3.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {open && (
        <div
          className="absolute right-0 top-[calc(100%+10px)] w-56 rounded-lg bg-white border border-line shadow-lg py-2 z-50"
        >
          <p className="px-4 pb-2 text-label font-semibold uppercase tracking-wide text-muted">Select currency</p>
          {CURRENCIES.map((c) => (
            <button
              key={c.code}
              type="button"
              onClick={() => {
                setCurrency(c.code);
                setOpen(false);
              }}
              className="w-full flex items-center justify-between gap-3 px-4 py-2 text-left text-small hover:bg-cream cursor-pointer"
              style={{ color: 'var(--color-gold)' }}
            >
              <span className="flex items-center gap-2">
                <span aria-hidden="true">{c.flag}</span>
                <span>
                  {c.code} <span className="text-muted">· {c.name}</span>
                </span>
              </span>
              {currency === c.code && (
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <circle cx="8" cy="8" r="8" fill="var(--color-cta)" />
                  <path d="M4.5 8.2 7 10.5 11.5 5.5" stroke="#fff" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
