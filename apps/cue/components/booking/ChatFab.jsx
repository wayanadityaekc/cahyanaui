import { MessageCircle } from 'lucide-react';
import { WHATSAPP_NUMBER } from '@/lib/constants';

// Floating chat shortcut, mobile only, mounted once in app/layout.jsx so it is
// on every page (Wayan, Sep 2026: "box chat ada di semua page"). Detail pages
// that sell something render <BookBar>, which already carries its own Chat
// button - so this one steps aside there rather than stacking two chat entries
// on top of each other. CSS does that with :has(), no JS and no hydration flash:
// the bar is in the static HTML of those pages, so the FAB is never painted.
export default function ChatFab() {
  return (
    <a
      href={`https://wa.me/${WHATSAPP_NUMBER}`}
      target="_blank"
      rel="noopener"
      className="fixed right-4 bottom-4 z-[95] hidden max-md:flex items-center gap-[6px] py-[0.5rem] px-[0.85rem] rounded-pill bg-white border border-line shadow-lg text-green no-underline [body:has(.bookbar)_&]:hidden"
      aria-label="Chat on WhatsApp"
    >
      <MessageCircle className="w-[18px] h-[18px]" strokeWidth={1.8} />
      <span className="text-[0.75rem] font-semibold leading-none">Chat</span>
    </a>
  );
}
