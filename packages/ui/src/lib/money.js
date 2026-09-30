// Mirror of cahyana-api fx.js (ladder, buffer, display): rupiah is the real price, other currencies are derived.
// Keep in step with fx.js; tools/money-parity-test.mjs compares the two.

// Same order as fx.CURRENCIES, which is CUE's picker order.
export const CURRENCIES = ['USD', 'IDR', 'AUD', 'EUR', 'GBP', 'SGD', 'NZD', 'CAD', 'CHF', 'JPY', 'MYR', 'HKD'];

export const CURRENCY_SYMBOL = {
  USD: '$', IDR: 'Rp', AUD: 'A$', EUR: '€', GBP: '£', SGD: 'S$',
  NZD: 'NZ$', CAD: 'C$', CHF: 'CHF ', JPY: '¥', MYR: 'RM', HKD: 'HK$',
};

// fx.js BASELINE_PER_USD in the catalog's `fx` shape; used only before any live rate has arrived.
export const BASELINE_FX = {
  source: 'baseline',
  asOf: null,
  buffer: 0.03,
  idrPerUsd: 17600,
  perUsd: { USD: 1, IDR: 17600, AUD: 1.4, EUR: 0.86, GBP: 0.74, SGD: 1.36, NZD: 1.72, CAD: 1.39, CHF: 0.84, JPY: 150, MYR: 4.45, HKD: 7.8 },
};

const MANTISSAS = [1, 1.1, 1.2, 1.3, 1.4, 1.5, 1.6, 1.7, 1.8, 1.9, 2, 2.2, 2.4, 2.5, 2.6, 2.8, 3, 3.2, 3.5, 3.8,
  4, 4.2, 4.5, 4.8, 5, 5.5, 6, 6.5, 7, 7.5, 8, 8.5, 9, 9.5, 10];

// Largest relative error from the snapshot rounding idrPerUsd to a whole number (0.5 / ~15000).
const SNAPSHOT_ERROR = 5e-5;

// Round up to the clean price ladder (45, 48, 50, 55 ...); at or below 10 it is a whole number.
export function ladder(value) {
  const amount = Number(value) || 0;
  if (amount <= 0) return 0;
  if (amount <= 10) return Math.ceil(amount - 1e-9);
  const decade = 10 ** Math.floor(Math.log10(amount));
  const step = MANTISSAS.map((mantissa) => Math.round(mantissa * decade)).find((candidate) => candidate >= amount - 1e-9);
  return step ?? Math.round(10 * decade);
}

// Units of `currency` per rupiah, from a catalog fx snapshot ({ idrPerUsd, perUsd }).
export function perIdr(fx, currency) {
  if (!fx || !fx.perUsd || !fx.idrPerUsd) return null;
  const perUsd = fx.perUsd[currency];
  return perUsd ? perUsd / fx.idrPerUsd : null;
}

// The number a guest sees for a rupiah price: IDR rounds up to thousands, others are rupiah x rate x buffer, laddered up.
export function displayFromIdr(idr, currency, fx = BASELINE_FX) {
  const code = String(currency || 'USD').toUpperCase();
  const amount = Number(idr) || 0;
  if (code === 'IDR') return Math.ceil(amount / 1000) * 1000;
  if (amount <= 0) return 0;
  const rate = perIdr(fx, code) ?? perIdr(BASELINE_FX, code);
  if (!rate) return null;
  // The snapshot rounds idrPerUsd to a whole number; nudge up by that error so a near-step price never shows below the server.
  return ladder(amount * rate * (1 + (fx?.buffer ?? 0.03)) * (1 + SNAPSHOT_ERROR));
}

// CUE's print rule: symbol then the number, dots for rupiah (id-ID), commas for the rest (en-US).
export function formatMoney(amount, currency) {
  const code = String(currency || 'USD').toUpperCase();
  if (amount == null) return '-';
  const symbol = CURRENCY_SYMBOL[code] ?? `${code} `;
  return `${symbol}${Number(amount).toLocaleString(code === 'IDR' ? 'id-ID' : 'en-US')}`;
}
