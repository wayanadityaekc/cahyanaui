import { cn } from '../lib/cn.js';

/**
 * A real typed input - a name, an email, a message. Anything with a fixed set
 * of answers should be a <Select>, and anything that is a date should be a
 * <DateField>; neither site uses a native dropdown or date widget any more.
 *
 * Height comes from --field-h so every control on a row lines up, and the
 * focus ring is the shared token rather than the browser's default outline.
 */
const BASE =
  'w-full bg-surface-raised font-body text-field text-green rounded-md ' +
  '[border:1px_solid_var(--line)] px-[0.85rem] ' +
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
