export default function DriverCard({ name, tagline, desc, onOpen }) {
  return (
    <button
      className="driver-card"
      type="button"
      data-name={name}
      data-tagline={tagline}
      onClick={() => onOpen && onOpen({ name, tagline, desc })}
    >
      <span className="driver-card__avatar">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
          <circle cx="12" cy="8" r="4" />
          <path d="M5.5 20a6.5 6.5 0 0 1 13 0" />
        </svg>
      </span>
      <strong className="driver-card__name">{name}</strong>
      <span className="driver-card__tagline">{tagline}</span>
      <span className="driver-card__more">View profile &rsaquo;</span>
      <div className="driver-card__detail" hidden data-desc={desc} />
    </button>
  );
}
