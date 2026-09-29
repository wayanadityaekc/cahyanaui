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
        {/* Flags for the seven added currencies, simplified at 20x14 like the ones above. */}
        <symbol id="flag-sgd" viewBox="0 0 60 40">
          <rect width="60" height="20" fill="#ef3340" />
          <rect y="20" width="60" height="20" fill="#fff" />
          <circle cx="13" cy="10" r="6" fill="#fff" />
          <circle cx="15.5" cy="10" r="5.5" fill="#ef3340" />
          <g fill="#fff">
            <circle cx="19" cy="6" r="0.9" />
            <circle cx="22" cy="8.5" r="0.9" />
            <circle cx="21" cy="12" r="0.9" />
            <circle cx="17" cy="12" r="0.9" />
            <circle cx="16" cy="8.5" r="0.9" />
          </g>
        </symbol>
        <symbol id="flag-nzd" viewBox="0 0 60 40">
          <rect width="60" height="40" fill="#00247d" />
          <path d="M0 0 L26 17 M26 0 L0 17" stroke="#fff" strokeWidth="4" />
          <path d="M13 0 V17 M0 8.5 H26" stroke="#fff" strokeWidth="5" />
          <path d="M13 0 V17 M0 8.5 H26" stroke="#cf142b" strokeWidth="2.5" />
          <path d="M0 0 L26 17 M26 0 L0 17" stroke="#cf142b" strokeWidth="1.6" />
          <g fill="#cc142b" stroke="#fff" strokeWidth="0.6">
            <circle cx="44" cy="11" r="1.8" />
            <circle cx="50" cy="18" r="1.8" />
            <circle cx="38" cy="20" r="1.8" />
            <circle cx="44" cy="31" r="2" />
          </g>
        </symbol>
        <symbol id="flag-cad" viewBox="0 0 60 40">
          <rect width="60" height="40" fill="#fff" />
          <rect width="15" height="40" fill="#d52b1e" />
          <rect x="45" width="15" height="40" fill="#d52b1e" />
          <path
            d="M30 9 L32 14 L35 12 L34 19 L38 16 L37 20 L40 21 L35 25 L36 27 L31 26 L31 32 L29 32 L29 26 L24 27 L25 25 L20 21 L23 20 L22 16 L26 19 L25 12 L28 14 Z"
            fill="#d52b1e"
          />
        </symbol>
        <symbol id="flag-chf" viewBox="0 0 60 40">
          <rect width="60" height="40" fill="#d52b1e" />
          <rect x="26" y="9" width="8" height="22" fill="#fff" />
          <rect x="19" y="16" width="22" height="8" fill="#fff" />
        </symbol>
        <symbol id="flag-jpy" viewBox="0 0 60 40">
          <rect width="60" height="40" fill="#fff" />
          <circle cx="30" cy="20" r="11" fill="#bc002d" />
        </symbol>
        <symbol id="flag-myr" viewBox="0 0 60 40">
          <rect width="60" height="40" fill="#fff" />
          <g fill="#cc0001">
            <rect y="0" width="60" height="2.86" />
            <rect y="5.71" width="60" height="2.86" />
            <rect y="11.43" width="60" height="2.86" />
            <rect y="17.14" width="60" height="2.86" />
            <rect y="22.86" width="60" height="2.86" />
            <rect y="28.57" width="60" height="2.86" />
            <rect y="34.29" width="60" height="2.86" />
          </g>
          <rect width="30" height="22.86" fill="#010066" />
          <circle cx="12" cy="11.4" r="6" fill="#fc0" />
          <circle cx="14" cy="11.4" r="5" fill="#010066" />
          <circle cx="21" cy="11.4" r="2.6" fill="#fc0" />
        </symbol>
        <symbol id="flag-hkd" viewBox="0 0 60 40">
          <rect width="60" height="40" fill="#de2910" />
          <g fill="#fff">
            <ellipse cx="30" cy="13" rx="3" ry="6" />
            <ellipse cx="30" cy="13" rx="3" ry="6" transform="rotate(72 30 20)" />
            <ellipse cx="30" cy="13" rx="3" ry="6" transform="rotate(144 30 20)" />
            <ellipse cx="30" cy="13" rx="3" ry="6" transform="rotate(216 30 20)" />
            <ellipse cx="30" cy="13" rx="3" ry="6" transform="rotate(288 30 20)" />
          </g>
        </symbol>
      </defs>
    </svg>
  );
}
