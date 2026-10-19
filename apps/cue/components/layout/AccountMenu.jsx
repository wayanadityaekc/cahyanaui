'use client';

import { useEffect, useId, useRef, useState } from 'react';
import { ChevronDown, LogOut, Settings, UserRound } from 'lucide-react';
import { useAccount } from '@/state/AccountProvider';
import { PopMenu } from '@/components/ui/Reveal';
import { MENU_ROW_BOX } from '@/components/ui/railClasses';
import TripPrefsFields from './TripPrefsFields';
import { BTN_CTA } from '@/components/ui/btnClasses';
import Separator from '@/components/ui/Separator';

const ICON_STROKE_WIDTH_LIGHT = 1.6;
const ICON_STROKE_WIDTH_MEDIUM = 1.8;
const ICON_STROKE_WIDTH_REGULAR = 1.7;

const PHONE =
  'max-[992px]:h-auto max-[992px]:p-0 max-[992px]:border-none max-[992px]:bg-transparent max-[992px]:hover:bg-transparent';

const ROW = `${MENU_ROW_BOX} text-small font-medium text-gold no-underline bg-transparent border-none cursor-pointer font-body hover:bg-cream`;

export function buildInitials(name, email) {
  const src = (name || '').trim() || (email || '').split('@')[0] || '';
  const parts = src.split(/\s+/).filter(Boolean);
  const initials = parts.length > 1 ? parts[0][0] + parts[parts.length - 1][0] : src.slice(0, 2);
  return initials.toUpperCase() || '?';
}

export function extractFirstName(name, email) {
  const firstName = (name || '').trim().split(/\s+/)[0];
  return firstName || (email || '').split('@')[0] || 'Account';
}

export default function AccountMenu({ onLogin }) {
  const { account, hydrated, logout } = useAccount();
  const [isOpen, setIsOpen] = useState(false);
  const boxRef = useRef(null);
  const btnRef = useRef(null);
  const panelId = useId();

  useEffect(() => {
    if (!isOpen) return undefined;
    function handleDocumentClick(event) {
      if (event.target.closest && event.target.closest('[data-portal]')) return;
      if (boxRef.current && !boxRef.current.contains(event.target)) setIsOpen(false);
    }
    function handleKeyDown(event) {
      if (event.key !== 'Escape') return;
      if (document.querySelector('[data-portal="select"][data-open]')) return;
      setIsOpen(false);
      btnRef.current?.focus();
    }
    document.addEventListener('click', handleDocumentClick);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('click', handleDocumentClick);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  const isPending = !hydrated;

  const PREFS = (
    <div className="max-[992px]:hidden mt-1">
      <Separator />
      <div className="px-3 pt-3 pb-3">
        <TripPrefsFields idPrefix="menu" />
      </div>
    </div>
  );

  if (!account) {
    function isDesktop() {
      return typeof window !== 'undefined' && window.matchMedia('(min-width: 993px)').matches;
    }
    return (
      <div className={`relative ${isPending ? 'invisible' : ''}`} ref={boxRef} data-account-slot="out">
        <button
          type="button"
          ref={btnRef}
          aria-expanded={isOpen}
          aria-controls={panelId}
          aria-label="Log in"
          onClick={() => (isDesktop() ? setIsOpen((wasOpen) => !wasOpen) : onLogin())}
          className={`inline-flex items-center h-[var(--btn-h)] px-3 rounded-sm border border-line bg-white text-small font-semibold font-body text-gold cursor-pointer whitespace-nowrap [transition:background-color_var(--dur)_var(--ease),scale_var(--dur-fast)_var(--ease)] hover:bg-cream ${PHONE}`}
        >
          <span className="max-[992px]:hidden">Log in</span>
          <UserRound className="min-[993px]:hidden w-5 h-5" strokeWidth={ICON_STROKE_WIDTH_LIGHT} aria-hidden="true" />
        </button>
        <PopMenu open={isOpen}>
          <div
            id={panelId}
            className="absolute right-0 top-[calc(100%+var(--space-1))] z-[130] w-[18rem] bg-white border border-line rounded-[var(--r-md)] p-[var(--space-1)]"
          >
            <div className="px-3 pt-2 pb-3">
              <b className="block text-small font-semibold text-gold">Plan your Bali trip</b>
              <span className="block text-small text-muted mb-3">Sign in with your email. No password needed.</span>
              <button
                type="button"
                className={`flex w-full ${BTN_CTA}`}
                onClick={() => {
                  setIsOpen(false);
                  onLogin();
                }}
              >
                Log in
              </button>
            </div>
            {PREFS}
          </div>
        </PopMenu>
      </div>
    );
  }

  const first = extractFirstName(account.name, account.email);
  return (
    <div className="relative" ref={boxRef} data-account-slot="in">
      <button
        type="button"
        ref={btnRef}
        aria-expanded={isOpen}
        aria-controls={panelId}
        aria-label={`Account menu for ${first}`}
        onClick={() => setIsOpen((wasOpen) => !wasOpen)}
        className={`inline-flex items-center gap-2 bg-transparent border-none p-0 cursor-pointer font-body text-small font-semibold text-gold [transition:color_var(--dur)_var(--ease),background-color_var(--dur)_var(--ease),scale_var(--dur-fast)_var(--ease)] hover:text-gold-d ${PHONE}`}
      >
        <span
          className="w-[30px] h-[30px] max-[992px]:w-[28px] max-[992px]:h-[28px] rounded-[50%] bg-gold text-white grid place-items-center text-label font-semibold tracking-[0.02em]"
          aria-hidden="true"
        >
          {buildInitials(account.name, account.email)}
        </span>
        <span className="max-[992px]:hidden max-w-[9rem] overflow-hidden text-ellipsis whitespace-nowrap">{first}</span>
        <ChevronDown
          className={`max-[992px]:hidden w-[var(--icon-sm)] h-[var(--icon-sm)] transition-[rotate] duration-200 ${isOpen ? 'rotate-180' : ''}`}
          strokeWidth={ICON_STROKE_WIDTH_MEDIUM}
          aria-hidden="true"
        />
      </button>
      <PopMenu open={isOpen}>
        <div
          id={panelId}
          className="absolute right-0 top-[calc(100%+var(--space-1))] z-[130] min-[993px]:w-[18rem] w-[15rem] bg-white border border-line rounded-[var(--r-md)] p-[var(--space-1)]"
        >
          <div className="px-3 pt-2 pb-3">
            <b className="block text-small font-semibold text-gold overflow-hidden text-ellipsis whitespace-nowrap">
              {account.name || first}
            </b>
            <span className="block text-small text-muted overflow-hidden text-ellipsis whitespace-nowrap">
              {account.email}
            </span>
          </div>
          <Separator className="mb-1" />
          <a href="/settings.html" className={ROW}>
            <Settings strokeWidth={ICON_STROKE_WIDTH_REGULAR} aria-hidden="true" />
            Settings
          </a>
          {PREFS}
          <Separator className="mt-1" />
          <div className="pt-1">
            <button
              type="button"
              className={ROW}
              onClick={() => {
                setIsOpen(false);
                logout();
              }}
            >
              <LogOut strokeWidth={ICON_STROKE_WIDTH_REGULAR} aria-hidden="true" />
              Sign out
            </button>
          </div>
        </div>
      </PopMenu>
    </div>
  );
}
