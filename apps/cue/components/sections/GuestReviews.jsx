import ReviewsStrip from '@/components/reviews/ReviewsStrip';

// Matches vanilla partials/reviews.html. No fake reviews (CLAUDE.md - no fake content):
// ReviewsStrip fetches real approved reviews and falls back to this empty state.
export default function GuestReviews() {
  return (
    <section className="reviews" id="reviews">
      <div className="reviews__head">
        <h2 className="section__title">Guest Reviews</h2>
        <a className="reviews__seeall" href="/all-reviews">See all reviews &rsaquo;</a>
      </div>
      <ReviewsStrip emptyText="Reviews are on their way - be one of the first to share your trip." emptyCta />
    </section>
  );
}
