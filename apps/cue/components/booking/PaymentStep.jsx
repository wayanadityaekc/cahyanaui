'use client';

import { useEffect, useState } from 'react';
import { ChevronDown, CreditCard } from 'lucide-react';
import InfoDot from '@/components/ui/InfoDot';
import { withSymbol } from '@/components/Price';
import ModalPresence from '@/components/ui/ModalPresence';
import { REFERRAL_INPUT, REFERRAL_BTN, buildReferralMessageClass } from '@/components/ui/modalClasses';
import { PAY_COPY, payOptions } from '@/lib/payment';
import { usePricing } from '@/state/PricingProvider';
import { buildRailNote, pickRail, RAIL_CHOICES } from '@/lib/rails';

const ICON_STROKE_WIDTH_REGULAR = 1.7;

const CARD = 'rounded-md bg-white [transition:border-color_var(--dur)_ease,background-color_var(--dur)_ease]';
const CARD_ON = '[border:1.5px_solid_var(--color-cta)] bg-cream';
const CARD_OFF = '[border:1.5px_solid_var(--line)] hover:[border-color:var(--color-gold)]';
const CARD_DIM = '[border:1.5px_solid_var(--line)] opacity-55';
const PICK = 'w-full flex items-start gap-3 text-left bg-transparent border-none p-[0.85rem] cursor-pointer';
const PICK_TIGHT = 'pb-[0.35rem]';
const PICK_DIM = 'cursor-not-allowed';
const FOOT = 'px-[0.85rem] pb-[0.6rem] pl-[calc(0.85rem+30px)]';
const DOT = 'flex-none w-[18px] h-[18px] mt-[0.1rem] rounded-[50%] flex items-center justify-center';
const LABEL = 'font-semibold text-green text-[1rem] leading-tight';
const SUB = 'block mt-[0.2rem] text-small text-muted leading-[var(--lh-body)]';
const AMOUNT = 'font-semibold text-amber text-[1rem] whitespace-nowrap';
const BADGE =
  'inline-block ml-2 px-[0.45rem] py-[0.1rem] rounded-sm bg-[rgba(201,164,92,0.16)] text-amber-d text-small font-semibold align-middle';
const HEAD = 'text-label font-medium tracking-[0.08em] uppercase text-muted mb-[0.6rem]';
const METHODS = 'grid grid-cols-2 gap-2 mb-2';
const METHOD = 'flex items-center justify-center h-[2.9rem] rounded-md bg-white cursor-pointer';
const METHOD_ICON = 'w-[var(--icon-lg)] h-[var(--icon-lg)]';
const INFO_ROW = 'flex items-center gap-[var(--space-1)] mb-[0.6rem]';
const INFO_TERM = 'block font-semibold text-green';
const APPROX = 'block text-small text-muted font-normal whitespace-nowrap text-right';
const FINE = 'text-small text-green leading-[var(--lh-body)]';
const FINE_DIM = 'text-small text-muted leading-[var(--lh-body)]';
const MORE =
  'inline-flex items-center gap-1 mt-[0.35rem] bg-transparent border-none p-0 text-small text-gold-d font-medium cursor-pointer';
const LOCKED = 'mt-[0.3rem] text-small text-muted leading-[var(--lh-body)]';
const FINE_SHELL =
  'fixed inset-0 z-[210] flex items-center justify-center p-3 bg-[rgba(0,0,0,0.5)] pointer-events-auto';
const FINE_BOX =
  'relative w-full max-w-[420px] max-h-[calc(100dvh-24px)] overflow-y-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden p-5 rounded-md bg-white';
