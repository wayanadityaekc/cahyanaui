import { STOP_NUM, STOP_NAME, STOP_DESC } from '@/components/sections/TourPage';

// Text-only overview for attraction pages, the twin of TourOverview - the gallery
// hero carries the photos now, so the sections no longer need one each.
//
// NOT numbered, unlike a tour's. An attraction's sections are TOPICS, not stops:
// "The Macaques", "Getting there", "What it costs". Numbering them would claim an
// order the day does not have. The page's own kicker (`num`) stays, because that is
// what it always was - a label, not a count.
//
// Type styles are the same three the photo rows used (STOP_NUM / STOP_NAME /
// STOP_DESC), so dropping the photo changed the layout and nothing else.
const ROWS = 'flex flex-col gap-6';
const ROW = '[&+&]:pt-6 [&+&]:[border-top:1px_solid_var(--color-line)]';
const TEXT = `${STOP_DESC} max-w-[68ch]`;

export default function AttractionOverview({ stops = [], id }) {
  return (
    <div className={ROWS} id={id}>
      {stops.map((s, i) => (
        <section className={ROW} key={s.name || i}>
          {s.num && <span className={STOP_NUM}>{s.num}</span>}
          <h3 className={STOP_NAME}>{s.name}</h3>
          <p className={TEXT} dangerouslySetInnerHTML={{ __html: s.descHtml }} />
        </section>
      ))}
    </div>
  );
}
