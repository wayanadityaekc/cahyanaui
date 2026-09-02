# [MIG-32] Content extraction: 15 guide articles

**Agent:** Voice + Engine · **Depends on:** MIG-12 · **Phase 2 repetitive work — Sonnet**

## Objective
Extract the 15 guide articles into `content/guides/` behind one `GuidePage` template.

## Scope
- One file per article, slug matching the current filename.
- Template parts, all already rolled out across the 15 pages: `.lhero` + hero tags, right sidebar on desktop / sticky category tabs on mobile, "You might also like", "See our tours".
- Category per page derived from its breadcrumb (island / culture / nature / do / know); the active state marks the matching sidebar item and tab. Categories link to the anchors on `bali-guide.html` — they are **not** an in-page scrollspy.
- Lead photos (`.guide-lead`) are **4:3**, placed between paragraphs, not stacked at the top.
- `bali-guide.html` hub page with its 5 category sections and typeahead search (`guideTypeahead`).
- JSON-LD: `BreadcrumbList` + `Article`.

## Out of scope
- `guide/_template.html` must **not** become a route. Once it 404s, its `Disallow` line can be dropped from robots.
- Rewriting article copy.
- Adding photos where the page currently has a gradient placeholder.

## Input
- The 15 files in `guide/`, plus `bali-guide.html`.
- `CLAUDE.md` — the Guide article template section, including the `.guide-article-page` vs `.guide-article` distinction and the `height: auto` + `aspect-ratio` trap that bit `.guide-lead`.

## Acceptance criteria
1. All 15 URLs plus `/bali-guide.html` resolve at their exact current paths.
2. Guide-to-guide links resolve correctly. **The old `<base href="/">` convention is gone**, so every link must be re-derived from the site root — a guide linking to another guide needs the `guide/` prefix; a guide linking to a root page needs no prefix and never `../`.
3. Sub-section titles left-aligned inside guide articles; still centred on Terms/Privacy/Cancellation/Charter, which share `.guide-article`.
4. `.guide-lead` renders 4:3 with `height: auto` applied.
5. Typeahead search on the hub works.
6. Screenshot diff clean at 390 / 768 / 1440 for all 16.

## Definition of done
- All 16 merged and diffed.

---

# RESULT — 15 guide articles done (2 Sep 2026)

One `GuideArticle` template fed by `content/guides/index.js`: hero with tags, category tabs linking to `bali-guide.html` anchors, the article column, the sidebar, and both `guide-more` sections. **All 15 diff clean.**

The second `guide-more` section carries an extra class (`guide-more tourprog`), so a selector matching `class="guide-more"` exactly found only one of the two.

`bali-guide.html` (the hub) is also done - see MIG-33.
