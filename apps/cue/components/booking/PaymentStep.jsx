'use client';

import { ShieldCheck } from 'lucide-react';
import { withSymbol } from '@/components/Price';
import PayChips from './PayChips';
import { REFERRAL_INPUT, REFERRAL_BTN, refMsgCls } from '@/components/ui/modalClasses';
import { PAY_OPTIONS, PAY_METHODS, PAY_COPY, amountDueNow } from '@/lib/payment';

// CHECKPOINT 1 - design only. Nothing here opens DOKU, creates a session or
// charges anything; it renders the choice and reports it upward.
//
// Two stacked choices, because they answer different questions:
//   1. HOW MUCH do you pay now - deposit, in full, or nothing (referral).
//   2. WITH WHAT - card or PayPal.
// The second only appears when the first actually charges something, so a
// referral booking does not ask a guest to pick a card for a zero payment.
//
// Amounts are derived from the total the server already quoted (priced.total),
// in the guest's own currency. No price is calculated here.
const ROW =
  'w-full flex items-start gap-3 text-left p-[0.85rem] rounded-md bg-white cursor-pointer ' +
  '[transition:border-color_var(--dur)_ease,background-color_var(--dur)_ease,scale_var(--dur-fast)_var(--ease)]';
const ROW_ON = '[border:1.5px_solid_var(--color-cta)] bg-cream';
const ROW_OFF = '[border:1.5px_solid_var(--line)] hover:[border-color:var(--color-gold)]';
const DOT = 'flex-none w-[18px] h-[18px] mt-[0.1rem] rounded-[50%] flex items-center justify-center';
const DOT_ON = '[border:1.5px_solid_var(--color-cta)]';
const DOT_OFF = '[border:1.5px_solid_#cfc9ba]';
const LABEL = 'font-semibold text-green text-[1rem] leading-tight';
const SUB = 'block mt-[0.2rem] text-small text-muted leading-[var(--lh-body)]';
const AMOUNT = 'font-semibold text-amber text-[1rem] whitespace-nowrap';
const BADGE = 'inline-block ml-2 px-[0.45rem] py-[0.1rem] rounded-sm bg-[rgba(201,164,92,0.16)] text-amber-d text-small font-semibold align-middle';
const HEAD = 'text-label font-medium tracking-[0.08em] uppercase text-muted mb-[0.6rem]';

function Radio({ on }) {
  return (
    <span className={`${DOT} ${on ? DOT_ON : DOT_OFF}`} aria-hidden="true">
      {on && <span className="w-[8px] h-[8px] rounded-[50%] bg-cta" />}
    </span>
  );
}

export default function PaymentStep({
  option, onOption,
  method, onMethod,
  total, symbol = '$',
  referral, onReferral, onApplyReferral, refMsg,
}) {
  const charges = option !== 'referral';

  return (
    <div className="my-5">
      <p className={HEAD}>{PAY_COPY.heading}</p>

      <div className="flex flex-col gap-2">
        {PAY_OPTIONS.map((o) => {
          const on = option === o.id;
          const due = amountDueNow(o.id, total, symbol);
          return (
            <div key={o.id}>
              <button
                type="button"
                role="radio"
                aria-checked={on}
                className={`${ROW} ${on ? ROW_ON : ROW_OFF}`}
                onClick={() => onOption(o.id)}
              >
                <Radio on={on} />
                <span className="flex-1 min-w-0">
                  <span className={LABEL}>
                    {o.label}
                    <span className={BADGE}>{o.badge}</span>
                  </span>
                  <span className={SUB}>{o.sub}</span>
                </span>
                {due && <span className={AMOUNT}>{withSymbol(due)}</span>}
              </button>

              {/* The code field lives inside its own row, so it is obvious what
                  it belongs to. Pre-filled when the guest already entered a code
                  earlier in the form - they should not have to type it twice. */}
              {on && o.id === 'referral' && (
                <div className="mt-2 ml-[calc(18px+0.75rem)]">
                  <div className="flex gap-2">
                    <input
                      className={REFERRAL_INPUT}
                      type="text"
                      aria-label="Referral code"
                      placeholder="Enter code"
                      value={referral}
                      onChange={(e) => onReferral(e.target.value)}
                    />
                    <button className={REFERRAL_BTN} type="button" onClick={onApplyReferral}>Apply</button>
                  </div>
                  {refMsg
                    ? <small className={refMsgCls(refMsg.ok)}>{refMsg.text}</small>
                    : <small className="block mt-[0.3rem] text-small text-muted">{PAY_COPY.referralNone}</small>}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {charges && (
        <>
          <p className={`${HEAD} mt-5`}>{PAY_COPY.methodHeading}</p>
          <div className="flex flex-col gap-2">
            {PAY_METHODS.map((m) => {
              const on = method === m.id;
              return (
                <button
                  key={m.id}
                  type="button"
                  role="radio"
                  aria-checked={on}
                  className={`${ROW} ${on ? ROW_ON : ROW_OFF} flex-col`}
                  onClick={() => onMethod(m.id)}
                >
                  <span className="flex items-start gap-3 w-full">
                    <Radio on={on} />
                    <span className="flex-1 min-w-0">
                      <span className={LABEL}>{m.label}</span>
                      <span className={SUB}>{m.sub}</span>
                    </span>
                  </span>
                  {/* Brands only once card is chosen - the row stays quiet until
                      it is the one being used. */}
                  {on && m.id === 'card' && (
                    <PayChips
                      className="w-full mt-[0.7rem] ml-[calc(18px+0.75rem)]"
                      logosClass="flex flex-wrap items-center gap-2"
                      chipClass="inline-flex items-center justify-center h-[28px] min-w-[44px] px-[0.5rem] bg-white [border:1px_solid_#e2ddd0] rounded-sm"
                      svgClass="block h-[var(--icon-sm)] w-auto"
                    />
                  )}
                </button>
              );
            })}
          </div>
        </>
      )}

      <p className="mt-[0.9rem] text-small text-green leading-[var(--lh-body)]">
        {PAY_COPY.cancel} <span className="text-muted">{PAY_COPY.late}</span>{' '}
        <a className="text-gold-d underline underline-offset-2" href="/our-company.html#cancellation">
          Cancellation policy
        </a>
      </p>

      {charges && (
        <p className="flex items-start gap-2 mt-[0.6rem] text-small text-muted leading-[var(--lh-body)]">
          <ShieldCheck className="w-[var(--icon-sm)] h-[var(--icon-sm)] shrink-0 mt-[0.1rem] text-cta" strokeWidth={1.7} aria-hidden="true" />
          <span>{method === 'paypal' ? PAY_COPY.securePaypal : PAY_COPY.secureCard}</span>
        </p>
      )}
    </div>
  );
}
