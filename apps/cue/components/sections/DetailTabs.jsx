'use client';

import { useEffect, useRef, useState } from 'react';
import ReviewsStrip from '@/components/reviews/ReviewsStrip';

// Facts grid (Details) - Duration / Availability / Pick-up etc. The Price fact is
// dropped on purpose: the live, currency-correct price shows in the booking bar
// and form, and the hardcoded fact price is stale (some are merged with the
// pick-up value in the source data).
function FactsGrid({ facts }) {
  const rows = facts.filter((f) => !/^price/i.test(f.label));
  if (!rows.length) return null;
  return (
    <ul className="dfacts">
      {rows.map((f) => (
        <li key={f.label}>
          <span className="dfacts__k">{f.label}</span>
          <span className="dfacts__v">{f.value}</span>
        </li>
      ))}
    </ul>
  );
}

// Included / excluded lists - reuses the site-wide radio bullet lists.
function Inclusions({ included, excluded }) {
  return (
    <div className="dincl">
      {included && included.length > 0 && (
        <>
          <h3 className="dincl__h">What&apos;s included</h3>
          <ul className="info__list info__list--yes">
            {included.map((it, i) => <li key={i}>{it}</li>)}
          </ul>
        </>
      )}
      {excluded && excluded.length > 0 && (
        <>
          <h3 className="dincl__h">Not included</h3>
          <ul className="info__list info__list--no">
            {excluded.map((it, i) => <li key={i}>{it}</li>)}
          </ul>
        </>
      )}
    </div>
  );
}

// Detail page sections (Overview / Details / Included / Reviews). Everything is
// on one scrollable page - the sections are stacked and always visible - and the
// sticky tab strip is a jump nav: clicking a tab scrolls to its section, and the
// active tab follows the section currently in view (scrollspy).
export default function DetailTabs({ overview, facts, included, excluded, reviewService }) {
  const detailFacts = (facts || []).filter((f) => !/^price/i.test(f.label));
  const sections = [{ id: 'overview', label: 'Overview', content: overview }];
  if (detailFacts.length) sections.push({ id: 'details', label: 'Details', content: <FactsGrid facts={facts} /> });
  if ((included && included.length) || (excluded && excluded.length)) {
    sections.push({ id: 'included', label: 'Included', content: <Inclusions included={included} excluded={excluded} /> });
  }
  sections.push({
    id: 'reviews',
    label: 'Reviews',
    content: <ReviewsStrip service={reviewService} emptyText="No reviews yet for this program - be the first to share your trip." emptyCta />,
  });

  const [active, setActive] = useState(sections[0].id);
  const stripRef = useRef(null);
  const secRefs = useRef({});

  const headerH = () => {
    const h = document.querySelector('.navbar');
    return h ? h.getBoundingClientRect().height : 0;
  };
  const pinOffset = () => headerH() + (stripRef.current ? stripRef.current.offsetHeight : 0);

  // Pin the sticky strip right under the fixed header (navbar + promo bar).
  useEffect(() => {
    const apply = () => { if (stripRef.current) stripRef.current.style.top = `${headerH()}px`; };
    apply();
    window.addEventListener('resize', apply);
    return () => window.removeEventListener('resize', apply);
  }, []);

  // Scrollspy: highlight the tab whose section is currently under the strip.
  useEffect(() => {
    const ids = sections.map((s) => s.id);
    const onScroll = () => {
      const line = pinOffset() + 12;
      let cur = ids[0];
      ids.forEach((id) => {
        const el = secRefs.current[id];
        if (el && el.getBoundingClientRect().top <= line) cur = id;
      });
      setActive(cur);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const pick = (id) => {
    const el = secRefs.current[id];
    if (!el) return;
    const top = el.getBoundingClientRect().top + window.scrollY - pinOffset() - 8;
    window.scrollTo({ top, behavior: 'smooth' });
  };

  return (
    <div className="dtabs">
      <div className="dtabs__strip" ref={stripRef} role="tablist" aria-label="Jump to section">
        {sections.map((s) => (
          <button
            key={s.id}
            type="button"
            aria-current={active === s.id}
            className={`dtabs__tab${active === s.id ? ' is-on' : ''}`}
            onClick={() => pick(s.id)}
          >
            {s.label}
          </button>
        ))}
      </div>
      {sections.map((s) => (
        <section
          key={s.id}
          id={`dsec-${s.id}`}
          ref={(el) => { secRefs.current[s.id] = el; }}
          className="dtabs__sec"
        >
          <h2 className="dtabs__sec-h">{s.label}</h2>
          {s.content}
        </section>
      ))}
    </div>
  );
}
