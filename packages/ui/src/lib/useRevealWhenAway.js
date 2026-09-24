'use client';

import { useEffect, useState } from 'react';

/**
 * True only while NONE of the given elements is on screen.
 *
 * This is the rule behind the mobile book bar: show it when the guest can no
 * longer see any of the page's real calls to action, and hide it the moment one
 * of them is back. Two CTAs saying the same thing on one screen is the thing to
 * avoid - it makes the page look like it is nagging.
 *
 * Pass the refs of the anchors that count as "a CTA is visible": on a villa
 * page that is the page title and the booking card.
 *
 *   const show = useRevealWhenAway([titleRef, cardRef]);
 *
 * IntersectionObserver rather than a scroll listener on purpose: a scroll
 * handler runs on every frame of every scroll on the page, this one runs when
 * an edge is actually crossed.
 *
 * Anything not yet mounted is ignored, so it is safe on a first render.
 */
export default function useRevealWhenAway(refs = []) {
  const [away, setAway] = useState(false);

  useEffect(() => {
    const nodes = refs.map((r) => r?.current).filter(Boolean);
    if (!nodes.length) return undefined;

    // A Map keyed by the element, so an observer callback that reports only
    // SOME of the entries (which is normal) does not lose the others' state.
    const seen = new Map(nodes.map((n) => [n, false]));
    const io = new IntersectionObserver((entries) => {
      for (const e of entries) seen.set(e.target, e.isIntersecting);
      setAway(![...seen.values()].some(Boolean));
    });
    nodes.forEach((n) => io.observe(n));
    return () => io.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, refs.map((r) => r?.current));

  return away;
}
