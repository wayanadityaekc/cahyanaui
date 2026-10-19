'use client';

import { useEffect, useState } from 'react';

export default function useRevealWhenAway(refs = []) {
  const [isAway, setIsAway] = useState(false);

  useEffect(
    () => {
      const nodes = refs.map((ref) => ref?.current).filter(Boolean);
      if (!nodes.length) return undefined;

      const seen = new Map(nodes.map((node) => [node, false]));
      const io = new IntersectionObserver((entries) => {
        for (const entry of entries) seen.set(entry.target, entry.isIntersecting);
        setIsAway(![...seen.values()].some(Boolean));
      });
      nodes.forEach((node) => io.observe(node));
      return () => io.disconnect();
    },
    refs.map((ref) => ref?.current),
  );

  return isAway;
}
