'use client';

import { useState, useEffect } from 'react';
import ListingRow from '@/components/cards/ListingRow';

function SearchIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="11" cy="11" r="7" /><path d="M21 21l-4.3-4.3" />
    </svg>
  );
}

// Search placeholder noun per listing page.
const NOUN = { tours: 'tours', activities: 'experiences', destinations: 'destinations' };

export default function ListingPage({ data }) {
  const { heroBg, title, sub, listTitle, sectionId, chips, cats, closing, info } = data;
  const [query, setQuery] = useState('');
  const [zone, setZone] = useState('all'); // 'all' | category id (desktop dim filter)
  const [isMobile, setIsMobile] = useState(false);
  const [spyId, setSpyId] = useState('all'); // category in view (mobile active tab)

  const q = query.trim().toLowerCase();
  const noun = NOUN[sectionId] || 'programs';

  // One flat grid: every card tagged with its category id; the first card of each
  // category carries an anchor id so the mobile tabs can scroll to it.
  const allCards = [];
  cats.forEach((cat) => cat.cards.forEach((card, i) => allCards.push({ card, catId: cat.id, anchor: i === 0 ? cat.id : null })));
  const shownCards = q ? allCards.filter((x) => x.card.name.toLowerCase().includes(q)) : allCards;
  const tabs = [{ id: 'all', label: listTitle }, ...chips];

  // Track breakpoint: mobile tabs scroll (no dim), desktop tabs dim.
  useEffect(() => {
    const mq = window.matchMedia('(max-width: 768px)');
    const sync = () => setIsMobile(mq.matches);
    sync();
    mq.addEventListener('change', sync);
    return () => mq.removeEventListener('change', sync);
  }, []);

  // Mobile: scrollspy sets the active tab from the category in view.
  useEffect(() => {
    if (!isMobile || q) return;
    const probe = () => {
      const y = window.scrollY + 200;
      let cur = 'all';
      chips.forEach((c) => {
        const el = document.getElementById(c.id);
        if (el && el.getBoundingClientRect().top + window.scrollY <= y) cur = c.id;
      });
      setSpyId(cur);
    };
    probe();
    window.addEventListener('scroll', probe, { passive: true });
    window.addEventListener('resize', probe);
    return () => {
      window.removeEventListener('scroll', probe);
      window.removeEventListener('resize', probe);
    };
  }, [isMobile, q, chips]);

  const activeTab = isMobile ? spyId : zone;

  const onTab = (id) => {
    if (isMobile) {
      const el = document.getElementById(id === 'all' ? sectionId : id);
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else {
      setZone(id);
    }
  };

  return (
    <div className="tourprog">
      {/* Hero = gaya split putih kayak halaman attraction (.tour-hero): teks kiri,
          foto kanan di desktop; foto atas + sheet putih di mobile. Search di bawah
          judul (desktop) / mengambang di foto (mobile) - memfilter kartu di bawah. */}
      <section className="tour-hero">
        <div className="tour-hero__image" style={{ backgroundImage: `url(/assets/images/${heroBg})` }} />
        <div className="tour-hero__body">
          <h1 className="subhero__title">{title}</h1>
          <p className="tour-hero__desc">{sub}</p>
          <div className="lsearch">
            <SearchIcon />
            <input
              type="search"
              className="lsearch__input"
              placeholder={`Search ${noun}`}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              aria-label={`Search ${noun}`}
            />
          </div>
          <a href={`#${sectionId}`} className="lbrowse">Browse all {noun}</a>
        </div>
      </section>

      <section className="experience experience--alt" id={sectionId}>
        <div className="lhead">
          <h2 className="section__title">{listTitle}</h2>
        </div>

        {/* Floating sticky tab bar (bawah). Desktop: pilih daerah -> kartu di luar
            daerah diredupkan (grid tetap satu). Mobile: tap = scroll ke section
            kartunya (tanpa redup). */}
        {!q && (
          <div className="zfilter" role="tablist" aria-label="Filter by area">
            {tabs.map((t) => (
              <button
                key={t.id}
                type="button"
                className={`zfilter__tab${activeTab === t.id ? ' is-active' : ''}`}
                aria-pressed={activeTab === t.id}
                onClick={() => onTab(t.id)}
              >
                {t.label}
              </button>
            ))}
          </div>
        )}

        <section className="catsec">
          <div className="lrow-list">
            {shownCards.map(({ card, catId, anchor }) => {
              const dim = !isMobile && !q && zone !== 'all' && catId !== zone;
              return (
                <ListingRow
                  key={card.href + card.name}
                  {...card}
                  anchorId={anchor || undefined}
                  dim={dim}
                  onReset={() => setZone('all')}
                />
              );
            })}
          </div>
          {q && shownCards.length === 0 && (
            <p className="lsearch__empty">No {noun} match &ldquo;{query.trim()}&rdquo;.</p>
          )}
        </section>
      </section>

      {info && (
        <section className="info">
          <div className="info__container">
            <h2 className="section__title">{info.title}</h2>
            <div className="info__facts">
              {info.facts.map((f) => (
                <div className="info__fact" key={f.label}>
                  <span>{f.label}</span>
                  <strong>{f.value}</strong>
                </div>
              ))}
            </div>
            <div className="info__lists">
              {info.cols.map((c) => (
                <div className="info__col" key={c.title}>
                  <h3>{c.title}</h3>
                  <ul className={`info__list ${c.cls}`}>
                    {c.items.map((it, i) => <li key={i}>{it}</li>)}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {closing && (
        <section className="closing-band">
          <p className="closing-band__text">{closing.text}</p>
          <div className="closing-band__actions">
            {closing.buttons.map((b) => (
              <a href={b.href} className={b.cls} key={b.href}>{b.text}</a>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
