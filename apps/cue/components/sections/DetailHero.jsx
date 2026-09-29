import { BTN_SM } from '@/components/ui/btnClasses';
import { Clock, Info, MapPin, Route, ShieldCheck, Users } from 'lucide-react';
import { SUBHERO_TITLE } from '@/components/ui/subheroClasses';
import HeroSlider from '@/components/sections/HeroSlider';
import HeroMosaic from '@/components/sections/HeroMosaic';
import Rating from '@/components/Rating';
import { isHiddenTour } from '@/lib/routes';
import Breadcrumb, { itemsFromLegacy } from '@/components/ui/Breadcrumb';
import { CHIP, CHIP_OK } from '@/components/ui/chipClasses';

// Hero for tour/attraction/guide pages; top padding reads --header-h-max (full header), not --header-h (nav row only).
export const HERO_DESC = 'max-w-[460px] m-0 text-[#3d3d3d]';
export const HERO_CTA =
  `inline-flex mt-[1.6rem] ${BTN_SM} bg-cta text-white no-underline ` +
  '[transition:background-color_var(--dur)_ease,scale_var(--dur-fast)_var(--ease)] hover:bg-cta-d [@media(max-width:768px)]:hidden';
// Split-hero fact list; keep the `tour-hook` class, check-detail requires it.
export const HOOK_UL =
  'tour-hook list-none flex justify-center mt-6 mx-0 mb-0 p-0 [&>li]:flex [&>li]:flex-col [&>li]:px-4 ' +
  'min-[769px]:[&>li]:px-[22px] [&>li+li]:[border-left:1px_solid_var(--line)]';
export const HOOK_LABEL = 'text-small font-normal tracking-[0] normal-case text-muted';
export const HOOK_VALUE = 'mt-[0.2rem] text-small font-medium text-ink min-[769px]:text-h3 min-[769px]:whitespace-nowrap';

// Breadcrumb position only (its look is Breadcrumb's): straight above the page title, 8px clear.
export const HERO_CRUMB = 'm-0 mb-2';
export const HERO_CRUMB_LINK = 'text-muted no-underline hover:underline';
export const HERO_CRUMB_SEP = 'mx-[0.35rem] opacity-[0.55]';
// Rating star needs an explicit size (Lucide defaults to 24px); amber-d matches the card stars.
export const HERO_RATING =
  'inline-flex items-center gap-[0.3rem] font-body text-small font-semibold text-amber-d [&>svg]:w-4 [&>svg]:h-4';
export const HERO_CHIPS = 'tour-hook list-none flex flex-wrap items-center gap-[0.45rem] mt-[1.1rem] mx-0 mb-0 p-0';
// Chip pill comes from ui/chipClasses, shared with the transfer/airport/activities fact strips.
export const HERO_CHIP = CHIP;
// Success-coloured chip for the free-cancellation promise.
export const HERO_CHIP_OK = CHIP_OK;

// Attraction pages label the same fact "Time here" where tours say "Duration".
const CHIP_ICON = { Duration: Clock, 'Time here': Clock, Area: MapPin, Group: Users, 'Pick-up': MapPin };

function Chip({ icon: Icon, text, ok }) {
  return (
    <li className={ok ? `${HERO_CHIP} ${HERO_CHIP_OK}` : HERO_CHIP}>
      <Icon aria-hidden="true" />
      <span>{text}</span>
    </li>
  );
}


function HeroBody({ title, desc, hooks, cta, ctaHref, crumb }) {
  return (
    <>
      {crumb && <Breadcrumb items={crumb[0] && crumb[0].type ? itemsFromLegacy(crumb) : crumb} className={HERO_CRUMB} />}
      <h1 className={`${SUBHERO_TITLE} mb-3`}>{title}</h1>
      <p className={HERO_DESC}>{desc}</p>
      <ul className={HOOK_UL}>
        {hooks.map((h) => (
          <li key={h.label}>
            <span className={HOOK_LABEL}>{h.label}</span>
            <span className={HOOK_VALUE}>{h.value}</span>
          </li>
        ))}
      </ul>
      {cta && <a href={ctaHref} className={HERO_CTA}>{cta}</a>}
    </>
  );
}

// `gallery` switches to the mosaic hero: crumb, title, rating, photo mosaic, then chips; otherwise the split hero.
export default function DetailHero({ heroBg, heroSlides, gallery, title, desc, hooks = [], cta, ctaHref, crumb, stops, ratingName, belowChips }) {
  if (gallery && gallery.length) {
    // Chip order: duration, then stop count (only if more than one), then the rest, then free cancellation.
    const chips = [];
    hooks.forEach((h, i) => {
      chips.push({ key: h.label, icon: CHIP_ICON[h.label] || Info, text: h.value });
      if (i === 0 && stops > 1) chips.push({ key: 'stops', icon: Route, text: `${stops} stops` });
    });
    if (!hooks.length && stops > 1) chips.push({ key: 'stops', icon: Route, text: `${stops} stops` });
    chips.push({ key: 'cancel', icon: ShieldCheck, text: 'Free cancellation', ok: true });
    return (
      // Top padding = header height + one --container-x, so the crumb sits one gutter below the navbar.
      <section className="pt-[calc(var(--header-h-max,92px)_+_var(--container-x))] min-[769px]:pt-[calc(var(--header-h-max,98px)_+_var(--container-x))] px-[max(var(--container-x),calc((100%_-_1280px)_/_2))]">
        {crumb && <Breadcrumb items={itemsFromLegacy(crumb)} className={HERO_CRUMB} />}
        <h1 className={`${SUBHERO_TITLE} mb-2 text-left`}>{title}</h1>
        {ratingName && (
          <div className="mb-[0.9rem]">
            <Rating name={ratingName} className={HERO_RATING} withWord />
          </div>
        )}
        <HeroMosaic photos={gallery} title={title} />
        <ul className={HERO_CHIPS}>
          {chips.map((c) => (
            <Chip key={c.key} icon={c.icon} text={c.text} ok={c.ok} />
          ))}
        </ul>
        {/* Slot under the chips (tour price + Book now row), so it shares this section's padding. */}
        {belowChips}
      </section>
    );
  }
  return (
    <section className="pt-[var(--header-h-max,92px)] min-[769px]:grid min-[769px]:grid-cols-[45%_55%] min-[769px]:items-stretch min-[769px]:min-h-[62vh] min-[769px]:pt-[var(--header-h-max,98px)]">
      {heroSlides && heroSlides.length > 1 ? (
        <HeroSlider slides={heroSlides} />
      ) : (
        <div
          className="min-h-[48vh] bg-green bg-cover bg-center min-[769px]:order-1 min-[769px]:min-h-0"
          style={{ backgroundImage: `url(/assets/images/${heroBg})` }}
        />
      )}
      <div className="relative z-[1] -mt-7 pt-9 px-[var(--container-x)] pb-3 bg-white rounded-t-[var(--r-xl)] flex flex-col items-start text-left
        min-[769px]:mt-0 min-[769px]:pt-12 min-[769px]:pr-12 min-[769px]:pb-12 min-[769px]:pl-[max(1.5rem,calc((100vw-1280px)/2))]
        min-[769px]:bg-transparent min-[769px]:rounded-none min-[769px]:justify-center">
        <HeroBody title={title} desc={desc} hooks={hooks} cta={cta} ctaHref={ctaHref} crumb={crumb} />
      </div>
    </section>
  );
}
