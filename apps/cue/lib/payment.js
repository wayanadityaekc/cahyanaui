// What the guest sees at checkout.
//
// A display mirror of payment.js in cahyana-api. The server decides what is
// actually charged - this decides what the guest is shown BEFORE they commit, so
// the two must agree. They are compared by a harness; change one, change both.
//
// Model (Wayan, 20 Sep 2026):
//
//   1. deposit   - FLAT $10, every booking, every pick-up area.
//   2. full      - the whole amount, NO discount and NO change to the
//                  cancellation window. What it buys is the day itself being
//                  simpler: no cash to carry, no money changer, and the guest
//                  pays in their own currency at a rate they can see now.
//   3. referral  - 5% off, and no deposit. Only offered with a valid code.
//
// Two earlier models are recorded so they do not come back: the deposit is not
// 20%, and it does not vary by pick-up area.

export const DEPOSIT_USD = 10;
export const REFERRAL_DISCOUNT_PCT = 5;
// One window, every booking, however it was paid. A longer window was drafted
// as a perk for paying in full and dropped (Wayan, 20 Sep 2026): a longer notice
// period is a STRICTER deadline, not a better one, so it would have punished the
// guests who paid the most. Free cancellation is 24 hours for everyone.
export const FREE_CANCEL_HOURS = 24;

// Mirrors TICKET_IDR_PER_USD / CUR_RATE in the API. Only used to show the flat
// USD deposit in the guest's currency; the charge itself is always the server's.
const IDR_PER_USD = 17600;
const RATE = { USD: 1, AUD: 1.4, EUR: 0.86, GBP: 0.74 };

export const PAY_OPTIONS = ['deposit', 'full', 'referral'];

// Flat, so the pick-up area is not consulted. Callers still pass `stay` because
// the booking records it for other reasons; it has no say in the deposit.
export function depositUsd() {
  return DEPOSIT_USD;
}

function roundUp(v, cur) {
  return cur === 'IDR' ? Math.ceil(v / 1000) * 1000 : Math.ceil(v);
}
function roundDown(v, cur) {
  // Discounts round DOWN - rounding a discounted total up shrinks the discount
  // the row just advertised.
  return cur === 'IDR' ? Math.floor(v / 1000) * 1000 : Math.floor(v);
}

function depositIn(cur) {
  const usd = depositUsd();
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
  const dep = depositIn(cur);
  const disc = known ? roundDown((total * (100 - REFERRAL_DISCOUNT_PCT)) / 100, cur) : null;

  return [
    {
      id: 'deposit',
      label: 'Pay a deposit',
      detail:
        'Holds your date, whatever the trip costs and wherever we pick you up. ' +
        'The rest is cash to your driver on the day.',
      badge: 'Deposit',
      amount: known ? dep : null,
      balance: known ? total - dep : null,
      available: true,
    },
    {
      id: 'full',
      label: 'Pay in full',
      detail:
        `The same price and the same ${FREE_CANCEL_HOURS}-hour free cancellation, with nothing to ` +
        'sort out on the day: no cash to carry, no money changer, no ATM. You pay in your own ' +
        'currency, at a rate you can see right now.',
      badge: null,
      amount: known ? total : null,
      balance: null,
      available: true,
    },
    {
      id: 'referral',
      label: 'Referral code',
      detail: `${REFERRAL_DISCOUNT_PCT}% off the whole trip, and no deposit to pay.`,
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
  referralHint: 'Got a code? Enter it here to unlock the third option below.',
  referralOk: `Code applied. You can now pay ${REFERRAL_DISCOUNT_PCT}% less, with no deposit.`,
  referralBad: 'Code not valid.',
  // Why the third row is there but not selectable. Short on purpose: it is the
  // one line that has to be readable without opening anything, because a row
  // that is greyed out with no reason given reads as broken.
  referralLocked: 'Enter a valid code to use this.',
  detailsMore: 'Details',
  detailsLess: 'Hide details',
  cancel: `Free cancellation up to ${FREE_CANCEL_HOURS} hours before pickup - anything paid is refunded in full.`,
  late: 'Cancel later than that, or no-show, and what you paid is not refunded.',
  secure: 'Card details go straight to PayPal from a secure field. They never reach our site or our server.',
  declined: 'That card was declined. Try another card, or pay with PayPal.',
  failed: 'We could not complete the payment. Your booking is saved - please try again.',
  cancelled: 'Payment cancelled. Your booking is saved, you can pay when you are ready.',
  nothingNow: 'Nothing today',
};
