'use client';

import { useEffect, useId, useRef, useState } from 'react';
import { ChevronDown, LogOut, Settings, UserRound } from 'lucide-react';
import { useAccount } from '@/state/AccountProvider';
import { PopMenu } from '@/components/ui/Reveal';
import { MENU_ROW_BOX } from '@/components/ui/railClasses';
import TripPrefsFields from './TripPrefsFields';
import { BTN_CTA } from '@/components/ui/btnClasses';
import Separator from '@/components/ui/Separator';

// ACCOUNT SLOT - far right of the navbar at every width (WO1, Sep 2026).
// One slot, two states: logged out = "Log in"; logged in = initials circle
// (+ first name on desktop) that opens a small menu: Settings, Sign out.
//
// DESKTOP ALSO CARRIES GUESTS / PICKUP / CURRENCY (Wayan: prefs go in the account
// menu). Desktop has no drawer any more, so this is their only home there - which is
// why on desktop the logged-out "Log in" opens the menu too (Log in button + prefs)
// instead of jumping straight to the modal. Phones keep the prefs in the drawer, so
// there the menu has none and "Log in" goes straight to the modal.
//
// Shape borrowed from the standard user dropdown (shadcn DropdownMenu / Flowbite
// "user menu"): header with name + email, separator, items, separator, sign out.
// Rebuilt in Cahyana tokens - no library code, no dependency.
//
// PHONES: a bare icon at the far right, sized like the chat + cart icons next to it
// - a person icon logged out, the initials circle logged in. (It was half of a
// [ burger | account ] pill for one round; Wayan moved the burger to the left of the
// logo, 28 Sep 2026.) `PHONE` strips the desktop button shape below 993px.
// NO My Trips row in the menu (Wayan, 28 Sep 2026) - the cart icon in the bar is it.
//
// DISCLOSURE, NOT A MENU (WO7 fix 2, Wayan 29 Sep 2026). The trigger is a button with
// aria-expanded + aria-controls and the panel is a plain group of links and buttons.
// It used to carry role="menu"/"menuitem", which promises arrow-key navigation the
// panel never had - a screen reader announced a menu that then did not behave like
// one. Links are reachable with Tab; Escape closes and puts focus back on the trigger.
//
// Floating panel rules (same as CatDropdown): solid bg + border, z-index, tap
// outside + Escape close it. The `relative` wrapper hugs the trigger (PopMenu
// containing-block trap - see CLAUDE.md).

const PHONE =
  'max-[992px]:h-auto max-[992px]:p-0 max-[992px]:border-none max-[992px]:bg-transparent max-[992px]:hover:bg-transparent';

const ROW = `${MENU_ROW_BOX} text-small font-medium text-gold no-underline bg-transparent border-none cursor-pointer font-body hover:bg-cream`;

export function initialsOf(name, email) {
  const src = (name || '').trim() || (email || '').split('@')[0] || '';
  const parts = src.split(/\s+/).filter(Boolean);
  const s = parts.length > 1 ? parts[0][0] + parts[parts.length - 1][0] : src.slice(0, 2);
  return s.toUpperCase() || '?';
}

export function firstNameOf(name, email) {
  const n = (name || '').trim().split(/\s+/)[0];
  return n || (email || '').split('@')[0] || 'Account';
}

