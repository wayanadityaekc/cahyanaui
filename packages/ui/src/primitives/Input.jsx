import { cn } from '../lib/cn.js';

const BASE =
  'w-full bg-surface-raised font-body text-field text-green rounded-md ' +
  '[border:1px_solid_var(--line)] px-3 ' +
  '[transition:border-color_var(--dur-fast)_ease,box-shadow_var(--dur-fast)_ease] ' +
  'placeholder:text-muted hover:[border-color:var(--color-gold)] ' +
  'focus-visible:outline-none focus-visible:[border-color:var(--color-gold)] ' +
  'focus-visible:[box-shadow:var(--focus-ring)] ' +
  'disabled:opacity-50 disabled:cursor-not-allowed';

export function Textarea({ invalid, className, ...rest }) {
  return (
    <textarea
      className={cn(BASE, 'py-2 min-h-[110px] resize-y', invalid && '[border-color:var(--color-err)]', className)}
      aria-invalid={invalid || undefined}
      {...rest}
    />
  );
}

export default function Input({ invalid, className, ...rest }) {
  return (
    <input
      className={cn(BASE, 'h-[var(--field-h)]', invalid && '[border-color:var(--color-err)]', className)}
      aria-invalid={invalid || undefined}
      {...rest}
    />
  );
}
