// How much the guest pays at checkout, and what that choice costs them.
//
// CORRECTION (Wayan, 17 Sep 2026): an earlier draft of this made the deposit a
// flat fee that changed with the pickup zone. That was a misread - the thing that
// varies by zone is the PICKUP FEE, which already lives server-side in
// pricing.js and has nothing to do with this. The deposit is 10% everywhere.
//
// Nothing here prices a booking. Every amount below is derived from the total the
// server already quoted, so the quote stays the single source of truth.

export const DEPOSIT_PCT = 10;

// TODO Wayan: confirm the number. 5% is a placeholder so the design has
// something real to show - it decides how much margin the upfront discount costs
// against the no-show risk it removes.
export const FULL_DISCOUNT_PCT = 5;

export const FREE_CANCEL_HOURS = 24;

// The three ways to pay, in the order they are shown.
export const PAY_OPTIONS = [
  {
    id: 'deposit',
    label: 'Deposit only',
    sub: `Pay ${DEPOSIT_PCT}% now, the rest to your driver on the day.`,
    badge: `${DEPOSIT_PCT}%`,
  },
  {
    id: 'full',
    label: 'Pay in full now',
    sub: `Settle everything up front and save ${FULL_DISCOUNT_PCT}%.`,
    badge: `Save ${FULL_DISCOUNT_PCT}%`,
  },
  {
    id: 'referral',
    label: 'I have a referral code',
    sub: 'Your code discount, and no deposit to pay now.',
    badge: 'No deposit',
  },
];

// Rounding direction depends on what the number IS, which is why this does not
// just reuse roundCur()'s blanket ceil:
//
//   deposit    - rounds UP, like the rest of the site. It is a part payment; the
//                remainder the driver collects absorbs the difference.
//   full price - rounds DOWN. Rounding a discounted total up quietly shrinks the
//                discount the row just advertised ($55 less 5% is $52.25, and
//                charging $53 gives the guest $2 off, not $2.75). Erring in the
//                guest's favour is the only version that matches "clear pricing".
//
// Rupiah works in thousands either way, the site never shows smaller units.
export function roundAmount(value, symbol, direction = 'up') {
  const step = symbol === 'Rp' ? 1000 : 1;
  const fn = direction === 'down' ? Math.floor : Math.ceil;
  return fn(value / step) * step;
}

export function formatAmount(value, symbol, direction) {
  return symbol + roundAmount(value, symbol, direction).toLocaleString(symbol === 'Rp' ? 'id-ID' : 'en-US');
}

// What each option charges NOW, given the already-quoted total.
// `total` is priced.total.display - the number the summary line shows, in the
// guest's own currency, referral discount already applied by the server.
export function amountDueNow(optionId, total, symbol) {
  if (!total && total !== 0) return null;
  if (optionId === 'deposit') return formatAmount((total * DEPOSIT_PCT) / 100, symbol, 'up');
  if (optionId === 'full') return formatAmount((total * (100 - FULL_DISCOUNT_PCT)) / 100, symbol, 'down');
  return null; // referral: nothing is charged at checkout
}

export const PAY_METHODS = [
  { id: 'card', label: 'Card', sub: 'Visa, Mastercard, JCB or Amex' },
  { id: 'paypal', label: 'PayPal', sub: 'Pay from your PayPal balance or linked card' },
];

export const PAY_COPY = {
  heading: 'How would you like to pay?',
  methodHeading: 'Pay with',
  cancel: `Free cancellation up to ${FREE_CANCEL_HOURS} hours before pickup - anything paid is refunded in full.`,
  late: 'Cancel later than that, or no-show, and what you paid is not refunded.',
  secureCard: 'Card details are entered on a secure DOKU window. We never see or store them.',
  securePaypal: 'You finish the payment in PayPal, then come back here.',
  referralNone: 'Enter your code to see the discount.',
};
