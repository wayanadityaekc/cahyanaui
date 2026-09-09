export default function FlagDefs() {
  return (
    <svg className="absolute w-0 h-0" aria-hidden="true" width="0" height="0">
      <defs>
        <symbol id="flag-usd" viewBox="0 0 60 40">
          <rect width="60" height="40" fill="#b22234" />
          <rect y="5" width="60" height="3" fill="#fff" />
          <rect y="11" width="60" height="3" fill="#fff" />
          <rect y="17" width="60" height="3" fill="#fff" />
          <rect y="23" width="60" height="3" fill="#fff" />
          <rect y="29" width="60" height="3" fill="#fff" />
          <rect y="35" width="60" height="3" fill="#fff" />
          <rect width="26" height="22" fill="#3c3b6e" />
        </symbol>
        <symbol id="flag-idr" viewBox="0 0 60 40">
          <rect width="60" height="20" fill="#e11d2e" />
          <rect y="20" width="60" height="20" fill="#fff" />
        </symbol>
        <symbol id="flag-aud" viewBox="0 0 60 40">
          <rect width="60" height="40" fill="#00247d" />
          <path d="M0 0 L26 17 M26 0 L0 17" stroke="#fff" strokeWidth="4" />
          <path d="M13 0 V17 M0 8.5 H26" stroke="#fff" strokeWidth="5" />
          <path d="M13 0 V17 M0 8.5 H26" stroke="#cf142b" strokeWidth="2.5" />
          <path d="M0 0 L26 17 M26 0 L0 17" stroke="#cf142b" strokeWidth="1.6" />
          <circle cx="43" cy="27" r="3" fill="#fff" />
          <circle cx="13" cy="30" r="2" fill="#fff" />
        </symbol>
        <symbol id="flag-eur" viewBox="0 0 60 40">
          <rect width="60" height="40" fill="#003399" />
          <g fill="#ffcc00">
            <circle cx="30" cy="8" r="1.6" />
            <circle cx="41" cy="11" r="1.6" />
            <circle cx="48" cy="20" r="1.6" />
            <circle cx="41" cy="29" r="1.6" />
            <circle cx="30" cy="32" r="1.6" />
            <circle cx="19" cy="29" r="1.6" />
            <circle cx="12" cy="20" r="1.6" />
            <circle cx="19" cy="11" r="1.6" />
          </g>
        </symbol>
        <symbol id="flag-gbp" viewBox="0 0 60 40">
          <rect width="60" height="40" fill="#00247d" />
          <path d="M0 0 L60 40 M60 0 L0 40" stroke="#fff" strokeWidth="8" />
          <path d="M0 0 L60 40 M60 0 L0 40" stroke="#cf142b" strokeWidth="4" />
          <path d="M30 0 V40 M0 20 H60" stroke="#fff" strokeWidth="12" />
          <path d="M30 0 V40 M0 20 H60" stroke="#cf142b" strokeWidth="7" />
        </symbol>
      </defs>
    </svg>
  );
}
