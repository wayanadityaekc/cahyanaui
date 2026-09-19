import { Clock, Info, MapPin, Route, ShieldCheck, Users } from 'lucide-react';
import { SUBHERO_TITLE } from '@/components/ui/subheroClasses';
import HeroSlider from '@/components/sections/HeroSlider';
import HeroMosaic from '@/components/sections/HeroMosaic';
import Rating from '@/components/Rating';
import { isHiddenTour } from '@/lib/routes';

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

// ---------------------------------------------------------------------------
// Gallery title block: breadcrumb, title, rating, chips - all flush LEFT at every
// width (Wayan, Sep 2026: "mobile bisa gak rating dan pill nya align kiri"). The
// facts became CHIPS rather than the split hero's label/value columns: a 354px-wide
// column row stranded itself in the middle of a 1232px content width when centred,
// and chips flow from the left and wrap on their own at any width, so one alignment
// works everywhere. Pills are already this site's vocabulary (zone-chip, guide-tag,
// the Popular badge), so this reads new without being a new idiom.
//
// The chips sit BELOW the photos (Wayan, Sep 2026, after a sheet of four shapes:
// "S1 bro"). That is the split Viator and GetYourGuide both use - the rating belongs
// beside the name, the spec belongs after the look - and it is free: the block is the
// same height either way, so the gallery simply starts 83px higher on a phone and
// 47px higher on desktop, filling a gap that was empty below it anyway (the hero CTA
// is gone, and it never showed on mobile).
//
// `tour-hook` rides on the chip list: it is a marker class check-detail requires on
// every detail page, and the <ul> it used to sit on is gone from this variant.
export const HERO_CRUMB = 'font-body text-small text-muted m-0 mb-2';
export const HERO_CRUMB_LINK = 'text-muted no-underline hover:underline';
export const HERO_CRUMB_SEP = 'mx-[0.35rem] opacity-[0.55]';
// Star sized explicitly - Lucide renders width/height=24, so an unsized icon blows
// up to 24px. amber-d matches the star on every card (design system: rating = amber).
export const HERO_RATING =
  'inline-flex items-center gap-[0.3rem] font-body text-small font-semibold text-amber-d [&>svg]:w-4 [&>svg]:h-4';
export const HERO_CHIPS = 'tour-hook list-none flex flex-wrap items-center gap-[0.45rem] mt-[1.1rem] mx-0 mb-0 p-0';
export const HERO_CHIP =
  'inline-flex items-center gap-[0.4rem] py-[0.35rem] px-3 rounded-pill [border:1px_solid_var(--color-line)] ' +
  'font-body text-small text-green whitespace-nowrap [&>svg]:w-4 [&>svg]:h-4 [&>svg]:text-muted';
// The one chip that answers a doubt rather than states a spec, so it carries the
// success colour. Same promise as the book bar and every card - not a new claim.
export const HERO_CHIP_OK = 'text-ok [border-color:rgba(46,125,84,0.35)] [&>svg]:text-ok';

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
export default function DetailHero({ heroBg, heroSlides, gallery, title, desc, hooks = [], cta, ctaHref, crumb, stops, ratingName, belowChips }) {
  if (gallery && gallery.length) {
    // Duration first, then the stop count, then the rest - the order Wayan picked.
    // A single stop is not worth a chip, and attraction pages have none at all.
    const chips = [];
    hooks.forEach((h, i) => {
      chips.push({ key: h.label, icon: CHIP_ICON[h.label] || Info, text: h.value });
      if (i === 0 && stops > 1) chips.push({ key: 'stops', icon: Route, text: `${stops} stops` });
    });
    if (!hooks.length && stops > 1) chips.push({ key: 'stops', icon: Route, text: `${stops} stops` });
    chips.push({ key: 'cancel', icon: ShieldCheck, text: 'Free cancellation', ok: true });
    return (
      // Title ABOVE the gallery (Wayan, Sep 2026: "title di atas image hero") -
      // Viator's order. The intro paragraph is gone from here on purpose: it moved
      // into the Overview section ("deskripsi di bawah title taruh di overview aja"),
      // so the hero is title, photos, facts, CTA.
      <section className="pt-[var(--header-h-max,92px)] min-[769px]:pt-[var(--header-h-max,98px)] px-[max(var(--container-x),calc((100%_-_1280px)_/_2))]">
        {crumb && (
          <nav className={HERO_CRUMB} aria-label="Breadcrumb">
            {crumb.map((p, i) =>
              p.type === 'link' && !isHiddenTour(p.href) ? (
                <a className={HERO_CRUMB_LINK} href={p.href} key={i}>{p.text}</a>
              ) : p.type === 'sep' ? (
                <span className={HERO_CRUMB_SEP} key={i}>{p.text}</span>
              ) : (
                <span key={i}>{p.text}</span>
              ),
            )}
          </nav>
        )}
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
        {/* Slot under the chips - the tour pages drop the inline price + Book now
            row in here, so it inherits this section's container padding instead of
            re-declaring it and drifting out of line with the gallery. */}
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
      <div className="relative z-[1] -mt-7 pt-9 px-6 pb-3 bg-white rounded-t-[var(--r-xl)] flex flex-col items-center text-center
        min-[769px]:mt-0 min-[769px]:pt-12 min-[769px]:pr-12 min-[769px]:pb-12 min-[769px]:pl-[max(1.5rem,calc((100vw-1280px)/2))]
        min-[769px]:bg-transparent min-[769px]:rounded-none min-[769px]:justify-center min-[769px]:items-start min-[769px]:text-left">
        <HeroBody title={title} desc={desc} hooks={hooks} cta={cta} ctaHref={ctaHref} />
      </div>
    </section>
  );
}
