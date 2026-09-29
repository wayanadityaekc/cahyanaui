'use client';
import { useState } from 'react';
import { API_BASE } from '@/lib/constants';
import { BTN_SM } from '@/components/ui/btnClasses';

// Loads DOKU's checkout script on demand; never clears the cart here and never trusts what the browser reports back.
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

// Styles the backdrop/container DOKU injects by diffing body children, never by DOKU class names (they can change).
function adoptShell(before) {
  const added = [...document.body.children].filter((el) => !before.has(el));
  added.forEach((el) => {
    if (el.tagName === 'SCRIPT' || el.tagName === 'STYLE') return;
    el.dataset.dokuShell = '1';
    const cs = getComputedStyle(el);
    // Tell backdrop from panel by shape (full-width or not), not by name, so a DOKU rename can't break it.
    const wide = el.offsetWidth >= window.innerWidth - 2;
    if (wide) {
      // Same scrim colour as the site's own modals.
      el.style.background = 'rgba(34,32,28,0.55)';
      el.style.backdropFilter = 'blur(2px)';
    }
    const frame = el.tagName === 'IFRAME' ? el : el.querySelector('iframe');
    if (frame) {
      frame.style.borderRadius = 'var(--r-xl)';
      frame.style.border = '0';
      if (cs.position === 'fixed' || cs.position === 'absolute') el.style.borderRadius = 'var(--r-xl)';
    }
  });
  return added.length;
}

export default function DokuCheckout({ bookingRef, option, amountText }) {
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState('');

  async function go() {
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
        // A switched-off rail says so instead of sending the guest to a page that won't load.
        setErr(
          d && d.code === 'not_ready'
            ? 'Card payments are not available right now. Please go back and choose PayPal, or contact us.'
            : (d && d.detail) || 'We could not start the payment. Please try again.',
        );
        setBusy(false);
        return;
      }

      // Try the overlay first; on any failure fall through to full navigation so the pay button never dead-ends.
      if (d.checkout_js) {
        try {
          await loadScript(d.checkout_js);
          if (typeof window.loadJokulCheckout === 'function') {
            const before = new Set(document.body.children);
            window.loadJokulCheckout(d.url);
            // Adopt the shell now and again next frame in case DOKU builds it asynchronously.
            adoptShell(before);
            requestAnimationFrame(() => adoptShell(before));
            setBusy(false);
            return;
          }
        } catch (e) {
          /* falls through to the redirect below */
        }
      }
      // Same-tab navigation, not a new tab, so a popup blocker can't swallow the payment page.
      window.location.href = d.url;
    } catch (e) {
      setErr('We could not reach the payment page. Please check your connection and try again.');
      setBusy(false);
    }
  }

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
        DOKU's secure payment opens here - card, QRIS, bank transfer or e-wallet, charged in rupiah.
      </p>
      {err ? <p className="mt-2 text-small text-err">{err}</p> : null}
    </div>
  );
}
