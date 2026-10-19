import { cn } from '../lib/cn.js';

export default function Collapse({ open, className, children }) {
  return (
    <div
      className={cn(
        'grid [transition:grid-template-rows_var(--dur)_var(--ease),opacity_var(--dur-fast)_var(--ease)]',
        'motion-reduce:transition-none',
        open
          ? '[grid-template-rows:1fr] opacity-100'
          : '[grid-template-rows:0fr] opacity-0 invisible pointer-events-none',
        className,
      )}
      aria-hidden={open ? undefined : 'true'}
    >
      <div className="overflow-hidden min-h-0">{children}</div>
    </div>
  );
}
