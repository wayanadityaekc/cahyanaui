import { PAGE_SCHEMA } from '@/content/shared/schema';
import { crumbsFor } from '@/lib/crumbs';
import { SITE } from '@/lib/routes';
import { catalog } from '@/lib/api';

let catalogPromise = null;
function livePrices() {
  if (!catalogPromise) {
    catalogPromise = (async () => {
      try {
        const d = await catalog({ currency: 'USD', guests: 2, stay: '' });
        if (!d || !Array.isArray(d.items)) return null;
        const byName = {};
        d.items.forEach((i) => {
          byName[i.name] = i.standard.usd;
        });
        (d.transfers || []).forEach((t) => {
          byName[t.route] = t.usd;
        });
        const transfers = (d.transfers || []).map((t) => t.usd).filter((n) => n > 0);
        return { byName, transfers };
      } catch (e) {
        return null;
      }
    })();
  }
  return catalogPromise;
}

function withLivePrice({ json, priceGroup, priceKey }, prices) {
  const node = json;
  if (!prices || !node || node['@type'] !== 'Product' || !node.offers) return node;

  if (priceGroup === 'transfers') {
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

  const usd = prices.byName[priceKey || node.name];
  if (usd == null) return node;
  return { ...node, offers: { ...node.offers, price: String(usd) } };
}

function isCrumb(n) {
  return n && n['@type'] === 'BreadcrumbList';
}
function stripCrumb(b) {
  if (Array.isArray(b.json)) {
    const kept = b.json.filter((n) => !isCrumb(n));
    return kept.length ? { ...b, json: kept } : null;
  }
  return isCrumb(b.json) ? null : b;
}

export default async function JsonLd({ page, crumbs }) {
  const raw = PAGE_SCHEMA[page] || [];
  const given = crumbs && crumbs.length > 1 ? crumbs : null;
  const blocks = given ? raw.map(stripCrumb).filter(Boolean) : raw;
  const hasCrumb = blocks.some((b) => (Array.isArray(b.json) ? b.json.some(isCrumb) : isCrumb(b.json)));
  const trail = given || (hasCrumb ? [] : crumbsFor(page));
  const extra =
    trail.length > 1
      ? [
          {
            id: null,
            json: {
              '@context': 'https://schema.org',
              '@type': 'BreadcrumbList',
              itemListElement: trail.map((t, i) => ({
                '@type': 'ListItem',
                position: i + 1,
                name: t.label,
                item: SITE + (t.href || `/${page}.html`),
              })),
            },
          },
        ]
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
