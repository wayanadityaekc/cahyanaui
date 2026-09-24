// Moved into @cahyana/ui (packages/ui/src/blocks/gridClasses.js). This file is a
// re-export so the existing call sites keep working; import from '@cahyana/ui'
// directly in anything new.
//
// GRID_SECTION is gone with the move: it had zero call sites and duplicated
// WRAP from the library's layoutClasses.
export * from '@cahyana/ui';
