import { createHash } from 'crypto';
import { readFileSync } from 'fs';
import { join } from 'path';
import localFont from 'next/font/local';
import './globals.css';
import Providers from '@/state/Providers';
import Navbar from '@/components/layout/Navbar';
import IosZoomFix from '@/components/layout/IosZoomFix';
import PwaRegister from '@/components/layout/PwaRegister';
import AppBottomNav from '@/components/layout/AppBottomNav';
import Footer from '@/components/layout/Footer';
import LoadingScreen from '@/components/ui/LoadingScreen';
import BookConfirmModal from '@/components/booking/BookConfirmModal';
import BookingGate from '@/components/booking/BookingGate';

const inter = localFont({
  src: '../public/assets/fonts/inter-latin.woff2',
  weight: '300 700',
  style: 'normal',
  display: 'swap',
  variable: '--font-inter',
  fallback: ['system-ui', 'sans-serif'],
});

// style.css is served with a week-long cache and was linked without a version,
// so a browser that cached a bad copy kept it for a week and no CSS fix could
// reach it. The hash changes whenever the file does, which retires the manual
// ?v= bump the old site needed.
// Same problem, same fix for the FAVICONS (Sep 2026, new logo): files under
// public/ are served at a stable path with no content hash, and browsers cache a
// tab icon harder than almost anything else - swapping the file alone can leave
// the old mark on screen for days. Hash each one the way style.css is hashed, so
// the link changes exactly when the file does and nobody has to bump anything.
const assetV = (...rel) => createHash('sha1')
  .update(readFileSync(join(process.cwd(), 'public', ...rel)))
  .digest('hex')
  .slice(0, 8);

const STYLE_V = assetV('style.css');
const ICON_SVG_V = assetV('assets', 'icons', 'favicon.svg');
const ICON_ICO_V = assetV('assets', 'icons', 'favicon.ico');
const ICON_APPLE_V = assetV('assets', 'icons', 'apple-touch-icon.png');

export const metadata = {
  metadataBase: new URL('https://cahyanaubudexperience.com'),
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={inter.variable}>
      <head>
        <link rel="icon" type="image/svg+xml" href={`/assets/icons/favicon.svg?v=${ICON_SVG_V}`} />
        <link rel="icon" href={`/assets/icons/favicon.ico?v=${ICON_ICO_V}`} sizes="any" />
        <link rel="apple-touch-icon" sizes="180x180" href={`/assets/icons/apple-touch-icon.png?v=${ICON_APPLE_V}`} />
        <link rel="stylesheet" href={`/style.css?v=${STYLE_V}`} />

        {/* Installable from the home screen. The icons this points at were already
            built for exactly this (CLAUDE.md, favicon section): icon-192/512 are
            OPAQUE gold tiles with the mark bled past the edge, because iOS and
            Android composite a transparent icon themselves - usually onto black -
            and round the corners for you. That is also why both are declared
            `maskable`: a full-bleed tile is what a mask wants. */}
        <link rel="manifest" href="/manifest.webmanifest" />
        <meta name="theme-color" content="#ffffff" />
        {/* iOS reads its own pair. `mobile-web-app-capable` is the standard one;
            the apple- prefix is still what older iPhones honour, so both ship. */}
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Cahyana" />
      </head>
      {/* Space reserved for whichever sticky bar is on screen. The two rules are
          kept MUTUALLY EXCLUSIVE on purpose (see CLAUDE.md): stacked, they would
          have identical specificity and the winner would be decided by Tailwind's
          class order rather than by intent. The bookbar rule tracks the bar's own
          breakpoint - and a Tailwind v4 `max-[N]` is width < N, so 993 here means
          "up to and including 992". SectionSwitcher still stops at 767. */}
      {/* Third rule, and it cannot overlap the first two: the app bottom bar only
          renders on a page that has NO sticky bar (see AppBottomNav), so the
          reservation it needs is scoped the same way. Height measured in the
          browser, not guessed. */}
      {/* Fourth + fifth rule: the compact footer (Settings/My Trips/Our Company,
          WO5+, Sep 2026) is `fixed` at the bottom too - see .footerbar in
          Footer.jsx. It cannot collide with the other three either: those three
          pages never carry a bookbar or stickybar of their own. Two heights, not
          one - the mobile footer shrank to icons-only content (Wayan: "at
          least same height with navbar") and measures 49px below 561px,
          under that width's 52.8px navbar; 60px at/above it (already within
          2.4px of that width's navbar) - and `env(safe-area-inset-bottom)`
          matches the footer's own pb-, so the reservation and the bar's real
          height never drift apart. */}
      <body className="max-md:not-has-[.bookbar]:has-[.stickybar]:pb-[60px] max-[993px]:has-[.bookbar]:pb-[72px] standalone:max-[993px]:not-has-[.bookbar]:pb-[56px] max-[560px]:has-[.footerbar]:pb-[calc(49px+env(safe-area-inset-bottom))] min-[561px]:has-[.footerbar]:pb-[calc(60px+env(safe-area-inset-bottom))]">
        <LoadingScreen />
        <Providers>
          <IosZoomFix />
          <PwaRegister />
          <Navbar />
          {children}
          <Footer />
          <BookConfirmModal />
          <BookingGate />
          <AppBottomNav />
        </Providers>
      </body>
    </html>
  );
}
