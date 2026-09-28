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
      {/* No photo (Wayan, Sep 2026: "gausah isi hero image cukup h1 dan deskripsi
          singkat dan breadcrumb") - plain text header instead of the SUBHERO photo
          band. pt- clears the fixed header the same way DetailHero's own crumb
          block does; SUBHERO_TITLE reads fine here (soft-black on white/cream, the
          same combination the listing pages already use for their own H1). */}
      <section className="px-[var(--container-x)] pt-[calc(var(--header-h-max,92px)_+_var(--container-x))] min-[769px]:pt-[calc(var(--header-h-max,98px)_+_var(--container-x))] pb-6">
        <div className={CATSEC}>
          <Breadcrumb items={crumbsFor('all-reviews')} className="m-0 mb-2" />
          <h1 className={SUBHERO_TITLE}>Guest Reviews</h1>
          <p className="mt-4 max-w-[560px] m-0 font-body text-[length:var(--fs-body)] leading-[var(--lh-body)] text-muted">
            What guests say after booking with Cahyana Ubud Experience.
          </p>
        </div>
      </section>

      {/* CATSEC: same container width + vertical rhythm as the listing pages
          (tour/activities/destinations), not this page's own ad hoc
          max-w-[1100px]/py-16 - Wayan, Sep 2026: "use the template of listing
          page ... hero and layout". CATSEC's own max-w already assumes it is
          sitting inside a padded ancestor (ListingPage nests it that way) -
          putting `px` on the SAME element as CATSEC's max-w double-counts
          the gutter (measured: 32px, not 16). Outer section carries the
          padding, CATSEC goes on the inner div, same split ListingPage uses. */}
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
