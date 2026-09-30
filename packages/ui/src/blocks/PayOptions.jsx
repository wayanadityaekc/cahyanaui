'use client';

import { cn } from '../lib/cn.js';

// CUE's PaymentStep look: rail tiles (icon only, name in aria-label) above plain option rows; amounts come from the site.
const METHOD = 'flex items-center justify-center h-[2.9rem] rounded-md bg-white cursor-pointer';
const METHOD_ON = '[border:1.5px_solid_var(--color-cta)] bg-cream';
const METHOD_OFF = '[border:1.5px_solid_var(--line)] hover:[border-color:var(--color-gold)]';
const CARD = 'rounded-md bg-white';
const CARD_ON = '[border:1.5px_solid_var(--color-cta)] bg-cream';
const CARD_OFF = '[border:1.5px_solid_var(--line)] hover:[border-color:var(--color-gold)]';
const PICK = 'w-full flex items-start gap-3 text-left bg-transparent border-none p-[0.85rem] cursor-pointer';
const DOT = 'flex-none w-[18px] h-[18px] mt-[0.1rem] rounded-[50%] flex items-center justify-center';
const HEAD = 'text-label font-medium tracking-[0.08em] uppercase text-muted mb-[0.6rem]';

export default function PayOptions({
  rails = [],
  rail = '',
  onRail = () => {},
  options = [],
  value = '',
  onChange = () => {},
  note = '',
  railsTitle = 'How would you like to pay?',
  optionsTitle = 'How much now?',
}) {
  if (!options.length) return <p className="m-0 text-body text-muted">Sorry, we could not load this information. Please try again.</p>;
  return (
    <div data-pay-options>
      {rails.length > 1 && (
        <>
          <p className={HEAD}>{railsTitle}</p>
          <div className="grid grid-cols-2 gap-2 mb-2" role="radiogroup" aria-label={railsTitle}>
            {rails.map(({ id, label, icon }) => (
              <button
                key={id}
                type="button"
                role="radio"
                aria-checked={rail === id}
                aria-label={label}
                data-rail={id}
                className={cn(METHOD, rail === id ? METHOD_ON : METHOD_OFF)}
                onClick={() => onRail(id)}
              >
                {icon}
              </button>
            ))}
          </div>
          {note ? <p className="m-0 mb-4 text-small text-muted leading-[var(--lh-body)]" data-pay-note>{note}</p> : <div className="mb-4" />}
        </>
      )}
      <p className={HEAD}>{optionsTitle}</p>
      <div className="flex flex-col gap-2" role="radiogroup" aria-label={optionsTitle}>
        {options.map(({ id, label, sub, amount }) => {
          const on = value === id;
          return (
            <div key={id} className={cn(CARD, on ? CARD_ON : CARD_OFF)} data-pay-option={id}>
              <button type="button" role="radio" aria-checked={on} className={PICK} onClick={() => onChange(id)}>
                <span className={cn(DOT, on ? 'bg-cta' : '[border:1.5px_solid_var(--line)]')} aria-hidden="true">
                  {on ? <span className="w-[7px] h-[7px] rounded-[50%] bg-white" /> : null}
                </span>
                <span className="flex-1 min-w-0">
                  <span className="font-semibold text-green text-[1rem] leading-tight">{label}</span>
                  {sub ? <span className="block mt-[0.2rem] text-small text-muted leading-[var(--lh-body)]">{sub}</span> : null}
                </span>
                <span className="font-semibold text-amber text-[1rem] whitespace-nowrap" data-pay-amount>{amount}</span>
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
