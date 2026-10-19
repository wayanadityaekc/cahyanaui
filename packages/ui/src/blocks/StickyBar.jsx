'use client';

import { cn } from '../lib/cn.js';

export const BAR_MARK = 'stickybar';

const SHELLS = {
  flush: `${BAR_MARK} fixed inset-x-0 bottom-0 z-40 lg:hidden transition-transform duration-300 ease-out`,
  floating: `${BAR_MARK} fixed left-4 right-4 bottom-4 z-40 lg:hidden transition-transform duration-300 ease-out`,
};

const CARDS = {
  flush:
    'bg-surface-raised rounded-t-[var(--r-xl)] [border-top:1px_solid_var(--line)] ' +
    'flex items-center justify-between gap-3 pt-[0.55rem] pl-[1.1rem] pr-[0.9rem] ' +
    'pb-[max(0.55rem,env(safe-area-inset-bottom))]',
  floating:
    'bg-surface-raised rounded-lg [border:1px_solid_var(--line)] [box-shadow:var(--shadow-xl)] ' +
    'flex items-center justify-between gap-3 px-4 py-3',
};

export const BAR_SHELL = SHELLS.floating;
export const BAR_CARD = CARDS.floating;

export default function StickyBar({
  variant = 'floating',
  show = true,
  className,
  cardClassName,
  children,
}) {
  return (
    <div className={cn(SHELLS[variant] || SHELLS.floating, show ? 'translate-y-0' : 'translate-y-[150%]', className)}>
      <div className={cn(CARDS[variant] || CARDS.floating, cardClassName)}>{children}</div>
    </div>
  );
}

export const BAR_BODY_PAD = 'max-[1024px]:has-[.stickybar]:pb-[64px]';
