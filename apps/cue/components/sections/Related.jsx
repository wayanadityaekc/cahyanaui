import HomepageCard from '@/components/cards/HomepageCard';
import { RELATED_ITEMS, RELATED_ALL } from '@/content/shared/related';
import { GRID_CAROUSEL_4UP } from '@/components/ui/gridClasses';
import Slider from '@/components/ui/Slider';
import { CAROUSEL_SECTION, CAROUSEL_TITLE } from '@/components/ui/carouselSection';
import { isHiddenTour } from '@/lib/routes';

// Ported from initRelated: same type, same zone first, then the closest by
// price. Renders nothing when fewer than 4 qualify, exactly as before.
export default function Related({ href }) {
  const me = RELATED_ITEMS.find((it) => it.href === href);
  if (!me) return null;

  const pool = RELATED_ITEMS.filter((it) => it.type === me.type && it.href !== me.href && !isHiddenTour(it.href));
  const sameZone = pool.filter((it) => it.zone === me.zone);
  const rest = pool
    .filter((it) => it.zone !== me.zone)
    .sort((a, b) => Math.abs(a.p - me.p) - Math.abs(b.p - me.p));
  const picks = sameZone.concat(rest).slice(0, 4);
  if (picks.length < 4) return null;

  const all = RELATED_ALL[me.type];

  // Full Tailwind (B-FINAL): .related section -> utilities. Its ::before top divider
  // is always shown (the `.crumb + .related` off-switch never matched - Related renders
  // BEFORE the crumb on every detail page), so it's baked unconditionally. The grid
  // context override went with the .experience__grid engine, so no marker is kept.
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
