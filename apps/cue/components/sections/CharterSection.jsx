import CharterBuilder from '@/components/sections/CharterBuilder';
import { CHARTER } from '@/content/shared/charter';
import { CHARTER_HERO, CHARTER_HERO_INNER, CHARTER_HERO_TITLE, CHARTER_HERO_SUB } from '@/components/ui/charterHeroClasses';

// The charter page body (hero + builder form + notes/info), extracted so both
// the /charter route and the All Programs "Charter" tab render the real form.
export default function CharterSection() {
  return (
    <>
      <section className={`${CHARTER_HERO} bg-[url(/assets/images/road-ubud.webp)]`}>
        <div className={CHARTER_HERO_INNER}>
          <h1 className={CHARTER_HERO_TITLE}>{CHARTER.title}</h1>
          <p className={CHARTER_HERO_SUB}>{CHARTER.sub}</p>
          <CharterBuilder />
        </div>
      </section>
      <section className="pt-10 px-[1.3rem] pb-0" dangerouslySetInnerHTML={{ __html: CHARTER.notesHtml }} />
      <section className="info" dangerouslySetInnerHTML={{ __html: CHARTER.infoHtml }} />
    </>
  );
}
