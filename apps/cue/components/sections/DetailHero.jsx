import { SUBHERO_TITLE } from '@/components/ui/subheroClasses';
import HeroSlider from '@/components/sections/HeroSlider';
import HeroMosaic from '@/components/sections/HeroMosaic';

// The split hero every "detail" page opens with: photo on one side, a white sheet
// carrying the title, the intro line, a row of facts and a CTA on the other. It was
// duplicated byte-for-byte in TourPage and AttractionPage; it now also runs the guide
// articles (Sep 2026, Wayan: "ubah semua page articles, pakai layout seperti tour
// destination dan experience, biar punya ciri khasnya"), so it lives in one place.
//
// pt- reserves clearance under the fixed header (navbar + trip bar). It reads
// --header-h-max, NOT --header-h: the trip bar retracts on scroll, and pinning the
// padding to the live height would shift the whole document up ~39px the moment it
// does. Fallbacks = the measured full header (92px HP / 98px desktop), so the photo is
// not clipped on the first paint before Navbar publishes the real numbers.
export const HERO_DESC = 'max-w-[460px] m-0 text-[#3d3d3d]';
export const HERO_CTA =
  'inline-block mt-[1.6rem] py-[0.8rem] px-8 rounded-pill bg-cta text-white font-semibold no-underline ' +
  '[transition:background-color_var(--dur)_ease,scale_var(--dur-fast)_var(--ease)] hover:bg-cta-d [@media(max-width:768px)]:hidden';
// Fact hooks in the hero. The `tour-hook` class is KEPT as the marker check-detail
// looks for. Breakpoint min-[769px] (not md:/768) to match @media (min-width:769px)
// exactly. The li divider comes from [&>li+li]; children are styled from the <ul>
// ([&>li]) to stay DRY - one context, the hero.
export const HOOK_UL =
  'tour-hook list-none flex justify-center mt-6 mx-0 mb-0 p-0 [&>li]:flex [&>li]:flex-col [&>li]:px-4 ' +
  'min-[769px]:[&>li]:px-[22px] [&>li+li]:[border-left:1px_solid_#e6e6e6]';
export const HOOK_LABEL = 'text-small font-normal tracking-[0] normal-case text-muted';
export const HOOK_VALUE = 'mt-[0.2rem] text-small font-medium text-ink min-[769px]:text-h3 min-[769px]:whitespace-nowrap';

// The fact row is centred in the split hero (the sheet centres everything on a
// phone) but left-aligned under the gallery, where there is nothing to centre on.
export const HOOK_UL_LEFT = HOOK_UL.replace('justify-center', 'justify-start [&>li:first-child]:pl-0');

function HeroBody({ title, desc, hooks, cta, ctaHref }) {
  return (
    <>
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

// Gallery variant (Wayan, Sep 2026): pass `gallery` and the hero becomes the
// Viator/GetYourGuide shape - a photo mosaic across the full content width, with
// the title above it and the facts and CTA underneath, instead of a single photo
// beside a sheet. Padding-x matches TOUR_LAYOUT_BOOK so the mosaic lines up with
// the content below it. Same component either way, so a rollout is one prop per
// page and nothing else moves.
export default function DetailHero({ heroBg, heroSlides, gallery, title, desc, hooks = [], cta, ctaHref }) {
  if (gallery && gallery.length) {
    return (
      // Title ABOVE the gallery (Wayan, Sep 2026: "title di atas image hero") -
      // Viator's order. The intro paragraph is gone from here on purpose: it moved
      // into the Overview section ("deskripsi di bawah title taruh di overview aja"),
      // so the hero is title, photos, facts, CTA.
      <section className="pt-[var(--header-h-max,92px)] min-[769px]:pt-[var(--header-h-max,98px)] px-[max(var(--container-x),calc((100%_-_1280px)_/_2))]">
        <h1 className={`${SUBHERO_TITLE} mb-4 text-left`}>{title}</h1>
        <HeroMosaic photos={gallery} title={title} />
        <div className="flex flex-col items-start mt-5 text-left">
          <ul className={HOOK_UL_LEFT}>
            {hooks.map((h) => (
              <li key={h.label}>
                <span className={HOOK_LABEL}>{h.label}</span>
                <span className={HOOK_VALUE}>{h.value}</span>
              </li>
            ))}
          </ul>
          {cta && <a href={ctaHref} className={HERO_CTA}>{cta}</a>}
        </div>
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
      <div className="relative z-[1] -mt-7 pt-9 px-6 pb-3 bg-white rounded-t-[var(--r-xl)] flex flex-col items-center text-center
        min-[769px]:mt-0 min-[769px]:pt-12 min-[769px]:pr-12 min-[769px]:pb-12 min-[769px]:pl-[max(1.5rem,calc((100vw-1280px)/2))]
        min-[769px]:bg-transparent min-[769px]:rounded-none min-[769px]:justify-center min-[769px]:items-start min-[769px]:text-left">
        <HeroBody title={title} desc={desc} hooks={hooks} cta={cta} ctaHref={ctaHref} />
      </div>
    </section>
  );
}
