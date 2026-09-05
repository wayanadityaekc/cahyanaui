'use client';

import { useState } from 'react';
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
  const [zone, setZone] = useState('all'); // 'all' | category id

  const q = query.trim().toLowerCase();
  const noun = NOUN[sectionId] || 'programs';

  // One flat grid: every card tagged with its category id (for the zone filter).
  const allCards = cats.flatMap((cat) => cat.cards.map((card) => ({ card, catId: cat.id })));
  const shownCards = q ? allCards.filter((x) => x.card.name.toLowerCase().includes(q)) : allCards;
  const tabs = [{ id: 'all', label: listTitle }, ...chips];

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

        {/* Zone filter tabs: "All" + tiap daerah. Pilih daerah -> kartu di luar
            daerah itu diredupkan (bukan disembunyiin), grid tetap satu. */}
        {!q && (
          <div className="zfilter" role="tablist" aria-label="Filter by area">
            {tabs.map((t) => (
              <button
                key={t.id}
                type="button"
                className={`zfilter__tab${zone === t.id ? ' is-active' : ''}`}
                aria-pressed={zone === t.id}
                onClick={() => setZone(t.id)}
              >
                {t.label}
              </button>
            ))}
          </div>
        )}

        <section className="catsec">
          <div className="lrow-list">
            {shownCards.map(({ card, catId }) => {
              const dim = !q && zone !== 'all' && catId !== zone;
              return (
                <ListingRow
                  key={card.href + card.name}
                  {...card}
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
