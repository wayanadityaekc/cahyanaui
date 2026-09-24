// Builds the opening of a detail card's Prose blocks from a page's `tinfo` data.
//
// Sep 2026, Wayan: "selaraskan styling layout sama charter bro, page transfer,
// airport dan charter harus identik". The charter page's details card opens with
// its own title and then an included/excluded pair; transfer and airport had the
// same information scattered across a loose section above the card, in a
// different order on each page. This puts the three in one order, from one
// place, so they cannot drift again:
//
//   heading (card title)  ->  facts strip  ->  included / excluded  ->  the page's own prose
//
// Charter keeps writing its blocks by hand in content/shared/charter.js: it has
// no facts strip and a second row of explanation boxes, so there is nothing for
// this helper to decide. The SHELL is what has to match, and that lives in the
// page components (INFO_SECTION_DETAIL > INFO_CARD > Prose headingVariant company).
//
// Box titles are charter's exact wording - "What's included" / "Not included".
// Transfer and airport used to say "What's excluded", which is the same idea in
// different words on pages a guest reads back to back.
export function detailBlocks(title, tinfo, rest = []) {
  return [
    { type: 'heading', sub: false, html: title },
    { type: 'facts', items: tinfo.facts },
    {
      type: 'boxes',
      items: [
        { title: "What's included", variant: 'yes', list: tinfo.included },
        { title: 'Not included', variant: 'no', list: tinfo.excluded },
      ],
    },
    ...rest,
  ];
}
