// Whether this visitor is shown the payment step.
//
// OFF for everyone by default, and that is the point. The checkout is finished
// code long before it is a finished product: a guest who meets a payment form
// we have not yet proven end to end is a booking we lose QUIETLY - they cannot
// pay, the booking sits unpaid, and no confirmation email goes out, because the
// email now waits for the provider's webhook. Until the whole chain is proven on
// the live site, the site must behave exactly as it did before any of this
// existed: book, confirm, email, pay the driver on the day.
//
// Turn it on for yourself with `?pay=1` and off again with `?pay=0`. The choice
// is remembered per browser, so it only has to be passed once.
//
// ON for everyone since 22 Sep 2026, once the chain was proven end to end on a
// real payment: PayPal captured, the webhook arrived, the amount and currency
// checked out, the booking went to paid and both emails went out - in the same
// second, with nobody touching it. Before that it was off precisely because
// none of that had been proven, and a guest meeting an unproven payment form is
// a booking lost in silence.
//
// Set this back to false to switch checkout off for everyone; `?pay=0` only
// switches it off for one browser.

export const PAY_DEFAULT = true;

const KEY = 'cue_pay_beta';

// Pure read - NEVER call this during render. This is a static export, so the
// first paint has to match the pre-rendered HTML; a value that only exists in
// the browser must arrive in an effect. (Same rule as the charter draft.)
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
  } catch {
    // Private mode, or storage blocked. Fall through to the default - the safe
    // direction is OFF, never on.
  }
  return PAY_DEFAULT;
}
