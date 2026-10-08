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
export { default as useDialog } from './lib/useDialog.js';
export { default as useDisclosure } from './lib/useDisclosure.js';
export { default as IosZoomFix } from './lib/IosZoomFix.jsx';
export { default as useRevealWhenAway } from './lib/useRevealWhenAway.js';
export { default as groupReviews } from './lib/groupReviews.js';
export { default as useChat } from './lib/useChat.js';
export { openChatSocket, chatSocketUrl } from './lib/chatSocket.js';
export { createChatThread } from './lib/chatThread.js';
export { CURRENCIES, CURRENCY_SYMBOL, BASELINE_FX, ladder, perIdr, displayFromIdr, formatMoney } from './lib/money.js';

/* --- layer 2: primitives --- */
export { default as Button } from './primitives/Button.jsx';
export * from './primitives/btnClasses.js';
export { default as Badge } from './primitives/Badge.jsx';
export { default as Eyebrow, CAPS, UPPER, EYEBROW, EYEBROW_LINE } from './primitives/Eyebrow.jsx';
export { default as Field } from './primitives/Field.jsx';
export { default as Input, Textarea } from './primitives/Input.jsx';
export { default as Select } from './primitives/Select.jsx';
export { default as DateField } from './primitives/DateField.jsx';
export { default as DateRangeField } from './primitives/DateRangeField.jsx';
export { default as Overlay } from './primitives/Overlay.jsx';
export { default as CurrencyPicker } from './primitives/CurrencyPicker.jsx';
export { default as FlagDefs } from './primitives/FlagDefs.jsx';
export { default as Separator } from './primitives/Separator.jsx';
export { default as LoadFallback } from './primitives/LoadFallback.jsx';
export { default as LiveRegion } from './primitives/LiveRegion.jsx';
export { default as OtpFields } from './primitives/OtpFields.jsx';

/* --- layer 3: blocks --- */
export { default as Container } from './blocks/Container.jsx';
export { default as Section } from './blocks/Section.jsx';
export { default as SectionHeading } from './blocks/SectionHeading.jsx';
export { default as Hero } from './blocks/Hero.jsx';
export { default as LoadingScreen } from './blocks/LoadingScreen.jsx';
export { default as SplitFeature } from './blocks/SplitFeature.jsx';
export { default as Card } from './blocks/Card.jsx';
export { default as LinkList } from './blocks/LinkList.jsx';
export { default as MediaCard } from './blocks/MediaCard.jsx';
export { default as PhotoGrid } from './blocks/PhotoGrid.jsx';
export { default as PhotoMosaic } from './blocks/PhotoMosaic.jsx';
export { default as PhotoHero } from './blocks/PhotoHero.jsx';
export { default as Collapse } from './blocks/Collapse.jsx';
export { default as NavbarShell } from './blocks/NavbarShell.jsx';
export { default as NavDesktop } from './blocks/NavDesktop.jsx';
export { default as AccountMenu, initialsOf, firstNameOf } from './blocks/AccountMenu.jsx';
export { default as FooterShell } from './blocks/FooterShell.jsx';
export { default as BrandIcon } from './blocks/BrandIcon.jsx';
export { default as Breadcrumb, CRUMB_NAV, CRUMB_OL, CRUMB_LINK, CRUMB_HERE, CRUMB_SEP } from './blocks/Breadcrumb.jsx';
export { default as JsonLd } from './blocks/JsonLd.jsx';
export { default as PopPanel } from './blocks/PopPanel.jsx';
export { default as SourceMark } from './blocks/SourceMark.jsx';
export { default as StickyBar, BAR_MARK, BAR_SHELL, BAR_CARD, BAR_BODY_PAD } from './blocks/StickyBar.jsx';
export { default as BookingPanel, SECONDARY_BTN } from './blocks/BookingPanel.jsx';
export { default as SearchBar, SEARCH_LABEL } from './blocks/SearchBar.jsx';
export { default as StayResults } from './blocks/StayResults.jsx';
export { default as PromoSlider } from './blocks/PromoSlider.jsx';
export { default as PhotoBand } from './blocks/PhotoBand.jsx';
export { default as ModalLogo } from './blocks/ModalLogo.jsx';
export { default as ProgramCard } from './blocks/ProgramCard.jsx';
export { default as GuideCard } from './blocks/GuideCard.jsx';
export { default as PriceBlock } from './blocks/PriceBlock.jsx';
export { default as VillaCard } from './blocks/VillaCard.jsx';
export { default as Slider } from './blocks/Slider.jsx';
export { default as ReviewCard } from './blocks/ReviewCard.jsx';
export { default as ReviewDetail } from './blocks/ReviewDetail.jsx';
export { default as ReviewList } from './blocks/ReviewList.jsx';
export { default as RailLayout } from './blocks/RailLayout.jsx';
export { default as FooterPayChips } from './blocks/FooterPayChips.jsx';
export { default as CompactFooter } from './blocks/CompactFooter.jsx';
export { default as PayChips } from './blocks/PayChips.jsx';
export { default as StepProgress } from './blocks/StepProgress.jsx';
export { ReadBackRows, ReadBackList, TotalBar } from './blocks/ReadBack.jsx';
export { default as RailHelp } from './blocks/RailHelp.jsx';
export { default as SplitHero } from './blocks/SplitHero.jsx';
export { default as GuideHubHero } from './blocks/GuideHubHero.jsx';
export { default as BookedTrips } from './blocks/BookedTrips.jsx';
export { default as SignInPrompt } from './blocks/SignInPrompt.jsx';
export { default as FaqAccordion } from './blocks/FaqAccordion.jsx';
export { default as FeatureStrip } from './blocks/FeatureStrip.jsx';
export { default as FeaturedList } from './blocks/FeaturedList.jsx';
export { default as ExpandPanels } from './blocks/ExpandPanels.jsx';
export { default as VillaRooms } from './blocks/VillaRooms.jsx';
export { default as FindUsOn } from './blocks/FindUsOn.jsx';
export { default as VillaFeature } from './blocks/VillaFeature.jsx';
export { default as TabGallery } from './blocks/TabGallery.jsx';
export { default as AddonCard } from './blocks/AddonCard.jsx';
export { default as LocationBand } from './blocks/LocationBand.jsx';
export { default as ChatLauncher } from './blocks/ChatLauncher.jsx';
export { default as ChatPanel } from './blocks/ChatPanel.jsx';
export { default as ChatMessages } from './blocks/ChatMessages.jsx';
export { default as AccountSettings } from './blocks/AccountSettings.jsx';
export { default as ExtrasPanel } from './blocks/ExtrasPanel.jsx';
export { default as PayOptions } from './blocks/PayOptions.jsx';
export { default as PlanList } from './blocks/PlanList.jsx';
export { default as AvailabilityCalendar } from './blocks/AvailabilityCalendar.jsx';
export { canCheckIn, canCheckOut, isBookedNight, nightsBetween as stayNights, stayLimits, stayIsOpen, addDays as addStayDays } from './lib/stayRules.js';

/* Shared class strings, for a page that needs the look without the component. */
export * from './primitives/controlClasses.js';
export * from './blocks/layoutClasses.js';
export * from './blocks/gridClasses.js';
export * from './blocks/cardClasses.js';
export * from './blocks/navbarClasses.js';
export * from './blocks/footerClasses.js';
export * from './primitives/separatorClasses.js';
export * from './blocks/reviewClasses.js';
export * from './blocks/railClasses.js';
export * from './blocks/chatClasses.js';
export * from './blocks/tripClasses.js';
export * from './blocks/confirmClasses.js';
