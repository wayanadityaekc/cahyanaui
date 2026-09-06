'use client';

import { useEffect, useRef, useState } from 'react';
import ReviewsStrip from '@/components/reviews/ReviewsStrip';

// Facts grid (Details tab) - Duration / Availability / Pick-up etc. The Price
// fact is dropped on purpose: the live, currency-correct price is shown in the
// booking bar and form, and the hardcoded price string here is stale (some are
// even merged with the pick-up value in the source data).
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

// Included / excluded lists (Included tab) - reuses the site-wide radio bullet lists.
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

// Detail page tabs (Overview / Details / Included / Reviews). Clicking a tab
// swaps the panel in place and scrolls so the sticky tab strip pins right under
// the fixed header - it reads like a page change without a reload. Every panel
// is rendered into the static HTML (just hidden), so search engines index it all.
export default function DetailTabs({ overview, facts, included, excluded, reviewService }) {
  const detailFacts = (facts || []).filter((f) => !/^price/i.test(f.label));
  const tabs = [{ id: 'overview', label: 'Overview', content: overview }];
  if (detailFacts.length) tabs.push({ id: 'details', label: 'Details', content: <FactsGrid facts={facts} /> });
  if ((included && included.length) || (excluded && excluded.length)) {
    tabs.push({ id: 'included', label: 'Included', content: <Inclusions included={included} excluded={excluded} /> });
  }
  tabs.push({
    id: 'reviews',
    label: 'Reviews',
    content: <ReviewsStrip service={reviewService} emptyText="No reviews yet for this program - be the first to share your trip." emptyCta />,
  });

  const [active, setActive] = useState(tabs[0].id);
  const wrapRef = useRef(null);
  const stripRef = useRef(null);

  // Pin the sticky strip right under the fixed header (navbar + promo bar). The
  // header height changes when the promo bar is on/off, so measure it live.
  const headerH = () => {
    const h = document.querySelector('.navbar');
    return h ? h.getBoundingClientRect().height : 0;
  };
  useEffect(() => {
    const apply = () => { if (stripRef.current) stripRef.current.style.top = `${headerH()}px`; };
    apply();
    window.addEventListener('resize', apply);
    return () => window.removeEventListener('resize', apply);
  }, []);

  const pick = (id) => {
    setActive(id);
    const wrap = wrapRef.current;
    if (!wrap) return;
    const top = wrap.getBoundingClientRect().top + window.scrollY - headerH();
    window.scrollTo({ top, behavior: 'smooth' });
  };

  return (
    <div className="dtabs" ref={wrapRef}>
      <div className="dtabs__strip" ref={stripRef} role="tablist" aria-label="Program information">
        {tabs.map((t) => (
          <button
            key={t.id}
            type="button"
            role="tab"
            id={`dtab-${t.id}`}
            aria-selected={active === t.id}
            aria-controls={`dpanel-${t.id}`}
            className={`dtabs__tab${active === t.id ? ' is-on' : ''}`}
            onClick={() => pick(t.id)}
          >
            {t.label}
          </button>
        ))}
      </div>
      {tabs.map((t) => (
        <div
          key={t.id}
          id={`dpanel-${t.id}`}
          role="tabpanel"
          aria-labelledby={`dtab-${t.id}`}
          className="dtabs__panel"
          hidden={active !== t.id}
        >
          {t.content}
        </div>
      ))}
    </div>
  );
}
