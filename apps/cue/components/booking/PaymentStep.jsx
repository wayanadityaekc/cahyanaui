'use client';

import { withSymbol } from '@/components/Price';
import InfoDot from '@/components/ui/InfoDot';
import { REFERRAL_INPUT, REFERRAL_BTN, refMsgCls } from '@/components/ui/modalClasses';
import { PAY_COPY, payOptions } from '@/lib/payment';

// The three ways to pay, each showing what it costs right now.
//
// Amounts here are for the guest to READ. The server recomputes every one of
// them before PayPal is told anything, so a number edited in the browser buys
// nothing - see paypal-routes.js.
//
// One info button, not three: the options only make sense next to each other
// (the deposit amount depends on pick-up, the referral one waives it), so
// explaining them one at a time would repeat itself three times.
const ROW =
  'w-full flex items-start gap-3 text-left p-[0.85rem] rounded-md bg-white cursor-pointer ' +
  '[transition:border-color_var(--dur)_ease,background-color_var(--dur)_ease,scale_var(--dur-fast)_var(--ease)]';
const ROW_ON = '[border:1.5px_solid_var(--color-cta)] bg-cream';
const ROW_OFF = '[border:1.5px_solid_var(--line)] hover:[border-color:var(--color-gold)]';
const ROW_OFF_DIM = '[border:1.5px_solid_var(--line)] opacity-55 cursor-not-allowed';
const DOT = 'flex-none w-[18px] h-[18px] mt-[0.1rem] rounded-[50%] flex items-center justify-center';
const LABEL = 'font-semibold text-green text-[1rem] leading-tight';
const SUB = 'block mt-[0.2rem] text-small text-muted leading-[var(--lh-body)]';
const AMOUNT = 'font-semibold text-amber text-[1rem] whitespace-nowrap';
const BADGE =
  'inline-block ml-2 px-[0.45rem] py-[0.1rem] rounded-sm bg-[rgba(201,164,92,0.16)] text-amber-d text-small font-semibold align-middle';
const HEAD = 'text-label font-medium tracking-[0.08em] uppercase text-muted mb-[0.6rem]';

function Radio({ on, dim }) {
  return (
    <span
      className={`${DOT} ${on ? '[border:1.5px_solid_var(--color-cta)]' : '[border:1.5px_solid_#cfc9ba]'}`}
      aria-hidden="true"
    >
      {on && !dim && <span className="w-[8px] h-[8px] rounded-[50%] bg-cta" />}
    </span>
  );
}

export default function PaymentStep({
  option, onOption,
  total, symbol = '$', currency = 'USD', stay = '', hasReferral = false,
  referral, onReferral, onApplyReferral, refMsg,
}) {
  const options = payOptions({ total, currency, stay, hasReferral });

  return (
    <div className="my-5">
      {/* Code first - it unlocks the third option below. */}
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
      {refMsg
        ? <small className={refMsgCls(refMsg.ok)}>{refMsg.text}</small>
        : <small id="referral-hint" className="block mt-[0.3rem] text-small text-muted">{PAY_COPY.referralHint}</small>}

      <div className="relative flex items-center gap-[var(--space-1)] mt-5 mb-[0.6rem]">
        <p className={`${HEAD} mb-0`}>{PAY_COPY.heading}</p>
        <InfoDot label="How the payment options work">
          <ul className="m-0 p-0 list-none flex flex-col gap-[var(--space-1)]">
            {PAY_COPY.optionsInfo.map((line) => (
              <li key={line} className="text-body leading-[var(--lh-body)] text-green">{line}</li>
            ))}
          </ul>
        </InfoDot>
      </div>

      <div className="flex flex-col gap-2" role="radiogroup" aria-label={PAY_COPY.heading}>
        {options.map((o) => {
          const on = option === o.id;
          const dim = !o.available;
          return (
            <button
              key={o.id}
              type="button"
              role="radio"
              aria-checked={on}
              aria-disabled={dim}
              disabled={dim}
              className={`${ROW} ${dim ? ROW_OFF_DIM : on ? ROW_ON : ROW_OFF}`}
              onClick={() => !dim && onOption(o.id)}
            >
              <Radio on={on} dim={dim} />
              <span className="flex-1 min-w-0">
                <span className={LABEL}>
                  {o.label}
                  {o.badge && <span className={BADGE}>{o.badge}</span>}
                </span>
                <span className={SUB}>
                  {dim ? 'Enter a valid referral code above to use this.' : o.sub}
                  {/* What is left for the day, stated rather than left to be
                      worked out - a deposit with an unnamed balance is the
                      thing guests ask about. */}
                  {!dim && o.balance != null && (
                    <> Then {withSymbol(symbol + o.balance.toLocaleString(symbol === 'Rp' ? 'id-ID' : 'en-US'))} on the day.</>
                  )}
                </span>
              </span>
              <span className={AMOUNT}>
                {o.amount != null
                  ? withSymbol(symbol + o.amount.toLocaleString(symbol === 'Rp' ? 'id-ID' : 'en-US'))
                  : '-'}
              </span>
            </button>
          );
        })}
      </div>

      <p className="mt-[0.9rem] text-small text-green leading-[var(--lh-body)]">
        {PAY_COPY.cancel} <span className="text-muted">{PAY_COPY.late}</span>{' '}
        <a className="text-gold-d underline underline-offset-2" href="/our-company.html#cancellation">
          Cancellation policy
        </a>
      </p>
    </div>
  );
}
