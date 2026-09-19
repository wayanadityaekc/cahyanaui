// Text-only overview (Wayan, Sep 2026): a short intro plus the itinerary as a
// numbered timeline. All the photos live in the hero gallery now, so a stop no
// longer needs a photo OF that place to look finished - which is what used to
// force a lookalike photo in when a place had nothing available online.
//
// Stop names are PLAIN TEXT, deliberately not linked: linking them to
// /attractions/<refId>.html dropped a guest mid-decision onto a page quoting a
// second, single-destination price. Same reason the photo-per-stop layout in
// TourPage dropped its links - the destination carousel lower down is the way
// through. Do not re-add them here.
const INTRO = 'font-body text-body leading-[var(--lh-body)] text-green m-0 mb-6 max-w-[68ch]';
const ROW =
  "relative grid grid-cols-[1.55rem_1fr] gap-x-[0.85rem] pb-[1.15rem] last:pb-0 " +
  "before:content-[''] before:absolute before:left-[0.74rem] before:top-[1.8rem] before:bottom-0 before:w-px before:bg-line last:before:hidden";
const DOT =
  'relative z-[1] grid place-items-center w-[1.55rem] h-[1.55rem] rounded-[50%] bg-cream ' +
  'font-body text-label font-semibold text-gold';
const NAME = 'font-body text-h3 font-semibold text-gold m-0 mb-[0.3rem]';
const OPTIONAL =
  'inline-block ml-2 py-[0.1rem] px-[0.45rem] rounded-pill align-middle ' +
  'font-body text-label font-medium tracking-[0.08em] uppercase text-muted [border:1px_solid_var(--color-line)]';
const TEXT = 'font-body text-body leading-[var(--lh-body)] text-green m-0 max-w-[68ch]';
// Sub-headings ("Day 1 - Ubud"). Only the 3-day package has them, and dropping
// them would turn 13 stops into one undifferentiated list, so the walk below
// keeps them AND restarts the numbering under each - which is how an itinerary
// reads. Tours without sub-headings number straight through, unchanged.
const DAY = 'font-body text-h3 font-semibold tracking-[0.02em] text-gold m-0 mt-2 mb-4 first:mt-0';

export default function TourOverview({ intro, items = [] }) {
  // One pass over the page's own order, so a day heading never loses the stops
  // that belong under it. Each heading opens a fresh <ol>, which is also what
  // restarts the count.
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
                  <p className={TEXT}>{s.summary || s.highlight}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      ))}
    </div>
  );
}
