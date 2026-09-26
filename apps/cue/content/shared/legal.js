// Legal pages (Terms / Privacy / Cancellation) content.
//
// TW-B2 (#335): body moved from a raw HTML string (dangerouslySetInnerHTML) to a
// structured block array rendered by <Prose> (components/prose/Prose.jsx), the
// same schema guide articles use (content/schema/prose.js, TW-B1 #334).
//
// 26 Sep 2026: the data itself moved to legal.json so the dashboard can edit it.
// THE POINT OF THE SPLIT IS THAT THE DASHBOARD WRITES DATA, NEVER CODE. A commit
// that puts a stray character into a .js file breaks the build for everyone; the
// worst a bad .json write can do is read badly. The file was already pure data -
// JSON.parse(JSON.stringify(LEGAL)) came back identical - so the move was
// mechanical, and the built HTML of all 102 pages was compared before and after.
//
// The import still happens at BUILD time, so every word here is in the HTML
// Google reads. That is the whole reason this is a commit-and-rebuild flow
// rather than something the browser fetches: content pulled at runtime is
// content missing from the search result.
import LEGAL from './legal.json';

export { LEGAL };
