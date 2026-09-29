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

// No exchange rates live on the site any more (29 Sep 2026): prices follow a live
// rate on the server (cahyana-api/fx.js). The flat USD deposit in the guest's own
// currency comes from the catalog (`catalog.deposit.display`), computed with the
// SAME rate as every other number on the page - pass it in as `deposit`.

export const PAY_OPTIONS = ['deposit', 'full', 'referral'];

// Flat, so the pick-up area is not consulted. Callers still pass `stay` because
// the booking records it for other reasons; it has no say in the deposit.
export function depositUsd() {
  return DEPOSIT_USD;
}

function roundDown(v, cur) {
  // Discounts round DOWN - rounding a discounted total up shrinks the discount
  // the row just advertised.
  return cur === 'IDR' ? Math.floor(v / 1000) * 1000 : Math.floor(v);
}

// The deposit in `cur`: what the catalog said, or - before it has answered - the
// one currency it is defined in. Anything else is unknown, never guessed: a
// guessed deposit is a number the guest could be charged differently from.
function depositIn(cur, deposit) {
  if (deposit != null) return deposit;
  return cur === 'USD' ? depositUsd() : null;
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
// The rupiah total of the same lines - what DOKU charges when the guest is shown
// another currency. Same lines as baseTotal, so the two can never describe
// different bookings.
export function baseTotalIdr(priced) {
  if (!priced || !Array.isArray(priced.lines)) return null;
  const lines = priced.lines.filter((l) => l && l.ok && l.was && l.was.idr != null);
  if (!lines.length) return priced.total && priced.total.idr != null ? priced.total.idr : null;
  return lines.reduce((sum, l) => sum + (l.was.idr || 0), 0);
}

// The dollar total of the same lines - what PayPal charges a rupiah guest (it
// cannot settle rupiah, so it bills USD from each line's stored usd).
export function baseTotalUsd(priced) {
  if (!priced || !Array.isArray(priced.lines)) return null;
  const lines = priced.lines.filter((l) => l && l.ok && l.was && l.was.usd != null);
  if (!lines.length) return priced.total && priced.total.usd != null ? priced.total.usd : null;
  return lines.reduce((sum, l) => sum + (l.was.usd || 0), 0);
}

// `totalIdr`/`depositIdr` are optional: when given, each option also carries
// `amountIdr`, the exact rupiah figure the card rail (DOKU) is told to charge -
// the server's own rule in payment.js (deposit = the flat deposit in rupiah,
// full = the rupiah total, referral = 5% off, rounded down to the thousand).
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
  // Why the third row is there but not selectable. Short on purpose: it is the
  // one line that has to be readable without opening anything, because a row
  // that is greyed out with no reason given reads as broken.
  referralLocked: 'Enter a valid code to use this.',
  detailsMore: 'Details',
  detailsTitle: 'What happens when you pay',
  detailsClose: 'Got it',
  // ONE short line stays on screen; everything else is behind the Details
  // button (Wayan, Sep 2026: "yang tulisan card payment itu loh, itu hide
  // dulu, terus kasi button details"). The 24-hour window is the fact that
  // changes a decision, so it is the line that is never hidden.
  cancelShort: `Free cancellation up to ${FREE_CANCEL_HOURS} hours before pickup.`,
  // What actually happens after the card goes through. Every line is
  // something the system really does - the card form is PayPal's iframe, the
  // booking is confirmed by the webhook, and the emails wait for it.
  // Per rail: the first line names whoever actually holds the card details.
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
