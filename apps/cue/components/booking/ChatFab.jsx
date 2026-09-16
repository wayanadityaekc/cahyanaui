import { MessageCircle } from 'lucide-react';
import { WHATSAPP_NUMBER } from '@/lib/constants';

// Floating chat shortcut, every page, mobile AND desktop (Wayan, Sep 2026 -
// it becomes a chat bot later, so it needs a permanent home on both). For now
// it is just a WhatsApp link; swapping it for a bot panel later is a change
// inside this component.
//
// It only steps aside on MOBILE detail pages, where <BookBar> is on screen with
// its own Chat button and two chat entries would stack. The hide is scoped to
// max-md on purpose: the bar element sits in the DOM of those pages at every
// width (it is display:none above 768px), so an unscoped body:has(.bookbar)
// would wrongly strip the chat off desktop tour pages too.
export default function ChatFab() {
  return (
    <a
      href={`https://wa.me/${WHATSAPP_NUMBER}`}
      target="_blank"
      rel="noopener"
      className="fixed right-4 bottom-4 z-[95] flex items-center gap-[6px] py-[0.5rem] px-[0.85rem] rounded-pill bg-white border border-line shadow-lg text-green no-underline min-[769px]:right-6 min-[769px]:bottom-6 max-md:[body:has(.bookbar)_&]:hidden"
      aria-label="Chat on WhatsApp"
    >
      <MessageCircle className="w-[18px] h-[18px]" strokeWidth={1.8} />
      <span className="text-[0.75rem] font-semibold leading-none">Chat</span>
    </a>
  );
}
