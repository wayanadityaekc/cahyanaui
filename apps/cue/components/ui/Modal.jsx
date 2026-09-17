'use client';

import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import clsx from 'clsx';
import useBodyLock from './useBodyLock';

export default function Modal({ open, onClose, title, children, className = '' }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === 'Escape' && onClose && onClose();
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  useBodyLock(open);

  if (!mounted) return null;

  // Tailwind-native (migrasi Fase 2): shell modal (.modal/.modal__box/close/logo/
  // title) -> utilities. `.modal*` CSS TETEP di style.css karena masih dipakai
  // modal inline lain (ReviewModal/BookConfirmModal) + konten modal lain - baru
  // dihapus kalau SEMUA pemakai .modal* udah di-convert.
  return createPortal(
    <div
      className={clsx(
        'fixed inset-0 z-[200] flex items-center justify-center p-6 bg-[rgba(0,0,0,0.55)] transition-[opacity,visibility] duration-300 ease-[ease] motion-reduce:transition-none',
        open ? 'opacity-100 visible pointer-events-auto' : 'opacity-0 invisible pointer-events-none',
        className,
      )}
      onClick={(e) => e.target === e.currentTarget && onClose && onClose()}
      role="dialog"
      aria-modal="true"
      aria-label={title}
    >
      <div className={`relative w-full max-w-[420px] max-h-[90vh] overflow-y-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden p-8 rounded-md bg-white transition-[opacity,transform] duration-[0.36s] ease-[var(--ease-out)] motion-reduce:transition-none ${open ? 'opacity-100 [transform:translateY(0)_scale(1)]' : 'opacity-0 [transform:translateY(14px)_scale(0.96)]'}`}>
        <button type="button" className="absolute top-3 right-4 text-[1.6rem] leading-none text-green bg-transparent border-none cursor-pointer" aria-label="Close" onClick={onClose}>
          &times;
        </button>
        <img
          className="block h-[38px] w-auto mx-auto mb-[1.1rem]"
          src="/assets/images/logo.webp"
          alt="The Cahyana Logo"
          width="1005"
          height="324"
        />
        {title && <h3 className="mb-5 font-body text-h3 text-center font-semibold tracking-normal">{title}</h3>}
        {children}
      </div>
    </div>,
    document.body,
  );
}
