'use client';

import { useEffect, useRef } from 'react';

// Shared dialog behaviour for Modal and ModalPresence: focus the box, trap Tab, Escape closes topmost only, restore focus.

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]):not([type="hidden"]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

// Open dialogs, oldest first. Only the last one answers Escape and Tab.
const stack = [];

function visible(el) { return el.getClientRects().length > 0 && getComputedStyle(el).visibility !== 'hidden'; }

export default function useDialog({ shown, onClose, escape = true }) {
  const ref = useRef(null);
  const closeRef = useRef(onClose);
  closeRef.current = onClose;

  useEffect(() => {
    if (!shown) return undefined;
    const node = ref.current;
    if (!node) return undefined;

    const opener = document.activeElement;
    const token = {};
    stack.push(token);

    if (!node.hasAttribute('tabindex')) node.setAttribute('tabindex', '-1');
    // Retry focus after a frame: a shell still visibility:hidden on the first frame refuses focus.
    function focusBox() { node.focus({ preventScroll: true }); return document.activeElement === node; }
    let raf = 0;
    let timer = 0;
    if (!focusBox()) {
      raf = requestAnimationFrame(() => { if (!focusBox()) timer = setTimeout(focusBox, 120); });
    }

    function onKey(e) {
      if (stack[stack.length - 1] !== token) return;

      if (e.key === 'Escape') {
        if (!escape || e.defaultPrevented) return;
        // A Select / Overlay popup handles its own Escape first.
        if (document.querySelector('[data-portal][data-open]')) return;
        closeRef.current?.();
        return;
      }

      if (e.key !== 'Tab') return;
      const focused = document.activeElement;
      // Focus inside a portaled popup (a Select list) is fine - leave it alone.
      if (focused && !node.contains(focused) && focused.closest && focused.closest('[data-portal]')) return;

      const items = Array.from(node.querySelectorAll(FOCUSABLE)).filter(visible);
      if (!items.length) {
        e.preventDefault();
        node.focus({ preventScroll: true });
        return;
      }
      const first = items[0];
      const last = items[items.length - 1];
      if (!node.contains(focused) || focused === node) {
        e.preventDefault();
        (e.shiftKey ? last : first).focus();
      } else if (e.shiftKey && focused === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && focused === last) {
        e.preventDefault();
        first.focus();
      }
    }

    document.addEventListener('keydown', onKey);
    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(timer);
      document.removeEventListener('keydown', onKey);
      const at = stack.indexOf(token);
      if (at >= 0) stack.splice(at, 1);
      if (opener && opener !== document.body && document.contains(opener) && opener.focus) {
        opener.focus({ preventScroll: true });
      }
    };
  }, [shown, escape]);

  return ref;
}
