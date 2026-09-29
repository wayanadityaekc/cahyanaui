import HomepageCard from '@/components/cards/HomepageCard';
import { RELATED_ITEMS, RELATED_ALL } from '@/content/shared/related';
import { GRID_CAROUSEL_4UP } from '@/components/ui/gridClasses';
import Slider from '@/components/ui/Slider';
import { CAROUSEL_SECTION, CAROUSEL_TITLE } from '@/components/ui/carouselSection';
import { isHiddenTour } from '@/lib/routes';

// Same type, same zone first, then closest by price; renders nothing when fewer than 4 qualify.
export default function Related({ href }) {
  const current = RELATED_ITEMS.find((it) => it.href === href);
  if (!current) return null;

  const pool = RELATED_ITEMS.filter((it) => it.type === current.type && it.href !== current.href && !isHiddenTour(it.href));
  const sameZone = pool.filter((it) => it.zone === current.zone);
  const rest = pool
    .filter((it) => it.zone !== current.zone)
    .sort((a, b) => Math.abs(a.p - current.p) - Math.abs(b.p - current.p));
  const picks = sameZone.concat(rest).slice(0, 4);
  if (picks.length < 4) return null;

  const all = RELATED_ALL[current.type];

  // Carousel section (with its top divider) rendered before the page crumb.
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
          <a href={all[0]} className="text-gold-d font-medium text-h3 no-underline hover:underline">{all[1]} &rsaquo;</a>
        </p>
      )}
    </section>
  );
}
