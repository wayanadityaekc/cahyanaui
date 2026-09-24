// Simple client-side currency display for the booking flow and price tags
// across the site. This is NOT a live-market feed — rates are hardcoded for
// display purposes only, good enough to show guests a ballpark in their own
// currency before the conversation moves to WhatsApp.
//
// RATES ARE CUE'S, NOT SEPARATE ONES (Sep 2026, Wayan). They were sitting on
// CUE's OLD numbers (IDR 15800 / AUD 1.53 / EUR 0.92 / GBP 0.76), which CUE
// itself moved off in Sep 2026 — so the two sister sites were quoting the same
// guest two different conversions of the same rupiah amount. They now mirror
// CUE's data.js / cahyana-api pricing.js exactly. If CUE's rates change again,
// change them here in the same pass.
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
  // Rounds UP, matching CUE's roundCur() in both data.js and the API's
  // pricing.js (IDR to the next 1.000). Deliberate: a converted figure should
  // never land below what the guest is actually asked to pay.
  const rounded = code === 'IDR' ? Math.ceil(value / 1000) * 1000 : Math.ceil(value);
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
