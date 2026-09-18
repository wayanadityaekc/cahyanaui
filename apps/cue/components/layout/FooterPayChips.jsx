// The 7 payment marks in the footer. Hand-drawn SVG on purpose - Lucide has no
// brand logos, and these have to stay recognisable (CLAUDE.md, "Ikon").
// Lifted out of Footer.jsx (Sep 2026) where they were ~60 lines of inline
// markup: the footer's own layout was impossible to read around them.
// NOTE: components/booking/PayChips.jsx is a DIFFERENT, shorter set (Visa,
// Mastercard, PayPal) used inside the booking modal. Don't merge the two
// without checking both callers - they show different things on purpose.
export default function FooterPayChips({ chipClass, svgClass = 'block h-[13px] w-auto' }) {
  return (
    <>
      <span className={chipClass}>
        <svg className={svgClass} viewBox="0 0 48 16" role="img" aria-label="Visa">
          <text x="24" y="13" textAnchor="middle" fontFamily="Arial, Helvetica, sans-serif" fontSize="15" fontWeight="700" fontStyle="italic" letterSpacing="0.5" fill="#1434CB">VISA</text>
        </svg>
      </span>
      <span className={chipClass}>
        <svg className={svgClass} viewBox="0 0 40 24" role="img" aria-label="Mastercard">
          <circle cx="15" cy="12" r="9" fill="#EB001B" />
          <circle cx="25" cy="12" r="9" fill="#F79E1B" />
          <path d="M20 4.52 A9 9 0 0 0 20 19.48 A9 9 0 0 0 20 4.52 Z" fill="#FF5F00" />
        </svg>
      </span>
      <span className={chipClass}>
        <svg className={svgClass} viewBox="0 0 48 16" role="img" aria-label="JCB">
          <rect x="0" y="1" width="14.5" height="14" rx="2" fill="#0B4EA2" />
          <rect x="16.75" y="1" width="14.5" height="14" rx="2" fill="#E4002B" />
          <rect x="33.5" y="1" width="14.5" height="14" rx="2" fill="#009944" />
          <text x="7.25" y="11.5" textAnchor="middle" fontFamily="Arial, Helvetica, sans-serif" fontSize="10" fontWeight="700" fill="#fff">J</text>
          <text x="24" y="11.5" textAnchor="middle" fontFamily="Arial, Helvetica, sans-serif" fontSize="10" fontWeight="700" fill="#fff">C</text>
          <text x="40.75" y="11.5" textAnchor="middle" fontFamily="Arial, Helvetica, sans-serif" fontSize="10" fontWeight="700" fill="#fff">B</text>
        </svg>
      </span>
      <span className={chipClass}>
        <svg className={svgClass} viewBox="0 0 48 16" role="img" aria-label="American Express">
          <rect x="0" y="1" width="48" height="14" rx="2" fill="#006FCF" />
          <text x="24" y="11.5" textAnchor="middle" fontFamily="Arial, Helvetica, sans-serif" fontSize="9" fontWeight="700" letterSpacing="0.5" fill="#fff">AMEX</text>
        </svg>
      </span>
      <span className={chipClass}>
        <svg className={svgClass} viewBox="0 0 50 16" role="img" aria-label="QRIS">
          <text x="1" y="13" fontFamily="Arial, Helvetica, sans-serif" fontSize="14" fontWeight="800" fontStyle="italic">
            <tspan fill="#13326B">QR</tspan>
            <tspan fill="#E8262A">IS</tspan>
          </text>
        </svg>
      </span>
      <span className={chipClass}>
        <svg className={svgClass} viewBox="0 0 62 16" role="img" aria-label="PayPal">
          <text x="0" y="13" fontFamily="Arial, Helvetica, sans-serif" fontSize="15" fontWeight="700" fontStyle="italic">
            <tspan fill="#003087">Pay</tspan>
            <tspan fill="#009CDE">Pal</tspan>
          </text>
        </svg>
      </span>
      <span className={chipClass}>
        <svg className={svgClass} viewBox="0 0 62 24" role="img" aria-label="Google Pay">
          <path fill="#4285F4" d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.5c-.3 1.5-1.1 2.7-2.4 3.6v3h3.9c2.3-2.1 3.5-5.2 3.5-8.8z" />
          <path fill="#34A853" d="M12 24c3.2 0 5.9-1.1 7.9-2.9l-3.9-3c-1.1.7-2.5 1.2-4 1.2-3.1 0-5.7-2.1-6.6-4.9H1.4v3.1C3.4 21.4 7.4 24 12 24z" />
          <path fill="#FBBC05" d="M5.4 14.3c-.2-.7-.4-1.5-.4-2.3s.1-1.6.4-2.3V6.6H1.4C.5 8.2 0 10 0 12s.5 3.8 1.4 5.4l4-3.1z" />
          <path fill="#EA4335" d="M12 4.8c1.8 0 3.3.6 4.6 1.8l3.4-3.4C17.9 1.2 15.2 0 12 0 7.4 0 3.4 2.6 1.4 6.6l4 3.1C6.3 6.9 8.9 4.8 12 4.8z" />
          <text x="27" y="17" fontFamily="Arial, Helvetica, sans-serif" fontSize="15" fontWeight="500" fill="#5F6368">Pay</text>
        </svg>
      </span>
    </>
  );
}
