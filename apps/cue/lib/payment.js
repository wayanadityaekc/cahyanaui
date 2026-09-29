// Display mirror of cahyana-api payment.js (deposit $10 flat, full, referral 5%); change one, change both.

export const DEPOSIT_USD = 10;
export const REFERRAL_DISCOUNT_PCT = 5;
// Free cancellation window, the same for every booking however it was paid.
export const FREE_CANCEL_HOURS = 24;

// No exchange rates here: non-USD deposits come from the catalog (catalog.deposit) and are passed in as `deposit`.

export const PAY_OPTIONS = ['deposit', 'full', 'referral'];

// Deposit is flat; the pick-up area has no say in it.
export function depositUsd() {
  return DEPOSIT_USD;
}

function roundDown(v, cur) {
  // Discounts round down so a rounded total never shrinks the advertised discount.
  return cur === 'IDR' ? Math.floor(v / 1000) * 1000 : Math.floor(v);
}

// Deposit in `cur` from the catalog, or USD's fixed value; otherwise null, never guessed.
function depositIn(cur, deposit) {
  if (deposit != null) return deposit;
  return cur === 'USD' ? depositUsd() : null;
}

// Trip total before payment options, from each line's `was` (pre-referral) so a code isn't counted twice.
export function baseTotal(priced) {
  if (!priced || !Array.isArray(priced.lines)) return null;
  const lines = priced.lines.filter((l) => l && l.ok && l.was);
  if (!lines.length) return priced.total ? priced.total.display : null;
  return lines.reduce((sum, l) => sum + (l.was.display || 0), 0);
}

// Rupiah total of the same lines: what DOKU charges when the guest sees another currency.
export function baseTotalIdr(priced) {
  if (!priced || !Array.isArray(priced.lines)) return null;
  const lines = priced.lines.filter((l) => l && l.ok && l.was && l.was.idr != null);
  if (!lines.length) return priced.total && priced.total.idr != null ? priced.total.idr : null;
  return lines.reduce((sum, l) => sum + (l.was.idr || 0), 0);
}

// Dollar total of the same lines: what PayPal charges a rupiah guest (it can't settle IDR).
export function baseTotalUsd(priced) {
  if (!priced || !Array.isArray(priced.lines)) return null;
  const lines = priced.lines.filter((l) => l && l.ok && l.was && l.was.usd != null);
  if (!lines.length) return priced.total && priced.total.usd != null ? priced.total.usd : null;
  return lines.reduce((sum, l) => sum + (l.was.usd || 0), 0);
}

// One entry per option (charged now, left for the day, copy); optional IDR/USD totals add the exact rail amounts.
export function payOptions({ total, currency = 'USD', stay = '', hasReferral = false, deposit = null, totalIdr = null, depositIdr = null, totalUsd = null }) {
  const cur = String(currency || 'USD').toUpperCase();
  const known = total != null;
  const dep = depositIn(cur, deposit);
  const disc = known ? roundDown((total * (100 - REFERRAL_DISCOUNT_PCT)) / 100, cur) : null;
  const idrKnown = totalIdr != null;
  const idr = {
    deposit: depositIdr != null ? depositIdr : null,
    full: idrKnown ? totalIdr : null,
    referral: idrKnown ? roundDown((totalIdr * (100 - REFERRAL_DISCOUNT_PCT)) / 100, 'IDR') : null,
  };
  // Same idea for PayPal billing a rupiah guest in dollars: `amountUsd`.
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

export function amountFor(optionId, ctx) {
  const row = payOptions(ctx).find((o) => o.id === optionId);
  return row && row.available ? row.amount : null;
}

export const PAY_COPY = {
  heading: 'How would you like to pay?',
  methodHeading: 'Pay with',
  referralLabel: 'Referral code',
  referralHint: 'Got a code? Enter it here to unlock the third option below.',
  referralOk: `Code applied. You can now pay ${REFERRAL_DISCOUNT_PCT}% less, with no deposit.`,
  referralBad: 'Code not valid.',
  // Reason the referral row is greyed out; a disabled row with no reason reads as broken.
  referralLocked: 'Enter a valid code to use this.',
  detailsMore: 'Details',
  detailsTitle: 'What happens when you pay',
  detailsClose: 'Got it',
  // The one line kept on screen; the rest of the fine print sits behind Details.
  cancelShort: `Free cancellation up to ${FREE_CANCEL_HOURS} hours before pickup.`,
  // What happens after paying, per rail; every line must be something the system really does.
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
