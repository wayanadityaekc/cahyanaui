'use client';

import { usePathname } from 'next/navigation';
import { LoadingScreen as Splash } from '@cahyana/ui';

// Splash on every page change like CUE (Wayan); usePathname tells it the new page exists, or it waits for its timeout.
export default function LoadingScreen() {
  const pathname = usePathname();
  return <Splash logo="/images/logo.webp" routeKey={pathname} />;
}
