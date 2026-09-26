'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import { MessageCircle } from 'lucide-react';

// The panel is loaded only when somebody opens it. This button sits in the
// navbar, which is on EVERY page, so importing the panel here eagerly would
// put the whole listings dataset and the answer engine into every page's
// bundle for a feature most visitors never open. Same lesson as TripBar and
// TOUR_CONTENT.
const ChatPanel = dynamic(() => import('./ChatPanel'), { ssr: false });

// `label` + `iconClass` exist for the app bottom bar, which needs a caption
// under a larger glyph. Left out, this renders exactly what the navbar has
// always rendered - so the navbar copy is untouched.
export default function ChatLauncher({ className, label, iconClass = 'w-5 h-5' }) {
  const [open, setOpen] = useState(false);
  // Stays mounted after the first open so closing can animate instead of
  // vanishing - the same reason the date panels stay in the tree.
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
