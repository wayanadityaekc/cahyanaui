import ReviewsStrip from '@/components/reviews/ReviewsStrip';
import Breadcrumb from '@/components/ui/Breadcrumb';
import { crumbsFor } from '@/lib/crumbs';
import { SECTION_TITLE, ST_LEFT } from '@/components/ui/sectionTitle';
import { SUBHERO_TITLE } from '@/components/ui/subheroClasses';
import { CATSEC } from '@/components/ui/listingClasses';
import JsonLd from '@/components/JsonLd';
import ReviewCta from '@/components/reviews/ReviewCta';

export const metadata = {
  title: 'Guest Reviews | Cahyana Ubud Experience',
  description:
    'Reviews from guests who booked tours, transfers, and activities with Cahyana Ubud Experience in Bali - every one tied to a real, completed booking.',
  alternates: { canonical: '/all-reviews.html' },
};

export default function AllReviews() {
  return (
    <>
      <JsonLd page="all-reviews" />
      {/* Text-only header (crumb, h1, blurb), no photo band; pt- clears the fixed header like DetailHero's crumb. */}
      <section className="px-[var(--container-x)] pt-[calc(var(--header-h-max,92px)_+_var(--container-x))] min-[769px]:pt-[calc(var(--header-h-max,98px)_+_var(--container-x))] pb-6">
        <div className={CATSEC}>
          <Breadcrumb items={crumbsFor('all-reviews')} className="m-0 mb-2" />
          <h1 className={SUBHERO_TITLE}>Guest Reviews</h1>
          <p className="mt-4 max-w-[560px] m-0 font-body text-[length:var(--fs-body)] leading-[var(--lh-body)] text-muted">
            What guests say after booking with Cahyana Ubud Experience.
          </p>
        </div>
      </section>

      {/* Listing-page layout: padding on the outer section, CATSEC on the inner div (px on CATSEC doubles the gutter). */}
      <section className="px-[var(--container-x)]" id="all-reviews">
        <div className={CATSEC}>
          <div className="flex justify-between items-end gap-6 flex-wrap mb-[1.6rem] pb-[0.8rem]">
            <h2 className={`${SECTION_TITLE} ${ST_LEFT} !mb-0`}>All Reviews</h2>
            <ReviewCta />
          </div>
          <ReviewsStrip />
        </div>
      </section>
    </>
  );
}
