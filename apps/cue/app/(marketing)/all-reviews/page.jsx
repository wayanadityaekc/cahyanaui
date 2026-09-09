import ReviewsStrip from '@/components/reviews/ReviewsStrip';
import { SECTION_TITLE, SECTION_TITLE_SUB, ST_LEFT } from '@/components/ui/sectionTitle';
import { SUBHERO, SUBHERO_CONTENT, SUBHERO_TITLE, SUBHERO_TEXT } from '@/components/ui/subheroClasses';
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
      <section className={SUBHERO}>
        <div className={SUBHERO_CONTENT}>
          <h1 className={SUBHERO_TITLE}>Guest Reviews</h1>
          <p className={SUBHERO_TEXT}>
            Every review here comes from a guest with a real, completed booking - no invitations, no incentives, just
            what they told us after their trip.
          </p>
        </div>
      </section>

      {/* "reviews" kept as an inert marker className (no styling left on it) -
          needed by the shared `.reviews .section__title` rule in style.css
          (left-aligned heading + underline, out of scope: .section__title is
          a shared primitive reserved for B-FINAL). Own layout below (padding,
          header row) is Tailwind utilities (TW-A5, #326). */}
      <section className="reviews py-16 px-6" id="all-reviews">
        <div className="flex justify-between items-end gap-6 flex-wrap max-w-[1100px] mx-auto mb-[1.6rem] pb-[0.8rem]">
          <h2 className={`${SECTION_TITLE} ${ST_LEFT} !mb-0`}>All Reviews</h2>
          <ReviewCta />
        </div>
        <ReviewsStrip />
      </section>
    </>
  );
}
