# [MIG-40] SEO infrastructure — metadata, schema, sitemap, robots

**Agent:** Voice (values) + Engine (plumbing) · **Depends on:** MIG-30, MIG-31, MIG-32, MIG-33

## Objective
Replace the hand-maintained SEO layer and both sync scripts with generated output that cannot drift.

## Scope
1. `generateMetadata()` per route from `content/`: title, description, canonical (`metadataBase` + `alternates.canonical`), Open Graph, Twitter.
2. `lib/schema.js` builders: `BreadcrumbList`, `Product`+`Offer`+`Brand`, `TouristAttraction`, `Organization`, `TravelAgency`, `Article`, `FAQPage`, `Event`, `WebSite`, `Place`, `PostalAddress`.
3. `app/sitemap.js` generated from `lib/routes.js`.
4. `app/robots.js`.
5. **Retire `tools/sync-prices.js` and `tools/sync-schema.js`.** Delete them and remove them from the CLAUDE.md workflow — the build does their job now.

## Out of scope
- Writing new copy or new meta descriptions. Values move across as they are; improvements are separate Voice issues after cutover.
- Changing URLs or canonicals.

## Input
- All 117 current HTML heads.
- `tools/sync-schema.js`, `tools/sync-prices.js` — the reference for what gets generated.
- Current counts to match: BreadcrumbList 100, TouristAttraction 40, Product 31 / Offer 33 / Brand 31, Organization 32, Article 15, FAQPage 1, Event 2.

## Acceptance criteria
1. Every page has canonical + BreadcrumbList.
2. Schema type counts in `out/` match the current counts above.
3. `out/sitemap.xml` contains exactly the same 100 URLs as today — diff empty.
4. Meta titles ≤65 chars, descriptions 110–170 chars, unique per page; `og:description` matches `description`.
5. All JSON-LD passes Google's Rich Results test on one sample of each type.
6. Both sync tools deleted; nothing references them.

## Definition of done
- PR merged. Sitemap diff attached to the issue.
- After cutover: submit the sitemap in Google Search Console (still never done — worth doing at the same time).

---

# BLOCKER FOUND — structured data is almost entirely missing (2 Sep 2026)

The class diff proved all 104 pages match structurally. It is **blind to JSON-LD**, because it only counts `class` attributes. A separate count of `"@type"` across every page:

| Schema type | Original | Built | |
|---|---|---|---|
| BreadcrumbList | 100 | 1 | **lost** |
| ListItem | 286 | 2 | **lost** |
| Product | 31 | 0 | **lost** |
| Offer | 33 | 0 | **lost** |
| Brand | 31 | 0 | **lost** |
| TouristAttraction | 40 | 0 | **lost** |
| Organization | 32 | 0 | **lost** |
| PostalAddress | 43 | 0 | **lost** |
| Article | 15 | 0 | **lost** |
| Event | 2 | 0 | **lost** |
| WebSite / WebPage / TravelAgency / Place / Schedule | 1/1/1/3/2 | 0 | **lost** |
| FAQPage, Question, Answer | 1/5/5 | 1/5/5 | ok |

Only the FAQ schema survived, because it was rebuilt by hand in `lib/schema.js`.

**This alone means the migration must not go live.** Product/Offer markup is what drives price rich-results; BreadcrumbList drives the breadcrumb trail in search listings; TouristAttraction and Article are the entity markup for 55 pages. Losing them is invisible on screen and severe in search.

`tools/check-schema.js` now counts schema types original-vs-built and **fails the build**, so this can never be shipped unnoticed. It is wired into CI ahead of the deploy step.

Remaining work: port the JSON-LD builders for BreadcrumbList, Product+Offer+Brand, TouristAttraction, Organization+PostalAddress, Article, Event, WebSite, TravelAgency into `lib/schema.js` and emit them from the four templates.
