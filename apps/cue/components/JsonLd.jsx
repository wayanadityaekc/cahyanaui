import { PAGE_SCHEMA } from '@/content/shared/schema';

export default function JsonLd({ page }) {
  const blocks = PAGE_SCHEMA[page];
  if (!blocks || !blocks.length) return null;
  return (
    <>
      {blocks.map((b, i) => (
        <script
          key={i}
          type="application/ld+json"
          id={b.id || undefined}
          dangerouslySetInnerHTML={{ __html: JSON.stringify(b.json) }}
        />
      ))}
    </>
  );
}
