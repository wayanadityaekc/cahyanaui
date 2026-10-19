import Img from '@/components/ui/Img';
import { SECTION_TITLE, SECTION_TITLE_SUB, ST_LEFT } from '@/components/ui/sectionTitle';
import TourDestinationCards from '@/components/sections/TourDestinationCards';
import { listTourDestinations, priceFallbackFor } from '@/lib/tourIndex';
import { buildGallery } from '@/lib/galleryFrom';
import { ATTRACTION_CONTENT } from '@/content/attractions';

import { STOPS, STOP, STOP_IMAGE } from '@/components/ui/stopClasses';
import { TOUR_LAYOUT_BOOK, TOUR_LAYOUT_MAIN, TOUR_LAYOUT_SIDE } from '@/components/ui/tourLayoutClasses';
import JsonLd from '@/components/JsonLd';
import BookCta from '@/components/booking/BookCta';
import BookSidebar from '@/components/booking/BookSidebar';
import BookBar from '@/components/booking/BookBar';
import BookNowRow from '@/components/booking/BookNowRow';
import DetailHero from '@/components/sections/DetailHero';
import TourOverview from '@/components/sections/TourOverview';
import Related from '@/components/sections/Related';
import ReviewCtaBand from '@/components/reviews/ReviewCtaBand';
import DetailTabs from '@/components/sections/DetailTabs';
import { isHiddenTour } from '@/lib/routes';
import Breadcrumb, { buildItemsFromLegacy } from '@/components/ui/Breadcrumb';

export const STOP_NUM = 'inline-block mb-[0.6rem] text-label font-medium tracking-[0.14em] uppercase text-muted';
export const STOP_NAME = 'mb-[0.6rem] font-body text-h3 font-semibold tracking-[0]';
export const STOP_DESC = 'font-body text-body leading-[var(--lh-body)] font-normal';
export const CRUMB_FOOT =
  'crumb max-w-none m-0 py-5 px-6 [border-top:1px_solid_var(--line)] [border-bottom:1px_solid_var(--line)] [&>ol]:justify-center';
export { HOOK_UL, HOOK_LABEL, HOOK_VALUE, HERO_DESC, HERO_CTA } from '@/components/sections/DetailHero';

function Stop({ s: stop }) {
  const inner = (
    <>
      {stop.img ? (
        <div className={STOP_IMAGE}>
          <Img src={`/assets/images/${stop.img}`} alt={stop.alt} width={stop.w} height={stop.hgt} />
        </div>
      ) : stop.gradient ? (
        <div
          className={STOP_IMAGE}
          style={{ backgroundImage: stop.gradient.replace(/^background-image:\s*/, '').replace(/;$/, '') }}
        />
      ) : null}
      <div>
        {stop.num && <span className={STOP_NUM}>{stop.num}</span>}
        <h3 className={STOP_NAME}>{stop.name}</h3>
        <p className={STOP_DESC} dangerouslySetInnerHTML={{ __html: stop.highlight }} />
      </div>
    </>
  );
  return <article className={STOP}>{inner}</article>;
}

export default function TourPage({ data }) {
  const slug = (data.__page || '').replace(/^\//, '');
  const destinations = listTourDestinations(slug, ATTRACTION_CONTENT);
  const gallery = buildGallery(data);
  return (
    <>
      <JsonLd page={data.__page} />
      <DetailHero
        heroBg={data.heroBg}
        heroSlides={data.heroSlides}
        gallery={gallery}
        title={data.title}
        desc={data.desc}
        hooks={data.hooks}
        cta={data.cta}
        ctaHref={data.ctaHref}
        crumb={gallery.length ? data.crumb : undefined}
        stops={data.items.filter((it) => it.type === 'stop').length}
        ratingName={data.bookItem}
        belowChips={
          gallery.length && data.bookItem ? (
            <BookNowRow item={data.bookItem} priceFallback={priceFallbackFor(data.bookItem)} />
          ) : null
        }
      />

      <div className={data.bookItem ? TOUR_LAYOUT_BOOK : undefined}>
        <div className={data.bookItem ? TOUR_LAYOUT_MAIN : undefined}>
          <DetailTabs
            overview={
              gallery.length ? (
                <div id={data.stopsId}>
                  <TourOverview intro={data.desc} items={data.items} />
                </div>
              ) : (
                <div className={STOPS} id={data.stopsId}>
                  {data.items.map((it, index) =>
                    it.type === 'sub' ? (
                      <h3 className={`${SECTION_TITLE_SUB} [transform:translateX(var(--title-shift,0px))]`} key={index}>
                        {it.text}
                      </h3>
                    ) : (
                      <Stop s={it} key={index} />
                    ),
                  )}
                </div>
              )
            }
            priceItem={data.bookItem}
            included={data.included}
            excluded={data.excluded}
            reviewService={data.bookItem || data.title}
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

      {data.bookItem && <div id="book-modal-placeholder" data-default={data.bookDefault} data-item={data.bookItem} />}

      {data.crumb && !gallery.length && <Breadcrumb items={buildItemsFromLegacy(data.crumb)} className={CRUMB_FOOT} />}
    </>
  );
}
