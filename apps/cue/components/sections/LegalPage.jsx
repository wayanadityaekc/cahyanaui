import Prose from '@/components/prose/Prose';
import { INFO_SECTION_ARTICLE, INFO_CONTAINER_ARTICLE } from '@/components/ui/infoClasses';

export default function LegalPage({ data }) {
  return (
    <>
      <section
        className={data.heroClass}
        style={{ backgroundImage: data.heroStyle.replace(/^background-image:\s*/, '').replace(/;$/, '') }}
      >
        <div className="subhero__content">
          <h1 className="subhero__title">{data.title}</h1>
          <p className="subhero__text">{data.text}</p>
        </div>
      </section>
      <section className={INFO_SECTION_ARTICLE}>
        <div className={INFO_CONTAINER_ARTICLE}>
          <Prose blocks={data.body} />
        </div>
      </section>
    </>
  );
}
