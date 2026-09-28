'use client';

import { useEffect, useRef, useState } from 'react';
import { ChevronDown, LogOut, Settings, ShoppingBag } from 'lucide-react';
import { useAccount } from '@/state/AccountProvider';
import { useItinerary } from '@/state/ItineraryProvider';
import { PopMenu } from '@/components/ui/Reveal';
import { MENU_ROW_BOX } from '@/components/ui/railClasses';

// ACCOUNT SLOT - far right of the navbar at every width (WO1, Sep 2026).
// One slot, two states: logged out = "Log in"; logged in = initials circle
// (+ first name on desktop) that opens a small menu: My Trips, Settings, Sign out.
//
// Shape borrowed from the standard user dropdown (shadcn DropdownMenu / Flowbite
// "user menu"): header with name + email, separator, items, separator, sign out.
// Rebuilt in Cahyana tokens - no library code, no dependency.
//
// Floating panel rules (same as CatDropdown): solid bg + border, z-index, tap
// outside + Escape close it. The `relative` wrapper hugs the trigger (PopMenu
// containing-block trap - see CLAUDE.md).

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
  const { count } = useItinerary();
  const [open, setOpen] = useState(false);
  const boxRef = useRef(null);

  useEffect(() => {
    if (!open) return undefined;
    const onDoc = (e) => { if (boxRef.current && !boxRef.current.contains(e.target)) setOpen(false); };
    const onKey = (e) => { if (e.key === 'Escape') setOpen(false); };
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

  if (!account) {
    return (
      <button
        type="button"
        data-account-slot="out"
        onClick={onLogin}
        className={`${pending ? 'invisible' : ''} inline-flex items-center h-[var(--btn-h)] px-3 rounded-sm border border-line bg-white text-small font-semibold font-body text-gold cursor-pointer whitespace-nowrap [transition:background-color_var(--dur)_var(--ease),scale_var(--dur-fast)_var(--ease)] hover:bg-cream max-[992px]:px-[0.6rem]`}
      >
        Log in
      </button>
    );
  }

  const first = firstNameOf(account.name, account.email);
  return (
    <div className="relative" ref={boxRef} data-account-slot="in">
      <button
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label={`Account menu for ${first}`}
        onClick={() => setOpen((v) => !v)}
        className="inline-flex items-center gap-2 bg-transparent border-none p-0 cursor-pointer font-body text-small font-semibold text-gold [transition:color_var(--dur)_var(--ease),scale_var(--dur-fast)_var(--ease)] hover:text-gold-d"
      >
        <span className="w-[30px] h-[30px] rounded-[50%] bg-gold text-white grid place-items-center text-label font-semibold tracking-[0.02em]" aria-hidden="true">
          {initialsOf(account.name, account.email)}
        </span>
        <span className="max-[992px]:hidden max-w-[9rem] overflow-hidden text-ellipsis whitespace-nowrap">{first}</span>
        <ChevronDown className={`max-[992px]:hidden w-[var(--icon-sm)] h-[var(--icon-sm)] transition-[rotate] duration-200 ${open ? 'rotate-180' : ''}`} strokeWidth={1.8} aria-hidden="true" />
      </button>
      <PopMenu open={open}>
        <div role="menu" className="absolute right-0 top-[calc(100%+var(--space-1))] z-[130] w-[15rem] bg-white border border-line rounded-[var(--r-md)] p-[var(--space-1)]">
          <div className="px-3 pt-2 pb-3 border-b border-line mb-1">
            <b className="block text-small font-semibold text-gold overflow-hidden text-ellipsis whitespace-nowrap">{account.name || first}</b>
            <span className="block text-small text-muted overflow-hidden text-ellipsis whitespace-nowrap">{account.email}</span>
          </div>
          <a role="menuitem" href="/my-trips.html" className={ROW}>
            <ShoppingBag strokeWidth={1.7} aria-hidden="true" />My Trips
            {count > 0 && <span className="ml-auto inline-flex items-center justify-center min-w-[18px] h-[18px] px-[5px] rounded-sm bg-ok text-white text-label font-semibold leading-none">{count}</span>}
          </a>
          <a role="menuitem" href="/settings.html" className={ROW}>
            <Settings strokeWidth={1.7} aria-hidden="true" />Settings
          </a>
          <div className="border-t border-line mt-1 pt-1">
            <button role="menuitem" type="button" className={ROW} onClick={() => { setOpen(false); logout(); }}>
              <LogOut strokeWidth={1.7} aria-hidden="true" />Sign out
            </button>
          </div>
        </div>
      </PopMenu>
    </div>
  );
}
