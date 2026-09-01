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
