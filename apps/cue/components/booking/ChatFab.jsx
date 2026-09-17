import { MessageCircle } from 'lucide-react';
import { WHATSAPP_NUMBER } from '@/lib/constants';

// Floating chat shortcut, every page, mobile AND desktop (Wayan, Sep 2026 -
// it becomes a chat bot later, so it needs a permanent home on both). For now
// it is just a WhatsApp link; swapping it for a bot panel later is a change
// inside this component.
//
// It only steps aside while a sticky bottom bar is actually SHOWING on mobile
// (BookBar on a detail page, SectionSwitcher on a listing) - those carry their
// own Chat button, and two chat entries would stack. It keys off `stickybar-on`
// rather than the bar's mere presence: BookBar slides away when the booking form
// scrolls into view, and chat should come back when it does. The hide is scoped
// to max-md on purpose - a bar sits in the DOM at every width (display:none
// above 768px), so an unscoped rule would wrongly strip the chat off desktop.
export default function ChatFab() {
  return (
    <a
      href={`https://wa.me/${WHATSAPP_NUMBER}`}
      target="_blank"
      rel="noopener"
      className="fixed left-4 bottom-4 z-[95] flex items-center gap-[6px] py-[0.5rem] px-[0.85rem] rounded-pill bg-white border border-line shadow-lg text-green no-underline min-[769px]:left-6 min-[769px]:bottom-6 max-md:[body:has(.stickybar-on)_&]:hidden"
      aria-label="Chat on WhatsApp"
    >
      <MessageCircle className="w-[18px] h-[18px]" strokeWidth={1.8} />
      <span className="text-[0.75rem] font-semibold leading-none">Chat</span>
    </a>
  );
}
