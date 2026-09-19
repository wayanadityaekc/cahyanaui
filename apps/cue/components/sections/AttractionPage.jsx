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
import { STOP_NUM, STOP_NAME, STOP_DESC, CRUMB_NAV, CRUMB_LINK, CRUMB_SEP } from '@/components/sections/TourPage';
import { isHiddenTour } from '@/lib/routes';
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
        reviewService={data.title}
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
