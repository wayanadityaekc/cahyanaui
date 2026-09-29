// Tour intro plus numbered stop timeline; reads only `highlight`, and stop names stay unlinked on purpose.
const INTRO = 'font-body text-body leading-[var(--lh-body)] text-green m-0 mb-6 max-w-[68ch]';
const ROW =
  "relative grid grid-cols-[1.55rem_1fr] gap-x-[0.85rem] pb-[1.15rem] last:pb-0 " +
  "before:content-[''] before:absolute before:left-[0.74rem] before:top-[1.8rem] before:bottom-0 before:w-px before:bg-line last:before:hidden";
const DOT =
  'relative z-[1] grid place-items-center w-[1.55rem] h-[1.55rem] rounded-[50%] bg-cream ' +
  'font-body text-label font-semibold text-gold';
const NAME = 'font-body text-h3 font-semibold text-gold m-0 mb-[0.3rem]';
const OPTIONAL =
  'inline-block ml-2 py-[0.1rem] px-[0.45rem] rounded-sm align-middle ' +
  'font-body text-label font-medium tracking-[0.08em] uppercase text-muted [border:1px_solid_var(--line)]';
const TEXT = 'font-body text-body leading-[var(--lh-body)] text-green m-0 max-w-[68ch]';
// Day sub-heading (multi-day packages only); numbering restarts under each day.
const DAY = 'font-body text-h3 font-semibold tracking-[0.02em] text-gold m-0 mt-2 mb-4 first:mt-0';

export default function TourOverview({ intro, items = [] }) {
  // Group stops under their day heading in page order; each group renders its own <ol>.
  const groups = [];
  items.forEach((it) => {
    if (!it) return;
    if (it.type === 'sub') {
      groups.push({ heading: it.text, stops: [] });
      return;
    }
    if (it.type !== 'stop') return;
    if (!groups.length) groups.push({ heading: null, stops: [] });
    groups[groups.length - 1].stops.push(it);
  });

  return (
    <div>
      {intro && <p className={INTRO}>{intro}</p>}
      {groups.map((g, gi) => (
        <div key={g.heading || gi} className={gi ? 'mt-7' : undefined}>
          {g.heading && <h3 className={DAY}>{g.heading}</h3>}
          <ol className="list-none m-0 p-0">
            {g.stops.map((s, i) => (
              <li className={ROW} key={s.refId || s.name}>
                <span className={DOT}>{i + 1}</span>
                <div>
                  <h3 className={NAME}>
                    {s.name}
                    {s.optional && <span className={OPTIONAL}>Optional</span>}
                  </h3>
                  <p className={TEXT}>{s.highlight}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      ))}
    </div>
  );
}
