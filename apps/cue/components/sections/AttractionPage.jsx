import Img from '@/components/ui/Img';
import JsonLd from '@/components/JsonLd';
import { SUBHERO_TITLE } from '@/components/ui/subheroClasses';
import { STOPS, STOP, STOP_IMAGE } from '@/components/ui/stopClasses';
import { TOUR_LAYOUT_BOOK, TOUR_LAYOUT_MAIN, TOUR_LAYOUT_SIDE } from '@/components/ui/tourLayoutClasses';
import BookCta from '@/components/booking/BookCta';
import BookSidebar from '@/components/booking/BookSidebar';
import BookBar from '@/components/booking/BookBar';
import HeroSlider from '@/components/sections/HeroSlider';
import Related from '@/components/sections/Related';
import ReviewCtaBand from '@/components/reviews/ReviewCtaBand';
import DetailTabs from '@/components/sections/DetailTabs';
import { STOP_NUM, STOP_NAME, STOP_DESC, CRUMB_NAV, CRUMB_LINK, CRUMB_SEP, HOOK_UL, HOOK_LABEL, HOOK_VALUE, HERO_DESC, HERO_CTA } from '@/components/sections/TourPage';
import { isHiddenTour } from '@/lib/routes';
import { isHiddenItem } from '@/lib/hiddenItems';
import InfoSidebar from '@/components/booking/InfoSidebar';
import VisitOnSidebar from '@/components/booking/VisitOnSidebar';
import { visitOptions } from '@/lib/tourIndex';

// PROTOTYPE (Wayan, Sep 2026) - the destination flow is live on this slug only
// while he looks at it. Rollout = drop this list and key off data.type alone;
// tools/check-detail.js reads the same list.
const INFO_ONLY = ['tanah-lot'];

export default function AttractionPage({ data }) {
  const bookType = data.bookDefault || 'tour';
  const perPerson = bookType === 'experience' || bookType === 'performance';
  // Parent tour parked: keep the two-column layout and the hero CTA anchor, but
  // nothing on the page may take a booking for it. bookItem going null switches
  // off the price tab, BookCta and the sticky BookBar; the sidebar becomes the
  // non-selling InfoSidebar.
  const parked = isHiddenItem(data.bookItem);
  // A destination is an information page, not a product: one place can sit on
  // several tours, so it shows which tours stop there instead of selling one.
  const slug = (data.__page || '').replace('attractions/', '');
  const infoOnly = data.type === 'destination' && INFO_ONLY.includes(slug);
  const visits = infoOnly ? visitOptions(slug) : [];
  const bookItem = parked || infoOnly ? null : data.bookItem;
  return (
    <>
      <JsonLd page={data.__page} />
      {/* Split hero (photo + white body). Fully Tailwind now; no tour-hero marker classes.
          pt- reserves clearance under the fixed navbar (--header-h, published by Navbar's
          ResizeObserver) so the photo's top edge isn't hidden under it - was a hardcoded
          6.5rem sized for navbar+tripbar together; now that the tripbar is homepage-only,
          that stale value left the mobile photo uncovered (no pt- at all) and desktop with
          ~46px of dead gap. Fallbacks match the navbar-only heights (57.6/52.8px). */}
      <section className="pt-[var(--header-h,52.8px)] min-[769px]:grid min-[769px]:grid-cols-[45%_55%] min-[769px]:items-stretch min-[769px]:min-h-[62vh] min-[769px]:pt-[var(--header-h,57.6px)]">
        {data.heroSlides && data.heroSlides.length > 1 ? (
          <HeroSlider slides={data.heroSlides} />
        ) : (
          <div
            className="min-h-[48vh] bg-green bg-cover bg-center min-[769px]:order-1 min-[769px]:min-h-0"
            style={{ backgroundImage: `url(/assets/images/${data.heroBg})` }}
          />
        )}
        <div className="relative z-[1] -mt-7 pt-9 px-6 pb-3 bg-white rounded-t-[var(--r-xl)] flex flex-col items-center text-center
          min-[769px]:mt-0 min-[769px]:pt-12 min-[769px]:pr-12 min-[769px]:pb-12 min-[769px]:pl-[max(1.5rem,calc((100vw-1280px)/2))]
          min-[769px]:bg-transparent min-[769px]:rounded-none min-[769px]:justify-center min-[769px]:items-start min-[769px]:text-left">
          <h1 className={`${SUBHERO_TITLE} mb-3`}>{data.title}</h1>
          <p className={HERO_DESC}>{data.desc}</p>
          <ul className={HOOK_UL}>
            {data.hooks.map((h) => (
              <li key={h.label}>
                <span className={HOOK_LABEL}>{h.label}</span>
                <span className={HOOK_VALUE}>{h.value}</span>
              </li>
            ))}
          </ul>
          <a href={data.ctaHref} className={HERO_CTA}>{infoOnly && visits.length ? 'See the tours' : parked || infoOnly ? 'Plan a visit' : data.cta}</a>
        </div>
      </section>

      <div className={data.bookItem ? TOUR_LAYOUT_BOOK : undefined}>
      <div className={data.bookItem ? TOUR_LAYOUT_MAIN : undefined}>
      <DetailTabs
        overview={(
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
        priceItem={bookItem}
        bookType={bookType}
        included={infoOnly ? undefined : data.included}
        excluded={infoOnly ? undefined : data.excluded}
        reviewService={data.title}
        showReviews={!infoOnly}
      />
      </div>
      {data.bookItem && (
        <div className={TOUR_LAYOUT_SIDE}>
          {infoOnly && visits.length ? (
            <VisitOnSidebar tours={visits} />
          ) : parked || infoOnly ? (
            <InfoSidebar facts={data.facts} />
          ) : (
            <BookSidebar item={bookItem} presetType={bookType} perPerson={perPerson} facts={data.facts} />
          )}
        </div>
      )}
      </div>
      <BookCta item={bookItem} />
      <BookBar item={bookItem} />
      <Related href={data.__href} />
      {data.bookItem && !infoOnly && <ReviewCtaBand />}

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
