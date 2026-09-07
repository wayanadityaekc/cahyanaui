// Simple client-side currency display for the booking flow and price tags
// across the site. This is NOT a live-market feed — rates are hardcoded
// approximations for display purposes only, good enough to show guests a
// ballpark in their own currency before the conversation moves to WhatsApp.
// CEK WAYAN — approximate rates (Sep 2026 ballpark), update periodically or
// swap for a live-rate API later if it's ever worth the complexity.
export const CURRENCIES = [
  { code: 'USD', name: 'US Dollar', flag: '🇺🇸' },
  { code: 'IDR', name: 'Indonesian Rupiah', flag: '🇮🇩' },
  { code: 'EUR', name: 'Euro', flag: '🇪🇺' },
  { code: 'AUD', name: 'Australian Dollar', flag: '🇦🇺' },
  { code: 'GBP', name: 'British Pound', flag: '🇬🇧' },
];

// Approximate units per 1 USD.
export const USD_RATES = {
  USD: 1,
  IDR: 15800,
  EUR: 0.92,
  AUD: 1.53,
  GBP: 0.76,
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
  const rounded = code === 'IDR' ? Math.round(value / 1000) * 1000 : Math.round(value);
  try {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: code,
      maximumFractionDigits: 0,
    }).format(rounded);
  } catch {
    return `${code} ${rounded.toLocaleString('en-US')}`;
  }
}

/** Always-IDR approximate line, e.g. for the "(approx. IDR 5,9x,xxx)" hint. */
export function formatApproxIDR(amountUsd) {
  return formatCurrency(amountUsd, 'IDR');
}
