/**
 * @cahyana/ui - the shared Cahyana library.
 *
 * Layer 2 (primitives) is what this barrel exports. Layer 1 is CSS and is
 * imported separately:  @import "@cahyana/ui/tokens.css";
 * Layer 3 (blocks) lands in Phase 2 and will export from here too.
 *
 * Structure borrowed from shadcn/ui - three layers, components you own rather
 * than a dependency you upgrade - but no code and no dependency taken from it.
 */

/* --- helpers --- */
export { cn } from './lib/cn.js';
export { default as useMobile } from './lib/useMobile.js';
export { default as useBodyLock } from './lib/useBodyLock.js';

/* --- primitives --- */
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

/* Shared class strings, for a site that needs the look without the component. */
export * from './primitives/controlClasses.js';
