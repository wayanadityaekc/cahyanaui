'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import { ChatLauncher as LauncherButton } from '@cahyana/ui';

// The chat loads on first open only; the icon is on every page, so an eager import would bloat every bundle.
const ChatWindow = dynamic(() => import('./ChatWindow'), { ssr: false });

// Navbar chat icon: opens the live chat in place (CUE's pattern); WhatsApp is a switch inside the panel.
export default function ChatLauncher({ className = '' }) {
  const [open, setOpen] = useState(false);
  // Stays mounted after the first open, so the conversation survives a close and closing can animate.
  const [touched, setTouched] = useState(false);

  return (
    <>
      <LauncherButton
        className={className}
        open={open}
        onClick={() => { setTouched(true); setOpen((wasOpen) => !wasOpen); }}
      />
      {touched && <ChatWindow open={open} onClose={() => setOpen(false)} />}
    </>
  );
}
