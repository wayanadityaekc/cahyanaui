import ReviewsStrip from './ReviewsStrip';
import ReviewCtaBand from './ReviewCtaBand';
import { SECTION_TITLE, ST_LEFT } from '@/components/ui/sectionTitle';

// Reviews for charter/transfer/airport pages: pass ONE service or a group (transfers), never both.
export default function ServiceReviews({ service, group, title = 'Guest reviews', emptyText }) {
  return (
    <section className="experience">
      <div className="max-w-[var(--container)] mx-auto px-[var(--container-x)]">
        <h2 className={`${SECTION_TITLE} ${ST_LEFT}`}>{title}</h2>
        <ReviewsStrip service={service} group={group} emptyText={emptyText} />
      </div>
      <ReviewCtaBand />
    </section>
  );
}
