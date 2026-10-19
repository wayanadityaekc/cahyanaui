'use client';

import { ShoppingBag, UserRound } from 'lucide-react';
import { cn } from '../lib/cn.js';

const PILL =
  'relative inline-flex items-center gap-2 h-8 px-[0.6rem] rounded-md [border:1px_solid_var(--line)] bg-surface-raised ' +
  'text-gold no-underline cursor-pointer [transition:border-color_var(--dur)_var(--ease)] ' +
  'hover:[border-color:var(--color-gold)] focus-visible:outline-none ' +
  'focus-visible:[border-color:var(--color-gold)] focus-visible:[box-shadow:var(--focus-ring)]';
const ICON = 'w-5 h-5 flex-none';
const SPLIT = 'w-px h-4 bg-[var(--line)] flex-none';
const DOT = 'absolute -top-[4px] -right-[4px] w-[10px] h-[10px] rounded-pill bg-ok [box-shadow:0_0_0_2px_var(--color-surface-raised)]';

export default function MyCahyanaPill({ href, label = 'My Cahyana', seen = true, onTap = () => {}, className }) {
  return (
    <a href={href} className={cn(PILL, className)} aria-label={label} onClick={onTap} data-my-pill>
      <UserRound className={ICON} strokeWidth={1.6} aria-hidden="true" />
      <span className={SPLIT} aria-hidden="true" />
      <ShoppingBag className={ICON} strokeWidth={1.6} aria-hidden="true" />
      {seen ? null : <span className={DOT} aria-hidden="true" data-my-pill-dot />}
    </a>
  );
}
