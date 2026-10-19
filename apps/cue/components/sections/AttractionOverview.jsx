import { STOP_NUM, STOP_NAME, STOP_DESC } from '@/components/sections/TourPage';

const ROWS = 'flex flex-col gap-6';
const ROW = '[&+&]:pt-6 [&+&]:[border-top:1px_solid_var(--line)]';
const TEXT = `${STOP_DESC} max-w-[68ch]`;

export default function AttractionOverview({ stops = [], id }) {
  return (
    <div className={ROWS} id={id}>
      {stops.map((stop, index) => (
        <section className={ROW} key={stop.name || index}>
          {stop.num && <span className={STOP_NUM}>{stop.num}</span>}
          <h3 className={STOP_NAME}>{stop.name}</h3>
          <p className={TEXT} dangerouslySetInnerHTML={{ __html: stop.descHtml }} />
        </section>
      ))}
    </div>
  );
}
