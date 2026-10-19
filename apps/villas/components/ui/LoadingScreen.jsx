'use client';

import { usePathname } from 'next/navigation';
import { LoadingScreen as Splash } from '@cahyana/ui';

export default function LoadingScreen() {
  const pathname = usePathname();
  return <Splash logo="/images/logo.webp" routeKey={pathname} />;
}
