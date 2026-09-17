import Img from '@/components/ui/Img';
import { SECTION_TITLE, SECTION_TITLE_SUB, ST_LEFT } from '@/components/ui/sectionTitle';
import TourDestinationCards from '@/components/sections/TourDestinationCards';
import { tourDestinations, priceFallbackFor } from '@/lib/tourIndex';
import { ATTRACTION_CONTENT } from '@/content/attractions';

import { STOPS, STOP, STOP_IMAGE } from '@/components/ui/stopClasses';
import { TOUR_LAYOUT_BOOK, TOUR_LAYOUT_MAIN, TOUR_LAYOUT_SIDE } from '@/components/ui/tourLayoutClasses';
import JsonLd from '@/components/JsonLd';
import BookCta from '@/components/booking/BookCta';
import BookSidebar from '@/components/booking/BookSidebar';
import BookBar from '@/components/booking/BookBar';
import DetailHero from '@/components/sections/DetailHero';
import Related from '@/components/sections/Related';
import ReviewCtaBand from '@/components/reviews/ReviewCtaBand';
import DetailTabs from '@/components/sections/DetailTabs';
import { isHiddenTour } from '@/lib/routes';

// Tailwind-native (migrasi Fase 2): teks stop (.stop__num/.stop__name/.stop__desc)
// -> utilities; .stop__body (tanpa CSS) -> drop class; .stop--link (link + hover
// lift) -> utilities. DIPERTAHANKAN sbg CSS: .stop (grid layout engine, di-scope
// .dtabs__sec .stop) + .stop__image (primitif foto shared, .stop__image > img).
export const STOP_NUM = 'inline-block mb-[0.6rem] text-label font-medium tracking-[0.14em] uppercase text-muted';
export const STOP_NAME = 'mb-[0.6rem] font-body text-h3 font-semibold tracking-[0]';
export const STOP_DESC = 'font-body text-body leading-[var(--lh-body)] font-normal';
// Linked stop = the same STOP grid layout (incl. its `stop` hook for DetailTabs'
// [&_.stop]:max-w-none) plus link-only styling.
// Breadcrumb (migrasi Fase 2): presentasi -> utilities. Kelas `crumb` DIPERTAHANKAN
// sbg marker: dipakai anchor sibling `.crumb + .related::before` (matiin divider dobel).
export const CRUMB_NAV = 'crumb max-w-none m-0 py-5 px-6 text-center [border-top:1px_solid_#e0ddd4] [border-bottom:1px_solid_#e0ddd4] text-h3 text-muted';
export const CRUMB_LINK = 'text-gold no-underline font-medium hover:underline';
export const CRUMB_SEP = 'mx-[0.4rem] opacity-[0.55]';
// The hero itself now lives in DetailHero (shared with AttractionPage and the guide
// articles). Its class names are re-exported here because other modules already import
// them from this file.
export { HOOK_UL, HOOK_LABEL, HOOK_VALUE, HERO_DESC, HERO_CTA } from '@/components/sections/DetailHero';

function Stop({ s }) {
  const inner = (
    <>
      {s.img ? (
        <div className={STOP_IMAGE}>
          <Img src={`/assets/images/${s.img}`} alt={s.alt} width={s.w} height={s.hgt} />
        </div>
      ) : s.gradient ? (
        <div className={STOP_IMAGE} style={{ backgroundImage: s.gradient.replace(/^background-image:\s*/, '').replace(/;$/, '') }} />
      ) : null}
      <div>
        {s.num && <span className={STOP_NUM}>{s.num}</span>}
        <h3 className={STOP_NAME}>{s.name}</h3>
        <p className={STOP_DESC} dangerouslySetInnerHTML={{ __html: s.highlight }} />
      </div>
    </>
  );
  // Stops are plain text. They used to link to /attractions/<refId>.html, which
  // dropped a guest mid-decision onto a page quoting a second, single-destination
  // price - the confusion this change exists to remove. The way through is the
  // destination carousel at the bottom, so the tour sidebar stays the only price
  // on screen while they read.
  return <article className={STOP}>{inner}</article>;
}

export default function TourPage({ data }) {
  const slug = (data.__page || '').replace(/^\//, '');
  const destinations = tourDestinations(slug, ATTRACTION_CONTENT);
  return (
    <>
      <JsonLd page={data.__page} />
      <DetailHero
        heroBg={data.heroBg}
        heroSlides={data.heroSlides}
        title={data.title}
        desc={data.desc}
        hooks={data.hooks}
        cta={data.cta}
        ctaHref={data.ctaHref}
      />

      <div className={data.bookItem ? TOUR_LAYOUT_BOOK : undefined}>
      <div className={data.bookItem ? TOUR_LAYOUT_MAIN : undefined}>
      <DetailTabs
        overview={(
          <div className={STOPS} id={data.stopsId}>
            {data.items.map((it, i) =>
              it.type === 'sub' ? (
                <h3 className={`${SECTION_TITLE_SUB} [transform:translateX(var(--title-shift,0px))]`} key={i}>{it.text}</h3>
              ) : (
                <Stop s={it} key={i} />
              ),
            )}
          </div>
        )}
        priceItem={data.bookItem}
        included={data.included}
        excluded={data.excluded}
        reviewService={data.title}
      />
      </div>
      {data.bookItem && (
        <div className={TOUR_LAYOUT_SIDE}>
          <BookSidebar item={data.bookItem} facts={data.facts} />
        </div>
      )}
      </div>
      <BookCta item={data.bookItem} />
      <BookBar item={data.bookItem} priceFallback={priceFallbackFor(data.bookItem)} />
      <TourDestinationCards items={destinations} />
      <Related href={data.__href} />
      {data.bookItem && <ReviewCtaBand />}

      {data.bookItem && (
        <div id="book-modal-placeholder" data-default={data.bookDefault} data-item={data.bookItem} />
      )}

      {data.crumb && (
        <nav className={CRUMB_NAV} aria-label="Breadcrumb">
          {data.crumb.map((p, i) =>
            p.type === 'link' && !isHiddenTour(p.href) ? (
              <a className={CRUMB_LINK} href={p.href} key={i}>{p.text}</a>
            ) : p.type === 'sep' ? (
              <span className={CRUMB_SEP} key={i}>{p.text}</span>
            ) : (
              <span key={i}>{p.text}</span>
            ),
          )}
        </nav>
      )}
    </>
  );
}
