// Always-mounted screen-reader-only live region, so changes are announced reliably (status, or alert if assertive).
export default function LiveRegion({ children = null, assertive = false }) {
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
