'use client';

import { createPortal } from 'react-dom';
import { buildOverlayClass } from './hsClasses';
import useBodyLock from './useBodyLock';

export default function Overlay({ open, elevated = false, onClose }) {
  useBodyLock(open);

  if (typeof document === 'undefined') return null;
  return createPortal(
    <div className={buildOverlayClass(open, elevated)} data-portal="overlay" onClick={onClose} />,
    document.body,
  );
}
