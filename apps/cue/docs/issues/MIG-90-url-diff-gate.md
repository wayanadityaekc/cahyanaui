# [MIG-90] Release gate: URL diff

**Agent:** QA · **Depends on:** all content issues · **Blocks cutover**

## Objective
Prove that not one URL changed.

## Scope
1. Build the canonical list: every `<loc>` in the current `sitemap.xml` (100) plus every reachable internal `href` across the 117 current files.
2. Build the same list from `lib/routes.js` and from the actual `out/` file tree.
3. Diff all three.
4. Post-cutover: crawl all 100 live URLs and record the status codes.

## Acceptance criteria
1. Diff is **empty**. Any missing or added URL blocks the cutover.
2. Post-cutover, all 100 URLs return **200** — not 301, not 404.
3. The 5 legacy 301s still redirect to their current targets.
4. `south-bali-tour.html` still resolves (now a 301 to `/hidden-beaches-cliffs.html`).
5. `/guide/_template.html` returns 404.

## Definition of done
- Diff output and the post-cutover crawl table attached to the issue.
