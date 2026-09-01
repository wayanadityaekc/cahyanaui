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
          <svg className={svgClass} viewBox="0 0 62 16" role="img" aria-label="PayPal">
            <text x="0" y="13" fontFamily="Arial, Helvetica, sans-serif" fontSize="15" fontWeight="700" fontStyle="italic">
              <tspan fill="#003087">Pay</tspan>
              <tspan fill="#009CDE">Pal</tspan>
            </text>
          </svg>
        </span>
      </div>
    </div>
  );
}
