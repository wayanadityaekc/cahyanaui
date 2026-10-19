export const RAILS = ['doku', 'paypal'];
export const DEFAULT_RAIL = 'doku';

const PAYPAL_SETTLES = new Set(['USD', 'AUD', 'EUR', 'GBP', 'SGD', 'NZD', 'CAD', 'CHF', 'JPY', 'MYR', 'HKD']);
const PAYPAL_FALLBACK = 'USD';

export function isRail(id) {
  return RAILS.includes(id);
}

export function railFor(choice) {
  return isRail(choice) ? choice : DEFAULT_RAIL;
}

export function chargeCurrency(currency, rail = DEFAULT_RAIL) {
  const current = String(currency || 'USD').toUpperCase();
  if (railFor(rail) === 'doku') return 'IDR';
  return PAYPAL_SETTLES.has(current) ? current : PAYPAL_FALLBACK;
}

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

export function noteFor(currency, rail = DEFAULT_RAIL) {
  const current = String(currency || 'USD').toUpperCase();
  const bill = chargeCurrency(current, rail);
  if (bill === current) return null;
  if (bill === 'IDR') {
    return `Card payments are charged in rupiah. The rupiah amount is exact; the amount in your currency is an estimate, and your bank converts it.`;
  }
  return `PayPal cannot charge ${current === 'IDR' ? 'rupiah' : current}, so the amount shown is converted at today's rate.`;
}
