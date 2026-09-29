import { STOP_NUM, STOP_NAME, STOP_DESC } from '@/components/sections/TourPage';

// Text-only attraction sections, deliberately unnumbered (topics, not stops); reuses the STOP_* type styles.
const ROWS = 'flex flex-col gap-6';
const ROW = '[&+&]:pt-6 [&+&]:[border-top:1px_solid_var(--line)]';
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
