'use client';

import { useEffect, useRef, useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '../lib/cn.js';

function wrap(variant) {
  return cn('relative', variant === 'navbar' && 'ml-auto flex-none', variant === 'bar' && 'flex-none');
}

const BTN_BASE =
  'flex items-center gap-[0.45rem] w-full bg-surface-raised font-body text-field text-green cursor-pointer';
const BAR_BTN =
  'flex items-center gap-[0.4rem] h-8 px-[0.6rem] rounded-md bg-surface-raised font-body text-small font-semibold text-gold ' +
  'cursor-pointer [border:1px_solid_var(--line)] [transition:border-color_var(--dur)_var(--ease)] ' +
  'hover:[border-color:var(--color-gold)] focus-visible:outline-none ' +
  'focus-visible:[border-color:var(--color-gold)] focus-visible:[box-shadow:var(--focus-ring)]';

function pickButtonClasses(variant) {
  if (variant === 'bar') return BAR_BTN;
  return cn(
    BTN_BASE,
    'py-0 px-[0.85rem] h-[var(--field-h)] rounded-md font-normal',
    '[border:1px_solid_var(--line)] hover:[border-color:var(--color-gold)]',
  );
}

const CODE = 'flex-[1_1_auto] text-left';
const CARET =
  'w-[14px] h-[14px] text-muted flex-none [transition:transform_var(--dur-fast)_ease] ' +
  '[[aria-expanded=true]_&]:[transform:rotate(180deg)]';

function list(variant, open) {
  return cn(
    'absolute mt-1 p-1 list-none bg-surface-raised z-10 max-h-[15rem] overflow-y-auto overscroll-contain',
    variant === 'bar' ? 'right-0 min-w-[9.5rem]' : 'left-0 right-0',
    '[border:1px_solid_var(--line)]',
    'transition-[opacity,transform] duration-[var(--dur)] ease-[var(--ease-out)] motion-reduce:transition-none',
    open
      ? 'opacity-100 visible pointer-events-auto [transform:translateY(0)]'
      : 'opacity-0 invisible pointer-events-none [transform:translateY(-4px)]',
    variant === 'hero' ? 'rounded-md' : 'rounded-sm',
  );
}

const OPT =
  'flex items-center gap-[0.45rem] py-[0.45rem] px-[0.4rem] rounded-sm font-body text-[1rem] font-semibold text-green cursor-pointer hover:bg-cream';
const FLAG =
  'inline-block w-5 h-[14px] rounded-base overflow-hidden flex-none [box-shadow:0_0_0_1px_rgba(0,0,0,0.06)] [&_svg]:block [&_svg]:w-full [&_svg]:h-full';

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
  id,
  className,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    if (!isOpen) return undefined;
    function handleOutsidePointerDown(event) {
      if (ref.current && !ref.current.contains(event.target)) setIsOpen(false);
    }
    function handleEscapeKeyDown(event) {
      if (event.key === 'Escape') setIsOpen(false);
    }
    document.addEventListener('click', handleOutsidePointerDown);
    document.addEventListener('keydown', handleEscapeKeyDown);
    return () => {
      document.removeEventListener('click', handleOutsidePointerDown);
      document.removeEventListener('keydown', handleEscapeKeyDown);
    };
  }, [isOpen]);

  return (
    <div className={cn(wrap(variant), className)} data-cur ref={ref}>
      <button
        type="button"
        id={id}
        className={pickButtonClasses(variant)}
        aria-label={label}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        onClick={() => setIsOpen((wasOpen) => !wasOpen)}
      >
        <Flag code={value} />
        <span className={variant === 'bar' ? undefined : CODE}>{value}</span>
        <ChevronDown className={CARET} aria-hidden="true" />
      </button>
      <ul className={list(variant, isOpen)} role="listbox" aria-label="Currency">
        {options.map((option) => {
          const code = typeof option === 'string' ? option : option.code;
          return (
            <li
              key={code}
              className={OPT}
              role="option"
              aria-selected={code === value}
              onClick={() => {
                onChange?.(code);
                setIsOpen(false);
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
