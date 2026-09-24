'use client';

import { createPortal } from 'react-dom';
import { overlay } from './controlClasses.js';
import useBodyLock from '../lib/useBodyLock.js';

export default function Overlay({ open, elevated = false, onClose }) {
  useBodyLock(open);

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
