import CharterBuilder from '@/components/sections/CharterBuilder';
import Prose from '@/components/prose/Prose';
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
      <section className="pt-10 px-[1.3rem] pb-0">
        <div className="max-w-[720px] mx-auto">
          <h3 className="itn__subtitle">Good to know</h3>
          <ul className="info__list info__list--yes">
            {CHARTER.notes.map((item, i) => <li key={i}>{item}</li>)}
          </ul>
        </div>
      </section>
      <section className="info">
        <div className="info__container">
          <Prose blocks={CHARTER.info} />
        </div>
      </section>
    </>
  );
}
