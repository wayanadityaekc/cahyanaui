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

  // Tailwind-native (migrasi Fase 2): judul (.related__title + underline ::after)
  // & link "view all" (.related__all) -> utilities, CSS-nya dihapus. KEPT: .related
  // (section) = context hook - dia yg pegang divider ::before, override kartu
  // .related .experience__* (di-share sama .home), + padding responsif; jadi jangan
  // dibuang. Engine .experience__grid* & komponen HomepageCard juga tetep.
  return (
    <section className="related">
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
