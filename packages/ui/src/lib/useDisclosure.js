'use client';

import { useEffect, useId, useRef, useState } from 'react';

export default function useDisclosure() {
  const [open, setOpen] = useState(false);
  const boxRef = useRef(null);
  const triggerRef = useRef(null);
  const panelId = useId();

  useEffect(() => {
    if (!open) return undefined;
    function onDoc(event) {
      if (event.target.closest && event.target.closest('[data-portal]')) return;
      if (boxRef.current && !boxRef.current.contains(event.target)) setOpen(false);
    }
    function onKey(event) {
      if (event.key !== 'Escape') return;
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
