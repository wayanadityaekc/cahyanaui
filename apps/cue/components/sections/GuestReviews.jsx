import ReviewsStrip from '@/components/reviews/ReviewsStrip';

// Matches vanilla partials/reviews.html. No fake reviews (CLAUDE.md - no fake content):
// ReviewsStrip fetches real approved reviews and falls back to this empty state.
// Tailwind-native (migrasi Fase 2): .reviews/.reviews__head/.reviews__seeall ->
// utilities. .section__title dibiarin (primitif design-system shared) + override
// margin lewat !mb-0 (dulu `.reviews__head .section__title { margin-bottom:0 }`).
export default function GuestReviews() {
  return (
    <section className="py-16 px-6" id="reviews">
      <div className="flex justify-between items-end gap-6 flex-wrap max-w-[1100px] mx-auto mb-[1.6rem] pb-[0.8rem]">
        <h2 className="section__title !mb-0 !text-left [&::after]:!left-0 [&::after]:![transform:none]">Guest Reviews</h2>
        <a className="inline-block text-gold-d font-medium no-underline hover:underline" href="/all-reviews">See all reviews &rsaquo;</a>
      </div>
      <ReviewsStrip emptyText="Reviews are on their way - be one of the first to share your trip." emptyCta />
    </section>
  );
}
