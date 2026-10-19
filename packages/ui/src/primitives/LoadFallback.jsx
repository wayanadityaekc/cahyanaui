import { cn } from '../lib/cn.js';

export default function LoadFallback({
  message = 'Sorry, we could not load this information. Please try again.',
  className = '',
}) {
  return (
    <p role="status" className={cn('m-0 text-small text-muted leading-[var(--lh-body)]', className)}>
      {message}
    </p>
  );
}
