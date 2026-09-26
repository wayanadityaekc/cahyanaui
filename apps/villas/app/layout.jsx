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

// The second face, and the ONLY place it is used is a villa's name and its
// price - see --font-serif in the library's tokens. Self-hosted like Inter
// (38KB, latin subset, variable 400-700): this site has never loaded a font
// from a third party and should not start, since that is a request to someone
// else's server on every first paint.
const playfair = localFont({
  src: '../public/fonts/playfair-latin.woff2',
  weight: '400 700',
  style: 'normal',
  display: 'swap',
  variable: '--font-playfair',
  fallback: ['Iowan Old Style', 'Georgia', 'serif'],
});

export const metadata = {
  metadataBase: new URL('https://ubudprivatevillas.com'),
};

// data-brand picks the surface out of the library's token file: this site sits
// on light grey, CUE on white, and nothing else about the brand differs. One
// attribute, so a component never has to know which site it is rendering in.
export default function RootLayout({ children }) {
  return (
    <html lang="en" data-brand="villas" className={`${inter.variable} ${playfair.variable}`}>
      {/* The bottom bar is fixed, so the page has to reserve its height or the
          last of the content sits under it - measured, it covered the footer at
          every mobile width. The number lives with the bar, in the library. */}
      <body className={BAR_BODY_PAD}>
        <LoadingScreen />
        <CurrencyProvider>
          <AccountProvider>
          <TripPrefsProvider>
          <CartProvider>
          <BookingProvider>
            <Navbar />
            {/* The header is FIXED (CUE's), so the page reserves its height here.
                --header-h-max is the ceiling the navbar publishes — it only ever
                grows, so the document cannot jump under the reader if the bar's
                contents shrink. The literal is the measured full height, used for
                the first paint before the observer has run. */}
            <main className="pt-[var(--header-h-max,53px)]">{children}</main>
            <Footer />
            <BookingSheet />
          </BookingProvider>
          </CartProvider>
          </TripPrefsProvider>
          </AccountProvider>
        </CurrencyProvider>
      </body>
    </html>
  );
}
