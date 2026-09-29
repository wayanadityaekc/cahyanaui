import { cn } from '../lib/cn.js';

/**
 * Said instead of an empty block when the data a component needs did not
 * arrive. A blank space reads as "nothing here"; this reads as "try again".
 */
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
