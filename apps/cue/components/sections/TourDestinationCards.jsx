import HomepageCard from '@/components/cards/HomepageCard';
import { GRID_CAROUSEL_4UP } from '@/components/ui/gridClasses';
import Slider from '@/components/ui/Slider';
import { CAROUSEL_SECTION, CAROUSEL_TITLE } from '@/components/ui/carouselSection';

// Destination cards on tour pages (the only tour-to-attraction link); no priceName, so no second price shows.
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