const FINE_TITLE = 'mb-3 font-body text-h3 font-semibold tracking-normal';
const FINE_CLOSE =
  'mt-5 w-full flex items-center justify-center text-center leading-none h-[var(--btn-h)] px-4 py-0 rounded-sm text-small font-semibold text-white bg-cta border-none cursor-pointer';

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
  option,
  onOption,
  rail: railChoice,
  onRail,
  total,
  totalIdr = null,
  totalUsd = null,
  symbol = '$',
  currency = 'USD',
  stay = '',
  hasReferral = false,
  referral,
  onReferral,
  onApplyReferral,
  refMsg,
}) {
  const pricing = usePricing();
  const cat = pricing && pricing.catalog;
  const deposit = cat && cat.currency === currency && cat.deposit ? cat.deposit.display : null;
  const depositIdr = cat && cat.deposit && cat.deposit.idr != null ? cat.deposit.idr : null;
  const options = payOptions({ total, currency, stay, hasReferral, deposit, totalIdr, depositIdr, totalUsd });
  const rail = pickRail(railChoice);
  const isInRupiah = rail === 'doku' && String(currency).toUpperCase() !== 'IDR';
  const isInUsd = rail === 'paypal' && String(currency).toUpperCase() === 'IDR';
  const [isFinePrintOpen, setIsFinePrintOpen] = useState(false);
  const railNote = buildRailNote(currency, rail);
  function formatMoney(amount) {
    return withSymbol(symbol + amount.toLocaleString(symbol === 'Rp' ? 'id-ID' : 'en-US'));
  }
  function formatRupiah(amount) {
    return withSymbol(`Rp${amount.toLocaleString('id-ID')}`);
  }
  function formatDollars(amount) {
    return withSymbol(`$${amount.toLocaleString('en-US')}`);
  }

  useEffect(() => {
    const picked = options.find((optionItem) => optionItem.id === option);
    if (picked && !picked.available) onOption('deposit');
  }, [options, option, onOption]);

  useEffect(() => {
    if (!isFinePrintOpen) return undefined;
    function handleKeyDown(event) {
      if (event.key === 'Escape') setIsFinePrintOpen(false);
    }
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isFinePrintOpen]);

  return (
    <div className="my-5">
      <div className={INFO_ROW}>
        <p className={`${HEAD} !mb-0`}>{PAY_COPY.heading}</p>
        <InfoDot label="How the payment methods work" align="end" subtle>
          <span className="flex flex-col gap-[var(--space-1)]" data-rail-info>
            {RAIL_CHOICES.map((railChoiceItem) => (
              <span key={railChoiceItem.id}>
                <span className={INFO_TERM}>{railChoiceItem.label}</span>
                {railChoiceItem.how}
              </span>
            ))}
            {railNote && <span className="text-muted">{railNote}</span>}
          </span>
        </InfoDot>
      </div>

      <div className={METHODS} role="radiogroup" aria-label={PAY_COPY.methodHeading} data-rail-choice>
        {RAIL_CHOICES.map((railChoiceItem) => {
          const isSelected = rail === railChoiceItem.id;
          return (
            <button
              key={railChoiceItem.id}
              type="button"
              role="radio"
              aria-checked={isSelected}
              data-rail={railChoiceItem.id}
              aria-label={railChoiceItem.label}
              title={railChoiceItem.label}
              className={`${METHOD} ${isSelected ? CARD_ON : CARD_OFF}`}
              onClick={() => onRail && onRail(railChoiceItem.id)}
            >
              {railChoiceItem.id === 'doku' ? (
                <CreditCard
                  strokeWidth={ICON_STROKE_WIDTH_REGULAR}
                  className={`${METHOD_ICON} text-green`}
                  aria-hidden="true"
                />
              ) : (
                <PayPalMark className={METHOD_ICON} />
              )}
            </button>
          );
        })}
      </div>

      <div className="flex flex-col gap-2" role="radiogroup" aria-label={PAY_COPY.heading}>
        {options.map((optionItem) => {
          const isSelected = option === optionItem.id;
          const isDimmed = !optionItem.available;
          const isRef = optionItem.id === 'referral';
          return (
            <div key={optionItem.id} className={`${CARD} ${isDimmed ? CARD_DIM : isSelected ? CARD_ON : CARD_OFF}`}>
              <button
                type="button"
                role="radio"
                aria-checked={isSelected}
                aria-disabled={isDimmed}
                disabled={isDimmed}
                className={`${PICK} ${isRef ? PICK_TIGHT : ''} ${isDimmed ? PICK_DIM : ''}`}
                onClick={() => !isDimmed && onOption(optionItem.id)}
              >
                <Radio on={isSelected} dim={isDimmed} />
                <span className="flex-1 min-w-0">
                  <span className={LABEL}>
                    {optionItem.label}
                    {optionItem.badge && <span className={BADGE}>{optionItem.badge}</span>}
                  </span>
                  <span className={SUB}>
                    {optionItem.sub}
                    {optionItem.balance != null && (
                      <> Then {formatMoney(optionItem.balance)} cash to your driver on the day.</>
                    )}
                  </span>
                </span>
                {isInRupiah ? (
                  <span className={AMOUNT} data-amount-idr>
                    {optionItem.amountIdr != null ? formatRupiah(optionItem.amountIdr) : '-'}
                    {optionItem.amount != null && <span className={APPROX}>≈ {formatMoney(optionItem.amount)}</span>}
                  </span>
                ) : isInUsd ? (
                  <span className={AMOUNT} data-amount-usd>
                    {optionItem.amountUsd != null ? formatDollars(optionItem.amountUsd) : '-'}
                    {optionItem.amount != null && <span className={APPROX}>≈ {formatMoney(optionItem.amount)}</span>}
                  </span>
                ) : (
                  <span className={AMOUNT}>{optionItem.amount != null ? formatMoney(optionItem.amount) : '-'}</span>
                )}
              </button>

              {isRef && (
                <div className={FOOT}>
                  <div className="flex gap-2">
                    <input
                      className={REFERRAL_INPUT}
                      type="text"
                      id="referral"
                      placeholder="Enter code"
                      value={referral}
                      onChange={(event) => onReferral(event.target.value)}
                      aria-label={PAY_COPY.referralLabel}
                    />
                    <button className={REFERRAL_BTN} type="button" onClick={onApplyReferral}>
                      Apply
                    </button>
                  </div>
                  {refMsg && <small className={buildReferralMessageClass(refMsg.ok)}>{refMsg.text}</small>}
                  {isDimmed && !refMsg && <p className={LOCKED}>{PAY_COPY.referralLocked}</p>}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="mt-[0.9rem]">
        <p className={FINE}>{PAY_COPY.cancelShort}</p>
        <button
          type="button"
          className={MORE}
          aria-expanded={isFinePrintOpen}
          aria-haspopup="dialog"
          onClick={() => setIsFinePrintOpen((wasFineOpen) => !wasFineOpen)}
        >
          {PAY_COPY.detailsMore}
          <ChevronDown
            className="w-[var(--icon-sm)] h-[var(--icon-sm)] shrink-0"
            strokeWidth={ICON_STROKE_WIDTH_REGULAR}
            aria-hidden="true"
          />
        </button>
      </div>

      <ModalPresence
        open={isFinePrintOpen}
        onClose={() => setIsFinePrintOpen(false)}
        label={PAY_COPY.detailsTitle}
        box={FINE_BOX}
        shellClass={FINE_SHELL}
      >
        <h4 className={FINE_TITLE}>{PAY_COPY.detailsTitle}</h4>
        <ol className="m-0 pl-5 flex flex-col gap-[0.4rem]">
          {(rail === 'doku' ? PAY_COPY.whatHappensDoku : PAY_COPY.whatHappens).map((line) => (
            <li key={line} className={FINE_DIM}>
              {line}
            </li>
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
        <button type="button" className={FINE_CLOSE} onClick={() => setIsFinePrintOpen(false)}>
          {PAY_COPY.detailsClose}
        </button>
      </ModalPresence>
    </div>
  );
}
