'use client';

import { ChevronDown, LogOut, UserRound } from 'lucide-react';
import { cn } from '../lib/cn.js';
import { BTN_SM } from '../primitives/btnClasses.js';
import { MENU_ROW_BOX } from './navbarClasses.js';
import usePopover, { POP_PANEL, popState } from './usePopover.js';

/**
 * The account slot at the far right of the navbar (ported from CUE, WO1, approved
 * 28 Sep 2026). Presentational: the site owns the session and hands it in.
 *
 *   account    { name, email } | null
 *   pending    true until the site knows whether there is a session - the slot keeps
 *              its space but paints nothing, or a signed-in guest sees "Log in" flash
 *   onLogin    () => void - open the site's sign-in
 *   onLogout   () => void
 *   items      [{ href, label, icon }] - rows between the header and Sign out.
 *              CUE passes Settings only: My Trips is deliberately NOT here (Wayan) -
 *              the cart icon in the bar is the way in.
 *   prefs      node - desktop-only block in the menu (CUE: Guests / Pickup / Currency,
 *              which live in the drawer on phones). When given, "Log in" on desktop
 *              opens the menu (Log in button + prefs) instead of going straight to
 *              onLogin, because the prefs have nowhere else to live on desktop.
 *   loginTitle / loginSub   the two lines above the Log in button in that menu
 *   linkAs     the link component; defaults to 'a'
 *
 * Phones: a bare icon sized like the chat + cart icons - a person when signed out
 * (tap = onLogin), the initials circle when signed in. Desktop: a bordered "Log in",
 * or initials + first name + chevron. No photo upload: initials only.
 *
 * Shape = the standard user dropdown (shadcn DropdownMenu / Flowbite "user menu"):
 * name + email, separator, items, separator, Sign out. No code taken from either.
 */
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

const ROW = `${MENU_ROW_BOX} text-small font-medium text-gold no-underline bg-transparent border-none cursor-pointer font-body hover:bg-cream`;

// Below 993px the desktop button shape is stripped back to a bare icon.
const PHONE = 'max-[992px]:h-auto max-[992px]:p-0 max-[992px]:border-none max-[992px]:bg-transparent max-[992px]:hover:bg-transparent';

export default function AccountMenu({
  account = null,
  pending = false,
  onLogin = () => {},
  onLogout = () => {},
  items = [],
  prefs = null,
  loginTitle = 'Plan your Bali trip',
  loginSub = 'Sign in with your email. No password needed.',
  linkAs: Link = 'a',
  className,
}) {
  const { open, setOpen, ref } = usePopover();
  const prefsBlock = prefs ? (
    <div className="max-[992px]:hidden px-3 pt-3 pb-3 [border-top:1px_solid_var(--line)] mt-1">{prefs}</div>
  ) : null;

  if (!account) {
    const isDesktop = () => typeof window !== 'undefined' && window.matchMedia('(min-width: 993px)').matches;
    return (
      <div className={cn('relative', pending && 'invisible', className)} ref={ref} data-account-slot="out">
        <button
          type="button"
          aria-haspopup={prefs ? 'menu' : undefined}
          aria-expanded={prefs ? open : undefined}
          aria-label="Log in"
          onClick={() => (prefs && isDesktop() ? setOpen((v) => !v) : onLogin())}
          className={cn(
            'inline-flex items-center h-[var(--btn-h)] px-3 rounded-sm [border:1px_solid_var(--line)] bg-surface-raised',
            'text-small font-semibold font-body text-gold cursor-pointer whitespace-nowrap hover:bg-cream',
            '[transition:background-color_var(--dur)_var(--ease),scale_var(--dur-fast)_var(--ease)]',
            PHONE,
          )}
        >
          <span className="max-[992px]:hidden">Log in</span>
          <UserRound className="min-[993px]:hidden w-5 h-5" strokeWidth={1.6} aria-hidden="true" />
        </button>
        {prefs ? (
          <div role="menu" className={cn(POP_PANEL, 'right-0 top-[calc(100%+var(--space-1))] w-[18rem]', popState(open))}>
            <div className="px-3 pt-2 pb-3">
              <b className="block text-small font-semibold text-gold">{loginTitle}</b>
              <span className="block text-small text-muted mb-3">{loginSub}</span>
              <button
                type="button"
                className={cn('flex w-full', BTN_SM, 'font-body border-none text-white bg-cta cursor-pointer hover:bg-cta-d')}
                onClick={() => { setOpen(false); onLogin(); }}
              >
                Log in
              </button>
            </div>
            {prefsBlock}
          </div>
        ) : null}
      </div>
    );
  }

  const first = firstNameOf(account.name, account.email);
  return (
    <div className={cn('relative', className)} ref={ref} data-account-slot="in">
      <button
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label={`Account menu for ${first}`}
        onClick={() => setOpen((v) => !v)}
        className={cn(
          'inline-flex items-center gap-2 bg-transparent border-none p-0 cursor-pointer font-body text-small font-semibold text-gold hover:text-gold-d',
          '[transition:color_var(--dur)_var(--ease),scale_var(--dur-fast)_var(--ease)]',
          PHONE,
        )}
      >
        <span
          className="w-[30px] h-[30px] max-[992px]:w-[28px] max-[992px]:h-[28px] rounded-[50%] bg-gold text-white grid place-items-center text-label font-semibold tracking-[0.02em]"
          aria-hidden="true"
        >
          {initialsOf(account.name, account.email)}
        </span>
        <span className="max-[992px]:hidden max-w-[9rem] overflow-hidden text-ellipsis whitespace-nowrap">{first}</span>
        <ChevronDown
          className={cn('max-[992px]:hidden w-[var(--icon-sm)] h-[var(--icon-sm)] transition-[rotate] duration-200', open && 'rotate-180')}
          strokeWidth={1.8}
          aria-hidden="true"
        />
      </button>
      <div role="menu" className={cn(POP_PANEL, 'right-0 top-[calc(100%+var(--space-1))] w-[15rem] min-[993px]:w-[18rem]', popState(open))}>
        <div className="px-3 pt-2 pb-3 [border-bottom:1px_solid_var(--line)] mb-1">
          <b className="block text-small font-semibold text-gold overflow-hidden text-ellipsis whitespace-nowrap">{account.name || first}</b>
          <span className="block text-small text-muted overflow-hidden text-ellipsis whitespace-nowrap">{account.email}</span>
        </div>
        {items.map((it) => (
          <Link key={it.href} role="menuitem" href={it.href} className={ROW}>
            {it.icon}
            {it.label}
          </Link>
        ))}
        {prefsBlock}
        <div className="[border-top:1px_solid_var(--line)] mt-1 pt-1">
          <button role="menuitem" type="button" className={ROW} onClick={() => { setOpen(false); onLogout(); }}>
            <LogOut strokeWidth={1.7} aria-hidden="true" />
            Sign out
          </button>
        </div>
      </div>
    </div>
  );
}
