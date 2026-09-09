import Prose from '@/components/prose/Prose';
import { INFO_SECTION_ARTICLE, INFO_CONTAINER_ARTICLE } from '@/components/ui/infoClasses';
import { SUBHERO_OVERLAP, SUBHERO_CONTENT, SUBHERO_TITLE, SUBHERO_TEXT } from '@/components/ui/subheroClasses';

export default function LegalPage({ data }) {
  return (
    <>
      <section
        className={SUBHERO_OVERLAP}
        style={{ backgroundImage: data.heroStyle.replace(/^background-image:\s*/, '').replace(/;$/, '') }}
      >
        <div className={SUBHERO_CONTENT}>
          <h1 className={SUBHERO_TITLE}>{data.title}</h1>
          <p className={SUBHERO_TEXT}>{data.text}</p>
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
