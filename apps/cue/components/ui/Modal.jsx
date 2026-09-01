'use client';

import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

export default function Modal({ open, onClose, title, children, className = '' }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === 'Escape' && onClose && onClose();
    document.addEventListener('keydown', onKey);
    document.body.classList.add('hs-locked');
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.classList.remove('hs-locked');
    };
  }, [open, onClose]);

  if (!mounted) return null;

  return createPortal(
    <div
      className={`modal${open ? ' active' : ''} ${className}`.trim()}
      onClick={(e) => e.target === e.currentTarget && onClose && onClose()}
      role="dialog"
      aria-modal="true"
      aria-label={title}
    >
      <div className="modal__box">
        <button type="button" className="modal__close" aria-label="Close" onClick={onClose}>
          &times;
        </button>
        {title && <h3 className="modal__title">{title}</h3>}
        {children}
      </div>
    </div>,
    document.body,
  );
}
