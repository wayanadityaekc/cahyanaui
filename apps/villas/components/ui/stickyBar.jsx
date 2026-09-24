// Moved into @cahyana/ui (packages/ui/src/blocks/StickyBar.jsx), which now also
// carries CUE's flush variant alongside this site's floating one. This file is a
// re-export so the existing call sites keep working; import { StickyBar } from
// '@cahyana/ui' directly in anything new - the component handles the show/hide
// translate itself, so a caller no longer pairs BAR_SHELL with its own
// `translate-y-[150%]`.
export { BAR_MARK, BAR_SHELL, BAR_CARD, default as StickyBar } from '@cahyana/ui/blocks/StickyBar.jsx';
