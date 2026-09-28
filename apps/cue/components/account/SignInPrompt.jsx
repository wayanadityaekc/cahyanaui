'use client';

import { useState } from 'react';
import AuthModal from './AuthModal';
import { BTN_CTA } from '@/components/ui/btnClasses';

// Shared logged-out empty state (Sep 2026, Wayan: "match it to My Trips's
// shape, then upgrade both together"). Before this, Settings was a bare
// unstyled <p>Sign in to manage your details.</p> with no button anywhere on
// the page, and My Trips had the right shape (a lead line + a sub line,
// centered) but no button either - it just told the guest to go open the
// account menu instead of giving them one here.
//
// One component, not two pages copying the same three class strings: the
// SHAPE (lead, sub, button, and now the modal itself) is what has to stay
// identical between them, and a shared component is what stops that from
// drifting apart, the same reasoning DetailHero/FormHero/RailLayout give in
// CLAUDE.md for the "shared component vs shared strings" call.
//
// Self-contained: owns its own AuthModal open state, so a caller just drops
// <SignInPrompt lead="…" sub="…" /> and doesn't wire anything.
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
