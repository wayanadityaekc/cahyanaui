'use client';

import { useEffect, useState } from 'react';

export default function useMobile(query = '(max-width: 768px)') {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia(query);
    function update() { return setIsMobile(mq.matches); }
    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, [query]);
  return isMobile;
}
