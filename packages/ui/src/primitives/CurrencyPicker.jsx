'use client';

import { useEffect, useRef, useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '../lib/cn.js';

/**
 * Display-currency switcher.
 *
 * PRESENTATIONAL ONLY, and that is the rule for everything in this library:
 * it takes `value`, `onChange` and `options` and knows nothing about where the
 * currency is stored, what the rates are, or who else re-renders when it
 * changes. Each site wires its own context to it. The moment a library
 * component reaches for a site's provider, the other site cannot use it.
 *
 * Flags are the SVG sprite in FlagDefs, which the consuming site must render
 * once somewhere in the tree. Emoji flags were the previous approach and they
 * render as two-letter boxes on most of Windows - a guest on a laptop saw "US"
 * where a flag should be.
 *
 *   variant  navbar  pushes itself to the end of a flex row
 *            hero    sized to match a form field on a search bar
 *            default
 */
const wrap = (v) => cn('relative', v === 'navbar' && 'ml-auto flex-none');

const BTN_BASE =
  'flex items-center gap-[0.45rem] w-full bg-surface-raised font-body text-field text-green cursor-pointer';
// ONE SHAPE, and it is a FIELD's shape, not a button's. The currency picker was
// a pill everywhere except the hero search form, where it already rendered as a
// 12px field - so the same control had two corners depending on where it stood.
// It is a field: it sits in a row beside Guests and Dates and it holds a value
// rather than performing an action. CUE made the same call. The border colour
// was also a hardcoded #d8d2c4 in the pill branch, the one place on either site
// not using the --line token.
const btn = (v) =>
  cn(
    BTN_BASE,
    'py-0 px-[0.85rem] h-[var(--field-h)] rounded-md font-normal',
    '[border:1px_solid_var(--line)] hover:[border-color:var(--color-gold)]',
  );

const CODE = 'flex-[1_1_auto] text-left';
const CARET =
  'w-[14px] h-[14px] text-muted flex-none [transition:transform_var(--dur-fast)_ease] ' +
  '[[aria-expanded=true]_&]:[transform:rotate(180deg)]';

// The list stays mounted and only toggles opacity/transform/pointer-events, so
// the transition has a frame to play from. A `hidden` attribute would snap.
const list = (v, open) =>
  cn(
    'absolute left-0 right-0 mt-1 p-1 list-none bg-surface-raised z-10',
    '[border:1px_solid_#e4dcc8] [box-shadow:0_10px_24px_rgba(31,61,43,0.16)]',
    'transition-[opacity,transform] duration-[var(--dur)] ease-[var(--ease-out)] motion-reduce:transition-none',
    open
      ? 'opacity-100 visible pointer-events-auto [transform:translateY(0)]'
      : 'opacity-0 invisible pointer-events-none [transform:translateY(-4px)]',
    v === 'hero' ? 'rounded-md' : 'rounded-sm',
  );

const OPT =
  'flex items-center gap-[0.45rem] py-[0.45rem] px-[0.4rem] rounded-sm font-body text-[1rem] font-semibold text-green cursor-pointer hover:bg-cream';
const FLAG =
  'inline-block w-5 h-[14px] rounded-[2px] overflow-hidden flex-none [box-shadow:0_0_0_1px_rgba(0,0,0,0.06)] [&_svg]:block [&_svg]:w-full [&_svg]:h-full';

function Flag({ code }) {
  return (
    <span className={FLAG}>
      <svg viewBox="0 0 60 40" aria-hidden="true">
        <use href={`#flag-${String(code).toLowerCase()}`} />
      </svg>
    </span>
  );
}

export default function CurrencyPicker({
  value,
  onChange,
  options = [],
  variant = 'default',
  label = 'Select currency',
  className,
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    if (!open) return undefined;
    const onDoc = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    const onKey = (e) => e.key === 'Escape' && setOpen(false);
    document.addEventListener('click', onDoc);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('click', onDoc);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  return (
    <div className={cn(wrap(variant), className)} data-cur ref={ref}>
      <button
        type="button"
        className={btn(variant)}
        aria-label={label}
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
      >
        <Flag code={value} />
        <span className={CODE}>{value}</span>
        <ChevronDown className={CARET} aria-hidden="true" />
      </button>
      <ul className={list(variant, open)} role="listbox" aria-label="Currency">
        {options.map((o) => {
          const code = typeof o === 'string' ? o : o.code;
          return (
            <li
              key={code}
              className={OPT}
              role="option"
              aria-selected={code === value}
              onClick={() => {
                onChange?.(code);
                setOpen(false);
              }}
            >
              <Flag code={code} />
              {code}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
