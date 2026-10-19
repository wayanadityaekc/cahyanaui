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
import { API_BASE } from '@/lib/constants';
import { CartProvider } from '@/components/providers/CartProvider';
import { SavedVillasProvider } from '@/components/providers/SavedVillasProvider';
import BookingSheet from '@/components/booking/BookingSheet';
import { BAR_BODY_PAD, IosZoomFix } from '@cahyana/ui';

const inter = localFont({
  src: '../public/fonts/inter-latin.woff2',
  weight: '300 700',
  style: 'normal',
  display: 'swap',
  variable: '--font-inter',
  fallback: ['system-ui', 'sans-serif'],
});

function buildAssetVersion(...rel) {
  return createHash('sha1')
    .update(readFileSync(join(process.cwd(), 'public', ...rel)))
    .digest('hex')
    .slice(0, 8);
}

export const metadata = {
  metadataBase: new URL('https://ubudprivatevillas.com'),
  icons: {
    icon: [
      {
        url: `/assets/icons/favicon.svg?v=${buildAssetVersion('assets', 'icons', 'favicon.svg')}`,
        type: 'image/svg+xml',
      },
      { url: `/assets/icons/favicon.ico?v=${buildAssetVersion('assets', 'icons', 'favicon.ico')}`, sizes: 'any' },
    ],
    apple: [
      {
        url: `/assets/icons/apple-touch-icon.png?v=${buildAssetVersion('assets', 'icons', 'apple-touch-icon.png')}`,
        sizes: '180x180',
      },
    ],
  },
  manifest: '/manifest.webmanifest',
};

async function buildFx() {
  try {
    const response = await fetch(`${API_BASE}/pricing/catalog?currency=USD`, { signal: AbortSignal.timeout(10000) });
    if (!response.ok) return null;
    const catalog = await response.json();
    return catalog?.fx?.perUsd && catalog.fx.idrPerUsd ? catalog.fx : null;
  } catch (e) {
    return null;
  }
}

export default async function RootLayout({ children }) {
  const initialFx = await buildFx();
  return (
    <html lang="en" data-brand="villas" className={inter.variable}>
      <body className={BAR_BODY_PAD}>
        <IosZoomFix />
        <LoadingScreen />
        <CurrencyProvider initialFx={initialFx}>
          <AccountProvider>
            <TripPrefsProvider>
              <CartProvider>
                <SavedVillasProvider>
                  <BookingProvider>
                    <Navbar />
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
