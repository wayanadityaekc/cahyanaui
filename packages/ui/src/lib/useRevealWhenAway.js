'use client';

import { useEffect, useState } from 'react';

export default function useRevealWhenAway(refs = []) {
  const [away, setAway] = useState(false);

  useEffect(() => {
    const nodes = refs.map((r) => r?.current).filter(Boolean);
    if (!nodes.length) return undefined;

    const seen = new Map(nodes.map((n) => [n, false]));
    const io = new IntersectionObserver((entries) => {
      for (const e of entries) seen.set(e.target, e.isIntersecting);
      setAway(![...seen.values()].some(Boolean));
    });
    nodes.forEach((n) => io.observe(n));
    return () => io.disconnect();
  }, refs.map((r) => r?.current));

  return away;
}
