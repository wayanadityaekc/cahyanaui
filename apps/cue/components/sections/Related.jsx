import ExperienceCard from '@/components/cards/ExperienceCard';
import { RELATED_ITEMS, RELATED_ALL } from '@/content/shared/related';

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

  return (
    <section className="related">
      <h2 className="related__title">You might also like</h2>
      <div className="experience__grid experience__grid--home4">
        {picks.map((it) => (
          <ExperienceCard
            key={it.href}
            href={it.href}
            name={it.name}
            img={it.img}
            alt={it.name}
            meta={it.meta}
            priceName={it.p ? it.priceName : undefined}
            priceFallback={it.p ? `$${it.p}` : undefined}
            hybrid
            rating={0}
            cat={it.cat}
          />
        ))}
      </div>
      {all && (
        <p className="related__all">
          <a href={all[0]}>{all[1]} &rsaquo;</a>
        </p>
      )}
    </section>
  );
}
