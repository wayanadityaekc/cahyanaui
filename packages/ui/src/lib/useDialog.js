'use client';

import { useEffect, useRef } from 'react';

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]):not([type="hidden"]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

const stack = [];

function isNodeVisible(node) {
  return node.getClientRects().length > 0 && getComputedStyle(node).visibility !== 'hidden';
}

export default function useDialog({ shown = false, onClose = null, escape = true } = {}) {
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
    function focusBox() {
      node.focus({ preventScroll: true });
      return document.activeElement === node;
    }
    let raf = 0;
    let timer = 0;
    if (!focusBox()) {
      raf = requestAnimationFrame(() => {
        if (!focusBox()) timer = setTimeout(focusBox, 120);
      });
    }

    function handleEscapeKeyDown(event) {
      if (stack[stack.length - 1] !== token) return;

      if (event.key === 'Escape') {
        if (!escape || event.defaultPrevented) return;
        if (document.querySelector('[data-portal][data-open]')) return;
        closeRef.current?.();
        return;
      }

      if (event.key !== 'Tab') return;
      const focused = document.activeElement;
      if (focused && !node.contains(focused) && focused.closest && focused.closest('[data-portal]')) return;

      const items = Array.from(node.querySelectorAll(FOCUSABLE)).filter(isNodeVisible);
      if (!items.length) {
        event.preventDefault();
        node.focus({ preventScroll: true });
        return;
      }
      const first = items[0];
      const last = items[items.length - 1];
      if (!node.contains(focused) || focused === node) {
        event.preventDefault();
        (event.shiftKey ? last : first).focus();
      } else if (event.shiftKey && focused === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && focused === last) {
        event.preventDefault();
        first.focus();
      }
    }

    document.addEventListener('keydown', handleEscapeKeyDown);
    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(timer);
      document.removeEventListener('keydown', handleEscapeKeyDown);
      const index = stack.indexOf(token);
      if (index >= 0) stack.splice(index, 1);
      if (opener && opener !== document.body && document.contains(opener) && opener.focus) {
        opener.focus({ preventScroll: true });
      }
    };
  }, [shown, escape]);

  return ref;
}
