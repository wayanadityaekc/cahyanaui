/**
 * Airbnb / Instagram / Facebook, HAND-DRAWN.
 *
 * Lucide dropped brand marks in v1 (6329 icons, none of them a logo), so these
 * are the same carve-out CUE already makes for payment logos and currency
 * flags: everything else comes from the set, these cannot. Single-colour
 * outlines so they inherit currentColor and sit inside a circle like the rest.
 *
 * If Lucide ever ships brand icons again, delete this file rather than keeping
 * both.
 */
const PATHS = {
  // The Bélo: a loop that rises to a point and tucks back under itself.
  Airbnb: <path d="M12 3c1 0 1.7.7 2.3 1.9 1.4 2.8 3.4 7 4.4 9.4.7 1.8.1 3.6-1.5 4.3-1.5.6-3.2 0-4.2-1.4L12 15.6l-1 1.6c-1 1.4-2.7 2-4.2 1.4-1.6-.7-2.2-2.5-1.5-4.3 1-2.4 3-6.6 4.4-9.4C10.3 3.7 11 3 12 3Z" />,
  Instagram: (
    <>
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.2" cy="6.8" r="1" fill="currentColor" stroke="none" />
    </>
  ),
  Facebook: <path d="M14 9h2V6h-2c-1.7 0-3 1.3-3 3v2H9v3h2v6h3v-6h2.2l.8-3H14V9.6c0-.3.3-.6.6-.6H16" />,
};

export default function BrandIcon({ name, className = 'block w-[13px] h-[13px]' }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {PATHS[name] || null}
    </svg>
  );
}
