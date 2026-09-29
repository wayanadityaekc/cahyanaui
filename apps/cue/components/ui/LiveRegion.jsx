// A live region that is ALWAYS in the DOM (WO7 fix 4, 29 Sep 2026). Screen readers
// announce text that changes inside an existing live region far more reliably than a
// region that mounts already holding text - so the toast shows visually as before
// (marked aria-hidden so it is not read twice) and this carries the same words to
// assistive tech. Standard shadcn/Sonner behaviour: role="status", polite.
// `assertive` = role="alert" (interrupts) - only for things that must not be missed.
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
