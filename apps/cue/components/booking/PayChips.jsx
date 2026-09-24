// The card brands accepted at the booking step.
//
// Changed Sep 2026 when the deposit step was added: this used to show Visa,
// Mastercard and PayPal, from back when the modal was an enquiry form and the
// chips were decorative. The DOKU card integration accepts Visa, Mastercard, JCB
// and American Express, and NOT PayPal - leaving PayPal here would promise a
// method the payment window does not offer. The JCB and Amex marks are the ones
// already hand-drawn in the footer, reused rather than redrawn.
//
// Brand marks stay hand-drawn (never Lucide) - see CLAUDE.md.
export default function PayChips({ className = '', logosClass = '', chipClass = '', svgClass = '' }) {
  return (
    <div className={className}>
      <div className={logosClass}>
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
      </div>
    </div>
  );
}
