// Default for showing the payment step; ?pay=1 / ?pay=0 overrides per browser, set false to turn checkout off for all.

export const PAY_DEFAULT = true;

const KEY = 'cue_pay_beta';

// Never call during render: static export, so read it in an effect to match the prerendered HTML.
export function readPayFlag() {
  if (typeof window === 'undefined') return PAY_DEFAULT;
  try {
    const q = new URLSearchParams(window.location.search).get('pay');
    if (q === '1' || q === '0') {
      localStorage.setItem(KEY, q);
      return q === '1';
    }
    const saved = localStorage.getItem(KEY);
    if (saved === '1' || saved === '0') return saved === '1';
  } catch (e) {
    // Storage blocked (private mode): fall back to PAY_DEFAULT.
  }
  return PAY_DEFAULT;
}
