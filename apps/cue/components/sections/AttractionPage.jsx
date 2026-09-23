import Img from '@/components/ui/Img';
import JsonLd from '@/components/JsonLd';
import { STOPS, STOP, STOP_IMAGE } from '@/components/ui/stopClasses';
import AttractionOverview from '@/components/sections/AttractionOverview';
import BookNowRow from '@/components/booking/BookNowRow';
import { galleryFrom } from '@/lib/galleryFrom';
import { TOUR_LAYOUT_BOOK, TOUR_LAYOUT_MAIN, TOUR_LAYOUT_SIDE } from '@/components/ui/tourLayoutClasses';
import BookCta from '@/components/booking/BookCta';
import BookSidebar from '@/components/booking/BookSidebar';
import BookBar from '@/components/booking/BookBar';
import DetailHero from '@/components/sections/DetailHero';
import Related from '@/components/sections/Related';
import ReviewCtaBand from '@/components/reviews/ReviewCtaBand';
import DetailTabs from '@/components/sections/DetailTabs';
import { STOP_NUM, STOP_NAME, STOP_DESC, CRUMB_FOOT } from '@/components/sections/TourPage';
import { isHiddenTour } from '@/lib/routes';
import Breadcrumb, { itemsFromLegacy } from '@/components/ui/Breadcrumb';
import TourComparisonBox from '@/components/booking/TourComparisonBox';
import { toursContaining, priceFallbackFor } from '@/lib/tourIndex';

export default function AttractionPage({ data }) {
  const bookType = data.bookDefault || 'tour';
  const perPerson = bookType === 'experience' || bookType === 'performance';
  // Which tours stop here, for the comparison box in the booking card. Reverse lookup
  // on refId, so a stop added to a tour shows up on this page by itself.
  const slug = (data.__page || '').replace('attractions/', '');
  const onTours = toursContaining(slug);
  // Same rollout as the tours (Wayan, Sep 2026: "Rollout bro") - the gallery is
  // built from this page's own hero photo and section photos, and a hand-picked
  // `gallery` in the content file overrides it.
  const gallery = galleryFrom(data);
  // The last crumb step used to be a second hand-typed copy of the title, so the two
  // could drift. It reads the short name straight off `title` now.
  const crumb = (data.crumb || []).map((p, i, a) =>
    i === a.length - 1 && p.type === 'text' ? { ...p, text: data.title } : p);
  return (
    <>
      <JsonLd page={data.__page} crumbs={itemsFromLegacy(crumb)} />
      <DetailHero
        heroBg={data.heroBg}
        heroSlides={data.heroSlides}
        gallery={gallery}
        title={data.heading || data.title}
        desc={data.desc}
        hooks={data.hooks}
        cta={data.cta}
        ctaHref={data.ctaHref}
        crumb={gallery.length ? crumb : undefined}
        ratingName={data.bookItem}
        belowChips={
          gallery.length && data.bookItem ? (
            <BookNowRow item={data.bookItem} priceFallback={priceFallbackFor(data.bookItem)} perPerson={perPerson} />
          ) : null
        }
      />

      <div className={data.bookItem ? TOUR_LAYOUT_BOOK : undefined}>
      <div className={data.bookItem ? TOUR_LAYOUT_MAIN : undefined}>
      <DetailTabs
        overview={gallery.length ? (
          // Gallery hero holds the photos, so the sections are text only.
          <AttractionOverview stops={data.stops} id={data.stopsId} />
        ) : (
          <div className={STOPS} id={data.stopsId}>
            {data.stops.map((s, i) => (
              <article className={STOP} key={i}>
                {s.img && (
                  <div className={STOP_IMAGE}>
                    <Img src={`/assets/images/${s.img}`} alt={s.alt} width={s.w} height={s.hgt} />
                  </div>
                )}
                <div>
                  {s.num && <span className={STOP_NUM}>{s.num}</span>}
                  <h3 className={STOP_NAME}>{s.name}</h3>
                  <p className={STOP_DESC} dangerouslySetInnerHTML={{ __html: s.descHtml }} />
                </div>
              </article>
            ))}
          </div>
        )}
        priceItem={data.bookItem}
        bookType={bookType}
        included={data.included}
        excluded={data.excluded}
        /* The key a review is WRITTEN under has to be the key the rating is READ
           under, and that is the catalog name (bookItem) - it is also what pricing
           uses, so it never moves. This read data.title until the short names were
           introduced, at which point the two would have drifted apart on 13 pages. */
        reviewService={data.bookItem || data.title}
      />
      </div>
      {data.bookItem && (
        <div className={TOUR_LAYOUT_SIDE}>
          <BookSidebar
            item={data.bookItem}
            presetType={bookType}
            perPerson={perPerson}
            facts={data.facts}
            belowPrice={<TourComparisonBox tours={onTours} />}
          />
        </div>
      )}
      </div>
      <BookCta item={data.bookItem} />
      {/* perPerson: the same flag the sidebar gets, so the bar's unit and the
          form's unit can never disagree (experiences are per person, tours per car). */}
      <BookBar item={data.bookItem} priceFallback={priceFallbackFor(data.bookItem)} perPerson={perPerson} />
      <Related href={data.__href} />
      {data.bookItem && <ReviewCtaBand />}

      {/* With the gallery hero the breadcrumb prints at the TOP of the page, so
          the foot copy is dropped rather than shown twice - same as TourPage. */}
      {data.crumb && !gallery.length && (
        <Breadcrumb items={itemsFromLegacy(data.crumb)} className={CRUMB_FOOT} />
      )}
    </>
  );
}
