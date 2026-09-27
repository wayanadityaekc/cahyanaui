// Content for the airport transfer page.
//
// 27 Sep 2026: the data moved to airport.json so the dashboard can edit it.
// THE POINT OF THE SPLIT IS THAT THE DASHBOARD WRITES DATA, NEVER CODE. A commit
// that puts a stray character into a .js file breaks the build for everyone; the
// worst a bad .json write can do is read badly. The file was already pure data -
// JSON.parse(JSON.stringify(AIRPORT)) came back identical - so the move was
// mechanical, and the built HTML of all 102 pages was compared before and after.
//
// The import still happens at BUILD time, so every word here is in the HTML
// Google reads. That is the whole reason the dashboard commits and rebuilds
// rather than having the browser fetch this: content pulled at runtime is
// content missing from the search result.
//
// NOT everything here is editable from the dashboard - see EDITABLE in
// cahyana-api/content.js. Catalog keys, images and refIds are structure, not
// copy, and renaming a catalog key does not rename a price - it loses it.
//
// ---- notes kept from before the split -------------------------------------
// Info body (TW-B4 #337): was infoHtml raw string -> Prose blocks. Rendered
// inside <section.info><div.info__container> (both classes kept - shared/B-FINAL).
// TWO PLAIN COLUMNS, not a run of full-width prose (Sep 2026, Wayan). Capped at
// --container-read and left-aligned, four paragraphs only filled the left half of
// a 1200px container and left the right half of the page empty. Same { type:
// 'boxes' } pattern the charter page uses for its explainers - no variant, so no
// frame and no tint, just two columns. The two blocks are a natural pair: two
// paragraphs each, and they come out close in height.
//
// Titles in sentence case to match charter's boxes ("How the day works").
// Good-to-know (TW-B4 #337): was tinfoHtml raw string -> data for <DetailTinfo>.
// ---------------------------------------------------------------------------
import AIRPORT from './airport.json';

export { AIRPORT };
