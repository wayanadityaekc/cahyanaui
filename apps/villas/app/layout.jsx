import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import localFont from 'next/font/local';
import './globals.css';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import LoadingScreen from '@/components/ui/LoadingScreen';
import { CurrencyProvider } from '@/components/providers/CurrencyProvider';
import { BookingProvider } from '@/components/providers/BookingProvider';
import { TripPrefsProvider } from '@/components/providers/TripPrefsProvider';
import { AccountProvider } from '@/components/providers/AccountProvider';
import { CartProvider } from '@/components/providers/CartProvider';
import { SavedVillasProvider } from '@/components/providers/SavedVillasProvider';
import BookingSheet from '@/components/booking/BookingSheet';
import { BAR_BODY_PAD } from '@cahyana/ui';

const inter = localFont({
  src: '../public/fonts/inter-latin.woff2',
  weight: '300 700',
  style: 'normal',
  display: 'swap',
  variable: '--font-inter',
  fallback: ['system-ui', 'sans-serif'],
});

// Content hash for files in public/, so a replaced icon gets a new URL and browsers drop the cached one.
function assetV(...rel) {
  return createHash('sha1').update(readFileSync(join(process.cwd(), 'public', ...rel))).digest('hex').slice(0, 8);
}

// Same icon set as CUE (same Cahyana logo): round tab icons, opaque tiles for home screens.
export const metadata = {
  metadataBase: new URL('https://ubudprivatevillas.com'),
  icons: {
    icon: [
      { url: `/assets/icons/favicon.svg?v=${assetV('assets', 'icons', 'favicon.svg')}`, type: 'image/svg+xml' },
      { url: `/assets/icons/favicon.ico?v=${assetV('assets', 'icons', 'favicon.ico')}`, sizes: 'any' },
    ],
    apple: [{ url: `/assets/icons/apple-touch-icon.png?v=${assetV('assets', 'icons', 'apple-touch-icon.png')}`, sizes: '180x180' }],
  },
};

// data-brand picks this site's surface from the library tokens, so no component needs to know which site it is in.
export default function RootLayout({ children }) {
  return (
    <html lang="en" data-brand="villas" className={inter.variable}>
      {/* The fixed bottom bar needs its height reserved, or it covers the footer on mobile. */}
      <body className={BAR_BODY_PAD}>
        <LoadingScreen />
        <CurrencyProvider>
          <AccountProvider>
          <TripPrefsProvider>
          <CartProvider>
          <SavedVillasProvider>
          <BookingProvider>
            <Navbar />
            {/* Reserve the fixed header's height: --header-h-max only grows, so the page never jumps under the reader. */}
            <main className="pt-[var(--header-h-max,53px)]">{children}</main>
            <Footer />
            <BookingSheet />
          </BookingProvider>
          </SavedVillasProvider>
          </CartProvider>
          </TripPrefsProvider>
          </AccountProvider>
        </CurrencyProvider>
      </body>
    </html>
  );
}
