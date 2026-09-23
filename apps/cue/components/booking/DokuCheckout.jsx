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

// Make DOKU's overlay look like it belongs to this site.
//
// The payment page itself is DOKU's, in a cross-origin iframe, and nothing here
// can style its inside - that is the same browser rule that keeps card details
// away from us and this server out of PCI scope. What DOKU's script DOES put in
// our page is the shell around it: a backdrop and a container. Those are ours.
//
// It is adopted by watching what appears rather than by guessing DOKU's class
// names: a selector that stops matching after one of their releases is dead CSS
// that fails silently, which is exactly the failure this repo keeps getting
// bitten by. Anything new at the top of <body> gets our tokens; if nothing
// appears, nothing happens.
function adoptShell(before) {
  const added = [...document.body.children].filter((el) => !before.has(el));
  for (const el of added) {
    if (el.tagName === 'SCRIPT' || el.tagName === 'STYLE') continue;
    el.dataset.dokuShell = '1';
    const cs = getComputedStyle(el);
    // The backdrop is the full-bleed layer; the container is the panel. Telling
    // them apart by SHAPE rather than by name survives a rename too.
    const wide = el.offsetWidth >= window.innerWidth - 2;
    if (wide) {
      // Same scrim the site's own modals use, so two dimmed layers never read
      // as two different weights of "this is a dialog".
      el.style.background = 'rgba(34,32,28,0.55)';
      el.style.backdropFilter = 'blur(2px)';
    }
    const frame = el.tagName === 'IFRAME' ? el : el.querySelector('iframe');
    if (frame) {
      frame.style.borderRadius = 'var(--r-xl)';
      frame.style.border = '0';
      // Modal elevation, the site's token - not a shadow invented here.
      frame.style.boxShadow = 'var(--shadow-xl)';
      if (cs.position === 'fixed' || cs.position === 'absolute') el.style.borderRadius = 'var(--r-xl)';
    }
  }
  return added.length;
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
            const before = new Set(document.body.children);
            window.loadJokulCheckout(d.url);
            // The script builds its shell synchronously in the versions we have
            // seen, but a frame of slack costs nothing and covers the case where
            // it does not.
            adoptShell(before);
            requestAnimationFrame(() => adoptShell(before));
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
