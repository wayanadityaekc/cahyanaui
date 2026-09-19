'use client';

import { ShieldCheck } from 'lucide-react';
import { withSymbol } from '@/components/Price';
import PayChips from './PayChips';
import { REFERRAL_INPUT, REFERRAL_BTN, refMsgCls } from '@/components/ui/modalClasses';
import { PAY_METHODS, PAY_COPY, amountDueNow, payOptions } from '@/lib/payment';

// CHECKPOINT 1 - design only. Nothing here opens DOKU or PayPal, creates a
// session or charges anything; it renders the choice and reports it upward.
//
// Order on the page is deliberate: the referral code comes FIRST, because a code
// changes what both options below are worth. Entering it afterwards would mean
// the guest picks from the wrong numbers.
//
// The "Pay with" block only appears when something is actually being charged, so
// a code holder booking with no deposit is never shown card logos for a payment
// of zero.
const ROW =
  'w-full flex items-start gap-3 text-left p-[0.85rem] rounded-md bg-white cursor-pointer ' +
  '[transition:border-color_var(--dur)_ease,background-color_var(--dur)_ease,scale_var(--dur-fast)_var(--ease)]';
const ROW_ON = '[border:1.5px_solid_var(--color-cta)] bg-cream';
const ROW_OFF = '[border:1.5px_solid_var(--line)] hover:[border-color:var(--color-gold)]';
const DOT = 'flex-none w-[18px] h-[18px] mt-[0.1rem] rounded-[50%] flex items-center justify-center';
const LABEL = 'font-semibold text-green text-[1rem] leading-tight';
const SUB = 'block mt-[0.2rem] text-small text-muted leading-[var(--lh-body)]';
const AMOUNT = 'font-semibold text-amber text-[1rem] whitespace-nowrap';
const AMOUNT_FREE = 'font-semibold text-cta text-small whitespace-nowrap';
const BADGE = 'inline-block ml-2 px-[0.45rem] py-[0.1rem] rounded-sm bg-[rgba(201,164,92,0.16)] text-amber-d text-small font-semibold align-middle';
const HEAD = 'text-label font-medium tracking-[0.08em] uppercase text-muted mb-[0.6rem]';

function Radio({ on }) {
  return (
    <span className={`${DOT} ${on ? '[border:1.5px_solid_var(--color-cta)]' : '[border:1.5px_solid_#cfc9ba]'}`} aria-hidden="true">
      {on && <span className="w-[8px] h-[8px] rounded-[50%] bg-cta" />}
    </span>
  );
}

export default function PaymentStep({
  option, onOption,
  total, symbol = '$', hasReferral = false,
  referral, onReferral, onApplyReferral, refMsg,
}) {
  const options = payOptions(hasReferral);
  const charges = !!amountDueNow(option, total, symbol, hasReferral);

  return (
    <div className="my-5">
      {/* Code first - it rewrites both rows below. */}
      <label className={HEAD} htmlFor="referral">{PAY_COPY.referralLabel}</label>
      <div className="flex gap-2">
        <input
          className={REFERRAL_INPUT}
          type="text"
          id="referral"
          placeholder="Enter code"
          value={referral}
          onChange={(e) => onReferral(e.target.value)}
          aria-describedby="referral-hint"
        />
        <button className={REFERRAL_BTN} type="button" onClick={onApplyReferral}>Apply</button>
      </div>
      {/* A hint, not a validation message. Tied to the input with
          aria-describedby so a screen reader announces it as guidance - the
          error messages elsewhere in this form are the ones carrying text-err. */}
      {refMsg
        ? <small className={refMsgCls(refMsg.ok)}>{refMsg.text}</small>
        : <small id="referral-hint" className="block mt-[0.3rem] text-small text-muted">{PAY_COPY.referralHint}</small>}

      <p className={`${HEAD} mt-5`}>{PAY_COPY.heading}</p>
      <div className="flex flex-col gap-2" role="radiogroup" aria-label={PAY_COPY.heading}>
        {options.map((o) => {
          const on = option === o.id;
          const due = amountDueNow(o.id, total, symbol, hasReferral);
          return (
            <button
              key={o.id}
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
              <span className={due ? AMOUNT : AMOUNT_FREE}>
                {due ? withSymbol(due) : PAY_COPY.nothingNow}
              </span>
            </button>
          );
        })}
      </div>

      {/* One rail, so there is nothing to pick - a radio group with a single
          option is a control that cannot do anything. Stated, not offered. */}
      {charges && (
        <>
          <p className={`${HEAD} mt-5`}>{PAY_COPY.methodHeading}</p>
          <div className={`${ROW} ${ROW_OFF} cursor-default flex-col`}>
            <span className="flex-1 min-w-0">
              <span className={LABEL}>{PAY_METHODS[0].label}</span>
              <span className={SUB}>{PAY_METHODS[0].sub}</span>
            </span>
            <PayChips
              className="w-full mt-[0.7rem]"
              logosClass="flex flex-wrap items-center gap-2"
              chipClass="inline-flex items-center justify-center h-[28px] min-w-[44px] px-[0.5rem] bg-white [border:1px_solid_#e2ddd0] rounded-sm"
              svgClass="block h-[var(--icon-sm)] w-auto"
            />
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
          <span>{PAY_COPY.secureCard}</span>
        </p>
      )}
    </div>
  );
}
