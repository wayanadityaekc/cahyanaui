'use client';

import { usePathname } from 'next/navigation';
import { normalizePath } from '@/lib/pathname';
import { House, Compass, ShoppingBag } from 'lucide-react';
import { useItinerary } from '@/state/ItineraryProvider';
import ChatLauncher from '@/components/chat/ChatLauncher';
import { APP_ONLY } from '@/components/ui/pwaClasses';

// Installed-app bottom bar (navbar hands it chat/cart); hidden on pages with a bookbar, stickybar (<768) or footerbar.
const BAR =
  `${APP_ONLY} [body:has(.bookbar)_&]:hidden max-md:[body:has(.stickybar)_&]:hidden [body:has(.footerbar)_&]:hidden ` +
  'fixed inset-x-0 bottom-0 z-[95] items-stretch ' +
  'pt-1 pb-[max(0.25rem,env(safe-area-inset-bottom))] ' +
  'bg-white [border-top:1px_solid_var(--line)] ' +
  '';

const CELL =
  'flex-1 flex flex-col items-center justify-center gap-[3px] ' +
  'py-[0.3rem] px-1 bg-transparent border-none cursor-pointer no-underline ' +
  'text-[0.62rem] font-medium leading-none text-center ' +
  '[transition:color_var(--dur)_var(--ease),scale_var(--dur-fast)_var(--ease)]';

function cellClass(active) { return `${CELL} ${active ? 'text-gold' : 'text-muted'}`; }

export default function AppBottomNav() {
  const pathname = normalizePath(usePathname());
  const { count } = useItinerary();
  function isCurrent(href) { return (href === '/' ? pathname === '/' : pathname.startsWith(href.replace('.html', ''))); }

  return (
    <nav className={BAR} aria-label="App" data-appnav>
      <a href="/" className={cellClass(isCurrent('/'))}>
        <House className="w-[22px] h-[22px]" strokeWidth={isCurrent('/') ? 2 : 1.7} aria-hidden="true" />
        Home
      </a>
      <a href="/tour.html" className={cellClass(isCurrent('/tour.html'))}>
        <Compass className="w-[22px] h-[22px]" strokeWidth={isCurrent('/tour.html') ? 2 : 1.7} aria-hidden="true" />
        Program
      </a>
      <a href="/my-trips.html" className={`relative ${cellClass(isCurrent('/my-trips.html'))}`}>
        <span className="relative">
          <ShoppingBag className="w-[22px] h-[22px]" strokeWidth={isCurrent('/my-trips.html') ? 2 : 1.7} aria-hidden="true" />
          <span
            className="absolute top-[-6px] right-[-8px] bg-gold text-white rounded-[999px] min-w-[16px] h-4 px-1 text-[0.58rem] font-semibold leading-4 text-center"
            hidden={!count}
          >
            {count}
          </span>
        </span>
        My Trip
      </a>
      {/* Only one chat launcher is reachable at a time (navbar in a tab, this in app mode), so the panel never mounts twice. */}
      <ChatLauncher className={cellClass(false)} label="Chat" iconClass="w-[22px] h-[22px]" />
    </nav>
  );
}
