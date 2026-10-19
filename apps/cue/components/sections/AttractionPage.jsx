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
  const slug = (data.__page || '').replace('attractions/', '');
  const onTours = toursContaining(slug);
  const gallery = galleryFrom(data);
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
      <BookBar item={data.bookItem} priceFallback={priceFallbackFor(data.bookItem)} perPerson={perPerson} />
      <Related href={data.__href} />
      {data.bookItem && <ReviewCtaBand />}

      {data.crumb && !gallery.length && (
        <Breadcrumb items={itemsFromLegacy(data.crumb)} className={CRUMB_FOOT} />
      )}
    </>
  );
}
