import Price from '@/components/Price';

const PLACEHOLDER_GRADIENT = 'linear-gradient(135deg, rgba(31, 61, 43, 0.92), rgba(46, 90, 64, 0.86))';

function ClockIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" />
    </svg>
  );
}
function PinIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 21s-7-6.2-7-11a7 7 0 0 1 14 0c0 4.8-7 11-7 11z" /><circle cx="12" cy="10" r="2.5" />
    </svg>
  );
}
function UserIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="8" r="4" /><path d="M4 20c0-4 4-6 8-6s8 2 8 6" />
    </svg>
  );
}
function StarIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 2l2.9 6 6.6.6-5 4.3 1.5 6.5L12 16.9 5.9 20l1.5-6.5-5-4.3 6.6-.6z" />
    </svg>
  );
}
function LeafIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M5 21c0-8 5-15 15-16 1 10-5 16-13 16H5zm3-3c5-1 8-4 9-9-5 2-8 5-9 9z" />
    </svg>
  );
}
function MaskIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 2c-4 0-7 2-7 6 0 5 3 10 7 14 4-4 7-9 7-14 0-4-3-6-7-6zM9.5 9a1.2 1.2 0 1 1 0 .01zM14.5 9a1.2 1.2 0 1 1 0 .01zM9 14c1 1.2 5 1.2 6 0-1 2-5 2-6 0z" />
    </svg>
  );
}
function MountainIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M3 20h18L14 8l-3.2 5-2-2.8L3 20z" />
    </svg>
  );
}
function TempleIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 2l9 5v2H3V7l9-5zM5 10h2v7H5v-7zm4 0h2v7H9v-7zm4 0h2v7h-2v-7zm4 0h2v7h-2v-7zM3 18h18v3H3v-3z" />
    </svg>
  );
}

// Category -> badge tone + icon. Labels are the real category (no invented
// "Popular" tags), tone reuses the brand gold/green.
const CATS = {
  Culture: { tone: 'gold', Icon: MaskIcon },
  Temple: { tone: 'gold', Icon: TempleIcon },
  Nature: { tone: 'green', Icon: LeafIcon },
  Adventure: { tone: 'green', Icon: MountainIcon },
};

// Tailwind-native (migrasi Fase 2, keluarga kartu - Opsi A "pisah bersih"):
// HomepageCard = kartu glass-overlay MANDIRI, gak numpang frame .experience__card
// / tema .home .experience__* lagi. Semua tampilan (frame, overlay ::after, badge,
// rating, judul, bar) 1:1 dari .hcard/.hcard__* lama -> utilities. Class `hcard`
// DIPERTAHANKAN cuma sbg hook layout grid (flex-basis 88% di slider HP), bukan
// buat styling. Foto dirender sendiri (fill) - gak lewat CardImage (biar mandiri).
// Rule visual .hcard*/.hcard__* lama dihapus dari style.css (produksi cuma dipake
// komponen ini). Grid/slider + ExperienceCard klasik = stage berikutnya.
const FRAME =
  "hcard relative block overflow-hidden text-white no-underline bg-white rounded-xl shadow-md aspect-[4/5] " +
  'transition-[transform,box-shadow] duration-200 ease-[var(--ease-out)] hover:-translate-y-[3px] ' +
  'hover:shadow-[0_16px_38px_rgba(31,61,43,0.16)] ' +
  "after:content-[''] after:absolute after:inset-0 after:z-[1] " +
  'after:bg-[linear-gradient(to_top,rgba(12,14,10,0.86)_0%,rgba(12,14,10,0.40)_40%,rgba(12,14,10,0)_66%,rgba(12,14,10,0.14)_100%)]';
const IMG = 'absolute inset-0 w-full h-full object-cover';
const CAT_BASE =
  'absolute top-3 left-3 z-[3] inline-flex items-center gap-[6px] px-3 py-[6px] rounded-pill text-label font-semibold ' +
  'tracking-[0.06em] uppercase text-white backdrop-blur-[6px] border border-[rgba(255,255,255,0.2)] ' +
  '[&>svg]:w-[13px] [&>svg]:h-[13px] [&>svg]:shrink-0';
const RATE =
  'absolute top-3 right-3 z-[3] inline-flex items-center gap-[5px] px-[10px] py-[5px] rounded-pill ' +
  'bg-[rgba(255,255,255,0.92)] text-ink text-small font-semibold shadow-sm ' +
  '[&>svg]:w-[13px] [&>svg]:h-[13px] [&>svg]:text-amber-d';
const OV = 'absolute left-0 right-0 bottom-0 z-[2] px-[15px] pb-[14px]';
const TITLE = 'mt-0 mb-[9px] font-semibold text-h2 leading-[1.2] text-white line-clamp-2 [text-shadow:0_2px_12px_rgba(0,0,0,0.5)]';
const ACCENT = 'block w-[38px] h-[3px] rounded-[2px] mb-3';
const BAR =
  'flex items-center justify-between gap-2 px-[11px] py-2 rounded-md bg-[rgba(255,255,255,0.13)] ' +
  'backdrop-blur-[12px] border border-[rgba(255,255,255,0.2)]';
const META =
  'inline-flex items-center gap-[6px] text-[rgba(255,255,255,0.92)] text-[0.62rem] min-w-0 flex-[0_1_auto] whitespace-nowrap ' +
  '[&>span]:flex-[0_0_auto] [&_svg]:w-3 [&_svg]:h-3 [&_svg]:flex-[0_0_auto]';
const SEP = 'w-px h-[11px] bg-[rgba(255,255,255,0.35)] flex-[0_0_auto]';
const PRICE_WRAP = 'flex-[0_0_auto] text-right leading-[1.05] whitespace-nowrap text-white';

export default function HomepageCard({
  href, name, img, alt, meta, metaIcon = 'clock',
  priceName, priceFallback, priceMode = 'standard', zone, cat, rating, width = 600, height = 600,
}) {
  const c = (cat && CATS[cat]) || null;
  const tone = c ? c.tone : 'gold';
  const isTour = metaIcon !== 'pin';
  const catTone = tone === 'green' ? 'bg-[rgba(61,92,70,0.84)]' : 'bg-[rgba(176,141,67,0.86)]';
  const accentTone = tone === 'green' ? 'bg-cta' : 'bg-amber';
  return (
    <a className={FRAME} href={href} data-zone={zone}>
      {img ? (
        <img className={IMG} src={`/assets/images/${img}`} alt={alt || name} width={width} height={height} loading="lazy" />
      ) : (
        <div className="absolute inset-0" style={{ backgroundImage: PLACEHOLDER_GRADIENT }} />
      )}
      {c && (
        <span className={`${CAT_BASE} ${catTone}`}>
          <c.Icon />{cat}
        </span>
      )}
      <span className={RATE}><StarIcon />{rating || 'New'}</span>
      <div className={OV}>
        <h3 className={TITLE}>{name}</h3>
        <span className={`${ACCENT} ${accentTone}`} />
        <div className={BAR}>
          <span className={META}>
            {isTour ? <ClockIcon /> : <PinIcon />}<span>{meta}</span>
            {isTour && (
              <>
                <span className={SEP} />
                <UserIcon /><span>Private Tour</span>
              </>
            )}
          </span>
          {priceName && (
            <span className={PRICE_WRAP}>
              <small className="block text-[9px] opacity-85 font-medium">from</small>
              <Price name={priceName} mode={priceMode} fallback={priceFallback} className="text-white font-bold text-strong" />
            </span>
          )}
        </div>
      </div>
    </a>
  );
}
