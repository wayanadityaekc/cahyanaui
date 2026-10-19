import HomepageCard from '@/components/cards/HomepageCard';
import { RELATED_ITEMS, RELATED_ALL } from '@/content/shared/related';
import { GRID_CAROUSEL_4UP } from '@/components/ui/gridClasses';
import Slider from '@/components/ui/Slider';
import { CAROUSEL_SECTION, CAROUSEL_TITLE } from '@/components/ui/carouselSection';
import { isHiddenTour } from '@/lib/routes';

const RELATED_ITEM_COUNT = 4;

export default function Related({ href }) {
  const current = RELATED_ITEMS.find((it) => it.href === href);
  if (!current) return null;

  const relatedPool = RELATED_ITEMS.filter(
    (it) => it.type === current.type && it.href !== current.href && !isHiddenTour(it.href),
  );
  const sameZoneItems = relatedPool.filter((it) => it.zone === current.zone);
  const otherZoneItems = relatedPool
    .filter((it) => it.zone !== current.zone)
    .sort((a, b) => Math.abs(a.p - current.p) - Math.abs(b.p - current.p));
  const picks = sameZoneItems.concat(otherZoneItems).slice(0, RELATED_ITEM_COUNT);
  if (picks.length < RELATED_ITEM_COUNT) return null;

  const all = RELATED_ALL[current.type];

  return (
    <section className={CAROUSEL_SECTION}>
      <h2 className={CAROUSEL_TITLE}>You might also like</h2>
      <Slider gridClassName={GRID_CAROUSEL_4UP}>
        {picks.map((it) => (
          <HomepageCard
            key={it.href}
            href={it.href}
            name={it.name}
            img={it.img}
            alt={it.name}
            meta={it.meta}
            priceName={it.p ? it.priceName : undefined}
            priceFallback={it.p ? `$${it.p}` : undefined}
          />
        ))}
      </Slider>
      {all && (
        <p className="mt-[1.6rem]">
          <a href={all[0]} className="text-gold-d font-medium text-h3 no-underline hover:underline">
            {all[1]} &rsaquo;
          </a>
        </p>
      )}
    </section>
  );
}
