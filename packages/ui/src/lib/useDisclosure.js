'use client';

import { useEffect, useId, useRef, useState } from 'react';

// A disclosure (button + panel, not role=menu): outside click and Escape close it, Escape returns focus to the trigger.
export default function useDisclosure() {
  const [open, setOpen] = useState(false);
  const boxRef = useRef(null);
  const triggerRef = useRef(null);
  const panelId = useId();

  useEffect(() => {
    if (!open) return undefined;
    function onDoc(e) {
      // A Select's list is portaled to <body>; picking an option there must not close this panel.
      if (e.target.closest && e.target.closest('[data-portal]')) return;
      if (boxRef.current && !boxRef.current.contains(e.target)) setOpen(false);
    }
    function onKey(e) {
      if (e.key !== 'Escape') return;
      // An open Select popup takes this Escape to close itself first.
      if (document.querySelector('[data-portal="select"][data-open]')) return;
      setOpen(false);
      if (triggerRef.current) triggerRef.current.focus();
    }
    document.addEventListener('click', onDoc);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('click', onDoc);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  return { open, setOpen, boxRef, triggerRef, panelId };
}
