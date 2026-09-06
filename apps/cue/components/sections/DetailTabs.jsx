'use client';

import { useEffect, useRef, useState } from 'react';
import ReviewsStrip from '@/components/reviews/ReviewsStrip';
import Price from '@/components/Price';

// Options (was "Details") - the two ways every program can be booked. This
// replaces a facts grid that just repeated the hero hooks; the choice between
// Standard and Exclusive is the genuinely useful, page-specific decision. Prices
// are live and currency-correct (Price component), not hardcoded.
function Packages({ item }) {
  return (
    <div className="dpkg">
      <p className="dpkg__lead">Every program comes two ways - pick when you book.</p>
      <div className="dpkg__grid">
        <div className="dpkg__card">
          <div className="dpkg__name">Standard</div>
          <p className="dpkg__desc">Private car, driver and fuel. Entrance tickets aren&apos;t included - you pay them at each gate as you go.</p>
          <div className="dpkg__price"><small>from</small> <Price name={item} mode="standard" className="dpkg__amt" /></div>
        </div>
        <div className="dpkg__card dpkg__card--feat">
          <div className="dpkg__name">Exclusive</div>
          <p className="dpkg__desc">The whole day prepaid, with entrance tickets for the listed stops included. Nothing to pay at the gates.</p>
          <div className="dpkg__price"><small>from</small> <Price name={item} mode="exclusive" className="dpkg__amt" /></div>
        </div>
      </div>
    </div>
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
export default function DetailTabs({ overview, priceItem, included, excluded, reviewService }) {
  const sections = [{ id: 'overview', label: 'Overview', content: overview }];
  if (priceItem) sections.push({ id: 'options', label: 'Options', content: <Packages item={priceItem} /> });
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
