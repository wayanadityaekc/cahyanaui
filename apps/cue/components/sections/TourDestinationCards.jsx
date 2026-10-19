import HomepageCard from '@/components/cards/HomepageCard';
import { GRID_CAROUSEL_4UP } from '@/components/ui/gridClasses';
import Slider from '@/components/ui/Slider';
import { CAROUSEL_SECTION, CAROUSEL_TITLE } from '@/components/ui/carouselSection';

export default function TourDestinationCards({ items }) {
  if (!items || !items.length) return null;
  return (
    <section className={CAROUSEL_SECTION}>
      <h2 className={CAROUSEL_TITLE}>Destinations you&apos;ll visit on this tour</h2>
      <Slider gridClassName={GRID_CAROUSEL_4UP}>
        {items.map((item) => (
          <HomepageCard
            key={item.refId}
            href={item.href}
            name={item.name}
            img={item.img}
            alt={item.alt}
            meta={item.meta}
            metaIcon="pin"
          />
        ))}
      </Slider>
    </section>
  );
}
