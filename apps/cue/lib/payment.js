// What the guest pays at checkout.
//
// Model (Wayan, 17 Sep 2026). Two ways to pay, and a referral code that changes
// what both of them mean:
//
//                        no code                    with a valid code
//   pay later / deposit  20% deposit now            nothing now, no discount
//   pay in full now      5% off                     15% off
//
// The deposit is deliberately steep and the full-payment discount deliberately
// visible: the point is to steer guests to paying up front. Wayan is raising the
// base prices separately to carry the discount, so these are the rules, not the
// margin.
//
// Earlier drafts had this wrong twice and both are recorded so they do not come
// back: the deposit is NOT a flat fee that varies by pickup zone (that is the
// pickup fee, which already lives in pricing.js), and the referral code is NOT a
// third payment option - it is a modifier on the two that exist.
//
// Nothing here prices a booking. Every figure is derived from the quote.

export const DEPOSIT_PCT = 20;
export const FULL_DISCOUNT_PCT = 5;
export const FULL_DISCOUNT_REFERRAL_PCT = 15;
export const FREE_CANCEL_HOURS = 24;

export const PAY_OPTIONS = ['later', 'full'];

// The quote applies the referral code's own percentage (REFERRAL in
// pricing-data.js: 10/10/5) to `total`, which is NOT how this model works - here
// a code is worth nothing on its own and 15% only when paying in full. So every
// figure below is computed from `was`, the per-line price BEFORE that discount,
// otherwise a code would be counted twice.
//
// CHECKPOINT 2 must settle this server-side; until then the display is right and
// the server's own total is not what the guest is quoted here.
export function baseTotal(priced) {
  if (!priced || !Array.isArray(priced.lines)) return null;
  const lines = priced.lines.filter((l) => l && l.ok && l.was);
  if (!lines.length) return priced.total ? priced.total.display : null;
  return lines.reduce((sum, l) => sum + (l.was.display || 0), 0);
}

// Rounding direction depends on what the number IS, which is why this does not
// reuse roundCur()'s blanket ceil:
//
//   deposit    - rounds UP, like the rest of the site. It is a part payment; the
//                remainder the driver collects absorbs the difference.
//   full price - rounds DOWN. Rounding a discounted total up quietly shrinks the
//                discount the row just advertised ($55 less 5% is $52.25, and
//                charging $53 gives the guest $2 off, not $2.75).
//
// Rupiah works in thousands either way - the site never shows smaller units.
export function roundAmount(value, symbol, direction = 'up') {
  const step = symbol === 'Rp' ? 1000 : 1;
  const fn = direction === 'down' ? Math.floor : Math.ceil;
  return fn(value / step) * step;
}

export function formatAmount(value, symbol, direction) {
  return symbol + roundAmount(value, symbol, direction).toLocaleString(symbol === 'Rp' ? 'id-ID' : 'en-US');
}

export function fullDiscountPct(hasReferral) {
  return hasReferral ? FULL_DISCOUNT_REFERRAL_PCT : FULL_DISCOUNT_PCT;
}

// What this option charges NOW. null means nothing is taken at checkout.
export function amountDueNow(optionId, total, symbol, hasReferral) {
  if (total === null || total === undefined) return null;
  if (optionId === 'later') {
    if (hasReferral) return null; // code holders book with no deposit
    return formatAmount((total * DEPOSIT_PCT) / 100, symbol, 'up');
  }
  return formatAmount((total * (100 - fullDiscountPct(hasReferral))) / 100, symbol, 'down');
}

// Row copy, which changes with the code because the offer itself changes.
export function payOptions(hasReferral) {
  return [
    hasReferral
      ? {
          id: 'later',
          label: 'Book now, pay later',
          sub: 'Your code covers the deposit. Pay your driver on the day.',
          badge: 'No deposit',
        }
      : {
          id: 'later',
          label: 'Pay a deposit',
          sub: `Pay ${DEPOSIT_PCT}% now to hold the date, the rest to your driver.`,
          badge: `${DEPOSIT_PCT}%`,
        },
    {
      id: 'full',
      label: 'Pay in full now',
      sub: hasReferral
        ? `The best price - your code makes it ${FULL_DISCOUNT_REFERRAL_PCT}% off.`
        : `Nothing to pay on the day, and ${FULL_DISCOUNT_PCT}% off.`,
      badge: `Save ${fullDiscountPct(hasReferral)}%`,
    },
  ];
}

export const PAY_METHODS = [
  { id: 'card', label: 'Card', sub: 'Visa, Mastercard, JCB or Amex' },
  { id: 'paypal', label: 'PayPal', sub: 'Pay from your PayPal balance or linked card' },
];

export const PAY_COPY = {
  heading: 'How would you like to pay?',
  methodHeading: 'Pay with',
  referralLabel: 'Referral code',
  referralHint: 'Got a code? Enter it first - it changes both options below.',
  // What a code is worth, said the way the model actually works. It used to read
  // "Referral applied - 10% off!", which is no longer true anywhere: a code does
  // not cut the price by itself, it unlocks the bigger full-payment discount and
  // waives the deposit. Two screens show this (homepage search + booking modal),
  // so the sentence lives here and not in either of them.
  referralOk: `Code applied. Pay in full at checkout for ${FULL_DISCOUNT_REFERRAL_PCT}% off, or book now with no deposit.`,
  referralBad: 'Code not valid.',
  cancel: `Free cancellation up to ${FREE_CANCEL_HOURS} hours before pickup - anything paid is refunded in full.`,
  late: 'Cancel later than that, or no-show, and what you paid is not refunded.',
  secureCard: 'Card details are entered on a secure DOKU window. We never see or store them.',
  securePaypal: 'You finish the payment in PayPal, then come back here.',
  nothingNow: 'Nothing today',
};
