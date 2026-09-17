import { MessageCircle } from 'lucide-react';
import { WHATSAPP_NUMBER } from '@/lib/constants';

// One sticky bottom bar, shared by the two pages that need one: BookBar on a
// detail page (price + Book now) and SectionSwitcher on a listing (category +
// arrows). Wayan, Sep 2026 - the listing used to float its own category pill in
// the middle while the chat pill sat in the corner, and on a phone the two
// overlapped. Same shell, chat always the left column, so a guest sees one bar
// in one place whichever page they are on.
//
// `stickybar` is the marker <body> reads to reserve the bar's height;
// `stickybar-on` says it is actually on screen (BookBar slides away when the
// booking form is in view), which is what ChatFab watches so the floating chat
// takes over exactly when the bar is gone.
export const BAR_MARK = 'stickybar';
export const BAR_ON = 'stickybar-on';

export const BAR_SHELL =
  `${BAR_MARK} fixed left-2 right-2 bottom-1.5 z-[95] hidden max-md:flex items-center gap-3 py-[0.4rem] pl-4 pr-[0.4rem] bg-white border border-line rounded-[var(--r-xl)] shadow-xl`;

export const BAR_DIVIDER = 'w-px self-stretch bg-line flex-none';

// The bar's own chat entry. ChatFab is the same shortcut for pages with no bar.
export function BarChat() {
  return (
    <a
      href={`https://wa.me/${WHATSAPP_NUMBER}`}
      target="_blank"
      rel="noopener"
      className="flex-none flex flex-col items-center gap-[2px] text-green no-underline"
      aria-label="Chat on WhatsApp"
    >
      <MessageCircle className="w-[18px] h-[18px]" strokeWidth={1.8} />
      <span className="text-[0.6rem] font-medium leading-none">Chat</span>
    </a>
  );
}
