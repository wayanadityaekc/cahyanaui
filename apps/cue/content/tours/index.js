// Per-tour page content for the 17 tour detail pages (app/[tourSlug]/page.jsx).
//
// 26 Sep 2026: the data itself moved to tours.json so the dashboard can edit it.
// THE POINT OF THE SPLIT IS THAT THE DASHBOARD WRITES DATA, NEVER CODE. A commit
// that puts a stray character into a .js file breaks the build for everyone; the
// worst a bad .json write can do is read badly. The file was already pure data -
// JSON.parse(JSON.stringify(TOUR_CONTENT)) came back identical - so the move was
// mechanical, and the built HTML of all 102 pages was compared before and after.
//
// The import still happens at BUILD time, so every word here is in the HTML
// Google reads. That is the whole reason the dashboard commits and rebuilds
// rather than having the browser fetch this: content pulled at runtime is
// content missing from the search result.
//
// NOT everything in here is editable from the dashboard - see EDITABLE in
// cahyana-api/content.js. `bookItem` is an API CATALOG KEY, not a display name,
// and renaming it breaks the price lookup; images, refIds and the crumb trail
// are structure, not copy.
import TOUR_CONTENT from './tours.json';

export { TOUR_CONTENT };
