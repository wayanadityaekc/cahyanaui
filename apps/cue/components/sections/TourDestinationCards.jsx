import ExperienceCard from '@/components/cards/ExperienceCard';
import { SECTION_TITLE } from '@/components/ui/sectionTitle';
import Slider from '@/components/ui/Slider';

// "Destinations you'll visit on this tour" - the only link from a tour page to
// an attraction page now that the itinerary stops are plain text. Keeping the
// stops unlinked is the point: a guest reading a tour never lands on a page
// quoting a second, single-destination price mid-decision.
//
// Cards carry a photo, a name and one line, and nothing else: no price, no Book
// button, no Include/Exclude, so the tour's own sidebar stays the only price on
// screen. ExperienceCard's `incl` variant is exactly that shape already, and its
// inclText slot takes the one-liner (it splits on pipes, and a plain string has
// none, so it renders as-is).
//
// A carousel, not a grid (Wayan): a tour can have more stops than fit a row - Ubud
// Culture Day has six - and a wrapping grid puts the tail on a second row while the
// "You might also like" carousel below it stays on one. Slider keeps both sections
// scrolling the same way, with arrows on desktop and swipe on mobile.
export default function TourDestinationCards({ items }) {
  if (!items || !items.length) return null;
  return (
    <section className="relative max-w-[1200px] mx-auto py-[var(--space-5)] px-[var(--space-3)] text-left max-[768px]:pt-8 max-[768px]:px-[1.1rem] max-[768px]:pb-[2.4rem]">
      <h2 className={SECTION_TITLE}>Destinations you&apos;ll visit on this tour</h2>
      <Slider>
        {items.map((d) => (
          <ExperienceCard
            key={d.refId}
            variant="incl"
            href={d.href}
            name={d.name}
            img={d.img}
            alt={d.alt}
            inclText={d.summary}
          />
        ))}
      </Slider>
    </section>
  );
}
