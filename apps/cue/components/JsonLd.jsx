import { PAGE_SCHEMA } from '@/content/shared/schema';
import { buildCrumbs } from '@/lib/crumbs';
import { SITE } from '@/lib/routes';
import { fetchCatalog } from '@/lib/api';

let catalogPromise = null;
function fetchLivePrices() {
  if (!catalogPromise) {
    catalogPromise = (async () => {
      try {
        const catalogData = await fetchCatalog({ currency: 'USD', guests: 2, stay: '' });
        if (!catalogData || !Array.isArray(catalogData.items)) return null;
        const byName = {};
        catalogData.items.forEach((item) => {
          byName[item.name] = item.standard.usd;
        });
        (catalogData.transfers || []).forEach((transfer) => {
          byName[transfer.route] = transfer.usd;
        });
        const transfers = (catalogData.transfers || [])
          .map((transfer) => transfer.usd)
          .filter((priceUsd) => priceUsd > 0);
        return { byName, transfers };
      } catch (e) {
        return null;
      }
    })();
  }
  return catalogPromise;
}

function applyLivePrice({ json, priceGroup, priceKey }, prices) {
  const node = json;
  const hasMissingProductOffer = !prices || !node || node['@type'] !== 'Product' || !node.offers;
  if (hasMissingProductOffer) return node;

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

function isCrumb(schemaNode) {
  return schemaNode && schemaNode['@type'] === 'BreadcrumbList';
}
function stripCrumb(block) {
  if (Array.isArray(block.json)) {
    const keptNodes = block.json.filter((schemaNode) => !isCrumb(schemaNode));
    return keptNodes.length ? { ...block, json: keptNodes } : null;
  }
  return isCrumb(block.json) ? null : block;
}

export default async function JsonLd({ page, crumbs }) {
  const raw = PAGE_SCHEMA[page] || [];
  const given = crumbs && crumbs.length > 1 ? crumbs : null;
  const blocks = given ? raw.map(stripCrumb).filter(Boolean) : raw;
  const hasCrumb = blocks.some((block) => (Array.isArray(block.json) ? block.json.some(isCrumb) : isCrumb(block.json)));
  const trail = given || (hasCrumb ? [] : buildCrumbs(page));
  const extraBlocks =
    trail.length > 1
      ? [
          {
            id: null,
            json: {
              '@context': 'https://schema.org',
              '@type': 'BreadcrumbList',
              itemListElement: trail.map((crumb, index) => ({
                '@type': 'ListItem',
                position: index + 1,
                name: crumb.label,
                item: SITE + (crumb.href || `/${page}.html`),
              })),
            },
          },
        ]
      : [];
  const allBlocks = [...(blocks || []), ...extraBlocks];
  if (!allBlocks.length) return null;
  const prices = await fetchLivePrices();

  return (
    <>
      {allBlocks.map((block, index) => (
        <script
          key={index}
          type="application/ld+json"
          id={block.id || undefined}
          dangerouslySetInnerHTML={{ __html: JSON.stringify(applyLivePrice(block, prices)) }}
        />
      ))}
    </>
  );
}
