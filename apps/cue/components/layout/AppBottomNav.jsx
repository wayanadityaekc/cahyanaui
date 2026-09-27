'use client';

import { usePathname } from 'next/navigation';
import { normalizePath } from '@/lib/pathname';
import { House, Compass, ShoppingBag } from 'lucide-react';
import { useItinerary } from '@/state/ItineraryProvider';
import ChatLauncher from '@/components/chat/ChatLauncher';
import { APP_ONLY } from '@/components/ui/pwaClasses';

// The bottom bar an installed app gets. It is NOT a second copy of the navbar:
// in app mode the navbar hands its chat and cart icons over to this (see
// APP_HIDE in Navbar), so nothing is in two places at once. What it buys is one
// tap instead of two - today the main destinations sit behind the hamburger.
//
// Wayan picked the four: Home, Program, My Trip, Chat. Guide / Our Company /
// Settings stay in the hamburger, which stays in the navbar - they are read
// once, not returned to.
//
// WHY IT DISAPPEARS ON SOME PAGES. Only one thing may be stuck to the bottom of
// the screen (CLAUDE.md), and 71 pages already have a sticky bar: BookBar on 68
// detail pages, SectionSwitcher on 3 listings. Wayan chose "Book bar menang", so
// this yields to them.
//   The condition is "the PAGE has a bar", not "the bar is on screen right now".
//   BookBar already hides itself while the booking form is in view, so tying
//   this to its visibility would make the two swap places as the guest scrolls.
//   `:has(.stickybar)` matches the element whether or not it is displayed, which
//   is exactly the stable per-page answer we want. That selector also outranks
//   the display utility below on specificity (0,2,1 vs 0,1,0), so no `!` is
//   needed to win - verified in the browser, not assumed.
// TWO yield rules, not one, and the reason is measured: `:has()` matches an element
// whether or not it is DISPLAYED, and the two bars do not cover the same widths.
// BookBar shows below 993, which is exactly this bar's own range, so it yields to
// it everywhere. SectionSwitcher stops at 767 - yielding to it above that left a
// listing page at 768-992 with NO bar at all, both of them hidden. Caught by the
// harness, invisible on a phone.
const BAR =
  `${APP_ONLY} [body:has(.bookbar)_&]:hidden max-md:[body:has(.stickybar)_&]:hidden ` +
  'fixed inset-x-0 bottom-0 z-[95] items-stretch ' +
  'pt-1 pb-[max(0.25rem,env(safe-area-inset-bottom))] ' +
  'bg-white [border-top:1px_solid_var(--color-line)] ' +
  '';

const CELL =
  'flex-1 flex flex-col items-center justify-center gap-[3px] ' +
  'py-[0.3rem] px-1 bg-transparent border-none cursor-pointer no-underline ' +
  'text-[0.62rem] font-medium leading-none text-center ' +
  '[transition:color_var(--dur)_var(--ease),scale_var(--dur-fast)_var(--ease)]';

const on = (active) => `${CELL} ${active ? 'text-gold' : 'text-muted'}`;

export default function AppBottomNav() {
  const pathname = normalizePath(usePathname());
  const { count } = useItinerary();
  const is = (href) => (href === '/' ? pathname === '/' : pathname.startsWith(href.replace('.html', '')));

  return (
    <nav className={BAR} aria-label="App" data-appnav>
      <a href="/" className={on(is('/'))}>
        <House className="w-[22px] h-[22px]" strokeWidth={is('/') ? 2 : 1.7} aria-hidden="true" />
        Home
      </a>
      <a href="/programs.html" className={on(is('/programs.html'))}>
        <Compass className="w-[22px] h-[22px]" strokeWidth={is('/programs.html') ? 2 : 1.7} aria-hidden="true" />
        Program
      </a>
      <a href="/my-trips.html" className={`relative ${on(is('/my-trips.html'))}`}>
        <span className="relative">
          <ShoppingBag className="w-[22px] h-[22px]" strokeWidth={is('/my-trips.html') ? 2 : 1.7} aria-hidden="true" />
          <span
            className="absolute top-[-6px] right-[-8px] bg-gold text-white rounded-[999px] min-w-[16px] h-4 px-1 text-[0.58rem] font-semibold leading-4 text-center"
            hidden={!count}
          >
            {count}
          </span>
        </span>
        My Trip
      </a>
      {/* The navbar's launcher is display:none in app mode and this one is
          display:none in a tab, so exactly one is reachable at a time and the
          panel is never mounted twice (two panels would mean two sockets). */}
      <ChatLauncher className={on(false)} label="Chat" iconClass="w-[22px] h-[22px]" />
    </nav>
  );
}
