'use client';

import { ChevronDown, LogOut, UserRound } from 'lucide-react';
import { cn } from '../lib/cn.js';
import useDisclosure from '../lib/useDisclosure.js';
import PopPanel from './PopPanel.jsx';
import Button from '../primitives/Button.jsx';
import Separator from '../primitives/Separator.jsx';
import {
  ACCOUNT_AVATAR,
  ACCOUNT_AVATAR_BTN,
  ACCOUNT_ICON_BTN,
  ACCOUNT_LOGIN,
  ACCOUNT_PANEL,
  ACCOUNT_ROW,
  NAV_CHEVRON,
} from './navbarClasses.js';

// Two letters for the avatar: first + last name, else the start of the name or email.
export function initialsOf(name, email) {
  const source = (name || '').trim() || (email || '').split('@')[0] || '';
  const parts = source.split(/\s+/).filter(Boolean);
  const letters = parts.length > 1 ? `${parts[0][0]}${parts[parts.length - 1][0]}` : source.slice(0, 2);
  return letters.toUpperCase() || '?';
}

export function firstNameOf(name, email) {
  const first = (name || '').trim().split(/\s+/)[0];
  return first || (email || '').split('@')[0] || 'Account';
}

// The navbar's account slot (CUE's WO1 AccountMenu); the site passes the account, the handlers and its own fields.
export default function AccountMenu({
  account = null,
  hydrated = true,
  onLogin = () => {},
  onLogout = () => {},
  prefs = null,
  rows = [],
  loginTitle = '',
  loginNote = '',
  linkAs = 'a',
  pop = null,
}) {
  const Link = linkAs;
  const { open, setOpen, boxRef, triggerRef, panelId } = useDisclosure();

  // Guests/Currency live in the desktop menu only; on a phone the drawer holds them.
  const prefsBlock = prefs ? (
    <div className="max-[992px]:hidden mt-1">
      <Separator />
      <div className="px-3 pt-3 pb-3">{prefs}</div>
    </div>
  ) : null;

  if (!account) {
    return (
      // Hidden until the session check answers, so a signed-in guest never sees "Log in" flash.
      <div className={cn('relative', !hydrated && 'invisible')} ref={boxRef} data-account-slot="out">
        <button type="button" className={ACCOUNT_ICON_BTN} aria-label="Log in" onClick={onLogin}>
          <UserRound className="w-5 h-5" strokeWidth={1.6} aria-hidden="true" />
        </button>
        <button
          type="button"
          ref={triggerRef}
          className={ACCOUNT_LOGIN}
          aria-expanded={open}
          aria-controls={panelId}
          onClick={() => setOpen((wasOpen) => !wasOpen)}
        >
          Log in
        </button>
        <PopPanel pop={pop} open={open} id={panelId} className={cn(ACCOUNT_PANEL, 'w-[18rem]')}>
          <div className="px-3 pt-2 pb-3">
            {loginTitle ? <b className="block text-small font-semibold text-gold">{loginTitle}</b> : null}
            {loginNote ? <span className="block text-small text-muted mb-3">{loginNote}</span> : null}
            <Button full onClick={() => { setOpen(false); onLogin(); }}>Log in</Button>
          </div>
          {prefsBlock}
        </PopPanel>
      </div>
    );
  }

  const first = firstNameOf(account.name, account.email);
  return (
    <div className="relative" ref={boxRef} data-account-slot="in">
      <button
        type="button"
        ref={triggerRef}
        className={ACCOUNT_AVATAR_BTN}
        aria-expanded={open}
        aria-controls={panelId}
        aria-label={`Account menu for ${first}`}
        onClick={() => setOpen((wasOpen) => !wasOpen)}
      >
        <span className={ACCOUNT_AVATAR} aria-hidden="true">{initialsOf(account.name, account.email)}</span>
        <span className="max-[992px]:hidden max-w-[9rem] overflow-hidden text-ellipsis whitespace-nowrap">{first}</span>
        <ChevronDown className={cn('max-[992px]:hidden', NAV_CHEVRON, open && 'rotate-180')} strokeWidth={1.8} aria-hidden="true" />
      </button>
      <PopPanel pop={pop} open={open} id={panelId} className={cn(ACCOUNT_PANEL, 'w-[15rem] min-[993px]:w-[18rem]')}>
        <div className="px-3 pt-2 pb-3">
          <b className="block text-small font-semibold text-gold overflow-hidden text-ellipsis whitespace-nowrap">{account.name || first}</b>
          <span className="block text-small text-muted overflow-hidden text-ellipsis whitespace-nowrap">{account.email}</span>
        </div>
        <Separator className="mb-1" />
        {rows.map((row) => (
          <Link key={row.href} href={row.href} className={ACCOUNT_ROW} onClick={() => setOpen(false)}>
            {row.icon}
            {row.label}
          </Link>
        ))}
        {prefsBlock}
        <Separator className="mt-1" />
        <div className="pt-1">
          <button type="button" className={ACCOUNT_ROW} onClick={() => { setOpen(false); onLogout(); }}>
            <LogOut strokeWidth={1.7} aria-hidden="true" />
            Sign out
          </button>
        </div>
      </PopPanel>
    </div>
  );
}
