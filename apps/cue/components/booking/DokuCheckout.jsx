'use client';
import { useState } from 'react';
import { API_BASE } from '@/lib/constants';
import { BTN_SM } from '@/components/ui/btnClasses';

// The rupiah rail's checkout: one button, then DOKU over this page.
//
// DOKU Checkout is hosted - that is what makes QRIS, virtual accounts and
// e-wallets possible at all, and those, not cards, are why an Indonesian guest
// wants this rail. But hosted does not have to mean "leaves the site": DOKU
// ships a script that renders the same payment page as an overlay here,
// driven by the SAME url the redirect would have used.
//
// What does not change, whichever way it renders:
//   - the cart is NOT cleared here. Starting a payment is not paying; a guest
//     who backs out must still have their trip. My Trips clears it once the
//     server says the money cleared.
//   - nothing the browser claims on the way back is trusted. The page asks the
//     server what actually happened.
//
// The script is fetched only when a guest actually pays on this rail, so no
// other page carries its weight - the same rule that keeps TOUR_CONTENT out of
// TripBar and LISTINGS out of PayWaiting.
function loadScript(src) {
  return new Promise((resolve, reject) => {
    const had = document.querySelector(`script[data-doku="${src}"]`);
    if (had) {
      if (had.dataset.ready === '1') return resolve();
      had.addEventListener('load', () => resolve());
      had.addEventListener('error', () => reject(new Error('script failed')));
      return;
    }
    const el = document.createElement('script');
    el.src = src;
    el.async = true;
    el.dataset.doku = src;
    el.addEventListener('load', () => { el.dataset.ready = '1'; resolve(); });
    el.addEventListener('error', () => reject(new Error('script failed')));
    document.head.appendChild(el);
  });
}

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

      // Overlay first. If anything about it is not available - script blocked,
      // offline, an ad blocker, a DOKU change - fall through to the full
      // navigation, which is the same payment and was the only path until now.
      // A guest must never be left holding a button that does nothing.
      if (d.checkout_js) {
        try {
          await loadScript(d.checkout_js);
          if (typeof window.loadJokulCheckout === 'function') {
            window.loadJokulCheckout(d.url);
            setBusy(false);
            return;
          }
        } catch {
          /* falls through to the redirect below */
        }
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
        DOKU's secure payment opens here - bank transfer, QRIS or e-wallet.
      </p>
      {err ? <p className="mt-2 text-small text-err">{err}</p> : null}
    </div>
  );
}
