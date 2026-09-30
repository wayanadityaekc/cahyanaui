// Display-only currency conversion; rates mirror CUE's pricing exactly, so change them here whenever CUE's change.
export const CURRENCIES = [
  { code: 'USD', name: 'US Dollar', flag: '🇺🇸' },
  { code: 'IDR', name: 'Indonesian Rupiah', flag: '🇮🇩' },
  { code: 'EUR', name: 'Euro', flag: '🇪🇺' },
  { code: 'AUD', name: 'Australian Dollar', flag: '🇦🇺' },
  { code: 'GBP', name: 'British Pound', flag: '🇬🇧' },
];

// Units per 1 USD — mirrors CUE's TICKET_IDR_PER_USD (17600) and CUR_RATE.
export const USD_RATES = {
  USD: 1,
  IDR: 17600,
  EUR: 0.86,
  AUD: 1.40,
  GBP: 0.74,
};

export const DEFAULT_CURRENCY = 'USD';
export const CURRENCY_STORAGE_KEY = 'upv_currency';

/** Converts a USD amount into the given currency (approximate, for display). */
export function convertFromUSD(amountUsd, code) {
  const rate = USD_RATES[code] ?? 1;
  return amountUsd * rate;
}

/** Formats a converted amount with sensible rounding/decimals per currency. */
export function formatCurrency(amountUsd, code) {
  const value = convertFromUSD(amountUsd, code);
  // Rounds up like CUE's roundCur(): a converted figure must never land below what the guest pays.
  const rounded = code === 'IDR' ? Math.ceil(value / 1000) * 1000 : Math.ceil(value);
  try {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: code,
      maximumFractionDigits: 0,
    }).format(rounded);
  } catch (e) {
    return `${code} ${rounded.toLocaleString('en-US')}`;
  }
}

/** Always-IDR approximate line, e.g. for the "(approx. IDR 5,9x,xxx)" hint. */
export function formatApproxIDR(amountUsd) {
  return formatCurrency(amountUsd, 'IDR');
}
