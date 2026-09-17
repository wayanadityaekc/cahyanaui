import HomepageCard from '@/components/cards/HomepageCard';
import { GRID_RELATED } from '@/components/ui/gridClasses';
import { CAROUSEL_SECTION, CAROUSEL_TITLE } from '@/components/ui/carouselSection';

// "Destinations you'll visit on this tour" - the only link from a tour page to
// an attraction page now that the itinerary stops are plain text. Keeping the
// stops unlinked is the point: a guest reading a tour never lands on a page
// quoting a second, single-destination price mid-decision.
//
// Cards are HomepageCard, the same card the "You might also like" carousel below
// uses, so the two sections read as one pair. Photo, name and area, and nothing
// else: leaving priceName out is what keeps the price off them, so the tour's
// sidebar stays the only price on screen while a guest reads.
//
// Same section chrome and the same GRID_RELATED as "You might also like" below it
// (Wayan: identical to carousel 2) - a 4-up grid on desktop, a slider on mobile.
// Six stops wrap to a second row on desktop; that is the same behaviour the other
// carousel would have with six cards, which is the point.
export default function TourDestinationCards({ items }) {
  if (!items || !items.length) return null;
  return (
    <section className={CAROUSEL_SECTION}>
      <h2 className={CAROUSEL_TITLE}>Destinations you&apos;ll visit on this tour</h2>
      <div className={GRID_RELATED}>
        {items.map((d) => (
          <HomepageCard
            key={d.refId}
            href={d.href}
            name={d.name}
            img={d.img}
            alt={d.alt}
            meta={d.meta}
            metaIcon="pin"
          />
        ))}
      </div>
    </section>
  );
}
