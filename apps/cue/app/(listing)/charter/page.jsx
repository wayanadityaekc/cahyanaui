import CharterBuilder from '@/components/sections/CharterBuilder';
import JsonLd from '@/components/JsonLd';
import { CHARTER } from '@/content/shared/charter';

export const metadata = {
  title: 'Private Car Charter Bali from Ubud | Half & Full Day',
  description:
    'Charter a private car with driver in Bali from Ubud - half day (5 hours) or full day (10 hours), extend by the hour, petrol included. Pick-up from anywhere on the island.',
  alternates: { canonical: '/charter.html' },
};

export default function Page() {
  return (
    <>
      <JsonLd page="charter" />
      <section className="charter-hero">
        <div className="charter-hero__inner">
          <h1 className="charter-hero__title">{CHARTER.title}</h1>
          <p className="charter-hero__sub">{CHARTER.sub}</p>
          <CharterBuilder />
        </div>
      </section>
      <section className="charter-notes-sec" dangerouslySetInnerHTML={{ __html: CHARTER.notesHtml }} />
      <section className="info" dangerouslySetInnerHTML={{ __html: CHARTER.infoHtml }} />
    </>
  );
}
