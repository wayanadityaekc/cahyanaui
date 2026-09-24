import { PAGE_SCHEMA } from '@/content/shared/schema';
import { crumbsFor } from '@/lib/crumbs';
import { SITE } from '@/lib/routes';
import { catalog } from '@/lib/api';

// Product/Offer carries a price, so it cannot be shipped frozen at extraction
// time - that is what tools/sync-prices.js used to prevent. Every other type is
// static and is emitted exactly as extracted.
let catalogPromise = null;
function livePrices() {
  if (!catalogPromise) {
    catalogPromise = catalog({ currency: 'USD', guests: 2, stay: '' })
      .then((d) => {
        if (!d || !Array.isArray(d.items)) return null;
        const byName = {};
        for (const i of d.items) byName[i.name] = i.standard.usd;
        for (const t of d.transfers || []) byName[t.route] = t.usd;
        // Kept as a group as well, for the aggregate offer on /transfer: that
        // page sells every route in the picker, not a list written here, so the
        // range has to follow the catalog rather than a copy of it.
        const transfers = (d.transfers || []).map((t) => t.usd).filter((n) => n > 0);
        return { byName, transfers };
      })
      .catch(() => null);
  }
  return catalogPromise;
}

// A block may name the catalog entry its price comes from, which is what lets a
// Product be TITLED for a reader ("Bali Airport Transfer") while still pricing
// off the route key the API knows it by ("Airport – Ubud"). `priceKey` and
// `priceGroup` live on the BLOCK, never inside `json` - anything inside `json`
// is emitted verbatim as JSON-LD, and those are not schema.org fields.
//
// Everything written in the static file is a fallback for the build where the
// API cannot be reached; when it answers, the live number wins.
function withLivePrice(block, prices) {
  const node = block.json;
  if (!prices || !node || node['@type'] !== 'Product' || !node.offers) return node;

  if (block.priceGroup === 'transfers') {
    const all = prices.transfers;
    if (!all || !all.length) return node;
    return {
      ...node,
      offers: {
        ...node.offers,
        lowPrice: String(Math.min(...all)),
        highPrice: String(Math.max(...all)),
        offerCount: all.length,
      },
    };
  }

  const usd = prices.byName[block.priceKey || node.name];
  if (usd == null) return node;
  return { ...node, offers: { ...node.offers, price: String(usd) } };
}

// `crumbs` lets a page hand in the SAME trail it renders on screen, which is how
// the guide articles stop having two hand-kept copies of one path: the visible one
// used to stop at the category, the JSON-LD named the article but never said Home.
// When it is passed, any BreadcrumbList sitting in the static blocks is dropped so
// the page cannot ship two.
const isCrumb = (n) => n && n['@type'] === 'BreadcrumbList';
const stripCrumb = (b) => {
  if (Array.isArray(b.json)) {
    const kept = b.json.filter((n) => !isCrumb(n));
    return kept.length ? { ...b, json: kept } : null;
  }
  return isCrumb(b.json) ? null : b;
};

export default async function JsonLd({ page, crumbs }) {
  const raw = PAGE_SCHEMA[page] || [];
  const given = crumbs && crumbs.length > 1 ? crumbs : null;
  const blocks = given ? raw.map(stripCrumb).filter(Boolean) : raw;
  const hasCrumb = blocks.some((b) => (Array.isArray(b.json) ? b.json.some(isCrumb) : isCrumb(b.json)));
  const trail = given || (hasCrumb ? [] : crumbsFor(page));
  const extra = trail.length > 1
    ? [{
        id: null,
        json: {
          '@context': 'https://schema.org',
          '@type': 'BreadcrumbList',
          itemListElement: trail.map((t, i) => ({
            '@type': 'ListItem',
            position: i + 1,
            name: t.label,
            // The LAST item carries no href - it is the page you are on, and the
            // visible trail must not link it. Falling back to SITE + '' pointed
            // every guide article's final node at the HOMEPAGE, which is what
            // Google was being told the article is. Self-reference instead.
            item: SITE + (t.href || `/${page}.html`),
          })),
        },
      }]
    : [];
  const all = [...(blocks || []), ...extra];
  if (!all.length) return null;
  const prices = await livePrices();

  return (
    <>
      {all.map((b, i) => (
        <script
          key={i}
          type="application/ld+json"
          id={b.id || undefined}
          dangerouslySetInnerHTML={{ __html: JSON.stringify(withLivePrice(b, prices)) }}
        />
      ))}
    </>
  );
}
