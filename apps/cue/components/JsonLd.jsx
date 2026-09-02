import { PAGE_SCHEMA } from '@/content/shared/schema';
import { catalog } from '@/lib/api';

// Product/Offer carries a price, so it cannot be shipped frozen at extraction
// time - that is what tools/sync-prices.js used to prevent. Every other type is
// static and is emitted exactly as extracted.
let catalogPromise = null;
function usdByName() {
  if (!catalogPromise) {
    catalogPromise = catalog({ currency: 'USD', guests: 2, stay: '' })
      .then((d) => {
        if (!d || !Array.isArray(d.items)) return null;
        const map = {};
        for (const i of d.items) map[i.name] = i.standard.usd;
        for (const t of d.transfers || []) map[t.route] = t.usd;
        return map;
      })
      .catch(() => null);
  }
  return catalogPromise;
}

function withLivePrice(node, prices) {
  if (!prices || !node || node['@type'] !== 'Product') return node;
  const usd = prices[node.name];
  if (usd == null || !node.offers) return node;
  return { ...node, offers: { ...node.offers, price: String(usd) } };
}

export default async function JsonLd({ page }) {
  const blocks = PAGE_SCHEMA[page];
  if (!blocks || !blocks.length) return null;
  const prices = await usdByName();

  return (
    <>
      {blocks.map((b, i) => (
        <script
          key={i}
          type="application/ld+json"
          id={b.id || undefined}
          dangerouslySetInnerHTML={{ __html: JSON.stringify(withLivePrice(b.json, prices)) }}
        />
      ))}
    </>
  );
}
