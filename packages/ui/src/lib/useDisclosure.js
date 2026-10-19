'use client';

import { useEffect, useId, useRef, useState } from 'react';

export default function useDisclosure() {
  const [isOpen, setIsOpen] = useState(false);
  const boxRef = useRef(null);
  const triggerRef = useRef(null);
  const panelId = useId();

  useEffect(() => {
    if (!isOpen) return undefined;
    function handleOutsidePointerDown(event) {
      if (event.target.closest && event.target.closest('[data-portal]')) return;
      if (boxRef.current && !boxRef.current.contains(event.target)) setIsOpen(false);
    }
    function handleEscapeKeyDown(event) {
      if (event.key !== 'Escape') return;
      if (document.querySelector('[data-portal="select"][data-open]')) return;
      setIsOpen(false);
      if (triggerRef.current) triggerRef.current.focus();
    }
    document.addEventListener('click', handleOutsidePointerDown);
    document.addEventListener('keydown', handleEscapeKeyDown);
    return () => {
      document.removeEventListener('click', handleOutsidePointerDown);
      document.removeEventListener('keydown', handleEscapeKeyDown);
    };
  }, [isOpen]);

  return { open: isOpen, setOpen: setIsOpen, boxRef, triggerRef, panelId };
}
