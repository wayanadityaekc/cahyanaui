'use client';

import { useEffect, useState } from 'react';

export default function useMobile(query = '(max-width: 768px)') {
  const [is, setIs] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia(query);
    const on = () => setIs(mq.matches);
    on();
    mq.addEventListener('change', on);
    return () => mq.removeEventListener('change', on);
  }, [query]);
  return is;
}
