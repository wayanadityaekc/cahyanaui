// Always-mounted sr-only live region (status/polite, or alert if assertive) so screen readers reliably announce changes.
export default function LiveRegion({ children, assertive = false }) {
  return (
    <div
      role={assertive ? 'alert' : 'status'}
      aria-live={assertive ? 'assertive' : 'polite'}
      aria-atomic="true"
      className="sr-only"
    >
      {children}
    </div>
  );
}
