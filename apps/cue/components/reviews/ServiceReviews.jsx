import ReviewsStrip from './ReviewsStrip';
import ReviewCtaBand from './ReviewCtaBand';
import { SECTION_TITLE, ST_LEFT } from '@/components/ui/sectionTitle';

// Reviews for the three pages that are not tour/attraction detail pages
// (charter, transfer, airport). Those get their reviews through DetailTabs; these
// three have no tabs, so the strip sits as its own section under the card.
//
// The gate that decides who may write one is already generic on the server - it
// reads inquiries.service, whatever that string is - so a charter or transfer
// guest could ALWAYS review. What was missing was only somewhere to read them.
//
// ONE service or a GROUP, never both:
//   charter  -> service "Charter"          (every charter booking stores that)
//   airport  -> service "Airport - Ubud"   (its one route)
//   transfer -> group  "transfers"         (it sells ten routes, and the guest
//                                          reviewed the ROUTE they took)
//
// Container is FormHero's INNER, so the heading starts on the same left edge as
// the card above it. The page is left-aligned throughout (Sep 2026), so the
// centred default would leave this heading as the only thing floating.
export default function ServiceReviews({ service, group, title = 'Guest reviews', emptyText }) {
  return (
    <section className="experience">
      <div className="max-w-[var(--container)] mx-auto px-[var(--container-x)]">
        <h2 className={`${SECTION_TITLE} ${ST_LEFT}`}>{title}</h2>
        <ReviewsStrip service={service} group={group} emptyText={emptyText} emptyCta />
      </div>
      <ReviewCtaBand />
    </section>
  );
}
