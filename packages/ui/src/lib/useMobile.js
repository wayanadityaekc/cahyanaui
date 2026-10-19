'use client';

import { useEffect, useState } from 'react';

export default function useMobile(query = '(max-width: 768px)') {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia(query);
    function handleMediaChange() {
      return setIsMobile(mq.matches);
    }
    handleMediaChange();
    mq.addEventListener('change', handleMediaChange);
    return () => mq.removeEventListener('change', handleMediaChange);
  }, [query]);
  return isMobile;
}
