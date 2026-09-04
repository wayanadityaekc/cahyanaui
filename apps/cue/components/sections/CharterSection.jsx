import CharterBuilder from '@/components/sections/CharterBuilder';
import { CHARTER } from '@/content/shared/charter';

// The charter page body (hero + builder form + notes/info), extracted so both
// the /charter route and the All Programs "Charter" tab render the real form.
export default function CharterSection() {
  return (
    <>
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
