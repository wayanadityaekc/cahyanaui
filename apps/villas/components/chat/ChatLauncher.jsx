'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import { ChatLauncher as LauncherButton } from '@cahyana/ui';

const ChatWindow = dynamic(() => import('./ChatWindow'), { ssr: false });

export default function ChatLauncher({ className = '' }) {
  const [open, setOpen] = useState(false);
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
