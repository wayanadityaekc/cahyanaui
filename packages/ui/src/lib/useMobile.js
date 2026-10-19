'use client';

import { useEffect, useState } from 'react';

export default function useMobile(query = '(max-width: 768px)') {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia(query);
    function on() {
      return setIsMobile(mq.matches);
    }
    on();
    mq.addEventListener('change', on);
    return () => mq.removeEventListener('change', on);
  }, [query]);
  return isMobile;
}
