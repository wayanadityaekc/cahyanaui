'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import { MessageCircle } from 'lucide-react';

// Chat panel loads on first open only; this button is on every page, so an eager import bloats every bundle.
const ChatPanel = dynamic(() => import('./ChatPanel'), { ssr: false });

// label + iconClass are for the app bottom bar; omitted, it renders the navbar version.
export default function ChatLauncher({ className, label, iconClass = 'w-5 h-5' }) {
  const [open, setOpen] = useState(false);
  // Stays mounted after the first open so closing can animate.
  const [touched, setTouched] = useState(false);

  return (
    <>
      <button
        type="button"
        className={className}
        aria-label="Chat with us"
        aria-expanded={open}
        onClick={() => { setTouched(true); setOpen((v) => !v); }}
      >
        <MessageCircle className={iconClass} strokeWidth={1.6} aria-hidden="true" />
        {label}
      </button>
      {touched && <ChatPanel open={open} onClose={() => setOpen(false)} />}
    </>
  );
}
