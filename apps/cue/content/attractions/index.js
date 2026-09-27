// Content for the 51 destination and experience pages.
//
// 27 Sep 2026: the data moved to attractions.json so the dashboard can edit it.
// THE POINT OF THE SPLIT IS THAT THE DASHBOARD WRITES DATA, NEVER CODE. A commit
// that puts a stray character into a .js file breaks the build for everyone; the
// worst a bad .json write can do is read badly. The file was already pure data -
// JSON.parse(JSON.stringify(ATTRACTION_CONTENT)) came back identical - so the move was
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

// ---------------------------------------------------------------------------
import ATTRACTION_CONTENT from './attractions.json';

export { ATTRACTION_CONTENT };
