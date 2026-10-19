import { CURRENCIES, displayFromIdr, formatMoney } from '@cahyana/ui';

export { CURRENCIES };

export const CURRENCY_NAMES = {
  USD: 'US Dollar',
  IDR: 'Indonesian Rupiah',
  AUD: 'Australian Dollar',
  EUR: 'Euro',
  GBP: 'British Pound',
  SGD: 'Singapore Dollar',
  NZD: 'New Zealand Dollar',
  CAD: 'Canadian Dollar',
  CHF: 'Swiss Franc',
  JPY: 'Japanese Yen',
  MYR: 'Malaysian Ringgit',
  HKD: 'Hong Kong Dollar',
};

export const DEFAULT_CURRENCY = 'USD';
export const CURRENCY_STORAGE_KEY = 'upv_currency';

export function formatCurrency(idr, currency, fx) {
  return formatMoney(displayFromIdr(idr, currency, fx), currency);
}

export function formatRupiah(idr) {
  return formatMoney(displayFromIdr(idr, 'IDR'), 'IDR');
}

export function buildDisplayBreakdown(breakdown, currency, fx) {
  if (!breakdown) return null;
  const { nights, nightlyIdr } = breakdown;
  const nightly = displayFromIdr(nightlyIdr, currency, fx);
  const subtotal = nightly * nights;
  return { nights, nightly, subtotal, total: subtotal };
}
