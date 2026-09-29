// Shown instead of an empty block when the data a component needs did not arrive.
export default function LoadFallback({ className = '' }) {
  return (
    <p role="status" className={`m-0 text-small text-muted leading-[var(--lh-body)] ${className}`}>
      Sorry, we could not load this information. Please try again.
    </p>
  );
}
