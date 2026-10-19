'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import { MessageCircle } from 'lucide-react';

const ICON_STROKE_WIDTH_LIGHT = 1.6;

const ChatPanel = dynamic(() => import('./ChatPanel'), { ssr: false });

export default function ChatLauncher({ className, label, iconClass = 'w-5 h-5' }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isTouched, setIsTouched] = useState(false);

  return (
    <>
      <button
        type="button"
        className={className}
        aria-label="Chat with us"
        aria-expanded={isOpen}
        onClick={() => {
          setIsTouched(true);
          setIsOpen((wasOpen) => !wasOpen);
        }}
      >
        <MessageCircle className={iconClass} strokeWidth={ICON_STROKE_WIDTH_LIGHT} aria-hidden="true" />
        {label}
      </button>
      {isTouched && <ChatPanel open={isOpen} onClose={() => setIsOpen(false)} />}
    </>
  );
}
