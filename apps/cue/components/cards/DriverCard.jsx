// Tailwind-native (migrasi Fase 2): kartu driver (about-us, di dalam .drivers-grid).
// Dulu keluarga .driver-card* di style.css -> utilities 1:1. `.driver-card__avatar`
// CSS masih dipakai driver modal di AboutPage (belum di-convert), jadi rule-nya
// tetep ada; di kartu ini avatarnya udah utilities. Blok detail tersembunyi
// (data holder, display:none) dibiarin apa adanya. Varian `.company-page .driver-card`
// gak kepake React (DriverCard cuma dipakai di about-us, bukan our-company).
export default function DriverCard({ name, tagline, desc, emptyReview, onOpen }) {
  return (
    <button
      className="font-body text-green flex flex-col items-center text-center grow-0 shrink-0 basis-[215px] py-[1.75rem] px-5 border-[1.5px] border-solid border-transparent rounded-lg [background:linear-gradient(var(--color-cream),var(--color-cream))_padding-box,var(--gold-edge)_border-box] cursor-pointer transition-[transform,box-shadow] duration-[0.15s] hover:[transform:translateY(-4px)] hover:shadow-[0_8px_22px_rgba(31,61,43,0.1)]"
      type="button"
      data-name={name}
      data-tagline={tagline}
      onClick={() => onOpen && onOpen({ name, tagline, desc, emptyReview })}
    >
      <span className="flex items-center justify-center w-[60px] h-[60px] mb-[0.9rem] rounded-[50%] font-head font-semibold text-[1.5rem] text-white bg-[linear-gradient(135deg,var(--color-amber),var(--color-amber-d))]">
        <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
          <circle cx="12" cy="8" r="4" />
          <path d="M5.5 20a6.5 6.5 0 0 1 13 0" />
        </svg>
      </span>
      <strong className="font-body text-h3 font-semibold tracking-normal">{name}</strong>
      <span className="mt-[0.2rem] text-body text-muted">{tagline}</span>
      <span className="mt-[0.6rem] text-label font-medium text-green opacity-70">View profile &rsaquo;</span>
      <div className="driver-card__detail" hidden data-desc={desc}>
        <div className="driver-detail__reviews">
          <p className="reviews__empty">{emptyReview}</p>
        </div>
      </div>
    </button>
  );
}
