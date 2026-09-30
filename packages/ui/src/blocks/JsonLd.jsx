// Structured data as one script tag; "<" is escaped so page text can never close the script early.
export default function JsonLd({ data = null }) {
  if (!data) return null;
  const json = JSON.stringify(data).replace(/</g, '\\u003c');
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: json }} />;
}
