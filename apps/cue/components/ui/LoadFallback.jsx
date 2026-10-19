export default function LoadFallback({ className = '' }) {
  return (
    <p role="status" className={`m-0 text-small text-muted leading-[var(--lh-body)] ${className}`}>
      Sorry, we could not load this information. Please try again.
    </p>
  );
}
