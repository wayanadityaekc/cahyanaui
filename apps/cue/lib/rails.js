// Which rail a payment goes through - the display mirror of providers.js in
// cahyana-api. The server decides; this decides what the guest is TOLD before
// they commit, so the two must agree (tools/check-pay-agree.mjs compares them).
//
// The rule (Wayan, 29 Sep 2026): DOKU is the DEFAULT for every currency, and
// the guest may choose PayPal instead. Overseas cards were approved on the DOKU
// account, so the rail that settles locally is the one we lead with.
//
//   doku   - card, QRIS, bank transfer, e-wallet. ALWAYS charged in rupiah. For
//            a guest shown another currency the rupiah figure is the exact one
//            and their own currency is an estimate - their bank converts.
//   paypal - charged in the guest's own currency, exactly. Rupiah falls back to
//            USD because PayPal cannot settle it.
//
// This replaces "rupiah -> DOKU, everything else -> PayPal" (20 Sep 2026) and
// the DOKU_ALL / DOKU_READY switches. The choice is the guest's now, so the
// site and the server can no longer disagree about where a currency belongs.

export const RAILS = ['doku', 'paypal'];
export const DEFAULT_RAIL = 'doku';

// Mirrors SUPPORTED in cahyana-api/paypal.js, trimmed to the currencies this
// site actually offers. IDR is absent on purpose: PayPal does not settle it.
const PAYPAL_SETTLES = new Set(['USD', 'AUD', 'EUR', 'GBP', 'SGD', 'NZD', 'CAD', 'CHF', 'JPY', 'MYR', 'HKD']);
const PAYPAL_FALLBACK = 'USD';

export function isRail(id) {
  return RAILS.includes(id);
}

// The rail a payment lands on: the guest's choice, or the default.
export function railFor(choice) {
  return isRail(choice) ? choice : DEFAULT_RAIL;
}

// What the guest will be billed in on that rail.
export function chargeCurrency(currency, rail = DEFAULT_RAIL) {
  const cur = String(currency || 'USD').toUpperCase();
  if (railFor(rail) === 'doku') return 'IDR';
  return PAYPAL_SETTLES.has(cur) ? cur : PAYPAL_FALLBACK;
}

// The two choices at the payment step. On screen they are ICONS ONLY (Wayan,
// 29 Sep 2026: "icon, no text"); `label` is the accessible name, and `how` is
// the explanation that lives behind the (i) beside the heading.
export const RAIL_CHOICES = [
  {
    id: 'doku',
    label: 'Card',
    how: 'Card, QRIS, bank transfer or e-wallet, through DOKU. Always charged in rupiah.',
  },
  {
    id: 'paypal',
    label: 'PayPal',
    how: 'PayPal balance or card, charged in the currency you chose.',
  },
];

// One sentence, or null when there is nothing to warn about: said when the
// guest is about to be charged in a currency other than the one every price on
// the page is shown in.
export function noteFor(currency, rail = DEFAULT_RAIL) {
  const cur = String(currency || 'USD').toUpperCase();
  const bill = chargeCurrency(cur, rail);
  if (bill === cur) return null;
  if (bill === 'IDR') {
    return `Card payments are charged in rupiah. The rupiah amount is exact; the amount in your currency is an estimate, and your bank converts it.`;
  }
  return `PayPal cannot charge ${cur === 'IDR' ? 'rupiah' : cur}, so the amount shown is converted at today's rate.`;
}
