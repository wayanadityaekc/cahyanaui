/**
 * @cahyana/ui - the shared Cahyana library.
 *
 * THREE LAYERS, and the split is the whole design:
 *   1  tokens   CSS. Imported separately:  @import "@cahyana/ui/tokens.css";
 *   2  primitives  the atoms - a button, a field, a badge
 *   3  blocks   assembled shapes - a hero, a card, the navbar shell
 *
 * Layers 2 and 3 export from here.
 *
 * Structure borrowed from shadcn/ui - three layers, components you own rather
 * than a dependency you upgrade - but no code and no dependency taken from it.
 *
 * TWO RULES THIS FILE ENFORCES BY WHAT IT DOES NOT EXPORT:
 *   - No component in here imports next/link, next/image or next/navigation. A
 *     UI library that imports the framework can only be used by that framework.
 *     Anything that needs a link takes a `linkAs` prop.
 *   - No component in here reads an app's React context (currency, cart,
 *     booking). Those live in one app's provider tree; a library component that
 *     reaches for one can only be rendered inside that app. Values come in as
 *     props, already formatted.
 */

/* --- helpers --- */
export { cn } from './lib/cn.js';
export { default as useMobile } from './lib/useMobile.js';
export { default as useBodyLock } from './lib/useBodyLock.js';
export { default as useRevealWhenAway } from './lib/useRevealWhenAway.js';

/* --- layer 2: primitives --- */
export { default as Button } from './primitives/Button.jsx';
export { default as Badge } from './primitives/Badge.jsx';
export { default as Eyebrow, EYEBROW } from './primitives/Eyebrow.jsx';
export { default as Field } from './primitives/Field.jsx';
export { default as Input, Textarea } from './primitives/Input.jsx';
export { default as Select } from './primitives/Select.jsx';
export { default as DateField } from './primitives/DateField.jsx';
export { default as Overlay } from './primitives/Overlay.jsx';
export { default as CurrencyPicker } from './primitives/CurrencyPicker.jsx';
export { default as FlagDefs } from './primitives/FlagDefs.jsx';

/* --- layer 3: blocks --- */
export { default as Container } from './blocks/Container.jsx';
export { default as Section } from './blocks/Section.jsx';
export { default as SectionHeading } from './blocks/SectionHeading.jsx';
export { default as Hero } from './blocks/Hero.jsx';
export { default as Card } from './blocks/Card.jsx';
export { default as MediaCard } from './blocks/MediaCard.jsx';
export { default as Collapse } from './blocks/Collapse.jsx';
export { default as NavbarShell } from './blocks/NavbarShell.jsx';
export { default as FooterShell } from './blocks/FooterShell.jsx';
export { default as BrandIcon } from './blocks/BrandIcon.jsx';
export { default as StickyBar, BAR_MARK, BAR_SHELL, BAR_CARD } from './blocks/StickyBar.jsx';
export { default as BookingPanel, SECONDARY_BTN } from './blocks/BookingPanel.jsx';
export { default as SearchBar, SEARCH_LABEL } from './blocks/SearchBar.jsx';
export { default as PriceBlock } from './blocks/PriceBlock.jsx';
export { default as VillaCard } from './blocks/VillaCard.jsx';

/* Shared class strings, for a page that needs the look without the component. */
export * from './primitives/controlClasses.js';
export * from './blocks/layoutClasses.js';
export * from './blocks/gridClasses.js';
export * from './blocks/cardClasses.js';
export * from './blocks/navbarClasses.js';
export * from './blocks/footerClasses.js';
