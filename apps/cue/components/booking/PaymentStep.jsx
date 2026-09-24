'use client';

import { useEffect, useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { withSymbol } from '@/components/Price';
import ModalPresence from '@/components/ui/ModalPresence';
import { REFERRAL_INPUT, REFERRAL_BTN, refMsgCls } from '@/components/ui/modalClasses';
import { PAY_COPY, payOptions } from '@/lib/payment';
import { noteFor } from '@/lib/rails';

// The three ways to pay, each showing what it costs right now.
//
// Amounts here are for the guest to READ. The server recomputes every one of
// them before PayPal is told anything, so a number edited in the browser buys
// nothing - see paypal-routes.js.
//
// THE ROWS ARE PLAIN: label, one short line, amount. Nothing to open.
// A per-row "Details" toggle was built and REJECTED (Wayan, Sep 2026: "text di
// dalam pilihan pembayaran fine, isi text singkat dan jelas jangan bisa di klik
// details gitu") - a guest choosing between three prices should not have to
// open three things to compare them.
//
// WHAT IS HIDDEN is the fine print UNDER the options (the card-settlement note
// and the refund terms), behind one Details button. Same request, other half:
// "yang tulisan card payment itu loh, itu hide dulu, terus kasi button details".
// One short line stays visible so the block never reads as empty, and the rest
// opens as a POPUP rather than unfolding in place: measured, unfolding pushes
// Book Now ~300px down the scroll, so reading the terms would move the button
// the guest was reaching for. Escape and a tap outside close it - the booking
// modal itself has no Escape handler, so nothing fights over the key.
//
// The card is a <div>, not the radio button: the referral row carries the code
// field, and an <input> cannot live inside a <button>.
const CARD = 'rounded-md bg-white [transition:border-color_var(--dur)_ease,background-color_var(--dur)_ease]';
const CARD_ON = '[border:1.5px_solid_var(--color-cta)] bg-cream';
const CARD_OFF = '[border:1.5px_solid_var(--line)] hover:[border-color:var(--color-gold)]';
const CARD_DIM = '[border:1.5px_solid_var(--line)] opacity-55';
// No `transition` of its own: that keeps the site-wide :active press feedback
// in style.css (the SNAP rule in check-motion is about buttons that override it).
const PICK =
  'w-full flex items-start gap-3 text-left bg-transparent border-none p-[0.85rem] cursor-pointer';
const PICK_TIGHT = 'pb-[0.35rem]';
const PICK_DIM = 'cursor-not-allowed';
// Lines up under the label, not under the radio.
const FOOT = 'px-[0.85rem] pb-[0.6rem] pl-[calc(0.85rem+30px)]';
const DOT = 'flex-none w-[18px] h-[18px] mt-[0.1rem] rounded-[50%] flex items-center justify-center';
const LABEL = 'font-semibold text-green text-[1rem] leading-tight';
const SUB = 'block mt-[0.2rem] text-small text-muted leading-[var(--lh-body)]';
const AMOUNT = 'font-semibold text-amber text-[1rem] whitespace-nowrap';
const BADGE =
  'inline-block ml-2 px-[0.45rem] py-[0.1rem] rounded-sm bg-[rgba(201,164,92,0.16)] text-amber-d text-small font-semibold align-middle';
const HEAD = 'text-label font-medium tracking-[0.08em] uppercase text-muted mb-[0.6rem]';
const FINE = 'text-small text-green leading-[var(--lh-body)]';
const FINE_DIM = 'text-small text-muted leading-[var(--lh-body)]';
const MORE =
  'inline-flex items-center gap-1 mt-[0.35rem] bg-transparent border-none p-0 text-small text-gold-d font-medium cursor-pointer';
const LOCKED = 'mt-[0.3rem] text-small text-muted leading-[var(--lh-body)]';
// Sits ON TOP of the booking popup, so one step above its z-[200].
const FINE_SHELL =
  'fixed inset-0 z-[210] flex items-center justify-center p-3 bg-[rgba(0,0,0,0.5)] pointer-events-auto';
const FINE_BOX =
  'relative w-full max-w-[420px] max-h-[calc(100dvh-24px)] overflow-y-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden p-5 rounded-md bg-white';
const FINE_TITLE = 'mb-3 font-body text-h3 font-semibold tracking-normal';
// Geometry from BTN_SM; colour and width stay with the caller, as that string
// is documented to be geometry only.
const FINE_CLOSE =
  'mt-5 w-full flex items-center justify-center text-center leading-none h-[var(--btn-h)] px-4 py-0 rounded-sm text-small font-semibold text-white bg-cta border-none cursor-pointer';

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
  const [openFine, setOpenFine] = useState(false);
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

  useEffect(() => {
    if (!openFine) return undefined;
    const onKey = (e) => { if (e.key === 'Escape') setOpenFine(false); };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [openFine]);

  return (
    <div className="my-5">
      <p className={HEAD}>{PAY_COPY.heading}</p>

      <div className="flex flex-col gap-2" role="radiogroup" aria-label={PAY_COPY.heading}>
        {options.map((o) => {
          const on = option === o.id;
          const dim = !o.available;
          const isRef = o.id === 'referral';
          return (
            <div key={o.id} className={`${CARD} ${dim ? CARD_DIM : on ? CARD_ON : CARD_OFF}`}>
              <button
                type="button"
                role="radio"
                aria-checked={on}
                aria-disabled={dim}
                disabled={dim}
                className={`${PICK} ${isRef ? PICK_TIGHT : ''} ${dim ? PICK_DIM : ''}`}
                onClick={() => !dim && onOption(o.id)}
              >
                <Radio on={on} dim={dim} />
                <span className="flex-1 min-w-0">
                  <span className={LABEL}>
                    {o.label}
                    {o.badge && <span className={BADGE}>{o.badge}</span>}
                  </span>
                  <span className={SUB}>
                    {o.sub}
                    {/* What is left for the day, stated rather than left to be
                        worked out - a deposit with an unnamed balance is the
                        thing guests ask about. */}
                    {o.balance != null && <> Then {money(o.balance)} cash to your driver on the day.</>}
                  </span>
                </span>
                <span className={AMOUNT}>{o.amount != null ? money(o.amount) : '-'}</span>
              </button>

              {/* The code lives in the row it unlocks, not in a block of its own. */}
              {isRef && (
                <div className={FOOT}>
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
                  {dim && !refMsg && <p className={LOCKED}>{PAY_COPY.referralLocked}</p>}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* One line, then everything else behind Details. */}
      <div className="mt-[0.9rem]">
        <p className={FINE}>{PAY_COPY.cancelShort}</p>
        <button
          type="button"
          className={MORE}
          aria-expanded={openFine}
          aria-haspopup="dialog"
          onClick={() => setOpenFine((v) => !v)}
        >
          {PAY_COPY.detailsMore}
          <ChevronDown
            className="w-[var(--icon-sm)] h-[var(--icon-sm)] shrink-0"
            strokeWidth={1.7}
            aria-hidden="true"
          />
        </button>
      </div>

      <ModalPresence
        open={openFine}
        onClose={() => setOpenFine(false)}
        box={FINE_BOX}
        shellClass={FINE_SHELL}
      >
        <h4 className={FINE_TITLE}>{PAY_COPY.detailsTitle}</h4>
        <ol className="m-0 pl-5 flex flex-col gap-[0.4rem]">
          {PAY_COPY.whatHappens.map((line) => (
            <li key={line} className={FINE_DIM}>{line}</li>
          ))}
        </ol>
        <div className="mt-4 flex flex-col gap-[0.5rem]">
          {railNote && <p className={FINE_DIM}>{railNote}</p>}
          <p className={FINE_DIM}>
            {PAY_COPY.cancelShort} {PAY_COPY.cancel} {PAY_COPY.late}{' '}
            <a className="text-gold-d underline underline-offset-2" href="/our-company.html#cancellation">
              Cancellation policy
            </a>
          </p>
        </div>
        <button type="button" className={FINE_CLOSE} onClick={() => setOpenFine(false)}>
          {PAY_COPY.detailsClose}
        </button>
      </ModalPresence>
    </div>
  );
}
