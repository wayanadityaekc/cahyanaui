'use client';

import { useEffect, useRef, useState } from 'react';
import { useTripPrefs } from '@/state/TripPrefsProvider';
import { CURRENCIES } from '@/lib/constants';

function Flag({ code }) {
  return (
    <span className="acct__flag">
      <svg viewBox="0 0 60 40" aria-hidden="true">
        <use href={`#flag-${code.toLowerCase()}`} />
      </svg>
    </span>
  );
}

export default function CurrencyPicker() {
  const { currency, setCurrency } = useTripPrefs();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    if (!open) return;
    const onDoc = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('click', onDoc);
    return () => document.removeEventListener('click', onDoc);
  }, [open]);

  return (
    <div className="acct__cur" data-cur ref={ref}>
      <button
        type="button"
        className="acct__curbtn"
        id="acct-cur"
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
      >
        <Flag code={currency} />
        <span className="acct__curcode">{currency}</span>
        <svg className="acct__curcaret" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M6 9l6 6 6-6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
      <ul className="acct__curlist" role="listbox" aria-label="Currency" hidden={!open}>
        {CURRENCIES.map((c) => (
          <li
            key={c}
            className="acct__curopt"
            role="option"
            aria-selected={c === currency}
            onClick={() => {
              setCurrency(c);
              setOpen(false);
            }}
          >
            <Flag code={c} />
            {c}
          </li>
        ))}
      </ul>
    </div>
  );
}
