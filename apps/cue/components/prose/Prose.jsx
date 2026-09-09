// Renders the block schema in content/schema/prose.js. Used by guide article
// bodies (TW-B1 #334) and, going forward, legal pages (TW-B2 #335).
// Every block still carries its ORIGINAL pre-migration class name - converting
// those to Tailwind utilities belongs to a later, separate issue (see
// content/schema/prose.js header). This component only moves the markup out
// of a raw HTML string into data + real elements.
export default function Prose({ blocks }) {
  return blocks.map((b, i) => {
    switch (b.type) {
      case 'crumb':
        return <p className="text-label text-muted mb-[1.25rem] [&_a]:text-gold [&_a]:no-underline [&_a]:font-medium" key={i} dangerouslySetInnerHTML={{ __html: b.html }} />;
      case 'lead':
        return (
          <figure className="guide-lead" key={i}>
            <img src={b.src} alt={b.alt} loading={b.loading} width={b.width} height={b.height} />
            <figcaption dangerouslySetInnerHTML={{ __html: b.caption }} />
          </figure>
        );
      case 'heading':
        // Default = sub-section heading (.section__title--sub), unchanged for all
        // guide/legal callers. `sub: false` = a main section heading (plain
        // .section__title), used by the detail-page info bodies (TW-B4 #337:
        // charter/airport "How a Charter Day Works" etc.). Class kept as-is -
        // .section__title base is B-FINAL's to convert.
        return b.sub === false
          ? <h2 className="section__title" key={i} dangerouslySetInnerHTML={{ __html: b.html }} />
          : <h2 className="section__title section__title--sub" key={i} dangerouslySetInnerHTML={{ __html: b.html }} />;
      case 'para':
        return <p key={i} dangerouslySetInnerHTML={{ __html: b.html }} />;
      case 'list':
        return (
          <ul className={`info__list info__list--${b.variant}`} key={i}>
            {b.items.map((item, j) => <li key={j} dangerouslySetInnerHTML={{ __html: item }} />)}
          </ul>
        );
      case 'back':
        // margin-top stays inline: `.guide-article p` (0,1,1) outweighs a mt-* utility
        // (0,1,0), same as the pre-migration inline style; [&_a]: replaces .guide-crumb-back.
        return <p style={{ marginTop: '2rem' }} className="[&_a]:text-gold [&_a]:no-underline [&_a]:font-medium" key={i} dangerouslySetInnerHTML={{ __html: b.html }} />;
      default:
        return null;
    }
  });
}
