// Content for the charter page.
//
// 27 Sep 2026: the data moved to charter.json so the dashboard can edit it.
// THE POINT OF THE SPLIT IS THAT THE DASHBOARD WRITES DATA, NEVER CODE. A commit
// that puts a stray character into a .js file breaks the build for everyone; the
// worst a bad .json write can do is read badly. The file was already pure data -
// JSON.parse(JSON.stringify(CHARTER)) came back identical - so the move was
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
// Full Day FIRST (Wayan, Sep 2026: "kalo paling depan taruh full day") - it is
// the one marked Popular, and in a picker the top row is what a guest reads first.
//
// ONE sub line per plan, not a list of icon points (Wayan picked the card option
// where the PRICE is the second thing you read). The points became a single
// dot-separated line under the price: the same facts, one line instead of three,
// which is what leaves room for the big number. Anything trimmed out of here is
// still in the Included list further down the same page.
// 12 hours is the longest one sold (Sep 2026, Wayan: "di charter kita ganti
// konsep bro, jangan pakai extended pakai 12 jam aja yang max"). It replaces
// "Extended", which was a full day plus however many hours the guest added in
// a second field - so the price only settled after two choices, and the row
// could not state what it cost. A fixed block states it.
//
// Its price is a real tier in the API (CHARTER.long = full + 2 hourly), so
// nothing here computes it - see useCharterTier in CharterPlans.jsx.
// 140 km is the same 12 km/h the other two lines use (5h/60, 10h/120), not a
// rounder number picked by eye.
// ONE details section (Wayan, Sep 2026: "details seperti include exclude dan
// how charter works itu jadiin satu"). What used to be a loose "Good to know"
// list above a separate article is now a single run of text in the Our Company
// reading style: left-aligned headings, no centred underline.
//
// The body is two rows of BOXES (Sep 2026, Wayan picked option B off the marker
// sheet, then: "pakai kolom termasuk yang dibawahnya how charter works dan lagi
// satunya"). Row 1 = Included / Not included, row 2 = How the day works / What a
// day can cover. The per-row marker is gone - see components/ui/InfoBoxes.jsx.
// Pairing is by HEIGHT, not by topic: the three-paragraph explainer and the
// seven-line list of route ideas are the two blocks that come out about level,
// so the boxes sit square instead of one trailing white space. "Charter or
// guided tour?" is STACKED UNDER the left one (Sep 2026, Wayan picked option a)
// rather than sitting full width below the row - see the note on that item.
// LEFT COLUMN = two stacked blocks (Sep 2026, Wayan picked option a).
// "Charter or guided tour?" used to be a full-width heading + paragraph
// BELOW this row, which left ~80px of white under this column and then
// more content after it - white in the middle of a row reads as a hole.
// Stacked here the left column runs longer than the right, so whatever
// white is left sits at the very END of the card, next to its own bottom
// padding, where it reads as the end of the text.
// ---------------------------------------------------------------------------
import CHARTER from './charter.json';

export { CHARTER };
