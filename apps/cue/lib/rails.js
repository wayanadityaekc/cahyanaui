// Which rail a currency is paid on - the display mirror of providers.js in
// cahyana-api. The server decides; this decides what the guest is TOLD before
// they commit, so the two must agree (tools/check-pay-agree.mjs compares them).
//
// The rule (Wayan, 20 Sep 2026): rupiah goes to DOKU, everything else goes to
// PayPal. PayPal cannot settle rupiah at all, so without a local rail an IDR
// guest is billed a converted number in dollars.
//
// DOKU is on as of 23 Sep 2026: the account has live credentials on the
// server, so a rupiah booking is charged in rupiah. `noteFor` still exists for
// the case where a currency has no rail of its own - the guest is told before
// they type a card number, rather than finding out from the amount.

export const RAILS = ['doku', 'paypal'];

// On since 23 Sep 2026. Set this back to false to send every rupiah booking to
// PayPal in dollars again - it is the one switch, and nothing else in this file
// changes, because the routing already points rupiah at DOKU either way.
export const DOKU_READY = true;

// Mirrors SUPPORTED in cahyana-api/paypal.js, trimmed to the currencies this
// site actually offers. IDR is absent on purpose: PayPal does not settle it.
const PAYPAL_SETTLES = new Set(['USD', 'AUD', 'EUR', 'GBP']);
const PAYPAL_FALLBACK = 'USD';

export const RAIL_LABEL = {
  doku: 'Pay in Rupiah',
  paypal: 'Card or PayPal',
};

// Off by default: send EVERY booking to DOKU, not just rupiah ones.
//
// Mirrors DOKU_ALL_CURRENCIES on the server, and the two must be flipped
// TOGETHER - check-pay-agree compares them and goes red otherwise. It exists to
// answer one question that can only be answered with a real card: does DOKU
// accept a foreign-issued one? Settlement is still rupiah either way; a guest
// quoted in dollars is billed the rupiah figure and their bank converts.
export const DOKU_ALL = true;

// The rail we want for a currency, whether or not it is switched on.
export function preferredRail(currency) {
  if (DOKU_ALL) return 'doku';
  return String(currency || '').toUpperCase() === 'IDR' ? 'doku' : 'paypal';
}

// The rail that will actually take the money today.
export function railFor(currency) {
  const want = preferredRail(currency);
  if (want === 'doku' && !DOKU_READY) return 'paypal';
  return want;
}

// What the guest will be billed in. Equal to their own currency unless the rail
// cannot settle it.
export function chargeCurrency(currency) {
  const cur = String(currency || 'USD').toUpperCase();
  // DOKU settles rupiah and only rupiah. While it takes only IDR bookings that
  // is the guest's own currency; opened to all of them it is not, and saying so
  // is what lets the payment step warn before a card is typed.
  if (railFor(cur) === 'doku') return DOKU_ALL ? 'IDR' : cur;
  return PAYPAL_SETTLES.has(cur) ? cur : PAYPAL_FALLBACK;
}

// One sentence, or null when there is nothing to warn about. Only says anything
// when the guest is about to be charged in a currency other than the one every
// price on the page is shown in.
export function noteFor(currency) {
  const cur = String(currency || 'USD').toUpperCase();
  const bill = chargeCurrency(cur);
  if (bill === cur) return null;
  return `Card payments are settled in ${bill}, so this is charged as ${bill} at today's rate. Prefer rupiah? Pay your driver on the day instead.`;
}
