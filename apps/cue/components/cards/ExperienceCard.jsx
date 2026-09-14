import { Clock, MapPin } from 'lucide-react';
import Img from '@/components/ui/Img';
import Price from '@/components/Price';
import { PRICE_FROM } from '@/components/ui/priceClasses';
import { BADGE_POPULAR, CARD_FRAME, CARD_IMG } from '@/components/ui/cardClasses';

const PLACEHOLDER_GRADIENT = 'linear-gradient(135deg, rgba(31, 61, 43, 0.92), rgba(46, 90, 64, 0.86))';

// Tailwind-native PENUH (migrasi Fase 2 - keluarga kartu, stage final). Dulu numpang
// .experience__card + .experience__image/body/name/meta/footer/price + override
// .tourprog .experience__* - sekarang SEMUA utilities. Layout = kartu "See our tours"
// (tourprog): foto 4:3, body grid 2 baris (title/rating, meta/price). Frame pakai
// CARD_FRAME shared. Keluarga CSS .experience__* (kecuali grid engine) udah dihapus.
const IMG_WRAP =
  'relative aspect-[4/3] rounded-md overflow-hidden bg-green bg-cover bg-center ' +
  "after:content-[''] after:absolute after:inset-0 after:bg-[linear-gradient(to_bottom,transparent_55%,rgba(31,61,43,0.45))]";
const BODY =
  "grid grid-cols-[1fr_auto] [grid-template-areas:'title_rating''meta_price'] [flex-direction:column] items-baseline " +
  'gap-x-[0.55rem] gap-y-[0.4rem] pt-[0.6rem] px-[0.9rem] pb-[0.8rem] grow';
const BODY_INCL =
  "grid grid-cols-[1fr] [grid-template-areas:'title''meta''incl'] [flex-direction:column] items-baseline " +
  'gap-x-[0.55rem] gap-y-[0.4rem] pt-[0.6rem] px-[0.9rem] pb-[0.8rem] grow';
const NAME =
  '[grid-area:title] m-0 text-strong max-[992px]:text-small font-semibold leading-[1.25] line-clamp-2';
const META =
  '[grid-area:meta] flex items-center gap-[0.4rem] text-small max-[992px]:text-label text-muted ' +
  '[&_svg]:w-[var(--icon-sm)] [&_svg]:h-[var(--icon-sm)] [&_svg]:shrink-0 [&_svg]:text-gold-d';
const FOOTER = '[grid-area:price] m-0 p-0 flex items-end justify-between';
const PRICE = 'text-amber whitespace-nowrap max-[992px]:[&_.price]:text-small';
const INCL =
  '[grid-area:incl] text-label text-muted leading-[1.35] line-clamp-2 [&_strong]:text-gold [&_strong]:font-medium';

export default function ExperienceCard({
  href,
  name,
  img,
  alt,
  meta,
  metaIcon = 'clock',
  priceName,
  priceFallback,
  priceMode = 'standard',
  zone,
  badge,
  program,
  variant = 'link',
  inclText,
  width = 600,
  height = 600,
  children,
}) {
  const incl = variant === 'incl';
  const body = (
    <>
      <div className={IMG_WRAP} style={img ? undefined : { backgroundImage: PLACEHOLDER_GRADIENT }}>
        {img && <Img className={CARD_IMG} src={`/assets/images/${img}`} alt={alt || name} width={width} height={height} />}
        {badge && <span className={BADGE_POPULAR}>{badge}</span>}
      </div>
      <div className={incl ? BODY_INCL : BODY}>
        <h3 className={NAME}>{name}</h3>
        {meta && (
          <div className={META}>
            {metaIcon === 'pin' ? <MapPin strokeWidth={1.7} /> : <Clock strokeWidth={1.7} />}
            <span>{meta}</span>
          </div>
        )}
        {incl && inclText && (
          <div className={INCL}>
            {inclText.split('|')[0]}
            <strong>{inclText.split('|')[1]}</strong>
            {inclText.split('|')[2]}
          </div>
        )}
        {priceName && (
          <div className={FOOTER}>
            <div className={PRICE}>
              <span className={PRICE_FROM}>from</span> <Price name={priceName} mode={priceMode} fallback={priceFallback} />
            </div>
          </div>
        )}
        {children}
      </div>
    </>
  );

  const cls = `${CARD_FRAME} block [flex-direction:column]`;
  if (variant === 'article') {
    return (
      <article className={cls} data-program={program} data-zone={zone}>
        {body}
      </article>
    );
  }
  return (
    <a className={cls} href={href} data-zone={zone}>
      {body}
    </a>
  );
}
