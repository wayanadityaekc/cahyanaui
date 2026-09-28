import ReviewsStrip from '@/components/reviews/ReviewsStrip';
import { SECTION_TITLE, SECTION_TITLE_SUB, ST_LEFT } from '@/components/ui/sectionTitle';

// Matches vanilla partials/reviews.html. No fake reviews (CLAUDE.md - no fake content):
// ReviewsStrip fetches real approved reviews and falls back to this empty state.
// Tailwind-native (migrasi Fase 2): .reviews/.reviews__head/.reviews__seeall ->
// utilities. .section__title dibiarin (primitif design-system shared) + override
// margin lewat !mb-0 (dulu `.reviews__head .section__title { margin-bottom:0 }`).
//
// Sep 2026 (Wayan): "See all reviews" pointed to `/all-reviews` - missing the
// `.html` this static export needs on every internal link, so it 404'd (folder
// `out/all-reviews/` has no index.html, only `all-reviews.html` does). Fixed
// here, the one place this link lives. Section is also a SLIDER now, not the
// vertical 3-col grid ("scrolling to bottom because it's too long") - same
// ReviewsStrip, just `variant="slider"` + a limit, so the homepage shows a
// handful and the rest live on the page this link goes to.
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
