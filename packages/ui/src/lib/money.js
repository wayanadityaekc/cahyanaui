
export const CURRENCIES = ['USD', 'IDR', 'AUD', 'EUR', 'GBP', 'SGD', 'NZD', 'CAD', 'CHF', 'JPY', 'MYR', 'HKD'];

export const CURRENCY_SYMBOL = {
  USD: '$', IDR: 'Rp', AUD: 'A$', EUR: '€', GBP: '£', SGD: 'S$',
  NZD: 'NZ$', CAD: 'C$', CHF: 'CHF ', JPY: '¥', MYR: 'RM', HKD: 'HK$',
};

export const BASELINE_FX = {
  source: 'baseline',
  asOf: null,
  buffer: 0.03,
  idrPerUsd: 17600,
  perUsd: { USD: 1, IDR: 17600, AUD: 1.4, EUR: 0.86, GBP: 0.74, SGD: 1.36, NZD: 1.72, CAD: 1.39, CHF: 0.84, JPY: 150, MYR: 4.45, HKD: 7.8 },
};

const MANTISSAS = [1, 1.1, 1.2, 1.3, 1.4, 1.5, 1.6, 1.7, 1.8, 1.9, 2, 2.2, 2.4, 2.5, 2.6, 2.8, 3, 3.2, 3.5, 3.8,
  4, 4.2, 4.5, 4.8, 5, 5.5, 6, 6.5, 7, 7.5, 8, 8.5, 9, 9.5, 10];

const SNAPSHOT_ERROR = 5e-5;

export function ladder(value) {
  const amount = Number(value) || 0;
  if (amount <= 0) return 0;
  if (amount <= 10) return Math.ceil(amount - 1e-9);
  const decade = 10 ** Math.floor(Math.log10(amount));
  const step = MANTISSAS.map((mantissa) => Math.round(mantissa * decade)).find((candidate) => candidate >= amount - 1e-9);
  return step ?? Math.round(10 * decade);
}

export function perIdr(fx, currency) {
  if (!fx || !fx.perUsd || !fx.idrPerUsd) return null;
  const perUsd = fx.perUsd[currency];
  return perUsd ? perUsd / fx.idrPerUsd : null;
}

export function displayFromIdr(idr, currency, fx = BASELINE_FX) {
  const code = String(currency || 'USD').toUpperCase();
  const amount = Number(idr) || 0;
  if (code === 'IDR') return Math.ceil(amount / 1000) * 1000;
  if (amount <= 0) return 0;
  const rate = perIdr(fx, code) ?? perIdr(BASELINE_FX, code);
  if (!rate) return null;
  return ladder(amount * rate * (1 + (fx?.buffer ?? 0.03)) * (1 + SNAPSHOT_ERROR));
}

export function formatMoney(amount, currency) {
  const code = String(currency || 'USD').toUpperCase();
  if (amount == null) return '-';
  const symbol = CURRENCY_SYMBOL[code] ?? `${code} `;
  return `${symbol}${Number(amount).toLocaleString(code === 'IDR' ? 'id-ID' : 'en-US')}`;
}
