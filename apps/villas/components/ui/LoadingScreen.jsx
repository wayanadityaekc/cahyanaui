'use client';

import { usePathname } from 'next/navigation';
import { LoadingScreen as Splash } from '@cahyana/ui';

// The splash now appears on EVERY page change, not just on arrival - Wayan:
// "ubah behavior pergantian page seperti CUE, samain seperti CUE".
//
// CUE navigates with full document loads, so its splash covers a real wait.
// This site routes client-side: a page change takes 87-91ms on a desktop and
// 198-236ms on a mid phone (measured on the built site). There is no wait to
// cover, so the splash is a deliberate brand moment and it makes navigation
// slower than it is - see minVisible in the library component, which is the
// dial. Set it to 0 and the splash only appears where there is a genuine wait.
//
// `usePathname` is what tells the splash the new page exists; nothing fires
// `load` on a client-side route change, so without it the overlay would sit
// there until its safety timeout.
export default function LoadingScreen() {
  const pathname = usePathname();
  return <Splash logo="/images/logo.webp" routeKey={pathname} />;
}
