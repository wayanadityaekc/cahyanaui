'use client';

import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { overlay } from './hsClasses';

export default function Overlay({ open, elevated = false, onClose }) {
  useEffect(() => {
    if (!open) return;
    document.body.classList.add('hs-locked');
    return () => document.body.classList.remove('hs-locked');
  }, [open]);

  if (typeof document === 'undefined') return null;
  return createPortal(
    <div
      className={overlay(open, elevated)}
      data-portal="overlay"
      onClick={onClose}
    />,
    document.body,
  );
}
