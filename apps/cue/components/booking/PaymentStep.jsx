'use client';

import { useEffect, useState } from 'react';
import { ChevronDown, CreditCard } from 'lucide-react';
import InfoDot from '@/components/ui/InfoDot';
import { withSymbol } from '@/components/Price';
import ModalPresence from '@/components/ui/ModalPresence';
import { REFERRAL_INPUT, REFERRAL_BTN, refMsgCls } from '@/components/ui/modalClasses';
import { PAY_COPY, payOptions } from '@/lib/payment';
import { usePricing } from '@/state/PricingProvider';
import { noteFor, railFor, RAIL_CHOICES } from '@/lib/rails';

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
// Tinted, not bordered: another framed box would read as a fourth option in a
// list of three. This is a note about all of them.
// The rail choice (Card / PayPal): two equal halves, same border language as
// the option cards so the step reads as one control family. No `transition`
// of its own on the button (SNAP rule in check-motion).
const METHODS = 'grid grid-cols-2 gap-2 mb-2';
// Icon only: the name is the aria-label, the explanation is behind the (i).
const METHOD = 'flex items-center justify-center h-[2.9rem] rounded-md bg-white cursor-pointer';
const METHOD_ICON = 'w-[var(--icon-lg)] h-[var(--icon-lg)]';
const INFO_ROW = 'flex items-center gap-[var(--space-1)] mb-[0.6rem]';
const INFO_TERM = 'block font-semibold text-green';
// Under the amount when the rail charges another currency: the guest's own
// figure, marked as the estimate it is.
const APPROX = 'block text-small text-muted font-normal whitespace-nowrap text-right';
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

// PayPal's double-P mark, drawn by hand like the other payment logos
// (PayChips) - Lucide has no brand icons.
function PayPalMark({ className }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <path
        fill="#003087"
        d="M7.3 21.4H3.9a.5.5 0 0 1-.5-.6L6.2 3a.7.7 0 0 1 .7-.6h6.4c3.4 0 5.4 1.7 4.9 4.9-.6 3.7-3.1 5.5-6.7 5.5H9.6a.7.7 0 0 0-.7.6z"
      />
      <path
        fill="#009cde"
        d="M18.9 7.7c.6.8.8 1.9.6 3.3-.6 3.6-3 5.3-6.4 5.3h-1.4a.7.7 0 0 0-.7.6l-.8 4.8a.5.5 0 0 1-.5.4H7.3l.3-1.6 1.3-8.1a.7.7 0 0 1 .7-.6h1.9c3.6 0 6.1-1.8 6.7-5.5l.1-.7c.3.6.5 1.3.6 2.1z"
      />
    </svg>
  );
}

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
  option, onOption, rail: railChoice, onRail,
  total, totalIdr = null, totalUsd = null, symbol = '$', currency = 'USD', stay = '', hasReferral = false,
  referral, onReferral, onApplyReferral, refMsg,
}) {
  // The deposit in this currency comes from the catalog - the server's live rate -
  // so the site never holds an exchange rate of its own. Only trusted when the
  // catalog is for THIS currency (it can lag one fetch behind a currency switch).
  const pricing = usePricing();
  const cat = pricing && pricing.catalog;
  const deposit = cat && cat.currency === currency && cat.deposit ? cat.deposit.display : null;
  // The flat deposit in rupiah is the same in every catalog (rupiah is the base).
  const depositIdr = cat && cat.deposit && cat.deposit.idr != null ? cat.deposit.idr : null;
  const options = payOptions({ total, currency, stay, hasReferral, deposit, totalIdr, depositIdr, totalUsd });
  const rail = railFor(railChoice);
  // Card (DOKU) always charges rupiah. For a guest shown another currency the
  // rupiah figure is the exact one and theirs is an estimate - said, not hidden.
  const inRupiah = rail === 'doku' && String(currency).toUpperCase() !== 'IDR';
  // And the mirror: PayPal cannot charge rupiah, so a rupiah guest there is
  // billed dollars - the dollar figure is the exact one.
  const inUsd = rail === 'paypal' && String(currency).toUpperCase() === 'IDR';
  const [openFine, setOpenFine] = useState(false);
  // Only ever set when the chosen rail charges another currency than the one
  // every price on the page is shown in - said before a card number is typed.
  const railNote = noteFor(currency, rail);
  function money(v) { return withSymbol(symbol + v.toLocaleString(symbol === 'Rp' ? 'id-ID' : 'en-US')); }
  function rupiah(v) { return withSymbol('Rp' + v.toLocaleString('id-ID')); }
  function dollars(v) { return withSymbol('$' + v.toLocaleString('en-US')); }

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
    function onKey(e) { if (e.key === 'Escape') setOpenFine(false); }
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [openFine]);

  return (
    <div className="my-5">
      <div className={INFO_ROW}>
        <p className={`${HEAD} !mb-0`}>{PAY_COPY.heading}</p>
        <InfoDot label="How the payment methods work" align="end" subtle>
          <span className="flex flex-col gap-[var(--space-1)]" data-rail-info>
            {RAIL_CHOICES.map((m) => (
              <span key={m.id}>
                <span className={INFO_TERM}>{m.label}</span>
                {m.how}
              </span>
            ))}
            {/* Only when it applies to THIS guest: the chosen rail charges a
                currency other than the one the page is shown in. */}
            {railNote && <span className="text-muted">{railNote}</span>}
          </span>
        </InfoDot>
      </div>

      {/* How, then how much. Card (DOKU) is the default for every currency
          (Wayan, 29 Sep 2026); PayPal is the guest's alternative. */}
      <div className={METHODS} role="radiogroup" aria-label={PAY_COPY.methodHeading} data-rail-choice>
        {RAIL_CHOICES.map((m) => {
          const on = rail === m.id;
          return (
            <button
              key={m.id}
              type="button"
              role="radio"
              aria-checked={on}
              data-rail={m.id}
              aria-label={m.label}
              title={m.label}
              className={`${METHOD} ${on ? CARD_ON : CARD_OFF}`}
              onClick={() => onRail && onRail(m.id)}
            >
              {m.id === 'doku' ? (
                <CreditCard strokeWidth={1.7} className={`${METHOD_ICON} text-green`} aria-hidden="true" />
              ) : (
                <PayPalMark className={METHOD_ICON} />
              )}
            </button>
          );
        })}
      </div>

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
                {inRupiah ? (
                  <span className={AMOUNT} data-amount-idr>
                    {o.amountIdr != null ? rupiah(o.amountIdr) : '-'}
                    {o.amount != null && <span className={APPROX}>≈ {money(o.amount)}</span>}
                  </span>
                ) : inUsd ? (
                  <span className={AMOUNT} data-amount-usd>
                    {o.amountUsd != null ? dollars(o.amountUsd) : '-'}
                    {o.amount != null && <span className={APPROX}>≈ {money(o.amount)}</span>}
                  </span>
                ) : (
                  <span className={AMOUNT}>{o.amount != null ? money(o.amount) : '-'}</span>
                )}
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
        label={PAY_COPY.detailsTitle}
        box={FINE_BOX}
        shellClass={FINE_SHELL}
      >
        <h4 className={FINE_TITLE}>{PAY_COPY.detailsTitle}</h4>
        <ol className="m-0 pl-5 flex flex-col gap-[0.4rem]">
          {(rail === 'doku' ? PAY_COPY.whatHappensDoku : PAY_COPY.whatHappens).map((line) => (
            <li key={line} className={FINE_DIM}>{line}</li>
          ))}
        </ol>
        <div className="mt-4 flex flex-col gap-[0.5rem]">
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
