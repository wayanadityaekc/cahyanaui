import ReviewsStrip from '@/components/reviews/ReviewsStrip';
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
      <section className="subhero">
        <div className="subhero__content">
          <h1 className="subhero__title">Guest Reviews</h1>
          <p className="subhero__text">
            Every review here comes from a guest with a real, completed booking - no invitations, no incentives, just
            what they told us after their trip.
          </p>
        </div>
      </section>

      <section className="reviews" id="all-reviews">
        <div className="reviews__head">
          <h2 className="section__title">All Reviews</h2>
          <ReviewCta />
        </div>
        <ReviewsStrip />
      </section>
    </>
  );
}
