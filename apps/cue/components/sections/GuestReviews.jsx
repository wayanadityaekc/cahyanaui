import ReviewsStrip from '@/components/reviews/ReviewsStrip';
import { SECTION_TITLE, SECTION_TITLE_SUB, ST_LEFT } from '@/components/ui/sectionTitle';

// Homepage reviews slider (real reviews only, empty state otherwise); internal links need the .html suffix.
export default function GuestReviews() {
  return (
    <section className="py-16 px-[var(--container-x)]" id="reviews">
      <div className="flex justify-between items-end gap-6 flex-wrap max-w-[1100px] mx-auto mb-[1.6rem] pb-[0.8rem]">
        <h2 className={`${SECTION_TITLE} ${ST_LEFT} !mb-0`}>Guest Reviews</h2>
        <a className="inline-block text-gold-d font-medium no-underline hover:underline" href="/all-reviews.html">See all reviews &rsaquo;</a>
      </div>
      <ReviewsStrip
        variant="slider"
        limit={10}
        emptyText="Reviews are on their way - be one of the first to share your trip."
        emptyCta
      />
    </section>
  );
}
