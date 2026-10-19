'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import { MessageCircle } from 'lucide-react';

const ChatPanel = dynamic(() => import('./ChatPanel'), { ssr: false });

export default function ChatLauncher({ className, label, iconClass = 'w-5 h-5' }) {
  const [open, setOpen] = useState(false);
  const [touched, setTouched] = useState(false);

  return (
    <>
      <button
        type="button"
        className={className}
        aria-label="Chat with us"
        aria-expanded={open}
        onClick={() => {
          setTouched(true);
          setOpen((wasOpen) => !wasOpen);
        }}
      >
        <MessageCircle className={iconClass} strokeWidth={1.6} aria-hidden="true" />
        {label}
      </button>
      {touched && <ChatPanel open={open} onClose={() => setOpen(false)} />}
    </>
  );
}
