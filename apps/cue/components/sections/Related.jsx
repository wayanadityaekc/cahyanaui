import HomepageCard from '@/components/cards/HomepageCard';
import { RELATED_ITEMS, RELATED_ALL } from '@/content/shared/related';
import { GRID_RELATED } from '@/components/ui/gridClasses';

// Ported from initRelated: same type, same zone first, then the closest by
// price. Renders nothing when fewer than 4 qualify, exactly as before.
export default function Related({ href }) {
  const me = RELATED_ITEMS.find((it) => it.href === href);
  if (!me) return null;

  const pool = RELATED_ITEMS.filter((it) => it.type === me.type && it.href !== me.href);
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
    <section className='relative max-w-[1200px] mx-auto py-[var(--space-5)] px-[var(--space-3)] text-left max-[768px]:pt-8 max-[768px]:px-[1.1rem] max-[768px]:pb-[2.4rem] before:content-[""] before:absolute before:top-0 before:left-1/2 before:[transform:translateX(-50%)] before:w-[min(1100px,90%)] before:h-px before:bg-[rgba(34,32,28,0.4)]'>
      <h2 className="font-body font-semibold text-h3 leading-[var(--lh-heading)] text-green m-0 [&::after]:content-[''] [&::after]:block [&::after]:w-12 [&::after]:h-[3px] [&::after]:rounded-[2px] [&::after]:bg-gold [&::after]:mt-2">You might also like</h2>
      <div className={GRID_RELATED}>
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
      </div>
      {all && (
        <p className="mt-[1.6rem]">
          <a href={all[0]} className="text-gold-d font-medium text-h3 no-underline hover:underline">{all[1]} &rsaquo;</a>
        </p>
      )}
    </section>
  );
}
