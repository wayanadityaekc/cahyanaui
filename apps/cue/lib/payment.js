export const DEPOSIT_USD = 10;
export const REFERRAL_DISCOUNT_PCT = 5;
export const FREE_CANCEL_HOURS = 24;

export const PAY_OPTIONS = ['deposit', 'full', 'referral'];

export function depositUsd() {
  return DEPOSIT_USD;
}

function roundDown(amount, current) {
  return current === 'IDR' ? Math.floor(amount / 1000) * 1000 : Math.floor(amount);
}

function depositIn(current, deposit) {
  if (deposit != null) return deposit;
  return current === 'USD' ? depositUsd() : null;
}

export function baseTotal(priced) {
  if (!priced || !Array.isArray(priced.lines)) return null;
  const lines = priced.lines.filter((line) => line && line.ok && line.was);
  if (!lines.length) return priced.total ? priced.total.display : null;
  return lines.reduce((sum, line) => sum + (line.was.display || 0), 0);
}

export function baseTotalIdr(priced) {
  if (!priced || !Array.isArray(priced.lines)) return null;
  const lines = priced.lines.filter((line) => line && line.ok && line.was && line.was.idr != null);
  if (!lines.length) return priced.total && priced.total.idr != null ? priced.total.idr : null;
  return lines.reduce((sum, line) => sum + (line.was.idr || 0), 0);
}

export function baseTotalUsd(priced) {
  if (!priced || !Array.isArray(priced.lines)) return null;
  const lines = priced.lines.filter((line) => line && line.ok && line.was && line.was.usd != null);
  if (!lines.length) return priced.total && priced.total.usd != null ? priced.total.usd : null;
  return lines.reduce((sum, line) => sum + (line.was.usd || 0), 0);
}

export function payOptions({
  total,
  currency = 'USD',
  stay = '',
  hasReferral = false,
  deposit = null,
  totalIdr = null,
  depositIdr = null,
  totalUsd = null,
}) {
  const current = String(currency || 'USD').toUpperCase();
  const known = total != null;
  const dep = depositIn(current, deposit);
  const disc = known ? roundDown((total * (100 - REFERRAL_DISCOUNT_PCT)) / 100, current) : null;
  const idrKnown = totalIdr != null;
  const idr = {
    deposit: depositIdr != null ? depositIdr : null,
    full: idrKnown ? totalIdr : null,
    referral: idrKnown ? roundDown((totalIdr * (100 - REFERRAL_DISCOUNT_PCT)) / 100, 'IDR') : null,
  };
  const usdKnown = totalUsd != null;
  const usd = {
    deposit: DEPOSIT_USD,
    full: usdKnown ? totalUsd : null,
    referral: usdKnown ? roundDown((totalUsd * (100 - REFERRAL_DISCOUNT_PCT)) / 100, 'USD') : null,
  };

  return [
    {
      id: 'deposit',
      label: 'Pay a deposit',
      sub: 'Holds your date.',
      badge: 'Deposit',
      amount: known && dep != null ? dep : null,
      amountIdr: idr.deposit,
      amountUsd: usd.deposit,
      balance: known && dep != null ? total - dep : null,
      available: true,
    },
    {
      id: 'full',
      label: 'Pay in full',
      sub: 'Nothing to pay on the day, no cash to carry.',
      badge: null,
      amount: known ? total : null,
      amountIdr: idr.full,
      amountUsd: usd.full,
      balance: null,
      available: true,
    },
    {
      id: 'referral',
      label: 'Referral code',
      sub: `${REFERRAL_DISCOUNT_PCT}% off, and no deposit to pay.`,
      badge: `Save ${REFERRAL_DISCOUNT_PCT}%`,
      amount: known ? disc : null,
      amountIdr: idr.referral,
      amountUsd: usd.referral,
      balance: null,
      available: !!hasReferral,
    },
  ];
}

export function amountFor(optionId, paymentContext) {
  const row = payOptions(paymentContext).find((option) => option.id === optionId);
  return row && row.available ? row.amount : null;
}

export const PAY_COPY = {
  heading: 'How would you like to pay?',
  methodHeading: 'Pay with',
  referralLabel: 'Referral code',
  referralHint: 'Got a code? Enter it here to unlock the third option below.',
  referralOk: `Code applied. You can now pay ${REFERRAL_DISCOUNT_PCT}% less, with no deposit.`,
  referralBad: 'Code not valid.',
  referralLocked: 'Enter a valid code to use this.',
  detailsMore: 'Details',
  detailsTitle: 'What happens when you pay',
  detailsClose: 'Got it',
  cancelShort: `Free cancellation up to ${FREE_CANCEL_HOURS} hours before pickup.`,
  whatHappensDoku: [
    'DOKU, our Indonesian payment provider, takes the card or QRIS details on its own secure page. They never reach our site.',
    'We wait for the payment to clear, then your booking is confirmed.',
    'You get a confirmation email with the trip and the amount paid.',
  ],
  whatHappens: [
    'PayPal takes the card details in their own secure field. They never reach our site.',
    'We wait for the payment to clear, then your booking is confirmed.',
    'You get a confirmation email with the trip and the amount paid.',
  ],
  cancel: `Anything paid is refunded in full within that ${FREE_CANCEL_HOURS} hours.`,
  late: 'Cancel later than that, or no-show, and what you paid is not refunded.',
  secure: 'Card details go straight to PayPal from a secure field. They never reach our site or our server.',
  declined: 'That card was declined. Try another card, or pay with PayPal.',
  failed: 'We could not complete the payment. Your booking is saved - please try again.',
  cancelled: 'Payment cancelled. Your booking is saved, you can pay when you are ready.',
  nothingNow: 'Nothing today',
};
