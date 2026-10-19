'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import { ChatLauncher as LauncherButton } from '@cahyana/ui';

const ChatWindow = dynamic(() => import('./ChatWindow'), { ssr: false });

export default function ChatLauncher({ className = '' }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isTouched, setIsTouched] = useState(false);

  return (
    <>
      <LauncherButton
        className={className}
        open={isOpen}
        onClick={() => {
          setIsTouched(true);
          setIsOpen((wasOpen) => !wasOpen);
        }}
      />
      {isTouched && <ChatWindow open={isOpen} onClose={() => setIsOpen(false)} />}
    </>
  );
}
