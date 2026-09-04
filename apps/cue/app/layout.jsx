import localFont from 'next/font/local';
import './globals.css';
import Providers from '@/state/Providers';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import LoadingScreen from '@/components/ui/LoadingScreen';
import BookConfirmModal from '@/components/booking/BookConfirmModal';

const inter = localFont({
  src: '../public/assets/fonts/inter-latin.woff2',
  weight: '300 700',
  style: 'normal',
  display: 'swap',
  variable: '--font-inter',
  fallback: ['system-ui', 'sans-serif'],
});

export const metadata = {
  metadataBase: new URL('https://cahyanaubudexperience.com'),
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={inter.variable}>
      <head>
        <link rel="icon" type="image/svg+xml" href="/assets/icons/favicon.svg" />
        <link rel="icon" href="/assets/icons/favicon.ico" sizes="any" />
        <link rel="apple-touch-icon" sizes="180x180" href="/assets/icons/apple-touch-icon.png" />
        <link rel="stylesheet" href="/style.css" />
        {/* Splash: show once per session; repeat loads get `splash-seen` before
            paint so CSS hides the overlay instantly (no flash). */}
        <script
          dangerouslySetInnerHTML={{
            __html:
              "try{if(sessionStorage.getItem('cue_splash')){document.documentElement.className+=' splash-seen'}else{sessionStorage.setItem('cue_splash','1')}}catch(e){}",
          }}
        />
      </head>
      <body>
        <LoadingScreen />
        <Providers>
          <Navbar />
          {children}
          <Footer />
          <BookConfirmModal />
        </Providers>
      </body>
    </html>
  );
}
