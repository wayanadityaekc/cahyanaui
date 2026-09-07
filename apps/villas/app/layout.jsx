import { Cormorant_Garamond, Jost } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { VillaSelectionProvider } from '@/components/providers/VillaSelectionProvider';

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-cormorant',
  display: 'swap',
});

const jost = Jost({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  variable: '--font-jost',
  display: 'swap',
});

export const metadata = {
  metadataBase: new URL('https://ubudprivatevillas.com'),
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${cormorant.variable} ${jost.variable}`}>
      <body>
        <VillaSelectionProvider>
          <Navbar />
          <main>{children}</main>
          <Footer />
        </VillaSelectionProvider>
      </body>
    </html>
  );
}
