import { CURRENCIES, displayFromIdr, formatMoney } from '@cahyana/ui';

// Prices are rupiah; other currencies come from the live rates in cahyana-api's catalog, same rule as CUE.
export { CURRENCIES };

// Names for the search form's currency list; the navbar picker shows codes only, like CUE.
export const CURRENCY_NAMES = {
  USD: 'US Dollar', IDR: 'Indonesian Rupiah', AUD: 'Australian Dollar', EUR: 'Euro', GBP: 'British Pound', SGD: 'Singapore Dollar',
  NZD: 'New Zealand Dollar', CAD: 'Canadian Dollar', CHF: 'Swiss Franc', JPY: 'Japanese Yen', MYR: 'Malaysian Ringgit', HKD: 'Hong Kong Dollar',
};

export const DEFAULT_CURRENCY = 'USD';
export const CURRENCY_STORAGE_KEY = 'upv_currency';

// Formats one rupiah price in the guest's currency.
export function formatCurrency(idr, currency, fx) {
  return formatMoney(displayFromIdr(idr, currency, fx), currency);
}

// Exact rupiah, the price the stay is actually charged at.
export function formatRupiah(idr) {
  return formatMoney(displayFromIdr(idr, 'IDR'), 'IDR');
}

// Each line converts on its own and the total is their sum, so a converted breakdown always adds up (CUE's rule).
export function displayBreakdown(breakdown, currency, fx) {
  if (!breakdown) return null;
  const { nights, nightlyIdr } = breakdown;
  const nightly = displayFromIdr(nightlyIdr, currency, fx);
  const subtotal = nightly * nights;
  return { nights, nightly, subtotal, total: subtotal };
}
