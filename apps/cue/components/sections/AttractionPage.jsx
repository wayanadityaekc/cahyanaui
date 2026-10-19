import Img from '@/components/ui/Img';
import JsonLd from '@/components/JsonLd';
import { STOPS, STOP, STOP_IMAGE } from '@/components/ui/stopClasses';
import AttractionOverview from '@/components/sections/AttractionOverview';
import BookNowRow from '@/components/booking/BookNowRow';
import { buildGallery } from '@/lib/galleryFrom';
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
import Breadcrumb, { buildItemsFromLegacy } from '@/components/ui/Breadcrumb';
import TourComparisonBox from '@/components/booking/TourComparisonBox';
import { findToursContaining, priceFallbackFor } from '@/lib/tourIndex';

export default function AttractionPage({ data }) {
  const bookType = data.bookDefault || 'tour';
  const isPricedPerPerson = bookType === 'experience' || bookType === 'performance';
  const slug = (data.__page || '').replace('attractions/', '');
  const onTours = findToursContaining(slug);
  const gallery = buildGallery(data);
  const crumbPartsItem = (data.crumb || []).map((crumbPart, index, crumbParts) =>
    index === crumbParts.length - 1 && crumbPart.type === 'text' ? { ...crumbPart, text: data.title } : crumbPart,
  );
  return (
    <>
      <JsonLd page={data.__page} crumbs={buildItemsFromLegacy(crumbPartsItem)} />
      <DetailHero
        heroBg={data.heroBg}
        heroSlides={data.heroSlides}
        gallery={gallery}
        title={data.heading || data.title}
        desc={data.desc}
        hooks={data.hooks}
        cta={data.cta}
        ctaHref={data.ctaHref}
        crumb={gallery.length ? crumbPartsItem : undefined}
        ratingName={data.bookItem}
        belowChips={
          gallery.length && data.bookItem ? (
            <BookNowRow
              item={data.bookItem}
              priceFallback={priceFallbackFor(data.bookItem)}
              perPerson={isPricedPerPerson}
            />
          ) : null
        }
      />

      <div className={data.bookItem ? TOUR_LAYOUT_BOOK : undefined}>
        <div className={data.bookItem ? TOUR_LAYOUT_MAIN : undefined}>
          <DetailTabs
            overview={
              gallery.length ? (
                <AttractionOverview stops={data.stops} id={data.stopsId} />
              ) : (
                <div className={STOPS} id={data.stopsId}>
                  {data.stops.map((stop, index) => (
                    <article className={STOP} key={index}>
                      {stop.img && (
                        <div className={STOP_IMAGE}>
                          <Img src={`/assets/images/${stop.img}`} alt={stop.alt} width={stop.w} height={stop.hgt} />
                        </div>
                      )}
                      <div>
                        {stop.num && <span className={STOP_NUM}>{stop.num}</span>}
                        <h3 className={STOP_NAME}>{stop.name}</h3>
                        <p className={STOP_DESC} dangerouslySetInnerHTML={{ __html: stop.descHtml }} />
                      </div>
                    </article>
                  ))}
                </div>
              )
            }
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
              perPerson={isPricedPerPerson}
              facts={data.facts}
              belowPrice={<TourComparisonBox tours={onTours} />}
            />
          </div>
        )}
      </div>
      <BookCta item={data.bookItem} />
      <BookBar item={data.bookItem} priceFallback={priceFallbackFor(data.bookItem)} perPerson={isPricedPerPerson} />
      <Related href={data.__href} />
      {data.bookItem && <ReviewCtaBand />}

      {data.crumb && !gallery.length && <Breadcrumb items={buildItemsFromLegacy(data.crumb)} className={CRUMB_FOOT} />}
    </>
  );
}
