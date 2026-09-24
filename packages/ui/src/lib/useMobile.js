'use client';

import { useEffect, useState } from 'react';

/**
 * Is the viewport narrower than `query`?
 *
 * Starts false and corrects after mount, never during render: this is read by
 * components in statically exported sites, and a value that only exists in the
 * browser would make the first client paint disagree with the prerendered HTML.
 */
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
