// Shared block schema for article-style body content (guide articles: TW-B1 #334;
// reused by legal pages: TW-B2 #335). Replaces raw HTML strings
// (dangerouslySetInnerHTML on a whole article) with a data array the <Prose>
// component (components/prose/Prose.jsx) renders block-by-block.
//
// Each block keeps its inner HTML fragment (bold/link markup, entities) as a
// string so restructuring never risks a text change - only the outer
// wrapper element + class attribute move from string to JSX. Class names are
// kept IDENTICAL to the pre-migration CSS on purpose (`.section__title--sub`,
// `.guide-lead`, `.info__list--yes/--no`, `.guide-crumb`, `.guide-crumb-back`) -
// converting those to Tailwind utilities is out of scope here (B-FINAL /
// TW-B3 own those families) and would be a second, independent change.
//
// Block shapes:
//   { type: 'crumb', html }                                   - breadcrumb line (owned by TW-B3, .guide-crumb*)
//   { type: 'lead', src, alt, loading, width, height, caption } - lead/inline 4:3 photo (.guide-lead)
//   { type: 'heading', html }                                  - sub-section H2 (.section__title.section__title--sub)
//   { type: 'para', html }                                     - plain paragraph (styled via ancestor .guide-article p)
//   { type: 'list', variant: 'yes' | 'no', items: [html, ...] } - checklist (.info__list.info__list--yes|--no)
//   { type: 'back', html }                                     - closing "back to guide" link (owned by TW-B3, .guide-crumb-back)

export const PROSE_BLOCK_TYPES = ['crumb', 'lead', 'heading', 'para', 'list', 'back'];