export default function AccountMenu({ onLogin }) {
  const { account, hydrated, logout } = useAccount();
  const [open, setOpen] = useState(false);
  const boxRef = useRef(null);
  const btnRef = useRef(null);
  const panelId = useId();

  useEffect(() => {
    if (!open) return undefined;
    const onDoc = (e) => {
      // Select popups are portaled to <body>; picking an option must not close this menu.
      if (e.target.closest && e.target.closest('[data-portal]')) return;
      if (boxRef.current && !boxRef.current.contains(e.target)) setOpen(false);
    };
    const onKey = (e) => {
      if (e.key !== 'Escape') return;
      if (document.querySelector('[data-portal="select"][data-open]')) return;
      setOpen(false);
      btnRef.current?.focus();
    };
    document.addEventListener('click', onDoc);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('click', onDoc);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  // Until the session check answers, keep the slot's space but show nothing -
  // otherwise a signed-in guest sees "Log in" flash on every page load.
  const pending = !hydrated;

  const PREFS = (
    <div className="max-[992px]:hidden mt-1">
      <Separator />
      <div className="px-3 pt-3 pb-3">
        <TripPrefsFields idPrefix="menu" />
      </div>
    </div>
  );

  if (!account) {
    const isDesktop = () => typeof window !== 'undefined' && window.matchMedia('(min-width: 993px)').matches;
    return (
      <div className={`relative ${pending ? 'invisible' : ''}`} ref={boxRef} data-account-slot="out">
        <button
          type="button"
          ref={btnRef}
          aria-expanded={open}
          aria-controls={panelId}
          aria-label="Log in"
          onClick={() => (isDesktop() ? setOpen((v) => !v) : onLogin())}
          className={`inline-flex items-center h-[var(--btn-h)] px-3 rounded-sm border border-line bg-white text-small font-semibold font-body text-gold cursor-pointer whitespace-nowrap [transition:background-color_var(--dur)_var(--ease),scale_var(--dur-fast)_var(--ease)] hover:bg-cream ${PHONE}`}
        >
          <span className="max-[992px]:hidden">Log in</span>
          <UserRound className="min-[993px]:hidden w-5 h-5" strokeWidth={1.6} aria-hidden="true" />
        </button>
        <PopMenu open={open}>
          <div id={panelId} className="absolute right-0 top-[calc(100%+var(--space-1))] z-[130] w-[18rem] bg-white border border-line rounded-[var(--r-md)] p-[var(--space-1)]">
            <div className="px-3 pt-2 pb-3">
              <b className="block text-small font-semibold text-gold">Plan your Bali trip</b>
              <span className="block text-small text-muted mb-3">Sign in with your email. No password needed.</span>
              <button type="button" className={`flex w-full ${BTN_CTA}`} onClick={() => { setOpen(false); onLogin(); }}>Log in</button>
            </div>
            {PREFS}
          </div>
        </PopMenu>
      </div>
    );
  }

  const first = firstNameOf(account.name, account.email);
  return (
    <div className="relative" ref={boxRef} data-account-slot="in">
      <button
        type="button"
        ref={btnRef}
        aria-expanded={open}
        aria-controls={panelId}
        aria-label={`Account menu for ${first}`}
        onClick={() => setOpen((v) => !v)}
        className={`inline-flex items-center gap-2 bg-transparent border-none p-0 cursor-pointer font-body text-small font-semibold text-gold [transition:color_var(--dur)_var(--ease),background-color_var(--dur)_var(--ease),scale_var(--dur-fast)_var(--ease)] hover:text-gold-d ${PHONE}`}
      >
        <span className="w-[30px] h-[30px] max-[992px]:w-[28px] max-[992px]:h-[28px] rounded-[50%] bg-gold text-white grid place-items-center text-label font-semibold tracking-[0.02em]" aria-hidden="true">
          {initialsOf(account.name, account.email)}
        </span>
        <span className="max-[992px]:hidden max-w-[9rem] overflow-hidden text-ellipsis whitespace-nowrap">{first}</span>
        <ChevronDown className={`max-[992px]:hidden w-[var(--icon-sm)] h-[var(--icon-sm)] transition-[rotate] duration-200 ${open ? 'rotate-180' : ''}`} strokeWidth={1.8} aria-hidden="true" />
      </button>
      <PopMenu open={open}>
        <div id={panelId} className="absolute right-0 top-[calc(100%+var(--space-1))] z-[130] min-[993px]:w-[18rem] w-[15rem] bg-white border border-line rounded-[var(--r-md)] p-[var(--space-1)]">
          <div className="px-3 pt-2 pb-3">
            <b className="block text-small font-semibold text-gold overflow-hidden text-ellipsis whitespace-nowrap">{account.name || first}</b>
            <span className="block text-small text-muted overflow-hidden text-ellipsis whitespace-nowrap">{account.email}</span>
          </div>
          <Separator className="mb-1" />
          <a href="/settings.html" className={ROW}>
            <Settings strokeWidth={1.7} aria-hidden="true" />Settings
          </a>
          {PREFS}
          <Separator className="mt-1" />
          <div className="pt-1">
            <button type="button" className={ROW} onClick={() => { setOpen(false); logout(); }}>
              <LogOut strokeWidth={1.7} aria-hidden="true" />Sign out
            </button>
          </div>
        </div>
      </PopMenu>
    </div>
  );
}
