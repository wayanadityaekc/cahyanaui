// Tailwind-native (migrasi Fase 2): kartu driver (about-us, di dalam .drivers-grid).
// Dulu keluarga .driver-card* di style.css -> utilities 1:1 (TW-A7, #328 - CSS-nya
// udah dihapus, termasuk `.driver-card__avatar`/`.company-page .driver-card*`).
// Blok detail tersembunyi (data holder, display:none via attr `hidden`) dibiarin
// apa adanya - bukan family-ku, ada kemungkinan dipakai flow review nanti.
// `company` = kartu dikecilin buat halaman Our Company (kolom sempit).
// `driverAvatarClasses` diexport biar dipakai bareng avatar di driver-modal
// (AboutPage.jsx) - dulu 2 rule CSS beda (`.driver-card__avatar` vs modal
// head-nya) tapi angkanya identik, jadi disatuin ke satu sumber (DRY).
export function driverAvatarClasses(company) {
  return {
    box: company ? 'w-[46px] h-[46px] mb-[0.6rem] text-[1.15rem]' : 'w-[60px] h-[60px] mb-[0.9rem] text-[1.5rem]',
    svg: company ? 'w-6 h-6' : 'w-8 h-8',
  };
}

export default function DriverCard({ name, tagline, desc, emptyReview, onOpen, company = false }) {
  const box = company ? 'basis-[158px] py-[1.1rem] px-[0.9rem]' : 'basis-[215px] py-[1.75rem] px-5';
  const { box: ava, svg: avaSvg } = driverAvatarClasses(company);
  return (
    <button
      className={`font-body text-green flex flex-col items-center text-center grow-0 shrink-0 ${box} border-[1.5px] border-solid border-transparent rounded-lg [background:linear-gradient(var(--color-cream),var(--color-cream))_padding-box,var(--gold-edge)_border-box] cursor-pointer transition-[transform,box-shadow] duration-[var(--dur)] ease-[var(--ease-out)] hover:[transform:translateY(-4px)] hover:shadow-[0_8px_22px_rgba(31,61,43,0.1)]`}
      type="button"
      data-name={name}
      data-tagline={tagline}
      onClick={() => onOpen && onOpen({ name, tagline, desc, emptyReview })}
    >
      <span className={`flex items-center justify-center ${ava} rounded-[50%] font-head font-semibold text-white bg-[linear-gradient(135deg,var(--color-amber),var(--color-amber-d))]`}>
        <svg className={avaSvg} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
          <circle cx="12" cy="8" r="4" />
          <path d="M5.5 20a6.5 6.5 0 0 1 13 0" />
        </svg>
      </span>
      <strong className="font-body text-h3 font-semibold tracking-normal">{name}</strong>
      <span className="mt-[0.2rem] text-body text-muted">{tagline}</span>
      <span className="mt-[0.6rem] text-label font-medium text-green opacity-70">View profile &rsaquo;</span>
      <div className="hidden" hidden data-desc={desc}>
        <div className="driver-detail__reviews">
          <p className="py-10 px-6 text-center [border:1px_dashed_#d8d2c4] rounded-md text-muted">{emptyReview}</p>
        </div>
      </div>
    </button>
  );
}
