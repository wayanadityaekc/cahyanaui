// Original leaf mark for "Ubud Private Villas" — not a copy of any real
// company's logo, just a simple two-blade leaf silhouette in the brand's
// CTA green, sized to sit left of the two-line wordmark per the mockup.
export function LeafMark({ size = 28, color = 'currentColor' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" aria-hidden="true">
      <path
        d="M16 3C9 6 5 12 5 18c0 6 4.5 10 11 11 6.5-1 11-5 11-11 0-6-4-12-11-15Z"
        fill={color}
        opacity="0.14"
      />
      <path
        d="M16 4.5C10 7.5 6.5 12.7 6.5 18c0 5.4 3.9 9.1 9.5 10 5.6-.9 9.5-4.6 9.5-10 0-5.3-3.5-10.5-9.5-13.5Z"
        stroke={color}
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <path d="M16 6v22" stroke={color} strokeWidth="1.6" strokeLinecap="round" />
      <path d="M16 12c-2.2 1.4-4.6 2-7 1.6M16 18c-2.6 1.4-5.3 1.9-8 1.4M16 12c2.2 1.4 4.6 2 7 1.6M16 18c2.6 1.4 5.3 1.9 8 1.4" stroke={color} strokeWidth="1.3" strokeLinecap="round" />
    </svg>
  );
}

export function Wordmark({ light = false }) {
  return (
    <span className="flex flex-col leading-none">
      <span
        className="text-[0.95rem] font-bold tracking-tight"
        style={{ color: light ? '#fff' : 'var(--color-gold)' }}
      >
        UBUD
      </span>
      <span
        className="text-[0.52rem] font-semibold tracking-[0.24em] uppercase mt-0.5"
        style={{ color: light ? 'rgba(255,255,255,0.7)' : 'var(--color-muted)' }}
      >
        Private Villas
      </span>
    </span>
  );
}

export default function Logo({ light = false, size = 30 }) {
  return (
    <span className="flex items-center gap-2.5">
      <LeafMark size={size} color={light ? '#fff' : 'var(--color-cta)'} />
      <Wordmark light={light} />
    </span>
  );
}
