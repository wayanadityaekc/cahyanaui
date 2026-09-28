import ReviewsStrip from '@/components/reviews/ReviewsStrip';
import Breadcrumb from '@/components/ui/Breadcrumb';
import { crumbsFor } from '@/lib/crumbs';
import { SECTION_TITLE, ST_LEFT } from '@/components/ui/sectionTitle';
import { SUBHERO, SUBHERO_CONTENT, SUBHERO_TEXT } from '@/components/ui/subheroClasses';
import { CATSEC } from '@/components/ui/listingClasses';
import JsonLd from '@/components/JsonLd';
import ReviewCta from '@/components/reviews/ReviewCta';

export const metadata = {
  title: 'Guest Reviews | Cahyana Ubud Experience',
  description:
    'Reviews from guests who booked tours, transfers, and activities with Cahyana Ubud Experience in Bali - every one tied to a real, completed booking.',
  alternates: { canonical: '/all-reviews.html' },
};

// H1 white, not the shared SUBHERO_TITLE's --color-gold (soft-black - near
// invisible against this hero's own dark photo overlay, measured before this
// change: text barely readable while the paragraph under it, already
// text-cream, was fine). Local to this page - SUBHERO_TITLE is shared by
// legal/FAQ/itinerary/guide-hub, whose own backgrounds were not audited here.
const HERO_TITLE_WHITE =
  'font-head text-[length:var(--fs-display)] leading-[var(--lh-heading)] text-white font-bold tracking-[-0.01em]';

export default function AllReviews() {
  return (
    <>
      <JsonLd page="all-reviews" />
      <section className={SUBHERO}>
        <div className={SUBHERO_CONTENT}>
          <Breadcrumb items={crumbsFor('all-reviews')} className="mb-2" />
          <h1 className={HERO_TITLE_WHITE}>Guest Reviews</h1>
          <p className={SUBHERO_TEXT}>What guests say after booking with Cahyana Ubud Experience.</p>
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
