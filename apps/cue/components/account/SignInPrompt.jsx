'use client';

import { useState } from 'react';
import AuthModal from './AuthModal';
import { BTN_CTA } from '@/components/ui/btnClasses';

// Shared logged-out state (lead, sub, Sign in button + its own AuthModal) for Settings and My Trips.
const LEAD = 'font-head font-medium tracking-[-0.01em] text-[1rem] text-green m-0 mb-[0.4rem]';
const SUB = 'text-body text-muted max-w-[44ch] mx-auto mt-0 mb-[1.4rem]';

export default function SignInPrompt({ lead, sub, className = '' }) {
  const [open, setOpen] = useState(false);
  return (
    <div className={`text-center pt-2 px-0 pb-0 ${className}`}>
      <p className={LEAD}>{lead}</p>
      <p className={SUB}>{sub}</p>
      <button type="button" className={`inline-flex ${BTN_CTA}`} onClick={() => setOpen(true)}>Sign in</button>
      <AuthModal open={open} onClose={() => setOpen(false)} />
    </div>
  );
}
