'use client';
import { useState } from 'react';
import { API_BASE } from '@/lib/constants';
import { BTN_SM } from '@/components/ui/btnClasses';

// The rupiah rail's checkout: one button, then DOKU's own page.
//
// Unlike PayPal there is nothing to embed. DOKU Checkout is hosted, which is
// what makes QRIS, virtual accounts and e-wallets possible at all - and those,
// not cards, are why an Indonesian guest wants this rail. The trade is that the
// guest LEAVES this page, so:
//   - the cart is NOT cleared here. Leaving for DOKU is not paying; a guest who
//     backs out must still have their trip. My Trips clears it once the server
//     says the money cleared.
//   - nothing on the way back is trusted. The guest returns with a reference
//     and the page asks the server what actually happened.
export default function DokuCheckout({ bookingRef, option, amountText }) {
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState('');

  const go = async () => {
    setBusy(true);
    setErr('');
    try {
      const r = await fetch(`${API_BASE}/doku/create-payment`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ booking_ref: bookingRef, option }),
      });
      const d = await r.json().catch(() => null);
      if (!r.ok || !d || !d.url) {
        // A rail that is switched off says so plainly rather than sending the
        // guest to a page that will not load.
        setErr(
          d && d.code === 'not_ready'
            ? 'Rupiah payments are not switched on yet. Please pay your driver on the day, or contact us.'
            : (d && d.detail) || 'We could not start the payment. Please try again.',
        );
        setBusy(false);
        return;
      }
      // Full navigation, not a new tab: a popup blocker must not be able to
      // swallow the only way to pay.
      window.location.href = d.url;
    } catch {
      setErr('We could not reach the payment page. Please check your connection and try again.');
      setBusy(false);
    }
  };

  return (
    <div>
      <button
        type="button"
        className={`flex w-full ${BTN_SM} border-none font-body no-underline text-white bg-cta cursor-pointer transition-[background-color,color,scale] duration-[var(--dur)] ease-[ease] hover:bg-cta-d disabled:opacity-60`}
        onClick={go}
        disabled={busy || !bookingRef}
      >
        {busy ? 'Opening...' : `Pay ${amountText || 'now'}`}
      </button>
      <p className="mt-2 text-small text-muted">
        You will finish on DOKU's secure page - bank transfer, QRIS or e-wallet - and come straight back here.
      </p>
      {err ? <p className="mt-2 text-small text-err">{err}</p> : null}
    </div>
  );
}
