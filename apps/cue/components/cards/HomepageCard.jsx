import { Clock, Landmark, Leaf, MapPin, Mountain, UserRound, VenetianMask } from 'lucide-react';
import Price from '@/components/Price';
import Rating from '@/components/Rating';

const PLACEHOLDER_GRADIENT = 'linear-gradient(135deg, rgba(31, 61, 43, 0.92), rgba(46, 90, 64, 0.86))';

const ClockIcon = () => <Clock strokeWidth={1.7} />;
const PinIcon = () => <MapPin strokeWidth={1.7} />;
const UserIcon = () => <UserRound strokeWidth={1.7} />;
// Category badges were solid shapes before Lucide, so they keep `fill` -
// outline-only would read as a different badge style.
const LeafIcon = () => <Leaf fill="currentColor" aria-hidden="true" />;
const MaskIcon = () => <VenetianMask fill="currentColor" aria-hidden="true" />;
const MountainIcon = () => <Mountain fill="currentColor" aria-hidden="true" />;
const TempleIcon = () => <Landmark fill="currentColor" aria-hidden="true" />;

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
  'transition-[translate,box-shadow] duration-200 ease-[var(--ease-out)] hover:-translate-y-[3px] ' +
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
// Wayan (14 Sep 2026): the meta row (duration + "Private Tour") could shrink
// (min-w-0 flex-[0_1_auto] above) but its text never did - every child was
// pinned flex-[0_0_auto], so a long duration ("10-11 hours") plus "Private
// Tour" just visually overflowed past the shrunk box into the price on the
// right instead of wrapping/hiding. Duration stays fixed-size (META_ITEM,
// it's the more important half); "Private Tour" is the one allowed to
// shrink+ellipsis (META_TRUNC) since it's the more skippable label.
const META_ITEM = 'flex-[0_0_auto]';
const META_TRUNC = 'min-w-0 truncate';
const META =
  'inline-flex items-center gap-[6px] text-[rgba(255,255,255,0.92)] text-[0.62rem] min-w-0 flex-[0_1_auto] whitespace-nowrap ' +
  '[&_svg]:w-3 [&_svg]:h-3 [&_svg]:flex-[0_0_auto]';
const SEP = 'w-px h-[11px] bg-[rgba(255,255,255,0.35)] flex-[0_0_auto]';
const PRICE_WRAP = 'flex-[0_0_auto] text-right leading-[1.05] whitespace-nowrap text-white';

export default function HomepageCard({
  href, name, img, alt, meta, metaIcon = 'clock',
  priceName, priceFallback, priceMode = 'standard', zone, cat, width = 600, height = 600,
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
      <Rating name={priceName} className={RATE} />
      <div className={OV}>
        <h3 className={TITLE}>{name}</h3>
        <span className={`${ACCENT} ${accentTone}`} />
        <div className={BAR}>
          <span className={META}>
            {isTour ? <ClockIcon /> : <PinIcon />}<span className={META_ITEM}>{meta}</span>
            {isTour && (
              <>
                <span className={SEP} />
                <UserIcon /><span className={META_TRUNC}>Private Tour</span>
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
