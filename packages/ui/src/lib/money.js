const FX_BUFFER_RATE = 0.03;
const IDR_PER_USD_FALLBACK = 17600;
const SMALL_AMOUNT_LADDER_LIMIT = 10;
const FLOAT_TOLERANCE = 1e-9;
const DECADE_BASE = 10;
const IDR_ROUNDING_STEP = 1000;

export const CURRENCIES = ['USD', 'IDR', 'AUD', 'EUR', 'GBP', 'SGD', 'NZD', 'CAD', 'CHF', 'JPY', 'MYR', 'HKD'];

export const CURRENCY_SYMBOL = {
  USD: '$',
  IDR: 'Rp',
  AUD: 'A$',
  EUR: '€',
  GBP: '£',
  SGD: 'S$',
  NZD: 'NZ$',
  CAD: 'C$',
  CHF: 'CHF ',
  JPY: '¥',
  MYR: 'RM',
  HKD: 'HK$',
};

export const BASELINE_FX = {
  source: 'baseline',
  asOf: null,
  buffer: FX_BUFFER_RATE,
  idrPerUsd: IDR_PER_USD_FALLBACK,
  perUsd: {
    USD: 1,
    IDR: IDR_PER_USD_FALLBACK,
    AUD: 1.4,
    EUR: 0.86,
    GBP: 0.74,
    SGD: 1.36,
    NZD: 1.72,
    CAD: 1.39,
    CHF: 0.84,
    JPY: 150,
    MYR: 4.45,
    HKD: 7.8,
  },
};

const MANTISSAS = [
  1, 1.1, 1.2, 1.3, 1.4, 1.5, 1.6, 1.7, 1.8, 1.9, 2, 2.2, 2.4, 2.5, 2.6, 2.8, 3, 3.2, 3.5, 3.8, 4, 4.2, 4.5, 4.8, 5,
  5.5, 6, 6.5, 7, 7.5, 8, 8.5, 9, 9.5, 10,
];

const SNAPSHOT_ERROR = 5e-5;

export function ladder(value) {
  const amount = Number(value) || 0;
  if (amount <= 0) return 0;
  if (amount <= SMALL_AMOUNT_LADDER_LIMIT) return Math.ceil(amount - FLOAT_TOLERANCE);
  const decade = DECADE_BASE ** Math.floor(Math.log10(amount));
  const step = MANTISSAS.map((mantissa) => Math.round(mantissa * decade)).find(
    (candidate) => candidate >= amount - FLOAT_TOLERANCE,
  );
  return step ?? Math.round(DECADE_BASE * decade);
}

export function perIdr(fx, currency) {
  const isRateMissing = !fx || !fx.perUsd || !fx.idrPerUsd;
  if (isRateMissing) return null;
  const perUsd = fx.perUsd[currency];
  return perUsd ? perUsd / fx.idrPerUsd : null;
}

export function displayFromIdr(idr, currency, fx = BASELINE_FX) {
  const code = String(currency || 'USD').toUpperCase();
  const amount = Number(idr) || 0;
  if (code === 'IDR') return Math.ceil(amount / IDR_ROUNDING_STEP) * IDR_ROUNDING_STEP;
  if (amount <= 0) return 0;
  const rate = perIdr(fx, code) ?? perIdr(BASELINE_FX, code);
  if (!rate) return null;
  return ladder(amount * rate * (1 + (fx?.buffer ?? FX_BUFFER_RATE)) * (1 + SNAPSHOT_ERROR));
}

export function formatMoney(amount, currency) {
  const code = String(currency || 'USD').toUpperCase();
  if (amount == null) return '-';
  const symbol = CURRENCY_SYMBOL[code] ?? `${code} `;
  return `${symbol}${Number(amount).toLocaleString(code === 'IDR' ? 'id-ID' : 'en-US')}`;
}
