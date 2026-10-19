export const PAY_DEFAULT = true;

const KEY = 'cue_pay_beta';

export function readPayFlag() {
  if (typeof window === 'undefined') return PAY_DEFAULT;
  try {
    const param = new URLSearchParams(window.location.search).get('pay');
    if (param === '1' || param === '0') {
      localStorage.setItem(KEY, param);
      return param === '1';
    }
    const saved = localStorage.getItem(KEY);
    if (saved === '1' || saved === '0') return saved === '1';
  } catch (e) {}
  return PAY_DEFAULT;
}
