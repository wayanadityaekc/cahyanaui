// Display mirror of cahyana-api providers.js: DOKU default (always IDR), PayPal by choice; check-pay-agree compares them.

export const RAILS = ['doku', 'paypal'];
export const DEFAULT_RAIL = 'doku';

// Mirrors SUPPORTED in cahyana-api/paypal.js; IDR is absent because PayPal can't settle it.
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

// Payment-rail choices: icons on screen, `label` is the accessible name, `how` is the (i) explanation.
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

// One-sentence note when the charge currency differs from the displayed one, else null.
export function noteFor(currency, rail = DEFAULT_RAIL) {
  const cur = String(currency || 'USD').toUpperCase();
  const bill = chargeCurrency(cur, rail);
  if (bill === cur) return null;
  if (bill === 'IDR') {
    return `Card payments are charged in rupiah. The rupiah amount is exact; the amount in your currency is an estimate, and your bank converts it.`;
  }
  return `PayPal cannot charge ${cur === 'IDR' ? 'rupiah' : cur}, so the amount shown is converted at today's rate.`;
}
