'use client';

import { useEffect, useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { withSymbol } from '@/components/Price';
import { Collapse } from '@/components/ui/Reveal';
import { REFERRAL_INPUT, REFERRAL_BTN, refMsgCls } from '@/components/ui/modalClasses';
import { PAY_COPY, payOptions } from '@/lib/payment';
import { noteFor } from '@/lib/rails';

// The three ways to pay, each showing what it costs right now.
//
// Amounts here are for the guest to READ. The server recomputes every one of
// them before PayPal is told anything, so a number edited in the browser buys
// nothing - see paypal-routes.js.
//
// EXPLANATIONS ARE BEHIND A "Details" TOGGLE, ONE PER ROW (Wayan, Sep 2026:
// "text penjelasanya itu terlalu banyak ... mending kasi kayak button details").
// Collapsed, a row is one line: what it is, what it costs. That is what buys the
// room to show the THIRD option - the referral row is rendered again, greyed out
// until a code is valid, instead of being left out of the list entirely.
//
// Only ONE row can be open at a time, so opening a detail can never grow this
// block by three paragraphs at once.
//
// The card is a <div>, not the radio button: a <button> cannot contain the
// Details <button>, and the toggle must not also pick the option.
const CARD = 'rounded-md bg-white [transition:border-color_var(--dur)_ease,background-color_var(--dur)_ease]';
const CARD_ON = '[border:1.5px_solid_var(--color-cta)] bg-cream';
const CARD_OFF = '[border:1.5px_solid_var(--line)] hover:[border-color:var(--color-gold)]';
const CARD_DIM = '[border:1.5px_solid_var(--line)] opacity-55';
// No `transition` of its own: that keeps the site-wide :active press feedback
// in style.css (the SNAP rule in check-motion is about buttons that override it).
const PICK =
  'w-full flex items-center gap-3 text-left bg-transparent border-none px-[0.85rem] pt-[0.7rem] pb-[0.35rem] cursor-pointer';
const PICK_DIM = 'cursor-not-allowed';
// Lines up under the label, not under the radio.
const FOOT = 'px-[0.85rem] pb-[0.6rem] pl-[calc(0.85rem+30px)]';
const DOT = 'flex-none w-[18px] h-[18px] rounded-[50%] flex items-center justify-center';
const LABEL = 'flex-1 min-w-0 font-semibold text-green text-[1rem] leading-tight';
const AMOUNT = 'font-semibold text-amber text-[1rem] whitespace-nowrap';
const BADGE =
  'inline-block ml-2 px-[0.45rem] py-[0.1rem] rounded-sm bg-[rgba(201,164,92,0.16)] text-amber-d text-small font-semibold align-middle';
const HEAD = 'text-label font-medium tracking-[0.08em] uppercase text-muted mb-[0.6rem]';
const MORE = 'inline-flex items-center gap-1 bg-transparent border-none p-0 text-small text-gold-d font-medium cursor-pointer';
const DETAIL = 'mt-[0.35rem] text-small text-muted leading-[var(--lh-body)]';
const LOCKED = 'mt-[0.3rem] mb-[0.3rem] text-small text-muted leading-[var(--lh-body)]';

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
  const [openId, setOpenId] = useState(null);
  // Only ever set when the guest's currency cannot be settled on the rail that
  // will take the payment - said here, before a card number is typed, rather
  // than appearing as a surprise amount at the card form.
  const railNote = noteFor(currency);
  const money = (v) =>
    withSymbol(symbol + v.toLocaleString(symbol === 'Rp' ? 'id-ID' : 'en-US'));

  // An option that is no longer available must not stay selected. hasReferral
  // can go back to false when the quote refreshes without the code - leaving
  // 'referral' chosen while its row is greyed out, and a discount asked for on
  // submit. The server recomputes either way, but the guest should see what
  // they are about to pay.
  useEffect(() => {
    const picked = options.find((o) => o.id === option);
    if (picked && !picked.available) onOption('deposit');
  }, [options, option, onOption]);

  return (
    <div className="my-5">
      <p className={HEAD}>{PAY_COPY.heading}</p>

      <div className="flex flex-col gap-2" role="radiogroup" aria-label={PAY_COPY.heading}>
        {options.map((o) => {
          const on = option === o.id;
          const dim = !o.available;
          const open = openId === o.id;
          return (
            <div key={o.id} className={`${CARD} ${dim ? CARD_DIM : on ? CARD_ON : CARD_OFF}`}>
              <button
                type="button"
                role="radio"
                aria-checked={on}
                aria-disabled={dim}
                disabled={dim}
                className={`${PICK} ${dim ? PICK_DIM : ''}`}
                onClick={() => !dim && onOption(o.id)}
              >
                <Radio on={on} dim={dim} />
                <span className={LABEL}>
                  {o.label}
                  {o.badge && <span className={BADGE}>{o.badge}</span>}
                </span>
                <span className={AMOUNT}>{o.amount != null ? money(o.amount) : '-'}</span>
              </button>

              <div className={FOOT}>
                {o.id === "referral" && (
                  <>
                    <div className="flex gap-2">
                      <input
                        className={REFERRAL_INPUT}
                        type="text"
                        id="referral"
                        placeholder="Enter code"
                        value={referral}
                        onChange={(e) => onReferral(e.target.value)}
                        aria-label={PAY_COPY.referralLabel}
                      />
                      <button className={REFERRAL_BTN} type="button" onClick={onApplyReferral}>Apply</button>
                    </div>
                    {refMsg && <small className={refMsgCls(refMsg.ok)}>{refMsg.text}</small>}
                  </>
                )}
                {dim && !refMsg && <p className={LOCKED}>{PAY_COPY.referralLocked}</p>}
                <button
                  type="button"
                  className={MORE}
                  aria-expanded={open}
                  aria-controls={`pay-detail-${o.id}`}
                  onClick={() => setOpenId(open ? null : o.id)}
                >
                  {open ? PAY_COPY.detailsLess : PAY_COPY.detailsMore}
                  <ChevronDown
                    className={`w-[var(--icon-sm)] h-[var(--icon-sm)] shrink-0 transition-[rotate] duration-[var(--dur)] ease-[var(--ease)] ${open ? 'rotate-180' : ''}`}
                    strokeWidth={1.7}
                    aria-hidden="true"
                  />
                </button>
                <Collapse open={open}>
                  <p id={`pay-detail-${o.id}`} className={DETAIL}>
                    {o.detail}
                    {/* What is left for the day, stated rather than left to be
                        worked out - a deposit with an unnamed balance is the
                        thing guests ask about. */}
                    {o.balance != null && <> Then {money(o.balance)} cash to your driver on the day.</>}
                  </p>
                </Collapse>
              </div>
            </div>
          );
        })}
      </div>

      {railNote && (
        <p className="mt-[0.9rem] text-small text-muted leading-[var(--lh-body)]">{railNote}</p>
      )}

      <p className="mt-[0.9rem] text-small text-green leading-[var(--lh-body)]">
        {PAY_COPY.cancel} <span className="text-muted">{PAY_COPY.late}</span>{' '}
        <a className="text-gold-d underline underline-offset-2" href="/our-company.html#cancellation">
          Cancellation policy
        </a>
      </p>
    </div>
  );
}
