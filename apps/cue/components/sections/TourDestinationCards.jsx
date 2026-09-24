import HomepageCard from '@/components/cards/HomepageCard';
import { GRID_CAROUSEL_4UP } from '@/components/ui/gridClasses';
import Slider from '@/components/ui/Slider';
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
// Same section chrome and the same track as "You might also like" below it. On
// desktop four cards fill the row and the rest slide - a wrapping grid put the
// tail on a second row, which is what Wayan did not want.
export default function TourDestinationCards({ items }) {
  if (!items || !items.length) return null;
  return (
    <section className={CAROUSEL_SECTION}>
      <h2 className={CAROUSEL_TITLE}>Destinations you&apos;ll visit on this tour</h2>
      <Slider gridClassName={GRID_CAROUSEL_4UP}>
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
      </Slider>
    </section>
  );
}
