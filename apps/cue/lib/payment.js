// What the guest sees at checkout.
//
// A display mirror of payment.js in cahyana-api. The server decides what is
// actually charged - this decides what the guest is shown BEFORE they commit, so
// the two must agree. They are compared by a harness; change one, change both.
//
// Model (Wayan, 20 Sep 2026):
//
//   1. deposit   - flat $5 if pick-up is in Ubud, $15 if outside. Rest is cash
//                  to the driver on the day.
//   2. full      - the whole amount, no discount.
//   3. referral  - 5% off, and no deposit. Only offered with a valid code.
//
// This REPLACES the 20%-deposit / 5%-off-full model. The site copy elsewhere
// still says "20% deposit" in roughly 33 places; that sweep is not done here.

export const DEPOSIT_UBUD_USD = 5;
export const DEPOSIT_OUTSIDE_USD = 15;
export const REFERRAL_DISCOUNT_PCT = 5;
export const FREE_CANCEL_HOURS = 24;

// Mirrors TICKET_IDR_PER_USD / CUR_RATE in the API. Only used to show the flat
// USD deposit in the guest's currency; the charge itself is always the server's.
const IDR_PER_USD = 17600;
const RATE = { USD: 1, AUD: 1.4, EUR: 0.86, GBP: 0.74 };

export const PAY_OPTIONS = ['deposit', 'full', 'referral'];

// Empty pick-up means Ubud, matching the server's default.
export function isUbudPickup(stay) {
  return !stay || stay === 'ubud';
}

export function depositUsd(stay) {
  return isUbudPickup(stay) ? DEPOSIT_UBUD_USD : DEPOSIT_OUTSIDE_USD;
}

function roundUp(v, cur) {
  return cur === 'IDR' ? Math.ceil(v / 1000) * 1000 : Math.ceil(v);
}
function roundDown(v, cur) {
  // Discounts round DOWN - rounding a discounted total up shrinks the discount
  // the row just advertised.
  return cur === 'IDR' ? Math.floor(v / 1000) * 1000 : Math.floor(v);
}

function depositIn(cur, stay) {
  const usd = depositUsd(stay);
  return cur === 'IDR' ? roundUp(usd * IDR_PER_USD, cur) : roundUp(usd * (RATE[cur] || 1), cur);
}

// The full price of the trip before any of this, taken from the quote. Uses
// `was` (pre-referral) so a code is never counted twice: the quote already
// subtracts it, and here a code is its own option.
export function baseTotal(priced) {
  if (!priced || !Array.isArray(priced.lines)) return null;
  const lines = priced.lines.filter((l) => l && l.ok && l.was);
  if (!lines.length) return priced.total ? priced.total.display : null;
  return lines.reduce((sum, l) => sum + (l.was.display || 0), 0);
}

// One entry per option: what is charged now, what is left for the day, and the
// copy that goes with it. `currency` is the ISO code; `symbol` is for display.
export function payOptions({ total, currency = 'USD', stay = '', hasReferral = false }) {
  const cur = String(currency || 'USD').toUpperCase();
  const known = total != null;
  const dep = depositIn(cur, stay);
  const disc = known ? roundDown((total * (100 - REFERRAL_DISCOUNT_PCT)) / 100, cur) : null;

  return [
    {
      id: 'deposit',
      label: 'Pay a deposit',
      sub: 'Holds your date. The rest is cash to your driver on the day.',
      badge: 'Deposit',
      amount: known ? dep : null,
      balance: known ? total - dep : null,
      available: true,
    },
    {
      id: 'full',
      label: 'Pay in full now',
      sub: 'No cash needed, no money changer, nothing to pay your driver on the day.',
      badge: null,
      amount: known ? total : null,
      balance: null,
      available: true,
    },
    {
      id: 'referral',
      label: 'Use your referral code',
      sub: `${REFERRAL_DISCOUNT_PCT}% off, and no deposit to pay.`,
      badge: `Save ${REFERRAL_DISCOUNT_PCT}%`,
      amount: known ? disc : null,
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
  referralHint: 'Got a code? Enter it first - it unlocks a third option.',
  referralOk: `Code applied. You can now pay ${REFERRAL_DISCOUNT_PCT}% less, with no deposit.`,
  referralBad: 'Code not valid.',
  // One explanation for all three, behind the info button next to the heading.
  optionsInfo: [
    `Deposit - pay $${DEPOSIT_UBUD_USD} if we pick you up in Ubud, $${DEPOSIT_OUTSIDE_USD} anywhere else. It holds your date; the rest is cash to your driver on the day.`,
    'Pay in full - nothing left to sort out on the day. No cash, no money changer, nothing to hand over.',
    `Referral code - ${REFERRAL_DISCOUNT_PCT}% off the whole trip, and no deposit. Enter the code above to unlock it.`,
  ],
  cancel: `Free cancellation up to ${FREE_CANCEL_HOURS} hours before pickup - anything paid is refunded in full.`,
  late: 'Cancel later than that, or no-show, and what you paid is not refunded.',
  secure: 'Card details go straight to PayPal from a secure field. They never reach our site or our server.',
  declined: 'That card was declined. Try another card, or pay with PayPal.',
  failed: 'We could not complete the payment. Your booking is saved - please try again.',
  cancelled: 'Payment cancelled. Your booking is saved, you can pay when you are ready.',
  nothingNow: 'Nothing today',
};
